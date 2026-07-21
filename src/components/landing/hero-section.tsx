"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "motion/react";
import { ArrowRight, ImageIcon } from "lucide-react";
import { Warp } from "@paper-design/shaders-react";

const words = ["dices", "sientes", "muestras", "conectas", "transmites"];


function BlurWord({ word, trigger }: { word: string; trigger: number }) {
  const letters = word.split("");
  const STAGGER = 45;
  const DURATION = 500;
  const GRADIENT_HOLD = STAGGER * letters.length + DURATION + 200;

  const [letterStates, setLetterStates] = useState<{ opacity: number; blur: number }[]>(
    letters.map(() => ({ opacity: 0, blur: 20 }))
  );
  const framesRef = useRef<number[]>([]);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    framesRef.current.forEach(cancelAnimationFrame);
    timersRef.current.forEach(clearTimeout);
    framesRef.current = [];
    timersRef.current = [];

    setLetterStates(letters.map(() => ({ opacity: 0, blur: 20 })));

    letters.forEach((_, i) => {
      const t = setTimeout(() => {
        const start = performance.now();
        const tick = (now: number) => {
          const progress = Math.min((now - start) / DURATION, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setLetterStates(prev => {
            const next = [...prev];
            next[i] = { opacity: eased, blur: 20 * (1 - eased) };
            return next;
          });
          if (progress < 1) {
            const id = requestAnimationFrame(tick);
            framesRef.current.push(id);
          }
        };
        const id = requestAnimationFrame(tick);
        framesRef.current.push(id);
      }, i * STAGGER);
      timersRef.current.push(t);
    });

    return () => {
      framesRef.current.forEach(cancelAnimationFrame);
      timersRef.current.forEach(clearTimeout);
    };
  }, [trigger]);

  return (
    <>
      {letters.map((char, i) => {
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              opacity: letterStates[i]?.opacity ?? 0,
              filter: `blur(${letterStates[i]?.blur ?? 20}px)`,
              color: "white",
            }}
          >
            {char}
          </span>
        );
      })}
    </>
  );
}


function MagneticButton() {
  const buttonRef = useRef<HTMLAnchorElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const { clientX, clientY } = e;
    const { left, top, width, height } = buttonRef.current!.getBoundingClientRect();
    const x = (clientX - (left + width / 2)) * 0.3; 
    const y = (clientY - (top + height / 2)) * 0.3;
    setPosition({ x, y });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <a
      href="#contacto"
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group relative overflow-hidden inline-flex items-center justify-center font-sans text-xs font-bold uppercase tracking-[0.03em] bg-transparent text-white border border-white px-8 py-4 rounded-[9999px] shadow-[0_8px_32px_rgba(0,0,0,0.15)] hover:bg-white hover:text-[#130321] transition-all duration-300 hero-cta-button"
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        transition: position.x === 0 && position.y === 0 
          ? "transform 0.5s cubic-bezier(0.34,1.56,0.64,1), background-color 0.25s ease, color 0.25s ease, border-color 0.25s ease, box-shadow 0.3s ease" 
          : "transform 0.1s ease-out, background-color 0.25s ease, color 0.25s ease, border-color 0.25s ease, box-shadow 0.3s ease",
      }}
    >
      <span className="relative z-10">COMENCEMOS</span>
    </a>
  );
}

