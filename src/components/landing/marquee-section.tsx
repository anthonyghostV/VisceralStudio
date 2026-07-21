"use client";

import { useState, useEffect, useRef } from "react";
import FishScroll from "@/components/ui/FishScroll";
import CircularText from "@/components/ui/CircularText";
import { SlidersHorizontal, Settings, X, RefreshCw, Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export function MarqueeSection() {
  // Load default states or read from localStorage
  const [text, setText] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("fs_text");
      if (!saved || saved === "ESTUDIO VISCERAL" || saved === "STUDIO VISCERAL" || saved.toUpperCase() === "STUDIO VISCERAL" || saved.toUpperCase() === "ESTUDIO VISCERAL") {
        return "VISCERAL STUDIO";
      }
      return saved;
    }
    return "VISCERAL STUDIO";
  });

  const [lensStrength, setLensStrength] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("fs_lensStrength");
      return saved ? parseFloat(saved) : -1.00;
    }
    return -1.00;
  });

  const [lensRadius, setLensRadius] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("fs_lensRadius");
      return saved ? parseFloat(saved) : 3.10;
    }
    return 3.10;
  });

  const [fontSize, setFontSize] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("fs_fontSize");
      return saved ? parseInt(saved) : 60;
    }
    return 60;
  });

  const [fontFamily, setFontFamily] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("fs_fontFamily") || "Bricolage Grotesque";
    }
    return "Bricolage Grotesque";
  });

  const [color, setColor] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("fs_color");
      if (!saved || saved === "#4a00d8") {
        return "#000000";
      }
      return saved;
    }
    return "#000000";
  });

  const [direction, setDirection] = useState<"rightToLeft" | "leftToRight">(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("fs_direction") as "rightToLeft" | "leftToRight") || "rightToLeft";
    }
    return "rightToLeft";
  });

  const [textureQuality, setTextureQuality] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("fs_textureQuality");
      return saved ? parseInt(saved) : 4;
    }
    return 4;
  });

  const [blur, setBlur] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("fs_blur");
      return saved ? parseFloat(saved) : 6.0;
    }
    return 6.0;
  });

  const [blurType, setBlurType] = useState<"screen" | "letter">(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("fs_blurType") as "screen" | "letter") || "screen";
    }
    return "screen";
  });

  const [overlay, setOverlay] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("fs_overlay") || "/visceral_cosop_boca_hj_4x.png";
    }
    return "/visceral_cosop_boca_hj_4x.png";
  });

  const [scrollShift, setScrollShift] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("fs_scrollShift");
      return saved ? parseFloat(saved) : -0.26;
    }
    return -0.26;
  });

  const [isOpen, setIsOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem("fs_text", text);
  }, [text]);

  useEffect(() => {
    localStorage.setItem("fs_lensStrength", lensStrength.toString());
  }, [lensStrength]);

  useEffect(() => {
    localStorage.setItem("fs_lensRadius", lensRadius.toString());
  }, [lensRadius]);

  useEffect(() => {
    localStorage.setItem("fs_fontSize", fontSize.toString());
  }, [fontSize]);

  useEffect(() => {
    localStorage.setItem("fs_fontFamily", fontFamily);
  }, [fontFamily]);

  useEffect(() => {
    localStorage.setItem("fs_color", color);
  }, [color]);

  useEffect(() => {
    localStorage.setItem("fs_direction", direction);
  }, [direction]);

  useEffect(() => {
    localStorage.setItem("fs_textureQuality", textureQuality.toString());
  }, [textureQuality]);

  useEffect(() => {
    localStorage.setItem("fs_blur", blur.toString());
  }, [blur]);

  useEffect(() => {
    localStorage.setItem("fs_blurType", blurType);
  }, [blurType]);

  useEffect(() => {
    localStorage.setItem("fs_overlay", overlay);
  }, [overlay]);

  useEffect(() => {
    localStorage.setItem("fs_scrollShift", scrollShift.toString());
  }, [scrollShift]);


  const handleReset = () => {
    setText("VISCERAL STUDIO");
    setLensStrength(-1.00);
    setLensRadius(3.10);
    setFontSize(60);
    setFontFamily("Bricolage Grotesque");
    setColor("#000000");
    setDirection("rightToLeft");
    setTextureQuality(4);
    setBlur(6.0);
    setBlurType("screen");
    setOverlay("/visceral_cosop_boca_hj_4x.png");
    setScrollShift(-0.26);
  };

  useEffect(() => { if (typeof window !== "undefined") { const migrated = localStorage.getItem("fs_migrated_v5"); if (!migrated) { handleReset(); localStorage.setItem("fs_migrated_v5", "true"); } } }, []);
  const colorPresets = [
    { label: "Morado Visceral", value: "#4a00d8", bg: "bg-[#4a00d8]" },
    { label: "Negro", value: "#000000", bg: "bg-black" },
    { label: "Gris", value: "#4b5563", bg: "bg-gray-600" },
    { label: "Rojo", value: "#991b1b", bg: "bg-red-800" },
    { label: "Verde", value: "#065f46", bg: "bg-emerald-800" },
    { label: "Azul", value: "#1e3a8a", bg: "bg-blue-900" },
    { label: "Dorado", value: "#854d0e", bg: "bg-amber-800" },
  ];

  const sansFonts = [
    "Inter", 
    "Space Grotesk", 
    "Syne", 
    "Plus Jakarta Sans",
    "Bricolage Grotesque",
    "Instrument Sans",
    "Hanken Grotesk",
    "Bebas Neue"
  ];

  const serifFonts = [
    "Cormorant Garamond",
    "Instrument Serif",
    "Playfair Display"
  ];

  const sectionRef = useRef<HTMLDivElement>(null);
  
  // Screen detection for dynamic mobile and tablet views
  const [isMobileScreen, setIsMobileScreen] = useState(false);
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobileScreen(window.innerWidth < 768);
      setIsMobileOrTablet(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Construct dynamic rotating text string based on current customized text
  const repeatingText = text && text.trim() !== ""
    ? `${text.trim()} • ${text.trim()} • ${text.trim()} • `
    : "VISCERAL STUDIO • VISCERAL STUDIO • VISCERAL STUDIO • ";

  // Helper to split the customized text into two parts for mobile layout
  const words = text.split(" ");
  const firstWord = words[0] || "VISCERAL";
  const secondWord = words.slice(1).join(" ") || "STUDIO";

  return (
    <section 
      ref={sectionRef}
      className="relative h-[80vh] md:h-screen bg-white lg:bg-[#4a00d8] flex items-center justify-center overflow-hidden border-y border-black/15"
    >
      
      {/* 1. Texto de fondo con distorsión líquida configurable (Solo en Desktop - Usando media queries en CSS) */}
      <div className="absolute inset-0 z-0 hidden lg:block">
        <FishScroll 
          text={text}
          direction={direction}
          font={{ 
            fontSize: `${fontSize}px`, 
            fontWeight: "800", 
            letterSpacing: "0.05em", 
            lineHeight: "1.2em", 
            fontFamily: fontFamily 
          }}
          color={color}
          lensStrength={lensStrength}
          lensRadius={lensRadius}
          textureQuality={textureQuality}
          smoothing={true}
          blur={blur}
          blurType={blurType}
          scrollShift={scrollShift}
        />
      </div>

      {/* 2. Texto Circular Giratorio con el Logo de la Boca Centrado (Solo para móviles y tablets) */}
      <CircularText 
        text={repeatingText} 
        color="#000000" 
        fontFamily={fontFamily} 
        logoUrl={overlay}
        className="absolute inset-0 z-20 lg:hidden"
      />

      {/* 3. Panel Flotante de Control (WebGL Configurator) */}
      <div className="absolute bottom-6 right-6 z-30 hidden lg:block">
        <AnimatePresence>
          {!isOpen ? (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={() => setIsOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-black hover:bg-black/90 text-white font-mono text-xs font-medium uppercase tracking-wider rounded-xl shadow-xl transition-all border border-white/10 cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Configurar WebGL
            </motion.button>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="w-[320px] bg-white/95 backdrop-blur-md border border-black/10 text-black shadow-2xl rounded-2xl overflow-hidden p-5 flex flex-col gap-4 font-sans select-none"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-black/5 pb-2.5">
                <div className="flex items-center gap-1.5">
                  <Settings className="w-4 h-4 text-neutral-800" />
                  <span className="font-mono text-[11px] font-bold tracking-wider uppercase text-neutral-800">
                    Ajustes de Deformación
                  </span>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-black/5 rounded-md transition-colors text-neutral-500 hover:text-black cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Controles */}
              <div className="flex flex-col gap-3.5 text-xs max-h-[60vh] overflow-y-auto pr-1">
                {/* Texto */}
                <div className="flex flex-col gap-1">
                  <label className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest font-semibold">
                    Texto del Marquee
                  </label>
                  <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="w-full px-3 py-1.5 bg-black/5 border border-black/10 rounded-lg text-black focus:outline-none focus:ring-1 focus:ring-black font-medium"
                    placeholder="ESTUDIO VISCERAL"
                  />
                </div>

                {/* Fuerza de Lente (lensStrength) */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center">
                    <label className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest font-semibold">
                      Fuerza Lente (lensStrength)
                    </label>
                    <span className="font-mono text-[10px] bg-black/5 px-1 py-0.5 rounded font-bold">
                      {lensStrength.toFixed(2)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="-1.0"
                    max="1.0"
                    step="0.05"
                    value={lensStrength}
                    onChange={(e) => setLensStrength(parseFloat(e.target.value))}
                    className="w-full h-1 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-black"
                  />
                </div>

                {/* Desenfoque (blur) */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center">
                    <label className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest font-semibold">
                      Desenfoque / Blur (px)
                    </label>
                    <span className="font-mono text-[10px] bg-black/5 px-1 py-0.5 rounded font-bold">
                      {blur.toFixed(1)}px
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="20"
                    step="0.5"
                    value={blur}
                    onChange={(e) => setBlur(parseFloat(e.target.value))}
                    className="w-full h-1 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-black"
                  />
                  {/* Tipo de Desenfoque */}
                  <div className="grid grid-cols-2 gap-1 mt-0.5">
                    {[
                      { label: "Pantalla (Bordes)", value: "screen" },
                      { label: "Letras (Directo)", value: "letter" }
                    ].map((opt) => {
                      const isSelected = blurType === opt.value;
                      return (
                        <button
                          key={opt.value}
                          onClick={() => setBlurType(opt.value as "screen" | "letter")}
                          className={`py-1 rounded text-[9px] font-semibold transition-all cursor-pointer border ${
                            isSelected
                              ? "bg-black text-white border-black shadow-sm"
                              : "bg-black/5 text-neutral-600 border-black/5 hover:bg-black/10"
                          }`}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Radio de Lente (lensRadius) */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center">
                    <label className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest font-semibold">
                      Radio Lente (lensRadius)
                    </label>
                    <span className="font-mono text-[10px] bg-black/5 px-1 py-0.5 rounded font-bold">
                      {lensRadius.toFixed(2)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.10"
                    max="15.00"
                    step="0.05"
                    value={lensRadius}
                    onChange={(e) => setLensRadius(parseFloat(e.target.value))}
                    className="w-full h-1 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-black"
                  />
                  {/* 3 Puntajes / Niveles de Radio de Lente para Configurar */}
                  <div className="grid grid-cols-3 gap-1 mt-1">
                    {[
                      { label: "Bajo (1.5)", value: 1.50 },
                      { label: "Medio (6.0)", value: 6.00 },
                      { label: "Alto (12.0)", value: 12.00 }
                    ].map((preset) => {
                      const isSelected = Math.abs(lensRadius - preset.value) < 0.1;
                      return (
                        <button
                          key={preset.value}
                          onClick={() => setLensRadius(preset.value)}
                          className={`py-1 text-[9px] font-mono rounded border transition-all cursor-pointer ${
                            isSelected
                              ? "bg-black text-white border-black font-semibold"
                              : "bg-black/5 text-neutral-600 border-black/5 hover:bg-black/10"
                          }`}
                        >
                          {preset.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Tamaño de Letra (fontSize) */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center">
                    <label className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest font-semibold">
                      Tamaño Texto (fontSize)
                    </label>
                    <span className="font-mono text-[10px] bg-black/5 px-1 py-0.5 rounded font-bold">
                      {fontSize}px
                    </span>
                  </div>
                  <input
                    type="range"
                    min="60"
                    max="240"
                    step="5"
                    value={fontSize}
                    onChange={(e) => setFontSize(parseInt(e.target.value))}
                    className="w-full h-1 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-black"
                  />
                </div>

                {/* Desplazamiento de Inicio (scrollShift) */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center">
                    <label className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest font-semibold">
                      Ajuste de Inicio / Centrado
                    </label>
                    <span className="font-mono text-[10px] bg-black/5 px-1 py-0.5 rounded font-bold">
                      {scrollShift > 0 ? `+${scrollShift.toFixed(2)}` : scrollShift.toFixed(2)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="-1.0"
                    max="1.0"
                    step="0.02"
                    value={scrollShift}
                    onChange={(e) => setScrollShift(parseFloat(e.target.value))}
                    className="w-full h-1 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-black"
                  />
                  <div className="flex justify-between text-[8px] text-neutral-400 font-mono">
                    <span>Estilo Izquierda</span>
                    <span className={Math.abs(scrollShift - (-0.35)) < 0.01 ? "text-neutral-800 font-semibold" : ""}>
                      Recomendado (-0.35)
                    </span>
                    <span>Estilo Derecha</span>
                  </div>
                </div>

                 {/* Tipografía (fontFamily) */}
                <div className="flex flex-col gap-2.5">
                  <div>
                    <label className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest font-semibold block mb-1">
                      Tipografía (Palo Seco / Sans)
                    </label>
                    <div className="grid grid-cols-2 gap-1">
                      {sansFonts.map((f) => {
                        const isSelected = fontFamily === f;
                        return (
                          <button
                            key={f}
                            onClick={() => setFontFamily(f)}
                            style={{ fontFamily: f }}
                            className={`py-1 text-[10px] rounded border transition-all cursor-pointer font-medium ${
                              isSelected
                                ? "bg-black text-white border-black"
                                : "bg-black/5 text-neutral-600 border-black/5 hover:bg-black/10"
                            }`}
                          >
                            {f}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest font-semibold block mb-1">
                      Tipografía (Con Serifas / Serif)
                    </label>
                    <div className="grid grid-cols-2 gap-1">
                      {serifFonts.map((f) => {
                        const isSelected = fontFamily === f;
                        return (
                          <button
                            key={f}
                            onClick={() => setFontFamily(f)}
                            style={{ fontFamily: f }}
                            className={`py-1 text-[10px] rounded border transition-all cursor-pointer font-medium ${
                              isSelected
                                ? "bg-black text-white border-black"
                                : "bg-black/5 text-neutral-600 border-black/5 hover:bg-black/10"
                            }`}
                          >
                            {f}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Color */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest font-semibold">
                    Color del Texto
                  </label>
                  <div className="grid grid-cols-6 gap-1">
                    {colorPresets.map((p) => {
                      const isSelected = color === p.value;
                      return (
                        <button
                          key={p.value}
                          onClick={() => setColor(p.value)}
                          title={p.label}
                          className={`h-5 w-full rounded relative border border-black/10 flex items-center justify-center cursor-pointer ${p.bg}`}
                        >
                          {isSelected && (
                            <Check className="w-3 h-3 text-white mix-blend-difference" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Dirección y Calidad */}
                <div className="grid grid-cols-2 gap-2 mt-1">
                  {/* Dirección */}
                  <div className="flex flex-col gap-1">
                    <label className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest font-semibold">
                      Dirección
                    </label>
                    <button
                      onClick={() => setDirection(prev => prev === "rightToLeft" ? "leftToRight" : "rightToLeft")}
                      className="py-1.5 bg-black/5 border border-black/5 hover:bg-black/10 rounded font-medium text-[10px] cursor-pointer"
                    >
                      {direction === "rightToLeft" ? "Derecha a Izq" : "Izq a Derecha"}
                    </button>
                  </div>

                  {/* Calidad */}
                  <div className="flex flex-col gap-1">
                    <label className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest font-semibold">
                      Resolución WebGL
                    </label>
                    <div className="grid grid-cols-3 gap-0.5 bg-black/5 p-0.5 rounded border border-black/5">
                      {[1, 2, 4].map((q) => {
                        const isSelected = textureQuality === q;
                        return (
                          <button
                            key={q}
                            onClick={() => setTextureQuality(q)}
                            className={`py-0.5 text-[9px] font-mono rounded cursor-pointer ${
                              isSelected ? "bg-white text-black font-bold shadow-sm" : "text-neutral-500"
                            }`}
                          >
                            {q}x
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Objeto 3D en Primer Plano (Overlay) */}
                <div className="flex flex-col gap-1.5 pt-2 border-t border-black/5">
                  <label className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest font-semibold">
                    Objeto 3D Frontal (Capa superior)
                  </label>
                  <div className="grid grid-cols-2 gap-1">
                    {[
                      { label: "Logo Principal", value: "/visceral_cosop_boca_hj_4x.png" },
                      { label: "Logo Alt", value: "/visceral_cosop_boca_hj_4x_1.png" },
                      { label: "Ninguno", value: "none" },
                    ].map((opt) => {
                      const isSelected = overlay === opt.value;
                      return (
                        <button
                          key={opt.value}
                          onClick={() => setOverlay(opt.value)}
                          className={`py-1 px-1.5 rounded border text-[10px] transition-all cursor-pointer font-medium ${
                            isSelected
                              ? "bg-black text-white border-black font-semibold"
                              : "bg-black/5 text-neutral-600 border-black/5 hover:bg-black/10"
                          }`}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Reset Action */}
              <div className="pt-2 border-t border-black/5 flex justify-end">
                <button
                  onClick={handleReset}
                  className="flex items-center gap-1 px-2.5 py-1 text-[9px] font-mono text-neutral-500 hover:text-black transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-2.5 h-2.5" />
                  Restablecer
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </section>
  );
}
