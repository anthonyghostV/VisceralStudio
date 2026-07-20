"use client";

import { ArrowUpRight } from "lucide-react";
import { useEffect, useRef } from "react";
import LiquidImage from "../ui/liquid-image";

export function FooterSection() {
  return (
    <footer className="relative bg-black">
      {/* Panoramic banner image */}
      <div className="relative w-full overflow-hidden">
        <div className="absolute inset-0 z-0">
          <LiquidImage 
            sourceType="image" 
            image={{src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Upscaled%20Image%20%2810%29-UnDKstODkIENp5xqTYUEpt0Sm8tNOw.png", alt: "Bioluminescent landscape"}} 
            borderRadius={0}
            fit="cover"
          />
        </div>
        <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Upscaled%20Image%20%2810%29-UnDKstODkIENp5xqTYUEpt0Sm8tNOw.png"
          alt="Bioluminescent landscape"
          width={1920}
          height={400}
          loading="lazy"
          className="w-full h-auto object-cover object-center opacity-0 pointer-events-none block"
        />
        {/* Gradient fade to black at bottom */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black pointer-events-none z-10" />
        {/* Subtle dark vignette on sides */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40 pointer-events-none z-10" />
      </div>

      {/* Footer content — black background, white text */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Main Footer */}
        
        <div className="py-16 lg:py-20">
          <div className="flex flex-col md:flex-row justify-between items-center w-full gap-8 md:gap-0">
            {/* Brand Logo */}
            <div className="font-display text-2xl text-white font-bold tracking-tight flex items-center gap-3">
              <img src="/logo_blanco.svg" alt="Visceral Logo" width={48} height={48} loading="lazy" className="w-12 h-auto" />
              ESTUDIO VISCERAL
            </div>

            {/* Social Links */}
            <div className="flex flex-wrap justify-center gap-8">
              <a 
                 href="https://instagram.com" 
                 target="_blank" 
                 rel="noopener noreferrer" 
                 className="font-mono text-xs uppercase text-white/50 hover:text-white transition-colors duration-300 flex items-center gap-1"
              >
                INSTAGRAM
              </a>
              <a 
                 href="https://behance.net" 
                 target="_blank" 
                 rel="noopener noreferrer" 
                 className="font-mono text-xs uppercase text-white/50 hover:text-white transition-colors duration-300 flex items-center gap-1"
              >
                BEHANCE
              </a>
              <a 
                 href="mailto:anthonymaxi2000@gmail.com" 
                 className="font-mono text-xs uppercase text-white/50 hover:text-white transition-colors duration-300 flex items-center gap-1"
              >
                EMAIL
              </a>
            </div>

            {/* Copyright text */}
            <div className="font-mono text-[10px] text-white/30 text-center md:text-right uppercase">
              © 2026 ESTUDIO VISCERAL. TODOS LOS DERECHOS RESERVADOS.
            </div>
          </div>
        </div>


      </div>
    </footer>
  );
}
