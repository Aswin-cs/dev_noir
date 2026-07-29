"use client";

import React, { useState, useEffect } from "react";
import { Play, ArrowUpRight, X, Menu } from "lucide-react";


export function Navbar({ onOpenReel }: { onOpenReel?: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "py-3 bg-black/65 backdrop-blur-xl border-b border-white/10 shadow-2xl shadow-purple-950/20"
          : "py-6 bg-gradient-to-b from-black/80 via-black/40 to-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <div className="flex items-center space-x-3 group cursor-pointer">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-500 to-cyan-400 p-[1px] shadow-lg shadow-purple-500/20 transition-transform duration-300 group-hover:scale-105">
              <div className="w-full h-full bg-black/90 rounded-[11px] flex items-center justify-center backdrop-blur-md p-1.5">
                <img src="/logo_white.svg" alt="Dev Noir Logo" className="w-full h-full object-contain filter drop-shadow" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg tracking-wider text-white flex items-center gap-1.5 font-mono">
                DEV NOIR
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              </span>
              <span className="text-[10px] text-purple-300/70 tracking-widest uppercase font-mono">
                STUDIO v2.4
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-lg shadow-inner">
            {[
              { label: "Services", href: "#services" },
              { label: "Projects", href: "#projects" },
              { label: "Contact", href: "#contact" }
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="px-4 py-2 text-xs font-medium text-zinc-300 hover:text-white hover:bg-white/10 rounded-full transition-all duration-200"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Right Action CTA */}
          <div className="hidden sm:flex items-center space-x-3">
            <button
              onClick={onOpenReel}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg backdrop-blur-md transition-all duration-200 group"
            >
              <Play className="w-3.5 h-3.5 text-purple-400 fill-purple-400/30 group-hover:scale-110 transition-transform" />
              <span>Watch Reel</span>
            </button>

            <a
              href="#contact"
              className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-xs font-medium rounded-lg group bg-gradient-to-br from-purple-600 via-indigo-500 to-cyan-400 group-hover:from-purple-600 group-hover:to-cyan-400 text-white shadow-lg shadow-purple-900/30 hover:shadow-purple-500/30 transition-all duration-300 active:scale-95"
            >
              <span className="relative px-4 py-2 transition-all ease-in duration-75 bg-black/90 rounded-[7px] group-hover:bg-opacity-0 flex items-center gap-1.5 font-semibold">
                <span>Access Studio</span>
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-zinc-400 hover:text-white rounded-lg bg-white/5 border border-white/10 backdrop-blur-md"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-3 px-4 pt-2 pb-6 bg-black/95 backdrop-blur-2xl border-b border-white/10 space-y-3">
          <div className="flex flex-col space-y-2">
            {[
              { label: "Services", href: "#services" },
              { label: "Projects", href: "#projects" },
              { label: "Contact", href: "#contact" }
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2.5 text-sm font-medium text-zinc-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                {item.label}
              </a>
            ))}
          </div>
          <div className="pt-2 border-t border-white/10 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (onOpenReel) onOpenReel();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-medium text-white bg-white/10 border border-white/15 rounded-lg"
            >
              <Play className="w-3.5 h-3.5 text-purple-400" />
              <span>Watch Reel</span>
            </button>
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 text-xs font-semibold text-black bg-gradient-to-r from-cyan-400 to-purple-400 rounded-lg"
            >
              Access Studio
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
