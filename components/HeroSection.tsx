"use client";

import React, { useRef, useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";

import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { useNetworkQualityContext } from "@/components/NetworkQualityProvider";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollToPlugin);
}

export function HeroSection() {
  const heroContainerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);
  const [isIdle, setIsIdle] = useState(false);
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Network-adaptive video sources
  // "high"   → full WebM + MP4 fallback
  // "medium" → medium MP4 + WebM fallback
  // "low"    → same medium files (3G can handle it; avoids jarring mid-session disappearance)
  // "lowest" → no video (true 2G — skip to save bandwidth)
  const { quality } = useNetworkQualityContext();
  const videoSources = quality === "high"
    ? { primary: "/dev_noir_brandShowCase_1.webm", fallback: "/dev_noir_brandShowCase_1.mp4", primaryType: "video/webm", fallbackType: "video/mp4" }
    : quality === "lowest"
    ? null
    : { primary: "/dev_noir_brandShowCase_1_medium.mp4", fallback: "/dev_noir_brandShowCase_1_medium.webm", primaryType: "video/mp4", fallbackType: "video/webm" };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.play().catch(() => {});
    }
  }, []);

  /* ── 5-Second Inactivity Viewport Idle Detection ── */
  useEffect(() => {
    let isIntersecting = false;

    const resetIdleTimer = () => {
      setIsIdle(false);
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
      }
      if (isIntersecting) {
        idleTimerRef.current = setTimeout(() => {
          setIsIdle(true);
        }, 5000);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isIntersecting = entry.isIntersecting;
          if (isIntersecting) {
            resetIdleTimer();
          } else {
            setIsIdle(false);
            if (idleTimerRef.current) {
              clearTimeout(idleTimerRef.current);
            }
          }
        });
      },
      { threshold: 0.4 }
    );

    if (heroContainerRef.current) {
      observer.observe(heroContainerRef.current);
    }

    const events = ["mousemove", "mousedown", "keydown", "touchstart", "scroll", "wheel"];
    events.forEach((evt) => {
      window.addEventListener(evt, resetIdleTimer, { passive: true });
    });

    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      observer.disconnect();
      events.forEach((evt) => {
        window.removeEventListener(evt, resetIdleTimer);
      });
    };
  }, []);

  /* ── Dispatch custom event for Navbar sync ── */
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("hero-idle-change", { detail: { isIdle } }));
    }
  }, [isIdle]);

  const handleMouseMove = (e: React.MouseEvent<HTMLHeadingElement>) => {
    if (!titleRef.current) return;
    const rect = titleRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseLeave = () => {
    setMousePos(null);
  };

  const text = "DEV NOIR";
  const letters = text.split("");

  return (
    <div
      ref={heroContainerRef}
      className="relative w-full h-screen overflow-hidden bg-transparent text-white flex flex-col justify-center items-center select-none"
    >
      {/* 1. Muted Background Video contained strictly inside Hero Section */}
      <div className="absolute inset-0 z-0 overflow-hidden select-none pointer-events-none">
        {/* Adaptive Video / Gradient fallback based on network quality */}
        {videoSources ? (
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            className={`w-full h-full object-cover transition-opacity duration-700 ease-in-out ${
              isIdle ? "opacity-100" : "opacity-70"
            }`}
          >
            <source src={videoSources.primary} type={videoSources.primaryType} />
            <source src={videoSources.fallback} type={videoSources.fallbackType} />
          </video>
        ) : (
          /* Lowest connection only: static gradient instead of video */
          <div
            className={`w-full h-full bg-gradient-to-br from-zinc-950 via-black to-zinc-900 transition-opacity duration-700 ease-in-out ${
              isIdle ? "opacity-100" : "opacity-70"
            }`}
          />
        )}

        {/* Black & White Glassmorphism Overlay */}
        <div
          className={`absolute inset-0 bg-black/55 backdrop-blur-[2px] transition-opacity duration-700 ease-in-out ${
            isIdle ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        />

        {/* Subtle Vignette */}
        <div
          className={`absolute inset-0 bg-radial from-transparent via-black/40 to-black pointer-events-none transition-opacity duration-700 ease-in-out ${
            isIdle ? "opacity-0" : "opacity-100"
          }`}
        />
      </div>

      {/* 2. Minimalist Black & White Hero Content */}
      <main
        className={`relative z-10 text-center px-4 max-w-6xl mx-auto flex flex-col items-center justify-center space-y-8 transition-all duration-700 ease-in-out ${
          isIdle
            ? "opacity-0 scale-95 pointer-events-none"
            : "opacity-100 scale-100 pointer-events-auto"
        }`}
      >

        {/* Interactive Kinetic Typography Title */}
        <h1
          ref={titleRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="font-orbitron font-bold text-6xl xs:text-7xl sm:text-8xl md:text-9xl lg:text-[10rem] xl:text-[11.5rem] tracking-wider uppercase leading-none select-none cursor-pointer flex items-center justify-center transition-all duration-300 py-2"
        >
          {letters.map((char, index) => {
            if (char === " ") {
              return <span key={index} className="w-4 sm:w-8 lg:w-12 inline-block">&nbsp;</span>;
            }

            let translateY = 0;
            let scale = 1;
            let glow = "none";
            let brightness = 1;

            if (mousePos && letterRefs.current[index] && titleRef.current) {
              const letterEl = letterRefs.current[index];
              if (letterEl) {
                const titleRect = titleRef.current.getBoundingClientRect();
                const letterRect = letterEl.getBoundingClientRect();
                const letterCenterX = letterRect.left + letterRect.width / 2 - titleRect.left;
                const letterCenterY = letterRect.top + letterRect.height / 2 - titleRect.top;

                const dist = Math.hypot(mousePos.x - letterCenterX, mousePos.y - letterCenterY);
                const maxDist = 220;

                if (dist < maxDist) {
                  const factor = 1 - dist / maxDist;
                  translateY = -factor * 22;
                  scale = 1 + factor * 0.18;
                  brightness = 1 + factor * 0.6;
                  glow = `0 0 ${30 * factor}px rgba(255, 255, 255, ${0.9 * factor}), 0 0 ${60 * factor}px rgba(192, 132, 252, ${0.4 * factor})`;
                }
              }
            }

            if (char === "E") {
              return (
                <span
                  key={index}
                  ref={(el) => { letterRefs.current[index] = el; }}
                  style={{
                    transform: `translateY(${translateY}px) scale(${scale})`,
                    filter: `brightness(${brightness})`,
                  }}
                  className="inline-flex flex-col justify-between w-[0.7em] h-[0.7em] mx-1 sm:mx-1.5 md:mx-2 self-center transition-transform duration-150 ease-out"
                >
                  <span className="w-full h-[15%] rounded-full bg-gradient-to-r from-white to-zinc-400" style={{ boxShadow: glow !== "none" ? glow : undefined }} />
                  <span className="w-full h-[15%] rounded-full bg-gradient-to-r from-white to-zinc-400" style={{ boxShadow: glow !== "none" ? glow : undefined }} />
                  <span className="w-full h-[15%] rounded-full bg-gradient-to-r from-white to-zinc-400" style={{ boxShadow: glow !== "none" ? glow : undefined }} />
                </span>
              );
            }

            return (
              <span
                key={index}
                ref={(el) => { letterRefs.current[index] = el; }}
                style={{
                  transform: `translateY(${translateY}px) scale(${scale})`,
                  filter: `brightness(${brightness})`,
                  textShadow: glow,
                }}
                className="inline-block transition-transform duration-150 ease-out bg-clip-text text-transparent bg-gradient-to-b from-white via-zinc-100 to-zinc-500 hover:from-white hover:to-zinc-200"
              >
                {char}
              </span>
            );
          })}
        </h1>

        <p className="text-sm sm:text-base md:text-lg text-zinc-400 max-w-xl font-light tracking-wide font-sans leading-relaxed">
          Minimalist digital architecture, motion visuals, and black &amp; white aesthetic.
        </p>

        {/* Scroll Down Indicator Button */}
        <button
          onClick={() => {
            const lenis = typeof window !== "undefined" ? (window as any).lenis : null;
            if (lenis) {
              lenis.scrollTo(window.innerHeight, { duration: 0.8 });
            } else {
              gsap.to(window, {
                scrollTo: { y: window.innerHeight, autoKill: false },
                duration: 0.5,
                ease: "power4.out",
              });
            }
          }}
          className="pt-2 flex flex-col items-center gap-1.5 text-zinc-400 hover:text-white transition-colors cursor-pointer group select-none"
        >
          <span className="text-[10px] font-mono tracking-widest uppercase opacity-70 group-hover:opacity-100">
            EXPLORE
          </span>
          <ChevronDown className="w-4 h-4 animate-bounce text-zinc-400 group-hover:text-white transition-colors" />
        </button>
      </main>
    </div>
  );
}
