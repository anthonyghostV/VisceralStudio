import React, { useState, useEffect } from "react";
import { motion } from "motion/react";

interface CircularTextProps {
  text?: string;
  color?: string;
  fontFamily?: string;
  className?: string;
  radius?: number; // Radius of the circular path
  logoUrl?: string; // Optional center logo image URL
}

export function CircularText({
  text = "VISCERAL STUDIO ✦",
  color = "#ffffff",
  fontFamily = "Space Grotesk, Inter, sans-serif",
  className = "",
  radius = 72, // Elegant radius for perfect breathing room
  logoUrl = "/logo_negro.svg",
}: CircularTextProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Extract clean base phrase by removing any existing separator stars/bullets
  const parts = text
    .replace(/[•✦*]/g, "|")
    .split("|")
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  const rawPhrase = parts.length > 0 ? parts[0] : "VISCERAL STUDIO";

  // Symmetrical layout with exactly TWO repetitions as requested ("quita un visceral estudio")
  // We use non-breaking spaces (\u00A0) to guarantee the SVG text rendering engine
  // never collapses spaces, ensuring perfect spacing around the star on the left (junction).
  const phraseWithSpaces = rawPhrase.replace(/\s+/g, "\u00A0");
  
  // 3 non-breaking spaces on each side of the star for premium, airy editorial design
  const spacingAroundStar = "\u00A0\u00A0\u00A0";
  
  // Construct the perfect symmetrical text loop
  const finalText = `${phraseWithSpaces}${spacingAroundStar}✦${spacingAroundStar}${phraseWithSpaces}${spacingAroundStar}✦${spacingAroundStar}`;

  const circumference = 2 * Math.PI * radius;
  const charCount = finalText.length;
  
  // Calculate a larger, bold, and highly aesthetic font size for the two-repetition layout
  // to perfectly fill up the circular boundary with premium editorial style.
  const dynamicFontSize = Math.max(8.5, Math.min(15.0, (circumference / charCount) * 1.12));

  // If logoUrl is empty, none, or matches the old PNG name, fallback to the iconic mouth logo vector
  const resolvedLogoUrl = !logoUrl || logoUrl === "none" || logoUrl === "/visceral_cosop_boca_hj_4x.png" ? "/logo_negro.svg" : logoUrl;

  const isSvg = resolvedLogoUrl.endsWith(".svg");
  let filterClass = "";
  if (color === "#000000" || color === "black") {
    // We want a black logo
    if (resolvedLogoUrl === "/logo_blanco.svg") {
      filterClass = "brightness-0"; // Force white SVG to black
    } else {
      filterClass = ""; // logo_negro.svg is already black
    }
  } else {
    // We want a white logo (or drop-shadowed)
    if (resolvedLogoUrl === "/logo_negro.svg") {
      filterClass = "invert"; // Force black SVG to white
    } else {
      filterClass = ""; // logo_blanco.svg is already white
    }
  }

  return (
    <div className={`flex items-center justify-center select-none pointer-events-none ${className}`}>
      <div className="w-[82vmin] h-[82vmin] xs:w-[72vmin] xs:h-[72vmin] sm:w-[62vmin] sm:h-[62vmin] max-w-[430px] max-h-[430px] flex items-center justify-center relative">
        
        {/* Central Logo: Static and perfectly aligned */}
        {resolvedLogoUrl && (
          <div className="absolute w-[45%] h-[45%] flex items-center justify-center pointer-events-auto z-10">
            <img 
              src={resolvedLogoUrl} 
              alt="Visceral Center Logo" 
              className={`w-full h-full object-contain transition-all duration-300 ${filterClass}`}
              referrerPolicy="no-referrer"
            />
          </div>
        )}

        {/* SVG Text: Rotates mathematically centered on its own 100px 100px axis inside the SVG viewBox */}
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full z-20"
        >
          <defs>
            {/* Perfectly centered path of diameter 2*radius in 200x200 canvas */}
            <path
              id="circularTextPath"
              d={`M 100, 100 m -${radius}, 0 a ${radius},${radius} 0 1,1 ${radius * 2},0 a ${radius},${radius} 0 1,1 -${radius * 2},0`}
            />
          </defs>
          <motion.g
            animate={{ rotate: 360 }}
            transition={{
              repeat: Infinity,
              ease: "linear",
              duration: 25, // Elegant, smooth, premium speed
            }}
            style={{ transformOrigin: "100px 100px" }}
          >
            <text
              className={`font-bold uppercase tracking-[0.24em] ${
                color === "#000000" || color === "black"
                  ? "drop-shadow-[0_2px_4px_rgba(0,0,0,0.05)]"
                  : "drop-shadow-[0_4px_12px_rgba(0,0,0,0.65)]"
              }`}
              fill={color}
              style={{ 
                fontFamily,
                fontSize: `${dynamicFontSize}px`,
                letterSpacing: "0.24em"
              }}
            >
              <textPath
                href="#circularTextPath"
                xlinkHref="#circularTextPath"
                startOffset="0%"
                textLength={circumference}
                lengthAdjust="spacing"
              >
                {finalText}
              </textPath>
            </text>
          </motion.g>
        </svg>
      </div>
    </div>
  );
}

export default CircularText;

