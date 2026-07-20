"use client";

import { useEffect, useState } from "react";
import {
  motion,
  useTransform,
  useMotionValue,
  useAnimationFrame,
} from "motion/react";

interface TextMarqueeProps {
  children: React.ReactNode;
  baseVelocity?: number;
  delay?: number;
  clasname?: string;
}

const wrap = (min: number, max: number, v: number) => {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};

export default function TextMarquee({ children, baseVelocity = -1, delay = 0, clasname = "" }: TextMarqueeProps) {
  const baseX = useMotionValue(0);
  const [isReady, setIsReady] = useState(delay === 0);

  useEffect(() => {
    if (delay > 0) {
      const timeout = setTimeout(() => setIsReady(true), delay);
      return () => clearTimeout(timeout);
    }
  }, [delay]);

  const x = useTransform(baseX, (v) => `${wrap(-20, -45, v)}%`);

  useAnimationFrame((t, delta) => {
    if (!isReady) return;
    
    // Velocidad constante suave, sin interactuar con el scroll
    let moveBy = baseVelocity * (delta / 1000) * 0.3;
    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div className="overflow-hidden m-0 py-8 whitespace-nowrap flex flex-nowrap w-full">
      <motion.div 
        className="flex flex-nowrap items-center whitespace-nowrap" 
        style={{ x, opacity: isReady ? 1 : 0 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: isReady ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      >
        <span className={`block mr-8 ${clasname}`}>{children}</span>
        <span className={`block mr-8 ${clasname}`}>{children}</span>
        <span className={`block mr-8 ${clasname}`}>{children}</span>
        <span className={`block mr-8 ${clasname}`}>{children}</span>
        <span className={`block mr-8 ${clasname}`}>{children}</span>
        <span className={`block mr-8 ${clasname}`}>{children}</span>
        <span className={`block mr-8 ${clasname}`}>{children}</span>
        <span className={`block mr-8 ${clasname}`}>{children}</span>
      </motion.div>
    </div>
  );
}
