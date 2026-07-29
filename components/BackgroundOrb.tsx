"use client";

import React, { useEffect, useState, useRef } from "react";

export function BackgroundOrb() {
  const [isActive, setIsActive] = useState(false);
  const orbRef = useRef<HTMLDivElement>(null);
  const targetProgressRef = useRef(0);
  const currentProgressRef = useRef(0);

  /* ── 1. Scroll Listener & On-Demand 60FPS Lerp Loop ── */
  useEffect(() => {
    let ticking = false;
    let animationFrameId: number;

    const updateOrbTransforms = () => {
      const target = targetProgressRef.current;
      const current = currentProgressRef.current;
      const diff = target - current;

      if (Math.abs(diff) > 0.0001) {
        currentProgressRef.current += diff * 0.15;
      } else {
        currentProgressRef.current = target;
      }

      const progress = currentProgressRef.current;

      if (orbRef.current) {
        // Controlled scale (0.8 -> 1.15) for ambient depth without blinding glare
        const scale = 0.8 + progress * 0.35;
        // Subtle opacity (0.25 -> 0.5)
        const opacity = 0.25 + progress * 0.25;

        orbRef.current.style.transform = `translate3d(-50%, -50%, 0) scale(${scale})`;
        orbRef.current.style.opacity = `${opacity}`;
      }

      if (Math.abs(target - currentProgressRef.current) > 0.0001) {
        animationFrameId = requestAnimationFrame(updateOrbTransforms);
      } else {
        ticking = false;
      }
    };

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const heroHeight = window.innerHeight;

      // Hidden in Hero section; active from Services section onwards
      if (scrollY >= heroHeight * 0.4) {
        setIsActive(true);

        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollableDistance = Math.max(1, docHeight - heroHeight * 0.4);
        const progress = Math.max(0, Math.min(1, (scrollY - heroHeight * 0.4) / scrollableDistance));
        targetProgressRef.current = progress;
      } else {
        setIsActive(false);
        targetProgressRef.current = 0;
      }

      if (!ticking) {
        ticking = true;
        animationFrameId = requestAnimationFrame(updateOrbTransforms);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div
      className={`fixed inset-0 pointer-events-none z-0 transition-opacity duration-700 overflow-hidden ${
        isActive ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* ── Fixed Viewport Center Ambient Glowing Orb ────── */}
      <div
        ref={orbRef}
        className="absolute top-1/2 left-1/2 w-[400px] h-[400px] sm:w-[500px] sm:h-[500px] rounded-full pointer-events-none will-change-transform"
        style={{
          transform: "translate3d(-50%, -50%, 0) scale(0.8)",
          opacity: 0.25,
        }}
      >
        {/* Outer Radiant Ambient Color Aura */}
        <div
          className="absolute inset-0 rounded-full ambient-orb pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(160,180,240,0.18) 0%, rgba(100,120,200,0.08) 50%, transparent 75%)",
            filter: "blur(90px)",
          }}
        />

        {/* Core Subtle Glass Ring with Soft Cyan-White Glow */}
        <div
          className="relative w-full h-full rounded-full backdrop-blur-sm overflow-hidden glass-overlay pointer-events-none"
          style={{
            border: "1.5px solid rgba(255, 255, 255, 0.25)",
            boxShadow: `
              0 0 60px rgba(255, 255, 255, 0.15),
              inset 0 0 40px rgba(255, 255, 255, 0.1),
              0 0 120px rgba(140, 180, 255, 0.15)
            `,
            background: "radial-gradient(circle at 35% 35%, rgba(255, 255, 255, 0.12) 0%, rgba(20, 20, 35, 0.4) 60%, rgba(5, 5, 10, 0.6) 100%)",
          }}
        >
          {/* Specular Light Reflection Arc */}
          <div className="absolute top-4 left-8 right-8 h-1/3 rounded-t-full bg-gradient-to-b from-white/30 to-transparent pointer-events-none" />

          {/* Internal Kinetic Core Pulse */}
          <div
            className="absolute inset-0 opacity-40 animate-pulse pointer-events-none"
            style={{
              background: "radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.3) 0%, transparent 65%)",
              animationDuration: "4s",
            }}
          />
        </div>
      </div>
    </div>
  );
}
