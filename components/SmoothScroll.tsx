"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const isTouchDevice =
      typeof window !== "undefined" &&
      ("ontouchstart" in window || navigator.maxTouchPoints > 0 || window.matchMedia("(max-width: 768px)").matches);

    const lenis = new Lenis({
      duration: isTouchDevice ? 1.25 : 1.0,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Silky smooth exponential damping curve
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      syncTouch: true, // Enables touch inertia scrolling on mobile/touch screens
      syncTouchLerp: 0.08, // Smooth lerp interpolation for mobile touch swipes
      touchMultiplier: isTouchDevice ? 2.2 : 1.5,
      wheelMultiplier: 1.0,
      autoResize: true,
    });

    lenisRef.current = lenis;
    if (typeof window !== "undefined") {
      (window as any).lenis = lenis;
    }

    // Connect Lenis scroll updates to GSAP ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    // Synchronize Lenis animation frames with GSAP Ticker
    const updateGSAP = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateGSAP);
    // Eliminate frame-skip jitter on mobile 60Hz and 120Hz ProMotion displays
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(updateGSAP);
      if (typeof window !== "undefined") {
        (window as any).lenis = null;
      }
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
