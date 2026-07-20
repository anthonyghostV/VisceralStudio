"use client";

import { useState, useEffect, useRef } from "react";
import FishScroll from "@/components/ui/FishScroll";
import CircularText from "@/components/ui/CircularText";
import { motion } from "motion/react";

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
      return saved ? parseFloat(saved) : 0.45;
    }
    return 0.45;
  });

  const [lensRadius, setLensRadius] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("fs_lensRadius");
      return saved ? parseFloat(saved) : 1.50;
    }
    return 1.50;
  });

  const [fontSize, setFontSize] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("fs_fontSize");
      return saved ? parseInt(saved) : 140;
    }
    return 140;
  });

  const [fontFamily, setFontFamily] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("fs_fontFamily") || "Inter";
    }
    return "Inter";
  });

  const [color, setColor] = useState("#000000");

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
      return saved ? parseFloat(saved) : 8.0;
    }
    return 8.0;
  });

  const [blurType, setBlurType] = useState<"screen" | "letter">(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("fs_blurType") as "screen" | "letter") || "letter";
    }
    return "letter";
  });

  const [overlay, setOverlay] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("fs_overlay") || "/logo_negro.svg";
    }
    return "/logo_negro.svg";
  });

  const [scrollShift, setScrollShift] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("fs_scrollShift");
      return saved ? parseFloat(saved) : -0.35;
    }
    return -0.35;
  });

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
      className="relative h-[80vh] md:h-screen bg-white lg:bg-[#4a00d8] flex items-center justify-center overflow-hidden border-y border-black/10 lg:border-white/10 marquee-section"
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

      {/* 2b. Logo de la Boca Centrado para pantallas de computadora (Desktop Center Logo) */}
      {overlay && overlay !== "none" && (
        <div className="absolute inset-0 z-10 hidden lg:flex items-center justify-center select-none pointer-events-none">
          <div className="w-[32vmin] h-[32vmin] max-w-[280px] max-h-[280px] flex items-center justify-center">
            <img 
              src={overlay} 
              alt="Visceral Center Logo Desktop" 
              className={`w-full h-full object-contain transition-all duration-300 ${
                overlay === "/logo_blanco.svg"
                  ? "" // Already white
                  : overlay === "/logo_negro.svg"
                    ? "invert" // Invert the black vector to make it white on the purple background
                    : "filter drop-shadow-[0_16px_32px_rgba(0,0,0,0.55)]"
              }`}
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      )}

    </section>
  );
}
