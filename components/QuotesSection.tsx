"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const AUTHOR = "Steve Jobs";

const PARTICLES = [
  { top: 15, left: 8, dur: 5.2, delay: 0.3, size: 2 },
  { top: 28, left: 92, dur: 7.1, delay: 1.8, size: 3 },
  { top: 42, left: 23, dur: 6.4, delay: 3.2, size: 2 },
  { top: 55, left: 67, dur: 8.3, delay: 0.7, size: 1 },
  { top: 70, left: 45, dur: 4.8, delay: 2.5, size: 2 },
  { top: 82, left: 78, dur: 9.1, delay: 4.1, size: 3 },
  { top: 18, left: 55, dur: 6.7, delay: 1.2, size: 1 },
  { top: 35, left: 12, dur: 5.5, delay: 3.8, size: 2 },
  { top: 63, left: 88, dur: 7.8, delay: 0.5, size: 1 },
  { top: 48, left: 35, dur: 8.6, delay: 2.9, size: 3 },
  { top: 75, left: 18, dur: 4.3, delay: 4.5, size: 2 },
  { top: 22, left: 72, dur: 9.4, delay: 1.6, size: 1 },
  { top: 58, left: 50, dur: 6.1, delay: 3.4, size: 2 },
  { top: 88, left: 30, dur: 7.5, delay: 0.9, size: 3 },
  { top: 32, left: 82, dur: 5.8, delay: 2.1, size: 1 },
  { top: 45, left: 60, dur: 8.9, delay: 4.8, size: 2 },
  { top: 68, left: 15, dur: 6.3, delay: 1.4, size: 2 },
  { top: 12, left: 40, dur: 7.2, delay: 3.6, size: 1 },
  { top: 80, left: 55, dur: 5.0, delay: 0.2, size: 3 },
  { top: 38, left: 95, dur: 8.1, delay: 2.7, size: 2 },
];
function AnimatedBg() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Fine grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Pulsing orbs */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 55%)",
          animation: "qPulse 6s ease-in-out infinite",
        }}
      />
      <div
        className="absolute top-[25%] left-[15%] w-[450px] h-[450px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 60%)",
          animation: "qPulse 9s ease-in-out infinite 3s",
        }}
      />
      <div
        className="absolute bottom-[15%] right-[10%] w-[550px] h-[550px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 55%)",
          animation: "qPulse 7s ease-in-out infinite 1.5s",
        }}
      />

      {/* Floating particles */}
      {PARTICLES.map((p, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white/15"
          style={{
            top: `${p.top}%`,
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            animation: `pFloat ${p.dur}s ease-in-out infinite ${p.delay}s`,
          }}
        />
      ))}

      {/* Diagonal aurora light */}
      <div
        className="absolute top-0 left-0 w-[200%] h-[200%] opacity-[0.015]"
        style={{
          background: "linear-gradient(135deg, transparent 30%, rgba(255,255,255,0.6) 48%, rgba(255,255,255,0.3) 52%, transparent 70%)",
          animation: "auroraSlide 15s linear infinite",
        }}
      />

      {/* Noise */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.7) 100%)",
        }}
      />
    </div>
  );
}

