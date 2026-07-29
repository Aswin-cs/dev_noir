"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Howl } from "howler";


if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const SERVICES = [
  "WEB ARCHITECTURE",
  "UI/UX & MOTION DESIGN",
  "FULL-STACK ENGINEERING",
  "AI INTEGRATION",
  "PERFORMANCE OPTIMIZATION",
  "SECURITY & CODE AUDIT",
];

// C-Major Diatonic Scale Playback Ratios for the 8 Horizontal Service Bars (C4 to C5)
const PIANO_SCALE_RATIOS = [1.0, 1.1225, 1.2599, 1.4983, 1.6818, 2.0];

let globalPianoHowl: Howl | null = null;
let activeSoundId: number | null = null;
const playedEntranceMap: Record<number, boolean> = {};

// Tone-scaled Tactile Haptic Vibration Feedback for Mobile & Touch Devices
function triggerHapticFeedback(index: number) {
  if (typeof window !== "undefined" && typeof navigator !== "undefined" && "vibrate" in navigator) {
    try {
      // Crisp 4ms - 10ms haptic pulse corresponding to tone pitch frequency
      const duration = Math.max(4, Math.floor(10 - index * 0.8));
      navigator.vibrate(duration);
    } catch {
      // Fallback for non-haptic devices
    }
  }
}

function playPianoSound(index: number, isScroll = false) {
  if (typeof window === "undefined") return;
  try {
    if (!globalPianoHowl) {
      globalPianoHowl = new Howl({
        src: ["/sounds/piano.wav"],
        volume: 0.38,
      });
    }

    if (isScroll) {
      if (playedEntranceMap[index]) return;
      playedEntranceMap[index] = true;
      setTimeout(() => {
        playedEntranceMap[index] = false;
      }, 700);
    }

    // ── Smooth 30ms Micro-Fadeout on Previous Note to Eliminate Audio Stacking & Distortion Noise ──
    if (activeSoundId !== null && globalPianoHowl.playing(activeSoundId)) {
      globalPianoHowl.fade(0.38, 0, 30, activeSoundId);
    }

    const rate = PIANO_SCALE_RATIOS[index % PIANO_SCALE_RATIOS.length] || 1.0;
    const soundId = globalPianoHowl.play();
    activeSoundId = soundId;
    globalPianoHowl.rate(rate, soundId);

    // Trigger synchronized haptic feedback
    triggerHapticFeedback(index);
  } catch {
    // Ignore audio autoplay restrictions
  }
}

