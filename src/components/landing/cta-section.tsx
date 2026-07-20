"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import ShaderFlow from "../ui/shader-flow";
import { ScrollReveal } from "./scroll-reveal";

export function CtaSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="contacto" ref={sectionRef} className="relative py-24 lg:py-32 overflow-hidden bg-black text-white">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div
          className={`relative border border-white/20 transition-all duration-1000 overflow-hidden rounded-3xl group ${
            isVisible ? "opacity-100 translate-y-0 shadow-[0_0_50px_rgba(255,255,255,0.05)] border-white/30" : "opacity-0 translate-y-8"
          }`}
        >
          {/* Ambient Glow Backdrops */}
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-rose-500/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen animate-pulse duration-[8s]" />
          <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen animate-pulse duration-[12s]" />

          {/* Background effect */}
          <div className="absolute inset-0 z-0">
            <ShaderFlow xScale={1.2} yScale={0.8} distortion={0.04} speed={0.002} color="default" />
            <div className="absolute inset-0 bg-black/75 pointer-events-none" />
          </div>
          
          <div className="relative z-10 px-8 lg:px-16 py-16 lg:py-24 contacto-content">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
              {/* Left content */}
              <div className="flex-1 max-w-2xl">
                <ScrollReveal duration={1200} distance={40}>
                  <h2 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-[72px] font-display tracking-tight mb-6 sm:mb-8 leading-[0.95] sm:leading-[0.85] text-white contacto-title">
                    Si llegaste hasta aquí,
                    <br />
                    <span className="italic font-light text-white/70 inline-block">probablemente ya entiendes la diferencia.</span>
                  </h2>
                </ScrollReveal>
                
                <ScrollReveal duration={1200} delay={150} distance={30}>
                  <div className="text-base sm:text-lg md:text-xl text-white/70 mb-6 sm:mb-8 leading-relaxed space-y-2 font-light contacto-desc">
                    <p>Las mejores marcas empiezan con una conversación.</p>
                    <p>Quizá la siguiente sea la tuya.</p>
                  </div>
                </ScrollReveal>
                
                <ScrollReveal duration={1200} delay={300} distance={20}>
                  <div className="flex flex-col sm:flex-row items-start gap-4">
                    <div className="relative group/btn">
                      {/* Button backglow */}
                      <div className="absolute -inset-1 bg-white rounded-full blur-md opacity-50 group-hover/btn:opacity-100 transition duration-500 group-hover/btn:duration-200 animate-tilt pointer-events-none" />
                      <Button
                        size="lg"
                        className="relative bg-white hover:bg-neutral-100 text-black px-8 h-14 text-base rounded-full group cursor-pointer transition-all duration-300"
                        onClick={() => window.location.href = 'mailto:anthonymaxi2000@gmail.com'}
                      >
                        Comencemos una conversación
                        <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </div>
                  </div>
                </ScrollReveal>
              </div>
            </div>
          </div>
          {/* Decorative corner */}
          <div className="absolute top-0 right-0 w-32 h-32 border-b border-l border-white/15 z-10 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-32 h-32 border-t border-r border-white/15 z-10 pointer-events-none" />
        </div>
      </div>
    </section>
  );
}
