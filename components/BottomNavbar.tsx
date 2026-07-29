"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ChevronDown, Layers, Film, ArrowUpRight } from "lucide-react";

import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollToPlugin);
}

export function BottomNavbar() {
  const [isVisible, setIsVisible] = useState(true);
  const [isHeroIdle, setIsHeroIdle] = useState(false);
  const [inServicesZone, setInServicesZone] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoverRect, setHoverRect] = useState<{ left: number; top: number; width: number; height: number; opacity: number } | null>(null);

  /* ── Sync with Hero Section Idle State ── */
  useEffect(() => {
    const handleHeroIdle = (e: Event) => {
      const customEvt = e as CustomEvent<{ isIdle: boolean }>;
      setIsHeroIdle(customEvt.detail.isIdle);
    };

    window.addEventListener("hero-idle-change", handleHeroIdle);
    return () => window.removeEventListener("hero-idle-change", handleHeroIdle);
  }, []);

  /* ── Hide navbar when inside the pinned Services bars zone ── */
  useEffect(() => {
    const checkServicesZone = () => {
      const servicesEl = document.getElementById("services");
      if (!servicesEl) return;
      const rect = servicesEl.getBoundingClientRect();
      // If the services section top is at or above viewport top and bottom is below viewport
      const isInZone = rect.top <= 0 && rect.bottom > window.innerHeight * 0.5;
      setInServicesZone(isInZone);
    };

    window.addEventListener("scroll", checkServicesZone, { passive: true });
    checkServicesZone();
    return () => window.removeEventListener("scroll", checkServicesZone);
  }, []);

  const resetInactivityTimer = () => {
    setIsVisible(true);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      setIsVisible(false);
    }, 5000); // Hide after 5 seconds of inactivity
  };

  const handleItemMouseEnter = (e: React.MouseEvent<HTMLElement>) => {
    const target = e.currentTarget;
    if (containerRef.current) {
      const containerBounds = containerRef.current.getBoundingClientRect();
      const targetBounds = target.getBoundingClientRect();
      setHoverRect({
        left: targetBounds.left - containerBounds.left,
        top: targetBounds.top - containerBounds.top,
        width: targetBounds.width,
        height: targetBounds.height,
        opacity: 1,
      });
    }
  };

  const handleNavMouseLeave = () => {
    setHoverRect((prev) => (prev ? { ...prev, opacity: 0 } : null));
    resetInactivityTimer();
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsVisible(true);
    resetInactivityTimer();

    const lenis = typeof window !== "undefined" ? (window as any).lenis : null;

    if (href === "/" || href === "#") {
      if (lenis) {
        lenis.scrollTo(0, { duration: 1.2 });
      } else {
        gsap.to(window, {
          scrollTo: { y: 0, autoKill: false },
          duration: 0.7,
          ease: "power3.inOut",
        });
      }
      return;
    }

    const targetId = href.replace("#", "");
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      if (lenis) {
        lenis.scrollTo(targetElement, { duration: 1.2 });
      } else {
        gsap.to(window, {
          scrollTo: { y: targetElement, autoKill: false },
          duration: 0.7,
          ease: "power3.inOut",
        });
      }
    }
  };

  useEffect(() => {
    // Start timer on initial mount
    resetInactivityTimer();

    const handleMouseMove = () => {
      resetInactivityTimer();
    };

    const handleKeyDown = () => {
      resetInactivityTimer();
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <>
      {/* Top Dock Hover Activation Area (invisible sentinel zone at screen top to trigger display on mouse approach) */}
      <div
        onMouseEnter={() => setIsVisible(true)}
        className="fixed top-0 left-0 right-0 h-24 z-40 pointer-events-auto"
        style={{ pointerEvents: isVisible ? "none" : "auto" }}
      />

      {/* Single Fluid Morphing Glass Dock Navbar (Positioned at TOP of screen) */}
      <nav
        onMouseEnter={() => {
          setIsVisible(true);
          if (timerRef.current) clearTimeout(timerRef.current);
        }}
        onMouseLeave={handleNavMouseLeave}
        onClick={() => {
          if (!isVisible) {
            setIsVisible(true);
            resetInactivityTimer();
          }
        }}
        className={`fixed top-6 sm:top-8 left-1/2 -translate-x-1/2 z-50 glass-dock p-1.5 rounded-full flex items-center shadow-2xl transition-all duration-700 ease-in-out cursor-pointer select-none max-w-[94vw] ${
          isHeroIdle || inServicesZone
            ? "opacity-0 -translate-y-16 pointer-events-none"
            : isVisible
            ? "opacity-100 translate-y-0 sm:max-w-[650px] border-white/20"
            : "opacity-100 translate-y-0 max-w-[85px] sm:max-w-[155px] border-white/30 hover:scale-105 active:scale-95"
        }`}
      >
        <div
          ref={containerRef}
          className="relative flex items-center gap-1 sm:gap-1.5 w-full justify-center sm:justify-start"
        >
          {/* Smooth Sliding Hover Highlight Pill */}
          {hoverRect && (
            <div
              className="absolute rounded-full bg-white/12 border border-white/25 backdrop-blur-md transition-all duration-300 cubic-bezier(0.16, 1, 0.3, 1) pointer-events-none z-0 shadow-lg"
              style={{
                left: `${hoverRect.left}px`,
                top: `${hoverRect.top}px`,
                width: `${hoverRect.width}px`,
                height: `${hoverRect.height}px`,
                opacity: hoverRect.opacity,
              }}
            />
          )}
          {/* Brand Minimalist Indicator (Always Visible) */}
          <Link
            href="/"
            onMouseEnter={handleItemMouseEnter}
            onClick={(e) => {
              if (!isVisible) {
                e.preventDefault();
                setIsVisible(true);
                resetInactivityTimer();
              } else {
                handleNavClick(e, "/");
              }
            }}
            className="group relative z-10 p-1.5 sm:px-3 sm:py-1.5 rounded-full font-mono text-xs font-bold tracking-widest text-white transition-colors flex items-center gap-2 shrink-0"
          >
            <img src="/logo_white.svg" alt="Dev Noir Logo" className="w-5 h-5 object-contain filter drop-shadow" />
            <span className="hidden md:inline font-mono text-xs font-bold tracking-widest text-white whitespace-nowrap">
              DEV NOIR
            </span>
            {/* Interactive Hover Label Tooltip */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3.5 px-2.5 py-1 rounded-md bg-zinc-950/95 border border-white/15 text-[10px] font-mono tracking-widest uppercase text-zinc-200 opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 shadow-2xl z-50 pointer-events-none whitespace-nowrap">
              Home
              <span className="w-1.5 h-1.5 bg-zinc-950 border-l border-t border-white/15 rotate-45 absolute -top-1 left-1/2 -translate-x-1/2" />
            </div>
          </Link>

          {/* Expand Chevron Icon (Visible ONLY when collapsed) */}
          <div
            className={`transition-all duration-300 flex items-center shrink-0 ${
              !isVisible ? "w-4 opacity-100 mr-0.5 sm:mr-1" : "w-0 opacity-0 overflow-hidden"
            }`}
          >
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400 group-hover:text-white" />
          </div>

          {/* Collapsible Navigation Area (Smooth horizontal width expansion & unclip) */}
          <div
            className={`flex items-center gap-1 sm:gap-1.5 transition-all duration-500 ease-out origin-left ${
              isVisible
                ? "max-w-[500px] opacity-100 scale-x-100 border-l border-white/15 pl-1.5 sm:pl-2"
                : "max-w-0 opacity-0 scale-x-90 pointer-events-none overflow-hidden pl-0"
            }`}
          >
            {/* Navigation Links: #services, #projects */}
            {[
              { label: "Services", href: "#services", icon: Layers },
              { label: "Projects", href: "#projects", icon: Film },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.label}
                  href={item.href}
                  onMouseEnter={handleItemMouseEnter}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className="group relative z-10 glass-dock-item p-2 sm:px-3.5 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-medium tracking-wide text-zinc-300 hover:text-white flex items-center gap-1.5 shrink-0 whitespace-nowrap"
                >
                  <Icon className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                  <span className="hidden sm:inline">{item.label}</span>
                  {/* Interactive Hover Label Tooltip */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3.5 px-2.5 py-1 rounded-md bg-zinc-950/95 border border-white/15 text-[10px] font-mono tracking-widest uppercase text-zinc-200 opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 shadow-2xl z-50 pointer-events-none whitespace-nowrap">
                    {item.label}
                    <span className="w-1.5 h-1.5 bg-zinc-950 border-l border-t border-white/15 rotate-45 absolute -top-1 left-1/2 -translate-x-1/2" />
                  </div>
                </a>
              );
            })}

            {/* Minimalist CTA Action */}
            <a
              href="#contact"
              onMouseEnter={handleItemMouseEnter}
              onClick={(e) => handleNavClick(e, "#contact")}
              className="group relative z-10 ml-0.5 sm:ml-1 p-2 sm:px-3.5 sm:py-1.5 rounded-full bg-white text-black text-xs font-semibold hover:bg-zinc-200 transition-colors flex items-center gap-1 shadow-lg shrink-0 whitespace-nowrap"
            >
              <span className="hidden sm:inline">Get Started</span>
              <ArrowUpRight className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
              {/* Interactive Hover Label Tooltip */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3.5 px-2.5 py-1 rounded-md bg-zinc-950/95 border border-white/15 text-[10px] font-mono tracking-widest uppercase text-zinc-200 opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 shadow-2xl z-50 pointer-events-none whitespace-nowrap">
                Get Started
                <span className="w-1.5 h-1.5 bg-zinc-950 border-l border-t border-white/15 rotate-45 absolute -top-1 left-1/2 -translate-x-1/2" />
              </div>
            </a>
          </div>
        </div>
      </nav>
    </>
  );
}