export function QuotesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const wordsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const authorRef = useRef<HTMLDivElement>(null);
  const quoteMarkRef = useRef<HTMLSpanElement>(null);
  const quoteMarkEndRef = useRef<HTMLSpanElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const horizLineRef = useRef<HTMLDivElement>(null);
  const vertLineLeftRef = useRef<HTMLDivElement>(null);
  const vertLineRightRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const laserUnderlineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const container = containerRef.current;
    const author = authorRef.current;
    const quoteMark = quoteMarkRef.current;
    const quoteMarkEnd = quoteMarkEndRef.current;
    const label = labelRef.current;
    const glow = glowRef.current;
    const horizLine = horizLineRef.current;
    const vertLineLeft = vertLineLeftRef.current;
    const vertLineRight = vertLineRightRef.current;
    const counter = counterRef.current;
    const laserUnderline = laserUnderlineRef.current;

    if (!section || !container || !author || !quoteMark || !quoteMarkEnd || !label || !glow || !horizLine || !vertLineLeft || !vertLineRight || !counter || !laserUnderline) return;

    const allWords = wordsRef.current.filter(Boolean) as HTMLSpanElement[];

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: "+=260%",
          pin: true,
          pinSpacing: true,
          scrub: 0.6,
          anticipatePin: 1,
        },
      });

      // ── Initial States ──
      gsap.set(allWords, {
        opacity: 0.12,
        y: 45,
        rotateX: -45,
        scale: 0.88,
        filter: "blur(12px)",
        color: "#52525b", // zinc-600 dark dim
      });
      gsap.set(author, { opacity: 0, y: 30, filter: "blur(6px)" });
      gsap.set(quoteMark, { opacity: 0, scale: 2.5, x: -60, filter: "blur(15px)" });
      gsap.set(quoteMarkEnd, { opacity: 0, scale: 2.5, x: 60, filter: "blur(15px)" });
      gsap.set(label, { opacity: 0, x: -20 });
      gsap.set(glow, { opacity: 0, scale: 0.3 });
      gsap.set(horizLine, { scaleX: 0 });
      gsap.set(vertLineLeft, { scaleY: 0 });
      gsap.set(vertLineRight, { scaleY: 0 });
      gsap.set(counter, { opacity: 0, y: 10 });
      gsap.set(laserUnderline, { scaleX: 0 });

      // ═══════════════════════════════════════════════════════
      // ACT 1: Architectural Frame & Corner Labels Draw
      // ═══════════════════════════════════════════════════════
      tl.to(vertLineLeft, { scaleY: 1, duration: 0.6, ease: "power3.inOut" }, 0);
      tl.to(vertLineRight, { scaleY: 1, duration: 0.6, ease: "power3.inOut" }, 0.1);
      tl.to(label, { opacity: 1, x: 0, duration: 0.4, ease: "power2.out" }, 0.2);
      tl.to(counter, { opacity: 0.5, y: 0, duration: 0.3, ease: "power2.out" }, 0.3);
      tl.to(glow, { opacity: 0.8, scale: 1, duration: 0.8, ease: "power2.out" }, 0.1);

      // ═══════════════════════════════════════════════════════
      // ACT 2: Opening Quotation Mark Zoom-Settle
      // ═══════════════════════════════════════════════════════
      tl.to(quoteMark, {
        opacity: 0.12,
        scale: 1,
        x: 0,
        filter: "blur(0px)",
        duration: 0.6,
        ease: "power3.out",
      }, 0.4);

      // ═══════════════════════════════════════════════════════
      // ACT 3: Apple-Style Word-by-Word Kinetic Luminance Scrub
      // ═══════════════════════════════════════════════════════
      const wordStagger = 0.08;
      const wordRevealStart = 0.7;

      allWords.forEach((wordEl, i) => {
        const isEmphasis = wordEl.dataset.emphasis === "true";

        tl.to(wordEl, {
          opacity: 1,
          y: 0,
          rotateX: 0,
          scale: 1,
          filter: "blur(0px)",
          color: "#ffffff",
          textShadow: isEmphasis ? "0 0 25px rgba(255,255,255,0.7), 0 0 50px rgba(255,255,255,0.3)" : "none",
          duration: 0.2,
          ease: "power3.out",
        }, wordRevealStart + i * wordStagger);
      });

      // ═══════════════════════════════════════════════════════
      // ACT 4: Laser Underline Sweep for Emphasis Line
      // ═══════════════════════════════════════════════════════
      const emphasisStart = wordRevealStart + (allWords.length - 5) * wordStagger;

      tl.to(laserUnderline, {
        scaleX: 1,
        duration: 0.6,
        ease: "power3.out",
      }, emphasisStart + 0.2);

      tl.to(glow, {
        scale: 1.4,
        opacity: 1,
        duration: 0.8,
        ease: "power2.inOut",
      }, emphasisStart);

      // ═══════════════════════════════════════════════════════
      // ACT 5: Closing Quotation Mark & Author Attribution
      // ═══════════════════════════════════════════════════════
      const afterWords = wordRevealStart + allWords.length * wordStagger + 0.3;

      tl.to(quoteMarkEnd, {
        opacity: 0.12,
        scale: 1,
        x: 0,
        filter: "blur(0px)",
        duration: 0.5,
        ease: "power3.out",
      }, afterWords);

      tl.to(horizLine, {
        scaleX: 1,
        duration: 0.6,
        ease: "power3.inOut",
      }, afterWords + 0.2);

      tl.to(author, {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.5,
        ease: "power2.out",
      }, afterWords + 0.4);

      // ═══════════════════════════════════════════════════════
      // ACT 6: Hold Reading & Smooth Zoom-Out Exit
      // ═══════════════════════════════════════════════════════
      tl.to({}, { duration: 1.5 });

      tl.to(container, {
        opacity: 0,
        scale: 0.93,
        duration: 1.0,
        ease: "power2.in",
      });

    }, section);

    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, []);

  // Split quote into structured lines & words
  const LINES = [
    {
      words: ["Design", "is", "not", "just", "what", "it"],
      emphasis: false,
    },
    {
      words: ["looks", "like", "and", "feels", "like."],
      emphasis: false,
    },
    {
      words: ["DESIGN", "IS", "HOW", "IT", "WORKS."],
      emphasis: true,
    },
  ];

  let wordGlobalIndex = 0;

  return (
    <>
      <style jsx global>{`
        @keyframes qPulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.03; }
          50% { transform: translate(-50%, -50%) scale(1.15); opacity: 0.07; }
        }
        @keyframes pFloat {
          0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0.1; }
          25% { transform: translateY(-25px) translateX(12px); opacity: 0.35; }
          50% { transform: translateY(-10px) translateX(-10px); opacity: 0.15; }
          75% { transform: translateY(18px) translateX(6px); opacity: 0.3; }
        }
        @keyframes auroraSlide {
          0% { transform: translateX(-50%) translateY(-50%); }
          100% { transform: translateX(50%) translateY(50%); }
        }
      `}</style>

      <section
        ref={sectionRef}
        className="relative z-10 w-full bg-black text-white"
      >
        <div
          ref={containerRef}
          className="w-full h-screen flex flex-col items-center justify-center bg-black relative overflow-hidden select-none"
          style={{ perspective: "1200px" }}
        >
          {/* ── Animated Background ── */}
          <AnimatedBg />

          {/* Reactive center glow */}
          <div
            ref={glowRef}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] rounded-full pointer-events-none opacity-0 will-change-transform"
            style={{
              background: "radial-gradient(ellipse, rgba(255,255,255,0.08) 0%, transparent 65%)",
              filter: "blur(50px)",
            }}
          />

          {/* ── Architectural frame lines ── */}
          <div
            ref={vertLineLeftRef}
            className="absolute left-[6%] sm:left-[8%] top-[15%] bottom-[15%] w-[1px] bg-gradient-to-b from-transparent via-zinc-700 to-transparent origin-center pointer-events-none"
          />
          <div
            ref={vertLineRightRef}
            className="absolute right-[6%] sm:right-[8%] top-[15%] bottom-[15%] w-[1px] bg-gradient-to-b from-transparent via-zinc-700 to-transparent origin-center pointer-events-none"
          />

          {/* ── Corner label ── */}
          <span
            ref={labelRef}
            className="absolute top-7 left-7 sm:top-10 sm:left-10 font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.5em] text-zinc-500 opacity-0 will-change-transform"
          >
            PHILOSOPHY
          </span>

          {/* ── Counter ── */}
          <span
            ref={counterRef}
            className="absolute top-7 right-7 sm:top-10 sm:right-10 font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.3em] text-zinc-600 opacity-0 will-change-transform"
          >
            01
          </span>

          {/* ── Opening quotation mark ── */}
          <span
            ref={quoteMarkRef}
            className="absolute top-[12%] left-[8%] sm:left-[12%] font-cinzel text-[140px] sm:text-[200px] md:text-[260px] text-white leading-none select-none pointer-events-none opacity-0 will-change-transform"
            aria-hidden="true"
          >
            &ldquo;
          </span>

          {/* ── Closing quotation mark ── */}
          <span
            ref={quoteMarkEndRef}
            className="absolute bottom-[8%] right-[8%] sm:right-[12%] font-cinzel text-[140px] sm:text-[200px] md:text-[260px] text-white leading-none select-none pointer-events-none opacity-0 will-change-transform"
            aria-hidden="true"
          >
            &rdquo;
          </span>

          {/* ── Quote Text — Word-by-Word Kinetic Luminance Scrub Reveal ── */}
          <div
            className="relative z-10 max-w-5xl mx-auto px-8 sm:px-14 md:px-20 text-center sm:text-left"
            style={{ transformStyle: "preserve-3d" }}
          >
            {LINES.map((lineObj, lineIdx) => (
              <div key={lineIdx} className="relative overflow-visible py-1 sm:py-1.5 flex flex-wrap justify-center sm:justify-start gap-x-3 sm:gap-x-4">
                {lineObj.words.map((wordStr, wordInLineIdx) => {
                  const idx = wordGlobalIndex++;
                  return (
                    <span
                      key={wordInLineIdx}
                      ref={(el) => { wordsRef.current[idx] = el; }}
                      data-emphasis={lineObj.emphasis ? "true" : "false"}
                      className={`inline-block font-cinzel ${
                        lineObj.emphasis
                          ? "font-bold text-white tracking-wider text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[4.5rem]"
                          : "font-normal text-zinc-400 text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-[4.2rem]"
                      } leading-[1.25] transition-shadow duration-300 will-change-transform`}
                      style={{
                        transformOrigin: "center bottom",
                        transformStyle: "preserve-3d",
                      }}
                    >
                      {wordStr}
                    </span>
                  );
                })}

                {/* Glowing Laser Underline on Emphasis Line */}
                {lineObj.emphasis && (
                  <div
                    ref={laserUnderlineRef}
                    className="w-full h-[2px] mt-2 bg-gradient-to-r from-transparent via-white to-transparent origin-left scale-x-0 will-change-transform shadow-[0_0_15px_rgba(255,255,255,0.8)]"
                  />
                )}
              </div>
            ))}
          </div>

          {/* ── Horizontal divider line ── */}
          <div
            ref={horizLineRef}
            className="relative z-10 mt-8 sm:mt-12 w-[120px] sm:w-[180px] md:w-[240px] h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent origin-center will-change-transform"
          />

          {/* ── Author attribution ── */}
          <div
            ref={authorRef}
            className="relative z-10 mt-5 sm:mt-7 flex items-center gap-3 sm:gap-4 opacity-0 will-change-transform"
          >
            <span className="w-2 h-2 rounded-full bg-white/40 shadow-[0_0_10px_rgba(255,255,255,0.8)] animate-pulse" />
            <span className="font-syncopate font-bold text-[10px] sm:text-xs uppercase tracking-[0.4em] text-zinc-300">
              {AUTHOR}
            </span>
            <span className="w-2 h-2 rounded-full bg-white/40 shadow-[0_0_10px_rgba(255,255,255,0.8)] animate-pulse" />
          </div>
        </div>
      </section>
    </>
  );
}