const backgrounds = [
  { type: "image", src: "/Architectural_stairs_with_texture_2K_202607151740_4.jpg", className: "opacity-100 object-cover object-top" }
];

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [wordIndex, setWordIndex] = useState(0);
  const [bgIndex, setBgIndex] = useState(0);
  const currentBg = backgrounds[bgIndex];

  const [isVideoEnded, setIsVideoEnded] = useState(false);

  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  // Slide upwards with a larger range as the page scrolls down to create deep, dramatic parallax
  // This uses the extra 38% height we added to the container (h-[138%]).
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "-27%"]);

  // Mouse magnet interactive state
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 40, stiffness: 120, mass: 1.2 };
  const xSpring = useSpring(mouseX, springConfig);
  const ySpring = useSpring(mouseY, springConfig);

  // Combine scroll parallax (percentage) and mouse magnet (pixel-offset) dynamically
  const yCombined = useTransform([yBg, ySpring], ([py, sy]) => {
    return `calc(${py} + ${sy}px)`;
  });

  const [isParallaxEnabled, setIsParallaxEnabled] = useState(true);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!heroRef.current) return;
    if (!isParallaxEnabled) {
      mouseX.set(0);
      mouseY.set(0);
      return;
    }
    const { width, height, left, top } = heroRef.current.getBoundingClientRect();
    const x = e.clientX - left - width / 2;
    const y = e.clientY - top - height / 2;

    // Soft shift of up to 12px for a very subtle, elegant physical feedback
    const maxShift = 12;
    const targetX = (x / (width / 2)) * maxShift;
    const targetY = (y / (height / 2)) * maxShift;

    mouseX.set(targetX);
    mouseY.set(targetY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    const disabled = localStorage.getItem("visceral_parallax_disabled") === "true";
    setIsParallaxEnabled(!disabled);

    const handleToggle = () => {
      const disabled = localStorage.getItem("visceral_parallax_disabled") === "true";
      setIsParallaxEnabled(!disabled);
    };

    window.addEventListener("toggle-parallax", handleToggle);
    return () => {
      window.removeEventListener("toggle-parallax", handleToggle);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % words.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section 
      ref={heroRef} 
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-screen flex flex-col justify-center items-start overflow-hidden bg-black"
    >
      {/* Background image */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.div
          key={currentBg.src}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="absolute top-0 left-[-4%] w-[108%] h-[138%]"
          style={{ y: yCombined, x: xSpring }}
        >
          {currentBg.type === "shader" ? (
            <div className="absolute inset-0 w-full h-full pointer-events-none">
              <Warp
                width="100%"
                height="100%"
                colors={["#050010", "#14002c", "#230046", "#3c007a", "#1a0033"]}
                proportion={0.45}
                softness={1}
                distortion={0.25}
                swirl={0.8}
                swirlIterations={10}
                shape="checks"
                shapeScale={0.1}
                speed={1}
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
              />
            </div>
          ) : currentBg.type === "image" ? (
            <img
              src={currentBg.src}
              alt="Background"
              aria-hidden="true"
              width={1920}
              height={1080}
              loading="eager"
              fetchPriority="high"
              className={`w-full h-full ${currentBg.className}`}
            />
          ) : (
            <video
              autoPlay
              muted
              playsInline
              loop
              key={currentBg.src}
              className={`w-full h-full object-cover object-center ${currentBg.className}`}
            >
              <source src={currentBg.src} type="video/mp4" />
            </video>
          )}
        </motion.div>
        {/* Bottom gradient to blend into the next black section */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black via-black/30 to-transparent z-[2] hero-bottom-gradient" />

        {/* Subtle grid lines */}
        <div className="absolute inset-0 z-[2] overflow-hidden pointer-events-none opacity-20 hero-grid-lines">
          {[...Array(8)].map((_, i) => (
            <div
              key={`h-${i}`}
              className="absolute h-px bg-white/10"
              style={{
                top: `${12.5 * (i + 1)}%`,
                left: 0,
                right: 0,
              }}
            />
          ))}
          {[...Array(12)].map((_, i) => (
            <div
              key={`v-${i}`}
              className="absolute w-px bg-white/10"
              style={{
                left: `${8.33 * (i + 1)}%`,
                top: 0,
                bottom: 0,
              }}
            />
          ))}
        </div>
      </div>
      
      <div className="relative z-10 w-full max-w-[1600px] mx-auto px-4 md:px-8 lg:px-12 pt-36 pb-20 sm:pt-48 sm:pb-32 lg:pt-72 lg:pb-40 hero-container">
        <motion.div 
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          variants={{
            visible: { transition: { staggerChildren: 0.15 } }
          }}
          className="w-full lg:max-w-[65%] xl:max-w-[55%]"
        >
        {/* Eyebrow removed */}
        
        {/* Main headline */}
        <div className="mb-8 md:mb-10 hero-content-wrapper">
          <motion.h1 
            variants={{
              hidden: { opacity: 0, y: 40 },
              visible: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.25, 0.1, 0.25, 1] } }
            }}
            className="text-left text-[11vw] xs:text-4xl sm:text-5xl md:text-6xl lg:text-[90px] font-display leading-[0.95] sm:leading-[0.85] tracking-tight text-white hero-title"
          >
            <span className="block whitespace-normal sm:whitespace-nowrap font-medium hero-title-span-1">No es lo que dices.</span>
            <span className="block whitespace-normal sm:whitespace-nowrap text-white mt-3 sm:mt-[13px] font-medium hero-title-span-2">
              <span className="inline-block mr-1.5 sm:mr-3">Es como lo</span><span className="relative inline-block text-white font-extrabold"><BlurWord word={words[wordIndex]} trigger={wordIndex} /></span>.
            </span>
          </motion.h1>
          <motion.p 
            variants={{
              hidden: { opacity: 0, y: 40, filter: "blur(4px)" },
              visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 1.5, ease: [0.25, 0.1, 0.25, 1] } }
            }}
            className="mt-6 sm:mt-8 text-base sm:text-lg md:text-xl text-white/80 leading-relaxed max-w-2xl font-light hero-subtitle"
          >
            <span className="inline sm:block hero-subtitle-span-1">Las marcas no se recuerdan por lo que venden. </span>
            <span className="inline sm:block mt-1 hero-subtitle-span-2">Se recuerdan por lo que hacen sentir.</span>
          </motion.p>
          
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 40 },
              visible: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.25, 0.1, 0.25, 1] } }
            }}
            className="mt-8 sm:mt-10"
          >
            <MagneticButton />
          </motion.div>
        </div>
        </motion.div>
      </div>
      
      {/* Scroll indicator */}
    </section>
  );
}