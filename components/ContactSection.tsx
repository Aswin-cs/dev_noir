"use client";

import React, { useEffect, useState, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FileText, X, ShieldCheck, ArrowUpRight } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* ── KINETIC PROMPT STUDIO (Minimalist Contact Box with Stagger Refs) ── */
export function KineticPromptStudio({
  logoBadgeRef,
  titleRef,
  subtitleRef,
  glassBoxRef,
}: {
  logoBadgeRef?: React.RefObject<HTMLDivElement | null>;
  titleRef?: React.RefObject<HTMLHeadingElement | null>;
  subtitleRef?: React.RefObject<HTMLParagraphElement | null>;
  glassBoxRef?: React.RefObject<HTMLDivElement | null>;
}) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // Modal states for smooth open & exit animations
  const [isModalMounted, setIsModalMounted] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const openTimerRef = useRef<NodeJS.Timeout | null>(null);
  const closeTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleOpenModal = () => {
    setIsModalMounted(true);
    if (openTimerRef.current) clearTimeout(openTimerRef.current);
    openTimerRef.current = setTimeout(() => setIsModalVisible(true), 20);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(() => setIsModalMounted(false), 300);
  };

  // Close modal on Escape key press & clean up timers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isModalMounted) {
        handleCloseModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (openTimerRef.current) clearTimeout(openTimerRef.current);
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, [isModalMounted]);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: x * 15, y: -y * 15 });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div className="relative z-20 w-full max-w-xl mx-auto flex flex-col items-center text-center px-4" style={{ perspective: "1000px" }}>
      {/* Logo Badge with Continuous Color-Cycling Filter on Hover */}
      <div ref={logoBadgeRef} className="group/logo relative w-20 h-20 mb-6 cursor-pointer will-change-transform">
        <img
          src="/logo_white.svg"
          alt="Dev Noir Logo"
          className="logo-color-cycle w-full h-full object-contain select-none transition-[transform,drop-shadow] duration-700 ease-out group-hover/logo:scale-110 group-hover/logo:drop-shadow-[0_0_20px_rgba(180,140,100,0.4)]"
        />
        <style>{`
          @keyframes hueShift {
            0%   { filter: sepia(0.85) brightness(0.8) contrast(1.2) saturate(2) hue-rotate(0deg); }
            16%  { filter: sepia(0.85) brightness(0.8) contrast(1.2) saturate(2) hue-rotate(60deg); }
            33%  { filter: sepia(0.85) brightness(0.8) contrast(1.2) saturate(2) hue-rotate(120deg); }
            50%  { filter: sepia(0.85) brightness(0.8) contrast(1.2) saturate(2) hue-rotate(180deg); }
            66%  { filter: sepia(0.85) brightness(0.8) contrast(1.2) saturate(2) hue-rotate(240deg); }
            83%  { filter: sepia(0.85) brightness(0.8) contrast(1.2) saturate(2) hue-rotate(300deg); }
            100% { filter: sepia(0.85) brightness(0.8) contrast(1.2) saturate(2) hue-rotate(360deg); }
          }
          .group\\/logo:hover .logo-color-cycle {
            animation: hueShift 4s linear infinite;
          }
        `}</style>
      </div>

      {/* Title */}
      <h2
        ref={titleRef}
        className="font-orbitron font-extrabold text-xl xs:text-3xl sm:text-5xl text-center uppercase tracking-wider sm:tracking-widest text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-100 to-zinc-500 mb-3 max-w-full px-2 will-change-transform"
      >
        CONNECT WITH DEV NOIR
      </h2>

      {/* Subtitle Paragraph */}
      <p
        ref={subtitleRef}
        className="text-xs sm:text-sm text-zinc-400 max-w-md text-center font-light mb-8 leading-relaxed will-change-transform"
      >
        Follow our engineering builds and protocol transmissions directly on Instagram.
      </p>

      {/* Main Glass Box */}
      <div
        ref={glassBoxRef}
        className="w-full rounded-3xl bg-zinc-950/90 border border-white/15 p-6 sm:p-8 backdrop-blur-2xl shadow-2xl relative overflow-hidden flex flex-col items-center space-y-6 will-change-transform"
      >
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none" />

        {/* Instagram Link Card (Authentic Instagram Color Theme + 3D Magnetic Hover) */}
        <a
          data-cursor-text="FOLLOW"
          href="https://instagram.com/dev_noir_"
          target="_blank"
          rel="noopener noreferrer"
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={handleMouseLeave}
          style={{
            transform: isHovered
              ? `perspective(1000px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg) scale(1.03)`
              : "perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)",
            transformStyle: "preserve-3d",
          }}
          className="w-full py-3.5 sm:py-4 px-4 sm:px-6 rounded-2xl bg-gradient-to-tr from-[#fbad50] via-[#e1306c] to-[#833ab4] text-white font-mono text-sm transition-all duration-300 ease-out flex items-center justify-between group cursor-pointer shadow-[0_0_30px_rgba(225,48,108,0.4)] hover:shadow-[0_0_50px_rgba(225,48,108,0.8)] relative overflow-hidden"
        >
          {/* Laser Sheen Sweep Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />

          <div className="flex items-center gap-3.5 relative z-10">
            <div className="p-2 sm:p-2.5 rounded-xl bg-white/20 backdrop-blur-md text-white group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-inner border border-white/20 shrink-0">
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6 stroke-current fill-none transition-transform duration-300"
                viewBox="0 0 24 24"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </div>
            <div className="hidden sm:block text-left">
              <span className="text-[10px] uppercase font-mono text-white/80 block tracking-widest font-semibold group-hover:text-white transition-colors">
                Official Instagram
              </span>
              <strong className="font-orbitron font-bold text-lg sm:text-xl text-white drop-shadow-md group-hover:tracking-wider transition-all duration-300">
                @dev_noir_
              </strong>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 text-xs font-mono text-white group-hover:bg-white group-hover:text-zinc-950 transition-all duration-300 shadow-md relative z-10 font-bold group-hover:shadow-white/20 shrink-0">
            <span>Follow</span>
            <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white group-hover:text-zinc-950 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
          </div>
        </a>

        {/* Disclaimer Terms & Conditions Button */}
        <div className="w-full pt-4 border-t border-white/10 flex items-center justify-center">
          <button
            type="button"
            onClick={handleOpenModal}
            className="flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-zinc-100 transition-all duration-300 cursor-pointer group px-3 py-1.5 rounded-xl hover:bg-white/[0.05]"
          >
            <FileText className="w-4 h-4 text-zinc-400 group-hover:text-emerald-400 group-hover:rotate-12 transition-all duration-300" />
            <span className="underline underline-offset-4 decoration-zinc-700 group-hover:decoration-emerald-400 transition-colors">
              Disclaimer &amp; Terms &amp; Conditions
            </span>
          </button>
        </div>
      </div>

      {/* Legal Disclaimer & Terms Modal (Smooth Open & Exit Animations) */}
      {isModalMounted && (
        <div
          onClick={handleCloseModal}
          className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 transition-all duration-300 ease-out ${
            isModalVisible
              ? "opacity-100 backdrop-blur-md"
              : "opacity-0 backdrop-blur-none pointer-events-none"
          }`}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`relative w-full max-w-lg bg-zinc-950 border border-white/20 rounded-3xl p-6 sm:p-7 shadow-2xl text-left font-mono space-y-4 transition-all duration-300 ease-out ${
              isModalVisible
                ? "opacity-100 scale-100 translate-y-0"
                : "opacity-0 scale-95 translate-y-4 pointer-events-none"
            }`}
          >
            
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2 text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
                <h3 className="font-orbitron font-bold text-sm text-white uppercase tracking-wider">
                  Disclaimer &amp; Terms of Service
                </h3>
              </div>
              <button
                type="button"
                onClick={handleCloseModal}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-zinc-400 hover:text-white transition-all cursor-pointer hover:rotate-90 duration-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-zinc-300 max-h-[55vh] overflow-y-auto pr-2 leading-relaxed font-light">
              <p>
                <strong className="text-white font-bold block mb-1">01. Intellectual Property &amp; Confidentiality</strong>
                All parameters, prompts, and specs transmitted through this channel are encrypted and treated under strict non-disclosure parameters. Dev Noir retains rights over proprietary kinetic architectural components.
              </p>
              <p>
                <strong className="text-white font-bold block mb-1">02. Protocol SLA</strong>
                Transmissions and inquiries are processed under standard SLA parameters.
              </p>
              <p>
                <strong className="text-white font-bold block mb-1">03. Disclaimer</strong>
                Content provided across Dev Noir digital channels represents non-binding scope estimations until formalized under an executed Master Services Agreement.
              </p>
            </div>

            <button
              type="button"
              onClick={handleCloseModal}
              className="w-full py-2.5 rounded-xl bg-white text-black font-bold text-xs uppercase tracking-widest hover:bg-zinc-200 transition-all duration-300 cursor-pointer active:scale-98"
            >
              Acknowledge &amp; Close
            </button>

          </div>
        </div>
      )}

    </div>
  );
}

/* ── STANDALONE CONTACT SECTION WRAPPER WITH AWWWARDS-LEVEL 3D SPATIAL UNFOLD ── */
export function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const bgLogoRef = useRef<HTMLDivElement>(null);
  const logoBadgeRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const glassBoxRef = useRef<HTMLDivElement>(null);

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  /* ── Mouse Parallax Tracking ── */
  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  /* ── Awwwards GSAP 3D Spatial Stagger Unfold Animation ── */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });

      // 0. Background Watermark Logo: Majestic Spatial 3D Expansion & Focus
      if (bgLogoRef.current) {
        tl.fromTo(
          bgLogoRef.current,
          { scale: 0.35, rotateY: -35, rotateX: 20, translateZ: -200, opacity: 0, filter: "blur(24px)" },
          { scale: 1, rotateY: 0, rotateX: 0, translateZ: 0, opacity: 0.55, filter: "blur(0px)", duration: 1.4, ease: "power4.out" },
          0
        );
      }

      // 1. Top Logo Badge: Kinetic Elastic Spring Pop
      if (logoBadgeRef.current) {
        tl.fromTo(
          logoBadgeRef.current,
          { scale: 0, rotate: -180, opacity: 0 },
          { scale: 1, rotate: 0, opacity: 1, duration: 0.8, ease: "back.out(1.8)" },
          0.15
        );
      }

      // 2. Main Title: 3D Unfold & Kinetic Glow Reveal
      if (titleRef.current) {
        tl.fromTo(
          titleRef.current,
          { y: 60, rotateX: -60, opacity: 0, filter: "blur(12px)" },
          { y: 0, rotateX: 0, opacity: 1, filter: "blur(0px)", duration: 1.0, ease: "power3.out" },
          0.25
        );
      }

      // 3. Subtitle Paragraph: Smooth Upward Glide
      if (subtitleRef.current) {
        tl.fromTo(
          subtitleRef.current,
          { y: 35, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
          0.38
        );
      }

      // 4. Main Glass Vault Box: 3D Spatial Forward Reveal
      if (glassBoxRef.current) {
        tl.fromTo(
          glassBoxRef.current,
          { y: 110, scale: 0.84, rotateX: 30, translateZ: -150, opacity: 0 },
          { y: 0, scale: 1, rotateX: 0, translateZ: 0, opacity: 1, duration: 1.2, ease: "power4.out" },
          0.35
        );
      }
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="contact"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setMousePos({ x: 0, y: 0 });
      }}
      className="relative z-10 w-full min-h-screen bg-black text-white flex flex-col items-center justify-center border-t border-zinc-900 select-none py-16 px-4 sm:px-8 overflow-hidden"
      style={{ perspective: "1200px" }}
    >
      {/* Dynamic Keyframe Style Definitions */}
      <style>{`
        @keyframes contactLogoFloat {
          0%, 100% { transform: translateY(0px) rotate(-6deg) scale(1); }
          50%      { transform: translateY(-15px) rotate(-4deg) scale(1.04); }
        }
        @keyframes contactLaserSweep {
          0%   { transform: translateY(-100%); opacity: 0; }
          50%  { opacity: 0.8; }
          100% { transform: translateY(100%); opacity: 0; }
        }
        .animate-logo-float {
          animation: contactLogoFloat 12s ease-in-out infinite;
        }
        .animate-laser-sweep {
          animation: contactLaserSweep 6s ease-in-out infinite;
        }
      `}</style>

      {/* Ambient Radial Spotlight Glow Orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] sm:w-[900px] h-[700px] sm:h-[900px] rounded-full bg-gradient-to-tr from-purple-900/30 via-zinc-800/40 to-cyan-900/30 blur-[180px] transition-transform duration-700 ease-out"
          style={{
            transform: `translate(-50%, -50%) translate3d(${mousePos.x * 40}px, ${mousePos.y * 40}px, 0)`,
          }}
        />
        {/* Subtle Cybernetic Grid Pattern Overlay */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />
      </div>

      {/* Main 3D Interactive Logo Watermark */}
      <div
        ref={bgLogoRef}
        className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden z-0 transition-transform duration-500 ease-out will-change-transform"
        style={{
          transform: isHovered
            ? `rotateX(${mousePos.y * -18}deg) rotateY(${mousePos.x * 18}deg) translateZ(-30px)`
            : "rotateX(0deg) rotateY(0deg) translateZ(0px)",
          transformStyle: "preserve-3d",
        }}
      >
        <div className="relative animate-logo-float flex items-center justify-center">
          <img
            src="/logo_white.svg"
            alt="Dev Noir Background Logo"
            className="w-[85vw] max-w-[920px] h-auto object-contain opacity-[0.55] select-none pointer-events-none filter drop-shadow-[0_0_80px_rgba(255,255,255,0.45)] transition-opacity duration-700 hover:opacity-75"
          />

          {/* Laser Scanline Beam Passing Over Background Logo */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-full">
            <div className="w-full h-24 bg-gradient-to-b from-transparent via-white/30 to-transparent animate-laser-sweep" />
          </div>
        </div>
      </div>

      {/* Contact Content Stage with Staggered Component Refs */}
      <div className="w-full relative z-10">
        <KineticPromptStudio
          logoBadgeRef={logoBadgeRef}
          titleRef={titleRef}
          subtitleRef={subtitleRef}
          glassBoxRef={glassBoxRef}
        />
      </div>
    </section>
  );
}