// Interactive Font-Family Morphing Bar Component
function ServiceFontMorphBar({
  serviceName,
  index,
  barRef,
}: {
  serviceName: string;
  index: number;
  barRef: (el: HTMLDivElement | null) => void;
}) {
  const isEven = index % 2 === 0;

  return (
    <div
      ref={barRef}
      onMouseEnter={() => playPianoSound(index, false)}
      className="group relative w-full flex-1 bg-white text-black px-4 sm:px-8 flex items-center justify-center text-center cursor-pointer transition-all duration-300 ease-out hover:bg-zinc-950 hover:text-white shadow-lg overflow-hidden border-y border-zinc-300 hover:border-white/40 active:scale-[0.99] min-h-[48px]"
    >
      {/* Ambient Dark Gradient Liquid Layer on Hover */}
      <div
        className={`absolute inset-0 bg-gradient-to-r ${
          isEven ? "from-black via-zinc-900 to-black" : "from-zinc-900 via-black to-zinc-900"
        } opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0`}
      />

      {/* Dynamic Laser Border Highlights */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-black group-hover:via-white to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10" />
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-black group-hover:via-white to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10" />

      {/* ── Font Family Morph Container (DEV NOIR Architectural Theme) ── */}
      <div className="relative z-10 flex items-center justify-center select-none w-full py-2">
        {/* Font 1 (Default): Futuristic Orbitron Geometric Sans */}
        <h3 className="font-orbitron font-extrabold text-[clamp(13px,2.8vh,28px)] sm:text-xl md:text-2xl lg:text-3xl uppercase tracking-[0.1em] text-black transition-all duration-300 ease-out group-hover:opacity-0 group-hover:scale-95 group-hover:-translate-y-2 pointer-events-none">
          {serviceName}
        </h3>

        {/* Font 2 (Hover): Syncopate Architectural Extended Luxury Sans */}
        <h3 className="absolute font-syncopate font-bold text-[clamp(12px,2.5vh,26px)] sm:text-lg md:text-xl lg:text-2xl uppercase tracking-[0.22em] text-white transition-all duration-300 ease-out opacity-0 scale-105 translate-y-2 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0 drop-shadow-[0_0_16px_rgba(255,255,255,0.6)] pointer-events-none">
          {serviceName}
        </h3>
      </div>
    </div>
  );
}

export function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingWrapperRef = useRef<HTMLDivElement>(null);
  const headingTextRef = useRef<HTMLHeadingElement>(null);
  const headingLineRef = useRef<HTMLDivElement>(null);
  const headingSubRef = useRef<HTMLParagraphElement>(null);
  const barsContainerRef = useRef<HTMLDivElement>(null);
  const barsRef = useRef<(HTMLDivElement | null)[]>([]);
  const scrollCueRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const headingWrapper = headingWrapperRef.current;
    const headingText = headingTextRef.current;
    const headingLine = headingLineRef.current;
    const headingSub = headingSubRef.current;
    const barsContainer = barsContainerRef.current;
    const scrollCue = scrollCueRef.current;

    if (!section || !headingWrapper || !headingText || !headingLine || !headingSub || !barsContainer || !scrollCue) return;

    const ctx = gsap.context(() => {
      const totalServices = SERVICES.length;

      // ═══════════════════════════════════════════════════════
      // PHASE 1: "SERVICES" Heading Scroll-Reveal Animation
      // Pinned full-screen reveal with dramatic text animation
      // ═══════════════════════════════════════════════════════

      const headingTl = gsap.timeline({
        scrollTrigger: {
          trigger: headingWrapper,
          start: "top top",
          end: "+=150%",
          pin: true,
          pinSpacing: true,
          scrub: 0.6,
          anticipatePin: 1,
        },
      });

      // Initial state: heading hidden
      gsap.set(headingText, {
        opacity: 0,
        scale: 0.3,
        yPercent: 30,
        rotateX: 45,
        filter: "blur(20px)",
      });
      gsap.set(headingLine, { scaleX: 0, opacity: 0 });
      gsap.set(headingSub, { opacity: 0, yPercent: 40, filter: "blur(8px)" });

      // Step 1: Dramatic heading reveal — scale up, unblur, move into place
      headingTl.to(headingText, {
        opacity: 1,
        scale: 1,
        yPercent: 0,
        rotateX: 0,
        filter: "blur(0px)",
        duration: 2,
        ease: "power3.out",
      });

      // Step 2: Decorative line expands outward
      headingTl.to(
        headingLine,
        {
          scaleX: 1,
          opacity: 1,
          duration: 1,
          ease: "power2.inOut",
        },
        "-=0.8"
      );

      // Step 3: Subtitle fades in
      headingTl.to(
        headingSub,
        {
          opacity: 1,
          yPercent: 0,
          filter: "blur(0px)",
          duration: 1,
          ease: "power2.out",
        },
        "-=0.5"
      );

      // Step 4: Hold visible so the user can read
      headingTl.to({}, { duration: 1.2 });

      // Step 5: Heading fades up and out
      headingTl.to(
        [headingText, headingLine, headingSub],
        {
          opacity: 0,
          yPercent: -20,
          filter: "blur(6px)",
          duration: 1.2,
          ease: "power2.in",
          stagger: 0.1,
        }
      );

      // ═══════════════════════════════════════════════════════
      // PHASE 2: Service Bars Sequential Slide-In
      // Pinned section where bars animate in from alternating sides
      // ═══════════════════════════════════════════════════════

      const barsTl = gsap.timeline({
        scrollTrigger: {
          trigger: barsContainer,
          start: "top top",
          end: `+=${totalServices * 45}%`,
          pin: true,
          pinSpacing: true,
          scrub: 0.8,
          anticipatePin: 1,
        },
      });

      // Sequential slide-in of all 8 white bars from alternating sides
      barsRef.current.forEach((bar, index) => {
        if (!bar) return;
        const isFromLeft = index % 2 === 0;
        const startXPercent = isFromLeft ? -110 : 110;

        barsTl.fromTo(
          bar,
          {
            xPercent: startXPercent,
            opacity: 0,
            scaleY: 0.7,
          },
          {
            xPercent: 0,
            opacity: 1,
            scaleY: 1,
            ease: "power3.out",
            duration: 1,
            onStart: () => playPianoSound(index, true),
          },
          index * 0.5
        );
      });

      // Hold: let the user see all bars + interact
      barsTl.to({}, { duration: 1.5 });

      // Scroll cue fades in after all bars
      barsTl.fromTo(
        scrollCue,
        { opacity: 0, yPercent: 20 },
        { opacity: 1, yPercent: 0, duration: 0.5, ease: "power2.out" },
        "-=1"
      );

      // Seamless exit
      barsTl.to(barsContainer, {
        opacity: 0.1,
        yPercent: -4,
        scale: 0.98,
        ease: "power1.inOut",
        duration: 0.8,
      });

    }, section);

    ScrollTrigger.refresh();

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="services"
      className="relative z-10 w-full bg-black text-white"
    >
      {/* ═══════════════════════════════════════════════════════
          PHASE 1: Full-Screen Heading Reveal
          ═══════════════════════════════════════════════════════ */}
      <div
        ref={headingWrapperRef}
        className="w-full h-screen flex flex-col items-center justify-center bg-black relative overflow-hidden"
        style={{ perspective: "1200px" }}
      >
        {/* Atmospheric ambient glow behind heading */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div
            className="w-[600px] h-[600px] rounded-full opacity-[0.06]"
            style={{
              background: "radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%)",
            }}
          />
        </div>

        {/* Main heading */}
        <h2
          ref={headingTextRef}
          className="font-orbitron font-black text-5xl sm:text-7xl md:text-8xl lg:text-9xl uppercase tracking-[0.3em] text-white drop-shadow-[0_0_60px_rgba(255,255,255,0.15)] leading-none text-center select-none will-change-transform"
          style={{ transformStyle: "preserve-3d" }}
        >
          SERVICES
        </h2>

        {/* Decorative expanding line */}
        <div
          ref={headingLineRef}
          className="mt-6 sm:mt-8 w-[200px] sm:w-[300px] md:w-[400px] h-[1px] bg-gradient-to-r from-transparent via-white to-transparent origin-center will-change-transform"
        />

        {/* Subtitle */}
        <p
          ref={headingSubRef}
          className="mt-4 sm:mt-6 font-syncopate text-[10px] sm:text-xs md:text-sm uppercase tracking-[0.4em] text-zinc-400 text-center select-none will-change-transform"
        >
          WHAT WE BUILD
        </p>
      </div>

      {/* ═══════════════════════════════════════════════════════
          PHASE 2: Service Bars — Pinned Full-Screen
          ═══════════════════════════════════════════════════════ */}
      <div
        ref={barsContainerRef}
        className="w-full h-screen overflow-hidden flex flex-col items-center justify-center pt-16 pb-6 sm:pt-20 sm:pb-8 bg-black relative select-none"
      >
        {/* Full Viewport Width Stacked Horizontal Bars with Font Morphing */}
        <div className="relative z-10 w-full flex-1 flex flex-col gap-1 overflow-hidden px-0">
          {SERVICES.map((serviceName, index) => (
            <ServiceFontMorphBar
              key={serviceName}
              serviceName={serviceName}
              index={index}
              barRef={(el: HTMLDivElement | null) => {
                barsRef.current[index] = el;
              }}
            />
          ))}
        </div>

        {/* Bottom Scroll Cue */}
        <div ref={scrollCueRef} className="relative z-10 text-center shrink-0 mt-4 opacity-0">
          <span className="text-[9px] font-mono uppercase tracking-[0.3em] text-zinc-400">
            HOVER TO MORPH FONT FAMILY • SCROLL FOR PROJECTS ↓
          </span>
        </div>
      </div>
    </section>
  );
}
