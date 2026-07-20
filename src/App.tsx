import { useEffect } from "react";
import Lenis from "lenis";
import { HeroSection } from "./components/landing/hero-section";
import { Navigation } from "./components/landing/navigation";
import { FeaturesSection } from "./components/landing/features-section";
import { IntegrationsSection } from "./components/landing/integrations-section";
import { DevelopersSection } from "./components/landing/developers-section";
import { MarqueeSection } from "./components/landing/marquee-section";
import { CtaSection } from "./components/landing/cta-section";
import { FooterSection } from "./components/landing/footer-section";

export default function App() {
  useEffect(() => {
    let lenis: Lenis | null = null;
    let rafId: number;

    function initLenis() {
      const isDisabled = localStorage.getItem("visceral_lenis_disabled") === "true";
      
      if (isDisabled) {
        if (lenis) {
          lenis.destroy();
          lenis = null;
        }
        return;
      }

      if (!lenis) {
        lenis = new Lenis({
          duration: 1.4, // Slower, more elegant gliding transition
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponential deceleration
          orientation: "vertical",
          gestureOrientation: "vertical",
          smoothWheel: true,
          wheelMultiplier: 1.0,
          touchMultiplier: 1.5,
        });
      }
    }

    function raf(time: number) {
      if (lenis) {
        lenis.raf(time);
      }
      rafId = requestAnimationFrame(raf);
    }

    initLenis();
    rafId = requestAnimationFrame(raf);

    const handleToggle = () => {
      initLenis();
    };

    window.addEventListener("toggle-lenis", handleToggle);

    return () => {
      cancelAnimationFrame(rafId);
      if (lenis) {
        lenis.destroy();
      }
      window.removeEventListener("toggle-lenis", handleToggle);
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden selection:bg-white selection:text-black">
      <Navigation />
      <HeroSection />
      <MarqueeSection />
      <FeaturesSection />
      <IntegrationsSection />
      <DevelopersSection />
      <CtaSection />
      <FooterSection />
    </div>
  );
}
