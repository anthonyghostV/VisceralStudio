"use client";

import { useState, useEffect, useRef } from "react";
import { ScrollReveal } from "./scroll-reveal";
import ImageSwitcher from "../ImageSwitcher";

export function DevelopersSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section id="developers" ref={sectionRef} className="relative pt-16 md:pt-24 lg:pt-32 pb-16 lg:pb-24 overflow-hidden bg-black">
      {/* All text content sits on top */}
      <div className="relative z-10 w-full mx-auto px-4 md:px-8 lg:px-12">
        {/* Header — Centered */}
        <ScrollReveal duration={1200} distance={40} className="mb-10 text-center flex flex-col items-center">
          <h2 className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-[139px] lg:leading-[107px] font-display tracking-tight text-white mb-4 text-center developers-title">
            No mostramos
            <br />
            <span className="text-[#4a00d8]">proyectos.</span>
          </h2>
        </ScrollReveal>

        {/* Description + Features — Centered */}
        <ScrollReveal duration={1200} delay={150} distance={30} className="w-full max-w-2xl mx-auto mb-12 sm:mb-24 md:mb-48 lg:mb-64 text-center flex flex-col items-center">
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed font-light text-center max-w-xl developers-desc">
            Mostramos transformaciones. Cada marca comenzó con un desafío diferente. Nuestra labor fue cambiar la forma en que las personas la perciben.
          </p>
        </ScrollReveal>

        {/* Interactive Image Gallery */}
        <ScrollReveal duration={1200} delay={300} distance={45} className="w-full mt-12 md:mt-16">
          <ImageSwitcher 
            largeImage01="/Cinematic_tilted_camera_angle_2K_202607160221-Recuperado.jpg"
            smallImage01="/Cinematic_tilted_camera_angle_2K_202607160221-Recuperado.jpg"
            largeImage02="/Architectural_stairs_with_texture_2K_202607151740_4.jpg"
            smallImage02="/Architectural_stairs_with_texture_2K_202607151740_4.jpg"
            largeImage03="/manos lazos.png"
            smallImage03="/manos lazos.png"
          />
        </ScrollReveal>
      </div>
    </section>
  );
}
