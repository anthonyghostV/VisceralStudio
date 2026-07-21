"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { motion } from "motion/react";

const navLinks = [
  { name: "Servicios", href: "#servicios" },
  { name: "Proyectos", href: "#proyectos" },
  { name: "Contacto",  href: "#contacto" },
];

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const lastScrollYRef = useRef(0);
  const scrollUpAccumulatorRef = useRef(0);
  const scrollDownAccumulatorRef = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const lastScrollY = lastScrollYRef.current;
      const delta = currentScrollY - lastScrollY;
      
      setIsScrolled(currentScrollY > 20);

      const secondSectionThreshold = window.innerHeight * 0.7; // "almost reaching" the second section (marquee-section)

      if (currentScrollY > secondSectionThreshold) {
        if (delta > 0) {
          // Scrolling down
          scrollUpAccumulatorRef.current = 0; // reset scroll up
          scrollDownAccumulatorRef.current += delta;
          if (scrollDownAccumulatorRef.current > 30) {
            setIsVisible(false);
          }
        } else if (delta < 0) {
          // Scrolling up
          scrollDownAccumulatorRef.current = 0; // reset scroll down
          scrollUpAccumulatorRef.current += Math.abs(delta);
          // Require at least 140px of accumulated upward scroll to make it show (preventing single wheel clicks)
          if (scrollUpAccumulatorRef.current > 140) {
            setIsVisible(true);
          }
        }
      } else {
        // Keep it visible while at the top or within the main Hero Section area
        setIsVisible(true);
        scrollUpAccumulatorRef.current = 0;
        scrollDownAccumulatorRef.current = 0;
      }

      lastScrollYRef.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const showNavbar = isVisible || isMobileMenuOpen;

  return (
    <header
      className={`fixed z-50 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isScrolled 
          ? "top-4 left-4 right-4" 
          : "top-0 left-0 right-0"
      } ${
        showNavbar 
          ? "translate-y-0 opacity-100" 
          : "-translate-y-28 opacity-0 pointer-events-none"
      }`}
    >
      <nav 
        className={`mx-auto transition-all duration-500 ${
          isScrolled || isMobileMenuOpen
            ? "bg-black/30 backdrop-blur-xl border border-white/10 rounded-full shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] max-w-[1100px]"
            : "bg-transparent max-w-[1600px]"
        }`}
      >
        <div 
          className={`flex items-center justify-between transition-all duration-500 px-6 md:px-8 lg:px-10 ${
            isScrolled ? "h-12 md:h-14" : "h-14 md:h-20"
          }`}
        >
          {/* Logo */}
          <a href="#" className="flex items-center gap-3 group">
              <motion.div
                initial={{ x: -40, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
              >
                <img src="/logo_blanco.svg" alt="Visceral Logo" width={64} height={56} fetchPriority="high" className="w-12 md:w-16 h-auto max-h-[40px] md:max-h-[56px] object-contain" />
              </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
            >
              <span className={`font-display tracking-tight not-italic transition-all duration-500 hidden md:block navbar-wordmark ${isScrolled ? "text-lg text-white" : "text-xl text-white"}`} style={{ fontWeight: "normal" }}>Visceral Studio</span>
            </motion.div>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-10 desktop-nav">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm transition-colors duration-300 relative group text-white/70 hover:text-white"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-px transition-all duration-300 group-hover:w-full bg-white" />
              </a>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4 desktop-cta">
            <Button
              size="sm"
              className={`rounded-full transition-all duration-500 font-medium ${
                isScrolled 
                  ? "bg-white hover:bg-neutral-200 text-black px-5 h-9 text-xs" 
                  : "bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm px-6"
              }`}
            >
              <span>Charlemos</span>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 transition-colors duration-500 text-white mobile-nav-toggle"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </nav>
      
      {/* Mobile Menu - Compact Glass Dropdown Curtain */}
      <motion.div
        initial={false}
        animate={isMobileMenuOpen ? { opacity: 1, y: 0, scale: 1, display: "flex" } : { opacity: 0, y: -8, scale: 0.98, transitionEnd: { display: "none" } }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="md:hidden absolute left-4 right-4 top-full mt-2 bg-black/45 backdrop-blur-2xl border border-white/10 rounded-2xl p-5 landscape:p-3 landscape:px-6 shadow-[0_16px_36px_rgba(0,0,0,0.5),inset_0_1px_0_0_rgba(255,255,255,0.15)] flex-col landscape:flex-row gap-4 landscape:gap-6 landscape:items-center z-40 origin-top"
      >
        {/* Navigation Links with staggered entry */}
        <div className="flex flex-col landscape:flex-row gap-2 landscape:gap-4 landscape:flex-1">
          {navLinks.map((link, i) => (
            <motion.a
              key={link.name}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              initial={false}
              animate={isMobileMenuOpen ? { opacity: 1, x: 0 } : { opacity: 0, x: -6 }}
              transition={{ delay: isMobileMenuOpen ? i * 0.04 : 0, duration: 0.3, ease: "easeOut" }}
              className="text-base landscape:text-sm text-white/70 hover:text-white transition-all duration-300 py-2 px-3 rounded-xl hover:bg-white/5 flex items-center justify-between landscape:justify-center group"
            >
              <span>{link.name}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-white/40 opacity-0 group-hover:opacity-100 scale-0 group-hover:scale-100 transition-all duration-300 landscape:hidden" />
            </motion.a>
          ))}
        </div>

        {/* Divider */}
        <div className="h-px bg-white/10 w-full landscape:w-px landscape:h-6 landscape:bg-white/10" />

        {/* CTA Button */}
        <motion.div
          initial={false}
          animate={isMobileMenuOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: 4 }}
          transition={{ delay: isMobileMenuOpen ? 0.12 : 0, duration: 0.3 }}
          className="landscape:w-auto w-full"
        >
          <Button 
            className="w-full landscape:w-auto bg-white hover:bg-neutral-200 text-black rounded-full h-11 landscape:h-9 landscape:px-6 text-xs font-medium shadow-sm transition-all duration-300"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <span>Charlemos</span>
          </Button>
        </motion.div>
      </motion.div>
    </header>
  );
}
