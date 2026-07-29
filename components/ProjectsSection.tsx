"use client";

import React, { useEffect, useState, useRef, useMemo } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useNetworkQualityContext } from "@/components/NetworkQualityProvider";
import { getAdaptiveAsset, getResponsiveAsset } from "@/lib/getAdaptiveAsset";
import { ArrowUpRight, Eye, X, Globe, ExternalLink, Code2 } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export interface ProjectItem {
  id: string;
  title: string;
  category: string;
  tagline: string;
  description: string;
  websiteUrl: string;
  githubUrl?: string;
  /** Base name key used to resolve the adaptive asset path (e.g., "whitely") */
  imageKey: string;
  tags: string[];
  badge?: string;
  metrics?: { label: string; value: string };
  year: string;
}

const INITIAL_PROJECTS: ProjectItem[] = [
  {
    id: "proj-1",
    title: "WHITELY",
    category: "FULL-STACK ENG",
    tagline: "Premium Skin Care Platform (Frontend & Backend)",
    description: "A complete, modern e-commerce and product experience ecosystem for skincare products. Built with a rich client-side presentation layer and an integrated backend for managing products, user accounts, and database orders.",
    websiteUrl: "https://whitely.vercel.app/",
    githubUrl: "#",
    imageKey: "whitely",
    tags: ["React", "Next.js", "Node.js", "Express", "MongoDB", "Tailwind CSS"],
    badge: "FRONTEND & BACKEND",
    metrics: { label: "Tech Stack", value: "Full-Stack" },
    year: "2026",
  },
  {
    id: "proj-2",
    title: "CREMA BAR",
    category: "CREATIVE DEV",
    tagline: "Artisan Cafe Portfolio & Experience",
    description: "An elegant, interactive web portfolio designed to capture the aesthetic and atmosphere of a boutique artisan cafe. Built with fluid transitions, layout design, and responsive frontend structures.",
    websiteUrl: "https://crema-bar.vercel.app/",
    githubUrl: "#",
    imageKey: "crema_bar",
    tags: ["HTML5", "CSS3", "JavaScript", "GSAP Animations", "Responsive design"],
    badge: "FRONTEND ONLY",
    metrics: { label: "Design Theme", value: "Minimalist Dark" },
    year: "2026",
  },
  {
    id: "proj-3",
    title: "VELMORA",
    category: "FRONTEND DEV",
    tagline: "Luxury Jewelry Showcase Canvas",
    description: "A premium jewelry showcase gallery exhibiting high-end jewels. The layout focuses on high-fidelity visual presentation, subtle reveal animations, and a seamless client experience.",
    websiteUrl: "https://velmora-kappa.vercel.app/",
    githubUrl: "#",
    imageKey: "velmora",
    tags: ["Next.js", "TypeScript", "Framer Motion", "Tailwind CSS"],
    badge: "FRONTEND ONLY",
    metrics: { label: "Visual Fidelity", value: "Ultra Luxury" },
    year: "2026",
  },
];

const TAGLINE_ITEMS = [
  "DESIGN",
  "DEVELOP",
  "DEPLOY",
  "INNOVATE",
  "DISRUPT",
  "CREATE",
  "ARCHITECT",
  "ELEVATE",
];



