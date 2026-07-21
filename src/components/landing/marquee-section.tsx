"use client";

import { useState, useEffect, useRef } from "react";
import FishScroll from "@/components/ui/FishScroll";
import CircularText from "@/components/ui/CircularText";
import { motion, AnimatePresence } from "motion/react";

export function MarqueeSection() {
  const text = "VISCERAL STUDIO";
  const lensStrength = -0.45;
  const lensRadius = 7.20;
  const fontSize = 60;
  const fontFamily = "Bricolage Grotesque";
  const color = "#000000";
  const direction = "rightToLeft";
  const textureQuality = 4;
  const blur = 6.0;
  const blurType = "screen";
  const overlay = "/visceral_cosop_boca_hj_4x.png";
  const scrollShift = -0.26;

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
  const repeatingText = "VISCERAL STUDIO • VISCERAL STUDIO • VISCERAL STUDIO • ";

  return (
    <section 
      ref={sectionRef}
      className="relative h-[80vh] md:h-screen bg-white lg:bg-[#4a00d8] flex items-center justify-center overflow-hidden border-y border-black/15"
    >
      
      {/* 1. Texto de fondo con distorsión líquida (Solo en Desktop - Usando media queries en CSS) */}
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

    </section>
  );
}
