import React, { useRef, useEffect, useState, startTransition, useMemo } from "react";
import { useScroll, useTransform, useSpring } from "motion/react";

// --- Código de los Shaders WebGL ---
const vertexShader = `
precision highp float;
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;
void main() {
vUv = uv;
gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragmentShader = `
precision highp float;
uniform sampler2D tText;
uniform float uScrollOffset;
uniform float uDistortionStrength;
uniform float uLensRadius;
uniform float uScreenAspect;
uniform float uTextureScaleX;
varying vec2 vUv;

vec2 fisheyeMagnify(vec2 uv, vec2 center, float strength, float radius) {
vec2 pos = uv - center;
pos.x *= uScreenAspect;

float safeRadius = max(0.0001, radius);
float dist = length(pos);
float falloff = 1.0 - smoothstep(0.0, safeRadius, dist);

float zoom = 1.0 + strength * 1.75 * falloff;
zoom = max(0.1, zoom);

vec2 warped = pos / zoom;
warped.x /= uScreenAspect;
return center + warped;
}
void main() {
vec2 screenCenter = vec2(0.5, 0.5);
vec2 distortedUv = fisheyeMagnify(vUv, screenCenter, uDistortionStrength, uLensRadius);
vec2 scaledUv = vec2(
(distortedUv.x - 0.5) * uTextureScaleX + 0.5,
distortedUv.y
);
vec2 finalUv = vec2(fract(scaledUv.x + uScrollOffset), distortedUv.y);
if (finalUv.y < 0.0 || finalUv.y > 1.0) {
gl_FragColor = vec4(0.0);
} else {
gl_FragColor = texture2D(tText, finalUv);
}
}
`;

function createShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
const shader = gl.createShader(type);
if (!shader) return null;
gl.shaderSource(shader, source);
gl.compileShader(shader);
if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
console.error("Shader Error:", gl.getShaderInfoLog(shader));
gl.deleteShader(shader);
return null;
}
return shader;
}

function createProgram(gl: WebGLRenderingContext, vsSource: string, fsSource: string): WebGLProgram | null {
const vertexShaderObj = createShader(gl, gl.VERTEX_SHADER, vsSource);
const fragmentShaderObj = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
if (!vertexShaderObj || !fragmentShaderObj) return null;
const program = gl.createProgram();
if (!program) return null;
gl.attachShader(program, vertexShaderObj);
gl.attachShader(program, fragmentShaderObj);
gl.linkProgram(program);
if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
console.error("Program Link Error:", gl.getProgramInfoLog(program));
return null;
}
return program;
}

interface WebGLCanvasProps {
texture: HTMLCanvasElement | null;
textAspect: number;
scrollMotionValue: any;
strength: number;
radius: number;
isStaticRenderer: boolean;
blur?: number;
blurType?: "screen" | "letter";
direction?: "leftToRight" | "rightToLeft";
scrollShift?: number;
style?: React.CSSProperties;
}

const WebGLCanvas = ({
texture,
textAspect,
scrollMotionValue,
strength,
radius,
isStaticRenderer,
blur = 0,
blurType = "screen",
direction = "rightToLeft",
scrollShift = 0,
style,
}: WebGLCanvasProps) => {
const canvasRef = useRef<HTMLCanvasElement>(null);
const glRef = useRef<WebGLRenderingContext | null>(null);
const programRef = useRef<WebGLProgram | null>(null);
const textureRef = useRef<WebGLTexture | null>(null);
const animationFrameId = useRef<number | null>(null);
const [isInView, setIsInView] = useState(true);

useEffect(() => {
const canvas = canvasRef.current;
if (!canvas) return;
const gl = canvas.getContext("webgl", { alpha: true });
if (!gl) return;
glRef.current = gl;

const program = createProgram(gl, vertexShader, fragmentShader);
programRef.current = program;
if (!program) return;

gl.useProgram(program);
gl.enable(gl.BLEND);
gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(
  gl.ARRAY_BUFFER,
  new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
  gl.STATIC_DRAW
);
const posLoc = gl.getAttribLocation(program, "position");
gl.enableVertexAttribArray(posLoc);
gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

const uvBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
gl.bufferData(
  gl.ARRAY_BUFFER,
  new Float32Array([0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1]),
  gl.STATIC_DRAW
);
const uvLoc = gl.getAttribLocation(program, "uv");
gl.enableVertexAttribArray(uvLoc);
gl.vertexAttribPointer(uvLoc, 2, gl.FLOAT, false, 0, 0);

const glTexture = gl.createTexture();
gl.bindTexture(gl.TEXTURE_2D, glTexture);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
textureRef.current = glTexture;

return () => {
  if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
  gl.deleteBuffer(positionBuffer);
  gl.deleteBuffer(uvBuffer);
  if (glTexture) gl.deleteTexture(glTexture);
  gl.deleteProgram(program);
};
}, []);

useEffect(() => {
const gl = glRef.current;
const glTexture = textureRef.current;
if (gl && glTexture && texture) {
gl.bindTexture(gl.TEXTURE_2D, glTexture);
gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 1);
gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture);
}
}, [texture]);

useEffect(() => {
const gl = glRef.current;
const program = programRef.current;
if (!gl || !program) return;

const uScrollOffset = gl.getUniformLocation(program, "uScrollOffset");
const uDistortionStrength = gl.getUniformLocation(program, "uDistortionStrength");
const uLensRadius = gl.getUniformLocation(program, "uLensRadius");
const uScreenAspect = gl.getUniformLocation(program, "uScreenAspect");
const uTextureScaleX = gl.getUniformLocation(program, "uTextureScaleX");

const drawFrame = () => {
  if (!canvasRef.current) return;
  const pixelRatio = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
  const width = canvasRef.current.clientWidth * pixelRatio;
  const height = canvasRef.current.clientHeight * pixelRatio;

  if (gl.canvas.width !== width || gl.canvas.height !== height) {
    gl.canvas.width = width;
    gl.canvas.height = height;
    gl.viewport(0, 0, width, height);
  }

  const screenAspect = width / height;
  const scaleX = screenAspect / (textAspect || 1);
  const clampedStrength = Math.max(-1, Math.min(1, strength));
  const mappedRadius = 0.15 + Math.max(0, radius) * 0.35;

  gl.useProgram(program);
  gl.uniform1f(uScrollOffset, scrollMotionValue.get() + scrollShift);
  gl.uniform1f(uDistortionStrength, clampedStrength);
  gl.uniform1f(uLensRadius, mappedRadius);
  gl.uniform1f(uScreenAspect, screenAspect);
  gl.uniform1f(uTextureScaleX, scaleX);

  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLES, 0, 6);
};

const render = () => {
  drawFrame();
  animationFrameId.current = requestAnimationFrame(render);
};

if (isStaticRenderer) {
  drawFrame();
  return;
}

if (!isInView) {
  return;
}
animationFrameId.current = requestAnimationFrame(render);

return () => {
  if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
  animationFrameId.current = null;
};
}, [scrollMotionValue, strength, radius, textAspect, isInView, isStaticRenderer, direction, scrollShift]);

useEffect(() => {
if (typeof window === "undefined") return;
if (isStaticRenderer) return;
const canvas = canvasRef.current;
if (!canvas) return;
if (typeof IntersectionObserver === "undefined") return;

const observer = new IntersectionObserver(
  (entries) => {
    const entry = entries[0];
    startTransition(() => {
      setIsInView(entry?.isIntersecting ?? true);
    });
  },
  { threshold: 0.01 }
);

observer.observe(canvas);
return () => {
  observer.disconnect();
};
}, [isStaticRenderer]);

return (
  <canvas 
    ref={canvasRef} 
    style={{ 
      width: "100%", 
      height: "100%", 
      display: "block",
      ...style
    }} 
  />
);
};

function parseFontSizePx(value: string | number | undefined, fallback: number): number {
if (typeof value === "number") return value;
if (typeof value === "string") {
const parsed = parseFloat(value);
return Number.isFinite(parsed) ? parsed : fallback;
}
return fallback;
}

function parseLineHeightPx(value: string | number | undefined, fontSizePx: number): number {
if (typeof value === "number") {
return value <= 3 ? value * fontSizePx : value;
}
if (typeof value === "string") {
const parsed = parseFloat(value);
if (!Number.isFinite(parsed)) return fontSizePx * 1.2;
if (value.endsWith("px")) return parsed;
if (value.endsWith("em")) return parsed * fontSizePx;
return parsed <= 3 ? parsed * fontSizePx : parsed;
}
return fontSizePx * 1.2;
}

function parseLetterSpacingPx(value: string | number | undefined): number {
if (typeof value === "number") return value;
if (typeof value === "string") {
const parsed = parseFloat(value);
return Number.isFinite(parsed) ? parsed : 0;
}
return 0;
}

function resolveCssColor(color: string | undefined): string {
if (typeof color !== "string" || color.trim() === "") return "#000000";
const trimmedColor = color.trim();
const hasVarToken = trimmedColor.includes("var(");
if (!hasVarToken) {
if (typeof window !== "undefined" && window.CSS?.supports) {
return window.CSS.supports("color", trimmedColor) ? trimmedColor : "#000000";
}
return trimmedColor;
}
if (typeof document === "undefined") return trimmedColor;
const el = document.createElement("span");
el.style.color = "";
el.style.color = trimmedColor;
el.style.position = "absolute";
el.style.visibility = "hidden";
el.style.pointerEvents = "none";
document.body.appendChild(el);
const computed = window.getComputedStyle(el).color;
document.body.removeChild(el);
if (typeof computed === "string" && computed.trim() !== "") {
return computed.trim();
}
const fallbackMatch = trimmedColor.match(/var([^,]+,\s*([^)]+))/);
const fallbackColor = fallbackMatch?.[1]?.trim();
if (fallbackColor) {
if (typeof window !== "undefined" && window.CSS?.supports) {
if (window.CSS.supports("color", fallbackColor)) return fallbackColor;
} else {
return fallbackColor;
}
}
return "#000000";
}

function drawTextWithLetterSpacing(
ctx: CanvasRenderingContext2D,
text: string,
x: number,
y: number,
letterSpacing: number,
textAlign: string
) {
if (!letterSpacing) {
ctx.fillText(text, x, y);
return;
}
const baseWidth = ctx.measureText(text).width;
const totalWidth = baseWidth + Math.max(0, text.length - 1) * letterSpacing;
const startX =
textAlign === "center"
? x - totalWidth / 2
: textAlign === "right"
? x - totalWidth
: x;
let currentX = startX;
for (const char of text) {
ctx.fillText(char, currentX, y);
currentX += ctx.measureText(char).width + letterSpacing;
}
}

export interface FishScrollProps {
text?: string;
direction?: "rightToLeft" | "leftToRight";
font?: {
fontSize?: string | number;
lineHeight?: string | number;
letterSpacing?: string | number;
fontStyle?: string;
fontWeight?: string | number;
fontFamily?: string;
textAlign?: "left" | "center" | "right";
};
color?: string;
lensStrength?: number;
lensRadius?: number;
smoothing?: boolean;
textureQuality?: number;
blur?: number;
blurType?: "screen" | "letter";
scrollShift?: number;
}

export default function FishScroll({
text = "SHARP FISHEYE ZOOM",
direction = "rightToLeft",
font = {
fontSize: "120px",
fontWeight: 700,
fontFamily: "Inter",
letterSpacing: "0px",
lineHeight: "1.2em",
textAlign: "center",
},
color = "#000000",
lensStrength = 0.5,
lensRadius = 0.6,
smoothing = true,
textureQuality = 4,
blur = 0,
blurType = "screen",
scrollShift = 0,
}: FishScrollProps) {
const containerRef = useRef<HTMLDivElement>(null);
const textCanvasRef = useRef<HTMLCanvasElement>(null);
const [texture, setTexture] = useState<HTMLCanvasElement | null>(null);
const [textAspect, setTextAspect] = useState(1);
const [fontsLoaded, setFontsLoaded] = useState(0);
const isStaticRenderer = false;

const resolvedTypography = useMemo(() => {
const fontSizePx = parseFontSizePx(font?.fontSize, 120);
const lineHeightPx = parseLineHeightPx(font?.lineHeight, fontSizePx);
const letterSpacingPx = parseLetterSpacingPx(font?.letterSpacing);
const fontStyleStr = font?.fontStyle || "normal";
const fontWeightStr = font?.fontWeight || 700;
const textAlign = font?.textAlign || "left";
const rawFontFamily = font?.fontFamily || "Inter";
const safeFontFamily =
rawFontFamily.includes(",") || rawFontFamily.includes('"') || rawFontFamily.includes("'")
? rawFontFamily
: rawFontFamily;
const fontString = `${fontStyleStr} ${fontWeightStr} ${fontSizePx}px ${safeFontFamily}`;
return {
fontSizePx,
lineHeightPx,
letterSpacingPx,
fontStyleStr,
fontWeightStr,
safeFontFamily,
textAlign,
fontString,
};
}, [font]);

useEffect(() => {
let isMounted = true;
if (typeof document !== "undefined" && document.fonts) {
const bumpFontsLoaded = () => {
if (!isMounted) return;
startTransition(() => {
setFontsLoaded((prev) => prev + 1);
});
};
const onLoadingDone = () => {
bumpFontsLoaded();
};
document.fonts
.load(resolvedTypography.fontString, text)
.then(() => {
bumpFontsLoaded();
})
.catch(() => {
bumpFontsLoaded();
});
document.fonts.ready
.then(() => {
bumpFontsLoaded();
})
.catch(() => {
bumpFontsLoaded();
});
document.fonts.addEventListener("loadingdone", onLoadingDone);
const t1 = setTimeout(() => {
bumpFontsLoaded();
}, 300);
const t2 = setTimeout(() => {
bumpFontsLoaded();
}, 1000);
return () => {
isMounted = false;
document.fonts.removeEventListener("loadingdone", onLoadingDone);
clearTimeout(t1);
clearTimeout(t2);
};
}
}, [resolvedTypography.fontString, text]);

useEffect(() => {
const textCanvas = textCanvasRef.current;
if (!textCanvas) return;
const ctx = textCanvas.getContext("2d");
if (!ctx) return;
ctx.font = resolvedTypography.fontString;
const metrics = ctx.measureText(text);
const baseTextWidth = metrics.width;
const textWidth = baseTextWidth + Math.max(0, text.length - 1) * resolvedTypography.letterSpacingPx;
const extraSpacing = resolvedTypography.fontSizePx * 1.2;
const totalTextWidth = textWidth + extraSpacing;
const textHeight = Math.max(1, resolvedTypography.lineHeightPx);
const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
const baseDpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
let dpr = baseDpr * (isMobile ? Math.min(1.5, textureQuality) : textureQuality);
const MAX_TEXTURE_SIZE = isMobile ? 2048 : 4096;

if (totalTextWidth * dpr > MAX_TEXTURE_SIZE) {
  dpr = MAX_TEXTURE_SIZE / totalTextWidth;
}
if (textHeight * dpr > MAX_TEXTURE_SIZE) {
  dpr = Math.min(dpr, MAX_TEXTURE_SIZE / textHeight);
}

const targetWidth = totalTextWidth * dpr;
const targetHeight = textHeight * dpr;
textCanvas.width = Math.max(1, Math.floor(targetWidth));
textCanvas.height = Math.max(1, Math.floor(targetHeight));
ctx.setTransform(1, 0, 0, 1, 0, 0);
ctx.scale(dpr, dpr);
ctx.clearRect(0, 0, textCanvas.width, textCanvas.height);
ctx.font = resolvedTypography.fontString;
const resolved = resolveCssColor(color);
ctx.fillStyle = resolved;
ctx.textBaseline = "middle";
ctx.textAlign = resolvedTypography.textAlign;
ctx.imageSmoothingEnabled = true;
ctx.imageSmoothingQuality = "high";
const x =
  resolvedTypography.textAlign === "center"
    ? totalTextWidth / 2
    : resolvedTypography.textAlign === "right"
    ? totalTextWidth
    : 0;

drawTextWithLetterSpacing(
  ctx,
  text,
  x,
  textHeight / 2,
  resolvedTypography.letterSpacingPx,
  resolvedTypography.textAlign
);

startTransition(() => {
  setTextAspect(totalTextWidth / textHeight);
  setTexture(textCanvas);
});
}, [text, color, textureQuality, resolvedTypography, fontsLoaded]);

const { scrollYProgress } = useScroll({
target: containerRef,
offset: ["start end", "end start"],
});

const smoothProgress = useSpring(scrollYProgress, {
damping: 40,
stiffness: 200,
});

const effectiveProgress = smoothing ? smoothProgress : scrollYProgress;

const scrollOffset = useTransform(
effectiveProgress,
[0, 1],
direction === "rightToLeft" ? [-0.9, 0.9] : [0.9, -0.9]
);

return (
<div ref={containerRef} style={containerStyle}>
<canvas ref={textCanvasRef} style={{ display: "none" }} />
{/* Sharp, centered canvas */}
<WebGLCanvas
  texture={texture}
  textAspect={textAspect}
  scrollMotionValue={scrollOffset}
  strength={lensStrength}
  radius={lensRadius}
  isStaticRenderer={isStaticRenderer}
  blur={0}
  blurType={blurType}
  direction={direction}
  scrollShift={scrollShift}
  style={{
    maskImage: blurType === "letter" && blur > 0
      ? "linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,0.2) 8%, rgba(0,0,0,1) 25%, rgba(0,0,0,1) 75%, rgba(0,0,0,0.2) 92%, rgba(0,0,0,0) 100%)"
      : "none",
    WebkitMaskImage: blurType === "letter" && blur > 0
      ? "linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,0.2) 8%, rgba(0,0,0,1) 25%, rgba(0,0,0,1) 75%, rgba(0,0,0,0.2) 92%, rgba(0,0,0,0) 100%)"
      : "none",
  }}
/>
{/* Blurred side-only canvas layer */}
{blurType === "letter" && blur > 0 && (
  <WebGLCanvas
    texture={texture}
    textAspect={textAspect}
    scrollMotionValue={scrollOffset}
    strength={lensStrength}
    radius={lensRadius}
    isStaticRenderer={isStaticRenderer}
    blur={blur}
    blurType={blurType}
    direction={direction}
    scrollShift={scrollShift}
    style={{
      position: "absolute",
      left: 0,
      top: 0,
      width: "100%",
      height: "100%",
      filter: `blur(${blur}px)`,
      pointerEvents: "none",
      maskImage: "linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 8%, rgba(0,0,0,0) 25%, rgba(0,0,0,0) 75%, rgba(0,0,0,0.8) 92%, rgba(0,0,0,1) 100%)",
      WebkitMaskImage: "linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 8%, rgba(0,0,0,0) 25%, rgba(0,0,0,0) 75%, rgba(0,0,0,0.8) 92%, rgba(0,0,0,1) 100%)",
    }}
  />
)}
{/* Left side blur overlay */}
<div
  style={{
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: "25%",
    pointerEvents: "none",
    backdropFilter: blurType === "screen" && blur > 0 ? `blur(${blur}px)` : "none",
    WebkitBackdropFilter: blurType === "screen" && blur > 0 ? `blur(${blur}px)` : "none",
    maskImage: "linear-gradient(to right, rgba(0,0,0,1), rgba(0,0,0,0))",
    WebkitMaskImage: "linear-gradient(to right, rgba(0,0,0,1), rgba(0,0,0,0))",
    zIndex: 10,
    display: blurType === "screen" ? "block" : "none",
  }}
/>
{/* Right side blur overlay */}
<div
  style={{
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: "25%",
    pointerEvents: "none",
    backdropFilter: blurType === "screen" && blur > 0 ? `blur(${blur}px)` : "none",
    WebkitBackdropFilter: blurType === "screen" && blur > 0 ? `blur(${blur}px)` : "none",
    maskImage: "linear-gradient(to left, rgba(0,0,0,1), rgba(0,0,0,0))",
    WebkitMaskImage: "linear-gradient(to left, rgba(0,0,0,1), rgba(0,0,0,0))",
    zIndex: 10,
    display: blurType === "screen" ? "block" : "none",
  }}
/>
</div>
);
}

const containerStyle: React.CSSProperties = {
width: "100%",
height: "100%",
overflow: "hidden",
display: "flex",
alignItems: "center",
justifyContent: "center",
background: "transparent",
position: "relative",
};