/* ── Interactive Haptic & Pressure Click Button Component ── */
function ExploreProjectButton({ href }: { href: string }) {
  const [isPressing, setIsPressing] = useState(false);
  const [isPressureActive, setIsPressureActive] = useState(false);
  const pressureTimerRef = useRef<NodeJS.Timeout | null>(null);
  const hasTriggeredPressureRef = useRef(false);

  const triggerClickHaptic = () => {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate(15);
      } catch {
        // Fallback
      }
    }
  };

  const triggerPressureHaptic = () => {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate([35, 15, 45]);
      } catch {
        // Fallback
      }
    }
  };

  const triggerReleaseHaptic = () => {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate(10);
      } catch {
        // Fallback
      }
    }
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLAnchorElement>) => {
    setIsPressing(true);
    hasTriggeredPressureRef.current = false;

    // Trigger immediate click vibration
    triggerClickHaptic();

    const pressure = e.pressure || 0;
    if (pressure > 0.45) {
      // Hardware force pressure detected
      hasTriggeredPressureRef.current = true;
      setIsPressureActive(true);
      triggerPressureHaptic();
    } else {
      // Software pressure click threshold (210ms hold)
      if (pressureTimerRef.current) clearTimeout(pressureTimerRef.current);
      pressureTimerRef.current = setTimeout(() => {
        if (!hasTriggeredPressureRef.current) {
          hasTriggeredPressureRef.current = true;
          setIsPressureActive(true);
          triggerPressureHaptic();
        }
      }, 210);
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLAnchorElement>) => {
    if (!isPressing || hasTriggeredPressureRef.current) return;
    if (e.pressure && e.pressure > 0.45) {
      hasTriggeredPressureRef.current = true;
      setIsPressureActive(true);
      triggerPressureHaptic();
      if (pressureTimerRef.current) clearTimeout(pressureTimerRef.current);
    }
  };

  const handlePointerUp = () => {
    if (pressureTimerRef.current) clearTimeout(pressureTimerRef.current);
    if (hasTriggeredPressureRef.current) {
      triggerReleaseHaptic();
    }
    setIsPressing(false);
    setIsPressureActive(false);
  };

  const handlePointerLeave = () => {
    if (pressureTimerRef.current) clearTimeout(pressureTimerRef.current);
    setIsPressing(false);
    setIsPressureActive(false);
  };

  return (
    <a
      data-cursor-text="GO"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerLeave}
      onPointerCancel={handlePointerLeave}
      className={`group/btn relative inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-8 py-2.5 sm:py-4 rounded-full bg-white text-black text-xs sm:text-sm font-orbitron font-extrabold uppercase tracking-wider sm:tracking-widest transition-all duration-300 ease-out overflow-hidden hover:text-white cursor-pointer border border-white select-none ${
        isPressureActive
          ? "scale-90 bg-white text-black shadow-[0_0_80px_rgba(255,255,255,1)] ring-4 ring-white/70"
          : isPressing
          ? "scale-95 shadow-[0_0_45px_rgba(255,255,255,0.9)]"
          : "hover:scale-105 shadow-[0_0_30px_rgba(255,255,255,0.35)] hover:shadow-[0_0_55px_rgba(255,255,255,0.8)]"
      }`}
    >
      {/* Pressure Click Shockwave & Laser Glow */}
      {isPressureActive && (
        <>
          <span className="absolute inset-0 rounded-full border-2 border-white animate-ping opacity-80 pointer-events-none" />
          <span className="absolute -inset-1 rounded-full bg-white/40 blur-md animate-pulse pointer-events-none" />
        </>
      )}

      <span className="absolute inset-0 bg-zinc-950 -translate-x-full group-hover/btn:translate-x-0 transition-transform duration-500 ease-out rounded-full" />
      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />
      <span className="relative z-10 transition-colors duration-500">EXPLORE PROJECT</span>
      <ArrowUpRight className="relative z-10 w-5 h-5 transition-transform duration-500 ease-out group-hover/btn:translate-x-1.5 group-hover/btn:-translate-y-1.5 group-hover/btn:rotate-45" />
    </a>
  );
}

