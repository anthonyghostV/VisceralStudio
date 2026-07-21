"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { ScrollReveal } from "./scroll-reveal";
const cinematicBg = "/Cinematic_tilted_camera_angle_2K_202607160221-Recuperado.jpg";

// Floating dot particles visualization
function ParticleVisualization() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener("resize", resize);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      };
    };
    canvas.addEventListener("mousemove", handleMouseMove);

    // Generate stable particle positions
    const COUNT = 70;
    const particles = Array.from({ length: COUNT }, (_, i) => {
      const seed = i * 1.618;
      return {
        bx: ((seed * 127.1) % 1),
        by: ((seed * 311.7) % 1),
        phase: seed * Math.PI * 2,
        speed: 0.4 + (seed % 0.4),
        radius: 1.2 + (seed % 2.2),
      };
    });

    let time = 0;
    const render = () => {
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;

      ctx.clearRect(0, 0, w, h);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      particles.forEach((p) => {
        const flowX = Math.sin(time * p.speed * 0.4 + p.phase) * 38;
        const flowY = Math.cos(time * p.speed * 0.3 + p.phase * 0.7) * 24;

        const bx = p.bx * w;
        const by = p.by * h;
        const dx = p.bx - mx;
        const dy = p.by - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const influence = Math.max(0, 1 - dist * 2.8);

        const x = bx + flowX + influence * Math.cos(time + p.phase) * 36;
        const y = by + flowY + influence * Math.sin(time + p.phase) * 36;

        const pulse = Math.sin(time * p.speed + p.phase) * 0.5 + 0.5;
        const alpha = 0.08 + pulse * 0.18 + influence * 0.3;

        ctx.beginPath();
        ctx.arc(x, y, p.radius + pulse * 0.8, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.fill();
      });

      time += 0.016;
      frameRef.current = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-auto"
      style={{ width: "100%", height: "100%" }}
    />
  );
}

export function FeaturesSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

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
      id="features"
      ref={sectionRef}
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-black py-0"
    >
      {/* Background Image & Particle effect stretching to full bleed screen */}
      <div className="absolute inset-0 w-full h-full overflow-hidden bg-black">
        <motion.img
          src={cinematicBg}
          alt="Glowing garden"
          width={1920}
          height={1080}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover object-center origin-bottom select-none pointer-events-none opacity-50 sm:opacity-75"
          animate={{
            scale: [1.02, 1.05, 1.02],
          }}
          transition={{
            repeat: Infinity,
            duration: 10,
            ease: "easeInOut"
          }}
        />
        {/* Gradients on top/bottom to fade seamlessly into other black sections */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black z-1 pointer-events-none" />
        <ParticleVisualization />
      </div>

      {/* Full screen overlay content */}
      <div className="relative z-10 w-full max-w-[1600px] mx-auto px-6 md:px-12 lg:px-16 flex flex-col justify-center items-end text-right">
        <div className="max-w-4xl pointer-events-auto flex flex-col items-end">
          <ScrollReveal duration={1200} distance={40}>
            <h2 className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-[90px] font-display tracking-tight leading-[0.95] text-white mb-6 drop-shadow-md features-title">
              Algunas marcas
              <br />
              <span className="text-white/70 italic font-light inline-block mt-2">solo ocupan espacio.</span>
            </h2>
          </ScrollReveal>
          <ScrollReveal duration={1200} delay={150} distance={20}>
            <p className="text-base sm:text-lg md:text-xl text-white/90 leading-relaxed max-w-2xl font-light drop-shadow-sm features-desc">
              Otras ocupan un lugar en la mente de las personas. La diferencia no está en un logo. Está en la percepción que construyen.
            </p>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
