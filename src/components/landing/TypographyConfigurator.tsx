"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useDragControls } from "motion/react";
import { Sliders, X, RotateCcw, Check, Type, GripHorizontal, Minimize2, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FontOption {
  name: string;
  value: string;
  className: string;
  preview: string;
}

const DISPLAY_FONTS: FontOption[] = [
  {
    name: "Bricolage Grotesque",
    value: "'Bricolage Grotesque', system-ui, sans-serif",
    className: "font-display",
    preview: "Bricolage",
  },
  {
    name: "Bebas Neue",
    value: "'Bebas Neue', sans-serif",
    className: "",
    preview: "BEBAS NEUE",
  },
  {
    name: "Instrument Serif",
    value: "'Instrument Serif', serif",
    className: "",
    preview: "Instrument",
  },
  {
    name: "Cormorant Garamond",
    value: "'Cormorant Garamond', serif",
    className: "",
    preview: "Cormorant",
  },
  {
    name: "Instrument Sans",
    value: "'Instrument Sans', system-ui, sans-serif",
    className: "",
    preview: "Instrument Sans",
  },
  {
    name: "JetBrains Mono",
    value: "'JetBrains Mono', monospace",
    className: "font-mono",
    preview: "JetBrains",
  },
];

const BODY_FONTS: FontOption[] = [
  {
    name: "Instrument Sans",
    value: "'Instrument Sans', system-ui, sans-serif",
    className: "",
    preview: "Sans estándar",
  },
  {
    name: "Hanken Grotesk",
    value: "'Hanken Grotesk', system-ui, sans-serif",
    className: "",
    preview: "Sans cálido",
  },
  {
    name: "JetBrains Mono",
    value: "'JetBrains Mono', monospace",
    className: "font-mono",
    preview: "Mono técnico",
  },
];

const WEIGHT_OPTIONS = [
  { label: "Fino (300)", value: "300" },
  { label: "Regular (400)", value: "400" },
  { label: "Medio (500)", value: "500" },
  { label: "Semibold (600)", value: "600" },
  { label: "Negrita (700)", value: "700" },
  { label: "Extra Bold (800)", value: "800" },
  { label: "Black (900)", value: "900" },
];

const SPACING_OPTIONS = [
  { label: "Muy Cerrado", value: "-0.05em" },
  { label: "Estrecho", value: "-0.02em" },
  { label: "Normal", value: "0em" },
  { label: "Separado", value: "0.04em" },
];

export function TypographyConfigurator() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const constraintsRef = useRef<HTMLDivElement>(null);
  const dragControls = useDragControls();

  // Default values
  const defaultDisplayFont = "'Bricolage Grotesque', system-ui, sans-serif";
  const defaultBodyFont = "'Instrument Sans', system-ui, sans-serif";
  const defaultWeight = "850"; // Boldest by default!
  const defaultSpacing = "-0.04em";

  // State
  const [displayFont, setDisplayFont] = useState(defaultDisplayFont);
  const [bodyFont, setBodyFont] = useState(defaultBodyFont);
  const [weight, setWeight] = useState(defaultWeight);
  const [spacing, setSpacing] = useState(defaultSpacing);
  const [lenisSmooth, setLenisSmooth] = useState(true);
  const [parallaxEnabled, setParallaxEnabled] = useState(true);

  // Initialize from LocalStorage
  useEffect(() => {
    const savedDisplayFont = localStorage.getItem("visceral_display_font");
    const savedBodyFont = localStorage.getItem("visceral_body_font");
    const savedWeight = localStorage.getItem("visceral_display_weight");
    const savedSpacing = localStorage.getItem("visceral_display_spacing");
    const savedLenisDisabled = localStorage.getItem("visceral_lenis_disabled") === "true";
    const savedParallaxDisabled = localStorage.getItem("visceral_parallax_disabled") === "true";

    if (savedDisplayFont) setDisplayFont(savedDisplayFont);
    if (savedBodyFont) setBodyFont(savedBodyFont);
    if (savedWeight) setWeight(savedWeight);
    if (savedSpacing) setSpacing(savedSpacing);
    setLenisSmooth(!savedLenisDisabled);
    setParallaxEnabled(!savedParallaxDisabled);
  }, []);

  // Apply typography values to document root
  useEffect(() => {
    document.documentElement.style.setProperty("--font-display", displayFont);
    localStorage.setItem("visceral_display_font", displayFont);
  }, [displayFont]);

  useEffect(() => {
    document.documentElement.style.setProperty("--font-sans", bodyFont);
    localStorage.setItem("visceral_body_font", bodyFont);
  }, [bodyFont]);

  useEffect(() => {
    document.documentElement.style.setProperty("--font-display-weight", weight);
    localStorage.setItem("visceral_display_weight", weight);
  }, [weight]);

  useEffect(() => {
    document.documentElement.style.setProperty("--font-display-letter-spacing", spacing);
    localStorage.setItem("visceral_display_spacing", spacing);
  }, [spacing]);

  const toggleLenis = () => {
    const newValue = !lenisSmooth;
    setLenisSmooth(newValue);
    localStorage.setItem("visceral_lenis_disabled", (!newValue).toString());
    window.dispatchEvent(new CustomEvent("toggle-lenis"));
  };

  const toggleParallax = () => {
    const newValue = !parallaxEnabled;
    setParallaxEnabled(newValue);
    localStorage.setItem("visceral_parallax_disabled", (!newValue).toString());
    window.dispatchEvent(new CustomEvent("toggle-parallax"));
  };

  const handleReset = () => {
    setDisplayFont(defaultDisplayFont);
    setBodyFont(defaultBodyFont);
    setWeight(defaultWeight);
    setSpacing(defaultSpacing);
    setLenisSmooth(true);
    setParallaxEnabled(true);
    localStorage.removeItem("visceral_lenis_disabled");
    localStorage.removeItem("visceral_parallax_disabled");
    window.dispatchEvent(new CustomEvent("toggle-lenis"));
    window.dispatchEvent(new CustomEvent("toggle-parallax"));
  };

  return (
    <>
      {/* Invisible container covering the viewport to define drag constraints */}
      <div ref={constraintsRef} className="fixed inset-0 pointer-events-none z-50 overflow-hidden" />

      {/* Floating Button to open/reopen customizer */}
      <div className="fixed bottom-8 left-8 z-40 flex items-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setIsOpen(true);
            setIsMinimized(false);
          }}
          className="flex items-center gap-2.5 px-5 py-3 bg-white/10 hover:bg-white/20 active:bg-white/30 backdrop-blur-xl border border-white/20 rounded-full text-white shadow-xl transition-colors cursor-pointer"
        >
          <Type className="w-4 h-4" />
          <span className="text-xs font-mono tracking-wider uppercase font-semibold">Tipografía</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        </motion.button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            drag
            dragControls={dragControls}
            dragListener={false}
            dragConstraints={constraintsRef}
            dragElastic={0.05}
            dragMomentum={false}
            initial={{ opacity: 0, scale: 0.95, y: 50, x: 24 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              y: 0,
              height: isMinimized ? "auto" : "640px",
              width: "360px"
            }}
            exit={{ opacity: 0, scale: 0.95, y: 50 }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className="fixed bottom-24 left-8 bg-neutral-950/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl z-50 flex flex-col text-white pointer-events-auto select-none overflow-hidden"
            style={{ 
              maxHeight: "80vh",
            }}
          >
            {/* Header / Drag Handle */}
            <div 
              onPointerDown={(e) => dragControls.start(e)}
              className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/10 cursor-grab active:cursor-grabbing select-none"
            >
              <div className="flex items-center gap-2.5 pointer-events-none">
                <GripHorizontal className="w-4 h-4 text-neutral-400" />
                <div className="flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-neutral-300" />
                  <span className="font-display text-sm font-bold tracking-tight">Personalizador</span>
                </div>
              </div>

              {/* Window controls */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  title={isMinimized ? "Maximizar" : "Minimizar"}
                  className="p-1 hover:bg-white/10 rounded-md transition-colors text-neutral-400 hover:text-white cursor-pointer"
                >
                  {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  title="Cerrar"
                  className="p-1 hover:bg-white/10 rounded-md transition-colors text-neutral-400 hover:text-white cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Window Content */}
            <AnimatePresence initial={false}>
              {!isMinimized && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex-1 overflow-y-auto px-4 py-4 space-y-6 flex flex-col scrollbar-thin"
                >
                  {/* 1. Heading Font Family */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest">
                      Tipografía de Títulos
                    </label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {DISPLAY_FONTS.map((font) => {
                        const isSelected = displayFont === font.value;
                        return (
                          <button
                            key={font.name}
                            onClick={() => setDisplayFont(font.value)}
                            className={`relative text-left p-2.5 rounded-xl border transition-all duration-300 flex flex-col justify-between h-[65px] group cursor-pointer ${
                              isSelected
                                ? "bg-white text-black border-white"
                                : "bg-white/5 text-neutral-300 border-white/10 hover:bg-white/10 hover:border-white/20"
                            }`}
                          >
                            <span className="text-[9px] font-mono opacity-65 group-hover:opacity-100 truncate w-full">
                              {font.name}
                            </span>
                            <span
                              style={{ fontFamily: font.value }}
                              className="text-sm leading-tight font-bold tracking-tight mt-1 overflow-hidden whitespace-nowrap text-ellipsis w-full"
                            >
                              {font.preview}
                            </span>
                            {isSelected && (
                              <div className="absolute top-1.5 right-1.5 w-3 h-3 rounded-full bg-black flex items-center justify-center">
                                <Check className="w-2 h-2 text-white" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 2. Heading Font Weight */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest">
                        Grosor de Títulos
                      </label>
                      <span className="text-[10px] font-mono bg-white/10 px-1.5 py-0.5 rounded text-white font-semibold">
                        {weight}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="grid grid-cols-4 gap-1">
                        {WEIGHT_OPTIONS.map((opt) => {
                          const isSelected = weight === opt.value;
                          return (
                            <button
                              key={opt.value}
                              onClick={() => setWeight(opt.value)}
                              className={`py-1 text-[9px] font-mono rounded border transition-all cursor-pointer ${
                                isSelected
                                  ? "bg-white text-black border-white font-bold"
                                  : "bg-white/5 text-neutral-300 border-white/10 hover:bg-white/10"
                              }`}
                            >
                              {opt.value}
                            </button>
                          );
                        })}
                      </div>
                      {/* Live text preview inside inspector */}
                      <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 overflow-hidden">
                        <p className="text-[9px] font-mono text-neutral-500 mb-1">Muestra:</p>
                        <h4
                          style={{ fontFamily: displayFont, fontWeight: weight }}
                          className="text-lg leading-none tracking-tight text-white transition-all uppercase"
                        >
                          Visceral
                        </h4>
                      </div>
                    </div>
                  </div>

                  {/* 3. Heading Letter Spacing */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest">
                      Espaciado (Tracking)
                    </label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {SPACING_OPTIONS.map((opt) => {
                        const isSelected = spacing === opt.value;
                        return (
                          <button
                            key={opt.value}
                            onClick={() => setSpacing(opt.value)}
                            className={`p-2 text-[11px] text-left rounded-xl border transition-all flex justify-between items-center cursor-pointer ${
                              isSelected
                                ? "bg-white text-black border-white font-medium"
                                : "bg-white/5 text-neutral-300 border-white/10 hover:bg-white/10"
                            }`}
                          >
                            <span>{opt.label}</span>
                            {isSelected && <Check className="w-3 h-3" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 4. Body Font Family */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest">
                      Tipografía del Cuerpo
                    </label>
                    <div className="grid grid-cols-1 gap-1">
                      {BODY_FONTS.map((font) => {
                        const isSelected = bodyFont === font.value;
                        return (
                          <button
                            key={font.name}
                            onClick={() => setBodyFont(font.value)}
                            className={`w-full p-2.5 rounded-xl border transition-all duration-300 flex items-center justify-between text-left cursor-pointer ${
                              isSelected
                                ? "bg-white text-black border-white"
                                : "bg-white/5 text-neutral-300 border-white/10 hover:bg-white/10"
                            }`}
                          >
                            <div className="flex flex-col">
                              <span className="text-xs font-medium">{font.name}</span>
                              <span className="text-[9px] opacity-60 font-mono mt-0.5">
                                {font.preview}
                              </span>
                            </div>
                            {isSelected && <Check className="w-3.5 h-3.5" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 5. Experience / Compare Effects (Antes / Después) */}
                  <div className="space-y-2 pt-2 border-t border-white/10">
                    <label className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest block">
                      Comparar Antes y Después
                    </label>
                    <p className="text-[9px] text-neutral-400 leading-tight">
                      Activa o desactiva las nuevas interacciones para sentir la diferencia:
                    </p>
                    <div className="space-y-1.5 mt-1">
                      {/* Smooth Scroll */}
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5">
                        <div className="flex flex-col">
                          <span className="text-xs font-medium text-white">Scroll Suave (Lenis)</span>
                          <span className="text-[9px] text-neutral-400">Flujo continuo vs salto tradicional</span>
                        </div>
                        <button
                          onClick={toggleLenis}
                          className={`relative w-9 h-5 rounded-full transition-colors duration-200 cursor-pointer ${
                            lenisSmooth ? "bg-white" : "bg-neutral-800"
                          }`}
                        >
                          <span
                            className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full transition-transform duration-200 ${
                              lenisSmooth ? "translate-x-4 bg-black" : "translate-x-0 bg-neutral-400"
                            }`}
                          />
                        </button>
                      </div>

                      {/* Parallax Mouse */}
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5">
                        <div className="flex flex-col">
                          <span className="text-xs font-medium text-white">Efecto Imán (Parallax)</span>
                          <span className="text-[9px] text-neutral-400">La imagen del home sigue al cursor</span>
                        </div>
                        <button
                          onClick={toggleParallax}
                          className={`relative w-9 h-5 rounded-full transition-colors duration-200 cursor-pointer ${
                            parallaxEnabled ? "bg-white" : "bg-neutral-800"
                          }`}
                        >
                          <span
                            className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full transition-transform duration-200 ${
                              parallaxEnabled ? "translate-x-4 bg-black" : "translate-x-0 bg-neutral-400"
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Footer actions */}
                  <div className="pt-2 border-t border-white/10 flex gap-2 mt-auto">
                    <Button
                      onClick={handleReset}
                      variant="outline"
                      className="flex-1 bg-transparent border-white/10 hover:bg-white/5 hover:text-white text-neutral-300 h-9 text-[10px] font-mono rounded-xl cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3 mr-1.5" />
                      Restablecer
                    </Button>
                    <Button
                      onClick={() => setIsOpen(false)}
                      className="flex-1 bg-white hover:bg-neutral-200 text-black h-9 text-[10px] font-mono font-bold rounded-xl cursor-pointer"
                    >
                      <Check className="w-3 h-3 mr-1.5" />
                      Listo
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Minimized Indicator Bar */}
            {isMinimized && (
              <div 
                onClick={() => setIsMinimized(false)}
                className="px-4 py-2 text-center text-[10px] text-neutral-400 font-mono hover:text-white cursor-pointer hover:bg-white/5 transition-all"
              >
                Haz doble clic o toca para restaurar
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