export function ProjectsSection() {
  const [isRevealed, setIsRevealed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // Network-adaptive asset quality
  const { quality } = useNetworkQualityContext();

  /** Resolve a project's imageKey to a full adaptive asset path */
  const resolveImageUrl = useMemo(
    () => (imageKey: string) => getAdaptiveAsset(imageKey, quality),
    [quality]
  );

  // Projects state
  const projects = INITIAL_PROJECTS;
  const [activeModalProject, setActiveModalProject] = useState<ProjectItem | null>(null);

  // DOM Node Refs
  const sectionRef = useRef<HTMLElement>(null);
  const pinContainerRef = useRef<HTMLDivElement>(null);
  const headerStageRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const progressTextRef = useRef<HTMLSpanElement>(null);

  // Marquee tracking
  const marqueeContainerRef = useRef<HTMLDivElement>(null);
  const marqueeTrackRef = useRef<HTMLDivElement>(null);
  const posRef = useRef(0);
  const targetPosRef = useRef(0);

  const titleText = "PROJECTS";
  const letters = titleText.split("");

  const filteredProjects = projects;

  /* ── GSAP ScrollTrigger Pinned Showcase with Horizontal Contact Slide ── */
  useEffect(() => {
    const el = sectionRef.current;
    const pinEl = pinContainerRef.current;
    if (!el || !pinEl) return;

    const totalCards = filteredProjects.length;
    if (totalCards === 0) return;

    const ctx = gsap.context(() => {
      // 0. Viewport-based Header Text Reveal (Triggers as header enters viewport)
      ScrollTrigger.create({
        trigger: el,
        start: "top 85%",
        onEnter: () => setIsRevealed(true),
        onLeaveBack: () => setIsRevealed(false),
      });

      const HEADER_OFFSET = 0.5;      // Header exit time
      const CARD_ENTER_TIME = 0.8;    // Smooth entrance from right
      const CARD_STEP = 0.85;         // Seamless continuous flow without stuck gaps

      let lastActiveCardIndex = -1;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: `+=${totalCards * 65}%`, // Responsive, fluid scroll distance
          pin: true,
          pinSpacing: true,
          anticipatePin: 1, // Prevents pin jitter
          scrub: 0.5, // Adds easing duration to smooth out touch drag micro-pixel recalculations
          onUpdate: (self) => {
            if (progressBarRef.current) {
              progressBarRef.current.style.width = `${self.progress * 100}%`;
            }
            if (progressTextRef.current) {
              const stageVal = self.progress * totalCards;
              const currentActiveCard = Math.min(totalCards, Math.max(0, Math.floor(stageVal)));
              if (currentActiveCard !== lastActiveCardIndex) {
                lastActiveCardIndex = currentActiveCard;
                if (currentActiveCard === 0) {
                  progressTextRef.current.innerText = `STAGE 1: OVERVIEW`;
                } else {
                  progressTextRef.current.innerText = `CARD STACK ${currentActiveCard} OF ${totalCards}`;
                }
              }
            }
          },
        },
      });

      // 1. Header Stage (Stage 0): Slides offstage left
      if (headerStageRef.current) {
        tl.to(headerStageRef.current, {
          xPercent: -120,
          opacity: 0,
          ease: "power1.inOut",
          duration: HEADER_OFFSET,
        }, 0);
      }

      // 2. Project Cards Right-to-Left Covering Stack Conveyor
      cardRefs.current.forEach((cardEl, index) => {
        if (!cardEl) return;

        const startTime = HEADER_OFFSET + index * CARD_STEP;

        // Initialize position offscreen right with stacked z-index & GPU acceleration
        gsap.set(cardEl, {
          x: "120vw",
          scale: 0.98,
          opacity: 1,
          zIndex: 10 + index,
          force3D: true,
        });

        // Step A: Entrance from Right (120vw -> 0vw), landing ON TOP of the stack
        tl.to(cardEl, {
          x: "0vw",
          scale: 1,
          ease: "power1.out",
          duration: CARD_ENTER_TIME,
        }, startTime);

        // Step B: Previous cards sit perfectly still and get hidden once completely covered
        if (index > 0) {
          const prevCard = cardRefs.current[index - 1];
          if (prevCard) {
            tl.set(prevCard, {
              visibility: "hidden",
            }, startTime + CARD_ENTER_TIME);
          }
        }
      });
    }, el);

    return () => ctx.revert();
  }, [filteredProjects.length]);

  /* ── Marquee Velocity Loop ── */
  useEffect(() => {
    let animationFrameId: number;

    const render = () => {
      targetPosRef.current -= 0.04;
      posRef.current += (targetPosRef.current - posRef.current) * 0.18;

      if (posRef.current <= -50) {
        posRef.current += 50;
        targetPosRef.current += 50;
      } else if (posRef.current >= 0) {
        posRef.current -= 50;
        targetPosRef.current -= 50;
      }

      if (marqueeTrackRef.current) {
        marqueeTrackRef.current.style.transform = `translate3d(${posRef.current}%, 0, 0)`;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  /* ── Interactive 3D Mouse Tilt for Header ── */
  const handleMouseMove = (e: React.MouseEvent<HTMLHeadingElement>) => {
    if (!titleRef.current) return;
    const rect = titleRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };



  return (
    <section
      ref={sectionRef}
      id="projects"
      className="relative z-10 w-full bg-black text-white"
    >
      {/* ── Sticky Viewport Container Pinned by GSAP ScrollTrigger ── */}
      <div
        ref={pinContainerRef}
        className="w-full h-screen overflow-hidden flex flex-col justify-between bg-black border-t border-zinc-900 select-none"
      >
        
        {/* ── Ambient Radial Spotlight Background ───────────── */}
        <div className="absolute inset-0 pointer-events-none opacity-30">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-zinc-100/10 via-zinc-800/10 to-transparent rounded-full blur-[160px] animate-pulse" />
        </div>

        {/* ── Background Grid Accent Lines ──────────────────── */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
          <div
            className="w-full h-full"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
              backgroundSize: "100px 100px",
            }}
          />
        </div>

        {/* ── MAIN STAGE AREA (Holds Header Sub-Section, Project Cards, AND Contact Stage) ── */}
        <div className="relative w-full flex-1 flex items-center justify-center overflow-hidden z-20 my-2">
          
          {/* ── SUB-SECTION 1: HEADER HERO SHOWCASE ───── */}
          <div
            ref={headerStageRef}
            className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 max-w-5xl mx-auto w-full will-change-transform z-20"
          >

            {/* 3D Kinetic Wave Unfold Heading: PROJECTS */}
            <div className="relative py-1" style={{ perspective: "1400px" }}>
              <h2
                ref={titleRef}
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => {
                  setIsHovered(false);
                  setMousePos({ x: 0, y: 0 });
                }}
                className="font-orbitron font-extrabold text-3xl xs:text-4xl sm:text-7xl md:text-8xl lg:text-9xl uppercase tracking-[0.08em] xs:tracking-[0.14em] sm:tracking-[0.2em] flex items-center justify-center cursor-pointer py-1 transition-transform duration-300 ease-out max-w-full px-2"
                style={{
                  transform: isHovered
                    ? `perspective(1400px) rotateY(${mousePos.x * 24}deg) rotateX(${-mousePos.y * 24}deg) scale(1.02)`
                    : "perspective(1400px) rotateY(0deg) rotateX(0deg) scale(1)",
                  transformStyle: "preserve-3d",
                }}
              >
                {letters.map((char, index) => {
                  const isEven = index % 2 === 0;
                  const rotateDir = isEven ? 1 : -1;

                  return (
                    <span
                      key={index}
                      className="inline-block relative transition-all duration-1000"
                      style={{
                        transform: isRevealed
                          ? "rotateX(0deg) rotateY(0deg) translateZ(0px) translateY(0px) scale(1)"
                          : `rotateX(${rotateDir * 85}deg) rotateY(${rotateDir * 45}deg) translateZ(-120px) translateY(${rotateDir * 40}px) scale(0.4)`,
                        opacity: isRevealed ? 1 : 0,
                        filter: isRevealed ? "blur(0px)" : "blur(12px)",
                        transitionDelay: `${index * 70}ms`,
                        transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)",
                        transformStyle: "preserve-3d",
                      }}
                    >
                      <span className="inline-block text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-100 to-zinc-500 hover:from-white hover:to-white transition-colors">
                        {char}
                      </span>
                    </span>
                  );
                })}
              </h2>

              {/* Dual Laser Scanline Sweep */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div
                  className="absolute top-0 bottom-0 w-24 bg-gradient-to-r from-transparent via-white/30 to-transparent transition-all duration-1400 ease-in-out"
                  style={{
                    left: isRevealed ? "110%" : "-20%",
                    transition: "left 1.4s cubic-bezier(0.16, 1, 0.3, 1) 0.3s",
                  }}
                />
              </div>
            </div>

            {/* Laser Underline */}
            <div className="w-80 max-w-full h-px relative mt-2 overflow-hidden">
              <div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-zinc-200 to-transparent transition-all duration-1000 ease-out transform"
                style={{
                  transform: isRevealed ? "scaleX(1)" : "scaleX(0)",
                  transition: "transform 1.4s cubic-bezier(0.16, 1, 0.3, 1) 0.5s",
                }}
              />
            </div>

            {/* Subtext */}
            <p className="mt-3 text-xs sm:text-sm text-zinc-400 max-w-lg font-light leading-relaxed">
              Scroll downwards to watch project cards enter from the right off-screen and stack on top of each other one by one in center stage.
            </p>

            {/* Downward Scroll Cue */}
            <div className="mt-6 flex flex-col items-center gap-1.5 text-zinc-500 animate-bounce">
              <span className="text-[10px] font-mono tracking-widest uppercase">SCROLL DOWN TO BEGIN SHOWCASE</span>
            </div>

          </div>

          {/* ── SUB-SECTIONS 2..N+1: ULTRA-STYLISH CINEMATIC PROJECT CARDS ───── */}
          {filteredProjects.map((project, idx) => (
            <div
              key={project.id}
              ref={(el) => {
                cardRefs.current[idx] = el;
              }}
              className="absolute inset-x-3 sm:inset-x-6 top-2 bottom-4 pointer-events-auto bg-black border border-white/20 rounded-2xl sm:rounded-3xl overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,0.9)] transition-colors duration-300 hover:border-white/40 group/card select-none will-change-transform"
            >
              {/* Top Subtle Laser Glow Line */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-70 z-30 pointer-events-none" />

              {/* Edge-to-Edge HD Visual Canvas Background */}
              <div className="absolute inset-0 z-0 overflow-hidden bg-zinc-950">
                <picture>
                  <source media="(max-width: 768px)" srcSet={getResponsiveAsset(project.imageKey)} type="image/webp" />
                  <img
                    src={resolveImageUrl(project.imageKey)}
                    alt={project.title}
                    className="w-full h-full object-cover object-center transition-transform duration-1000 ease-out group-hover/card:scale-105"
                  />
                </picture>
                
                {/* Subtle gradient for bottom text legibility only */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent pointer-events-none" />
              </div>

              {/* Card Foreground Content Overlay */}
              <div className="relative z-10 w-full h-full p-4 sm:p-10 lg:p-16 flex flex-col justify-between pointer-events-none">
                
                {/* Top Row Controls & Floating Category Pill */}
                <div className="flex items-center justify-between gap-2 sm:gap-4 pointer-events-auto">
                  {/* Floating Category Badge */}
                  <div className="inline-flex items-center gap-2 sm:gap-3 px-3 sm:px-5 py-1.5 sm:py-2.5 rounded-full bg-black/70 border border-white/25 backdrop-blur-md shadow-2xl shrink-0 whitespace-nowrap">
                    <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-white animate-pulse shrink-0" />
                    <span className="text-[10px] sm:text-sm font-mono tracking-[0.1em] sm:tracking-[0.2em] text-white font-semibold uppercase">
                      {project.category}
                    </span>
                    <span className="text-zinc-500 text-[10px] sm:text-xs">•</span>
                    <span className="text-[10px] sm:text-sm font-mono text-zinc-300">
                      0{idx + 1} / 0{filteredProjects.length}
                    </span>
                  </div>

                  {/* Top Action Icons */}
                  <div className="flex items-center gap-3">


                    <button
                      data-cursor-text="VIEW"
                      onClick={() => setActiveModalProject(project)}
                      title="View Details"
                      className="group/eye relative p-3.5 rounded-full bg-black/70 border border-white/25 text-zinc-200 hover:text-black hover:bg-white transition-all duration-500 ease-out backdrop-blur-md cursor-pointer shadow-2xl hover:shadow-[0_0_30px_rgba(255,255,255,0.75)] hover:scale-115 active:scale-95 overflow-hidden border-white"
                    >
                      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover/eye:translate-x-full transition-transform duration-700 ease-in-out pointer-events-none" />
                      <Eye className="relative z-10 w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 ease-out group-hover/eye:scale-125" />
                    </button>
                  </div>
                </div>

                {/* Bottom Row: Giant Title, Subtitle, Tech Pills, & Visit Button */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pointer-events-auto">
                  
                  {/* Left Column: Title & Subtitle */}
                  <div className="max-w-3xl">
                    {/* Badge / Year */}
                    <div className="inline-block px-3.5 py-1.5 rounded-md bg-white/10 border border-white/20 text-xs font-mono tracking-widest text-zinc-200 uppercase mb-4 backdrop-blur-md">
                      {project.badge || `RELEASE ${project.year}`}
                    </div>

                    {/* Giant Stylish Title */}
                    <h3 className="font-orbitron font-extrabold text-2xl xs:text-4xl sm:text-6xl md:text-7xl lg:text-8xl uppercase tracking-wider text-white drop-shadow-[0_6px_30px_rgba(0,0,0,0.95)] leading-none mb-2 sm:mb-4">
                      {project.title}
                    </h3>

                    {/* Tagline */}
                    <p className="text-sm sm:text-base font-mono text-zinc-300 drop-shadow-md mb-4 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      {project.tagline}
                    </p>

                    {/* Tech Stack Pills */}
                    <div className="flex flex-wrap items-center gap-2">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 rounded-full bg-black/60 border border-white/20 text-xs font-mono text-zinc-200 backdrop-blur-md shadow-lg"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Right Column: Giant Circular / Pill Action Button */}
                  <div className="shrink-0">
                    <ExploreProjectButton href={project.websiteUrl} />
                  </div>

                </div>

              </div>

            </div>
          ))}

        </div>

        {/* ── FIXED BOTTOM KINETIC MARQUEE SLIDER ──── */}
        <div
          ref={marqueeContainerRef}
          className="relative py-4 bg-zinc-950/95 border-t border-white/10 backdrop-blur-xl overflow-hidden group z-30 pointer-events-auto will-change-transform"
        >
          <div className="absolute top-0 bottom-0 left-0 w-24 bg-gradient-to-r from-black via-black/80 to-transparent z-10 pointer-events-none" />
          <div className="absolute top-0 bottom-0 right-0 w-24 bg-gradient-to-l from-black via-black/80 to-transparent z-10 pointer-events-none" />

          <div
            ref={marqueeTrackRef}
            className="flex items-center gap-12 whitespace-nowrap select-none will-change-transform"
          >
            {[...TAGLINE_ITEMS, ...TAGLINE_ITEMS, ...TAGLINE_ITEMS].map((item, idx) => (
              <div key={idx} className="flex items-center gap-12 group/word cursor-pointer py-0.5">
                <div className="flex items-center">
                  {item.split("").map((char, charIdx) => (
                    <span
                      key={charIdx}
                      className="inline-block font-orbitron font-extrabold text-base sm:text-lg md:text-xl text-zinc-400 group-hover/word:text-white transition-all duration-300 ease-out group-hover/word:scale-y-75 group-hover/word:scale-x-125 group-hover/word:-skew-x-6 group-hover/word:drop-shadow-[0_0_15px_rgba(255,255,255,0.9)]"
                      style={{
                        transitionDelay: `${charIdx * 25}ms`,
                        transformOrigin: "center center",
                        letterSpacing: "0.15em"
                      }}
                    >
                      {char}
                    </span>
                  ))}
                </div>
                <span className="w-2 h-2 rounded-full bg-white/30 group-hover/word:bg-white group-hover/word:scale-150 group-hover/word:drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] transition-all duration-300 animate-pulse" />
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ── PROJECT DETAILS MODAL ─────────────────────────────── */}
      {activeModalProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-xl animate-fade-in pointer-events-auto">
          <div className="relative w-full max-w-3xl rounded-3xl bg-zinc-950 border border-white/20 p-6 sm:p-8 text-white shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
            
            {/* Close Button */}
            <button
              onClick={() => setActiveModalProject(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-20 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Image Header */}
            <div className="relative w-full h-64 sm:h-80 rounded-2xl overflow-hidden mb-6 bg-zinc-900">
              <picture>
                <source media="(max-width: 768px)" srcSet={getResponsiveAsset(activeModalProject.imageKey)} type="image/webp" />
                <img
                  src={resolveImageUrl(activeModalProject.imageKey)}
                  alt={activeModalProject.title}
                  className="w-full h-full object-cover"
                />
              </picture>
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
              

            </div>

            {/* Modal Content */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-xs font-mono uppercase bg-white/10 border border-white/20 text-zinc-300">
                  {activeModalProject.category}
                </span>
                <span className="text-xs font-mono text-zinc-400">Released {activeModalProject.year}</span>
              </div>

              <h2 className="font-orbitron font-extrabold text-2xl sm:text-3xl text-white">
                {activeModalProject.title}
              </h2>
              <p className="text-sm font-mono text-zinc-400">
                {activeModalProject.tagline}
              </p>

              <p className="text-sm text-zinc-300 leading-relaxed font-light">
                {activeModalProject.description}
              </p>

              {/* Tech Tags */}
              <div className="pt-2">
                <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-500 mb-2">Technologies Used</h4>
                <div className="flex flex-wrap gap-2">
                  {activeModalProject.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-lg bg-white/5 border border-white/15 text-xs font-mono text-zinc-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* External Links */}
              <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                <a
                  href={activeModalProject.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/modalbtn relative inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-white text-black font-semibold text-xs transition-all duration-500 ease-out overflow-hidden hover:text-white border border-white shadow-lg hover:shadow-[0_0_35px_rgba(255,255,255,0.7)] hover:scale-105"
                >
                  <span className="absolute inset-0 bg-zinc-950 -translate-x-full group-hover/modalbtn:translate-x-0 transition-transform duration-500 ease-out rounded-full" />
                  <span className="relative z-10 flex items-center gap-2.5 transition-colors duration-500">
                    <Globe className="w-4 h-4" />
                    <span>Visit Website ({activeModalProject.websiteUrl})</span>
                    <ExternalLink className="w-4 h-4 transition-transform duration-300 group-hover/modalbtn:translate-x-0.5 group-hover/modalbtn:-translate-y-0.5" />
                  </span>
                </a>

                {activeModalProject.githubUrl && (
                  <a
                    href={activeModalProject.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-zinc-900 border border-white/20 text-white font-semibold text-xs hover:bg-zinc-800 transition-all"
                  >
                    <Code2 className="w-4 h-4" />
                    <span>View Repository</span>
                  </a>
                )}
              </div>

            </div>

          </div>
        </div>
      )}

    </section>
  );
}


