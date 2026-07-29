"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);

  // Prevent mobile browser address bar collapse/expansion from triggering layout jumps during scroll
  ScrollTrigger.config({
    ignoreMobileResize: true,
  });

  // Force all touchstart and touchmove event listeners to passive by default so browser does not block scrolling
  const originalAddEventListener = EventTarget.prototype.addEventListener;
  EventTarget.prototype.addEventListener = function (type, listener, options) {
    if (type === "touchstart" || type === "touchmove") {
      if (typeof options === "boolean") {
        options = { capture: options, passive: true };
      } else if (typeof options === "object" && options !== null) {
        if (options.passive === undefined) {
          options = { ...options, passive: true };
        }
      } else {
        options = { passive: true };
      }
    }
    return originalAddEventListener.call(this, type, listener, options);
  };
}

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const isTouchDevice =
      typeof window !== "undefined" &&
      ("ontouchstart" in window || navigator.maxTouchPoints > 0 || window.matchMedia("(max-width: 768px)").matches);

    const lenis = new Lenis({
      duration: 1.0,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Silky smooth exponential damping curve
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      syncTouch: false, // Keeps smooth scrolling for desktop, but lets mobile touch scroll natively
      touchMultiplier: 1.5,
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
    // Smooth out frame drops on mobile 60Hz and 120Hz ProMotion displays without violent position jumps
    gsap.ticker.lagSmoothing(500, 33);

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
