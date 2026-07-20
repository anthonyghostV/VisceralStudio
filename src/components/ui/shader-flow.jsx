import { jsx as _jsx } from "react/jsx-runtime";
// Animated WebGL Shader effect with chromatic aberration wave distortion
import React from "react";import{useEffect,useRef}from"react";const addPropertyControls = () => {}; const ControlType = {};/**
 * Shader Flow
 *
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight fixed
 */export default function ShaderFlow(props){const{xScale=1,yScale=.5,distortion=.05,speed=.01,color="default"}=props;const canvasRef=useRef(null);const propsRef=useRef({xScale,yScale,distortion,speed,color});// Update props ref whenever props change
useEffect(()=>{propsRef.current={xScale,yScale,distortion,speed,color};},[xScale,yScale,distortion,speed,color]);const sceneRef=useRef({gl:null,program:null,uniforms:{resolution:null,time:null,xScale:null,yScale:null,distortion:null,rWeight:null,gWeight:null,bWeight:null},animationId:null,timeValue:0});useEffect(()=>{if(typeof window==="undefined")return;if(!canvasRef.current)return;const canvas=canvasRef.current;const{current:refs}=sceneRef;const gl=canvas.getContext("webgl",{alpha:true,antialias:false,preserveDrawingBuffer:false});if(!gl)return;refs.gl=gl;const vertexShaderSource=`
            attribute vec2 position;
            void main() {
                gl_Position = vec4(position, 0.0, 1.0);
            }
        `;const fragmentShaderSource=`
            precision highp float;
            uniform vec2 resolution;
            uniform float time;
            uniform float xScale;
            uniform float yScale;
            uniform float distortion;
            uniform float rWeight;
            uniform float gWeight;
            uniform float bWeight;

            void main() {
                vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
                
                float d = length(p) * distortion;
                
                float rx = p.x * (1.0 + d);
                float gx = p.x;
                float bx = p.x * (1.0 - d);

                float r = 0.05 / abs(p.y + sin((rx + time) * xScale) * yScale);
                float g = 0.05 / abs(p.y + sin((gx + time) * xScale) * yScale);
                float b = 0.05 / abs(p.y + sin((bx + time) * xScale) * yScale);
                
                gl_FragColor = vec4(r * rWeight, g * gWeight, b * bWeight, 1.0);
            }
        `;const createShader=(type,source)=>{const shader=gl.createShader(type);if(!shader)return null;gl.shaderSource(shader,source);gl.compileShader(shader);if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS)){console.error(gl.getShaderInfoLog(shader));gl.deleteShader(shader);return null;}return shader;};const vertexShader=createShader(gl.VERTEX_SHADER,vertexShaderSource);const fragmentShader=createShader(gl.FRAGMENT_SHADER,fragmentShaderSource);if(!vertexShader||!fragmentShader)return;const program=gl.createProgram();if(!program)return;gl.attachShader(program,vertexShader);gl.attachShader(program,fragmentShader);gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS)){console.error(gl.getProgramInfoLog(program));return;}refs.program=program;gl.useProgram(program);const positions=new Float32Array([-1,-1,1,-1,-1,1,1,-1,-1,1,1,1]);const positionBuffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,positionBuffer);gl.bufferData(gl.ARRAY_BUFFER,positions,gl.STATIC_DRAW);const positionLocation=gl.getAttribLocation(program,"position");gl.enableVertexAttribArray(positionLocation);gl.vertexAttribPointer(positionLocation,2,gl.FLOAT,false,0,0);refs.uniforms.resolution=gl.getUniformLocation(program,"resolution");refs.uniforms.time=gl.getUniformLocation(program,"time");refs.uniforms.xScale=gl.getUniformLocation(program,"xScale");refs.uniforms.yScale=gl.getUniformLocation(program,"yScale");refs.uniforms.distortion=gl.getUniformLocation(program,"distortion");refs.uniforms.rWeight=gl.getUniformLocation(program,"rWeight");refs.uniforms.gWeight=gl.getUniformLocation(program,"gWeight");refs.uniforms.bWeight=gl.getUniformLocation(program,"bWeight");const handleResize=()=>{if(!canvas||!gl||!refs.uniforms.resolution)return;const width=canvas.clientWidth;const height=canvas.clientHeight;canvas.width=width*window.devicePixelRatio;canvas.height=height*window.devicePixelRatio;gl.viewport(0,0,canvas.width,canvas.height);gl.uniform2f(refs.uniforms.resolution,canvas.width,canvas.height);};const animate=()=>{if(!gl||!refs.program||!refs.uniforms.time)return;refs.timeValue+=propsRef.current.speed;gl.uniform1f(refs.uniforms.time,refs.timeValue);gl.uniform1f(refs.uniforms.xScale,propsRef.current.xScale);gl.uniform1f(refs.uniforms.yScale,propsRef.current.yScale);gl.uniform1f(refs.uniforms.distortion,propsRef.current.distortion);const colorPreset=propsRef.current.color;let rw=1.0,gw=1.0,bw=1.0;if(colorPreset==="visceral"||colorPreset==="red"){rw=1.0;gw=0.08;bw=0.12;}else if(colorPreset==="cyan"||colorPreset==="blue"){rw=0.1;gw=0.6;bw=1.0;}else if(colorPreset==="amber"||colorPreset==="orange"){rw=1.0;gw=0.45;bw=0.05;}else if(colorPreset==="violet"||colorPreset==="purple"){rw=0.7;gw=0.15;bw=1.0;}else if(colorPreset==="emerald"||colorPreset==="green"){rw=0.1;gw=0.9;bw=0.45;}gl.uniform1f(refs.uniforms.rWeight,rw);gl.uniform1f(refs.uniforms.gWeight,gw);gl.uniform1f(refs.uniforms.bWeight,bw);gl.drawArrays(gl.TRIANGLES,0,6);refs.animationId=requestAnimationFrame(animate);};handleResize();window.addEventListener("resize",handleResize);animate();return()=>{if(refs.animationId)cancelAnimationFrame(refs.animationId);window.removeEventListener("resize",handleResize);if(gl&&refs.program){gl.deleteProgram(refs.program);}if(gl&&vertexShader)gl.deleteShader(vertexShader);if(gl&&fragmentShader)gl.deleteShader(fragmentShader);};},[]);return /*#__PURE__*/_jsx("canvas",{ref:canvasRef,style:{width:"100%",height:"100%",display:"block",backgroundColor:"#000000"}});}addPropertyControls(ShaderFlow,{xScale:{type:ControlType.Number,title:"X Scale (Shader Flow)",defaultValue:1,min:.1,max:5,step:.1},yScale:{type:ControlType.Number,title:"Y Scale (Shader Flow)",defaultValue:.5,min:.1,max:2,step:.1},distortion:{type:ControlType.Number,title:"Distortion (Shader Flow)",defaultValue:.05,min:0,max:.5,step:.01},speed:{type:ControlType.Number,title:"Speed (Shader Flow)",defaultValue:.01,min:.001,max:.1,step:.001}});
export const __FramerMetadata__ = {"exports":{"default":{"type":"reactComponent","name":"ShaderFlow","slots":[],"annotations":{"framerContractVersion":"1","framerSupportedLayoutHeight":"fixed","framerSupportedLayoutWidth":"fixed"}},"__FramerMetadata__":{"type":"variable"}}}
