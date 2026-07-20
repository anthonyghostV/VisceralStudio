"use client";

import { useEffect, useState, useRef } from "react";
import { ScrollReveal } from "./scroll-reveal";

export function IntegrationsSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section 
      id="integrations" 
      ref={sectionRef} 
      className="relative overflow-hidden min-h-[700px] xs:min-h-[850px] sm:min-h-[1000px] md:min-h-[1100px] lg:min-h-[170vh] flex flex-col items-center justify-start pt-12 md:pt-16 lg:pt-20 pb-[250px] xs:pb-[350px] sm:pb-[450px] md:pb-[600px] lg:pb-[750px] px-4 bg-black"
    >
      {/* Imagen de fondo a pantalla completa dentro de la misma sección (100% nítida y opaca) */}
      <div className={`absolute top-[35%] xs:top-[32%] sm:top-[28%] md:top-[28%] lg:top-[32%] bottom-0 left-0 right-0 w-full transition-all duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] delay-200 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}>
        <img
          src="/manos_lazos.webp"
          alt=""
          aria-hidden="true"
          width={1920}
          height={1080}
          referrerPolicy="no-referrer"
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover object-bottom mt-3"
        />
      </div>

      {/* Texto — Capa superior (z-10) alineada a la izquierda, situada arriba, con generoso margen inferior */}
      <div className="relative z-10 pt-0 pb-12 text-left flex flex-col items-start max-w-4xl mx-auto mb-16 md:mb-24 lg:mb-32 w-full integrations-content">
        <ScrollReveal duration={1200} distance={40}>
          <h2 className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-[139px] lg:leading-[107px] font-display tracking-tight text-white mt-8 sm:mt-[38px] integrations-title">
            No hacemos
            <br />
            <span className="text-[#4a00d8]">logos.</span>
          </h2>
        </ScrollReveal>

        <ScrollReveal duration={1200} delay={150} distance={20} className="w-full">
          <p className="mt-8 sm:mt-16 lg:mt-[80px] text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground leading-relaxed max-w-2xl font-light text-left text-balance lg:w-[681px] lg:h-[153px] integrations-desc">
            Construimos percepción.
            <br />
            En Visceral Studio creemos que una marca es mucho más que su identidad visual. Es la forma en que las personas la recuerdan, la recuerdan y deciden confiar en ella.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
