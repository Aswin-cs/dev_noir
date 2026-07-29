"use client";

import React, { useEffect, useState } from "react";
import { Cpu } from "lucide-react";

interface LoadingScreenProps {
  onComplete?: () => void;
}

// Critical assets to preload before site launch
// Video: preload medium.mp4 during loading (smallest, most universal).
// The full adaptive video is loaded later once network quality is detected.
const ASSET_MANIFEST = {
  videos: ["/dev_noir_brandShowCase_1_medium.mp4"],
  svgs: ["/logo_white.svg", "/logo.svg"],
  images: [
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1000&auto=format&fit=crop",
  ],
};

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [statusLog, setStatusLog] = useState("INITIALIZING NEURAL CORE...");
  const [isFinished, setIsFinished] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    let loadedCount = 0;
    const totalAssets =
      ASSET_MANIFEST.videos.length +
      ASSET_MANIFEST.svgs.length +
      ASSET_MANIFEST.images.length +
      1; // +1 for fonts / DOM readiness

    const updateProgress = (logText: string) => {
      loadedCount++;
      const pct = Math.min(100, Math.round((loadedCount / totalAssets) * 100));
      setProgress(pct);
      setStatusLog(logText);

      if (loadedCount >= totalAssets) {
        finishLoading();
      }
    };

    const finishLoading = () => {
      setProgress(100);
      setStatusLog("NEURAL MATRIX READY");
      setTimeout(() => {
        setIsFinished(true);
        setTimeout(() => {
          setIsDismissed(true);
          if (onComplete) onComplete();
        }, 700);
      }, 500);
    };

    // 1. Check Document Fonts
    if (typeof document !== "undefined" && document.fonts) {
      document.fonts.ready.then(() => {
        updateProgress("TYPOGRAPHY MATRIX LOADED");
      }).catch(() => {
        updateProgress("TYPOGRAPHY INITIALIZED");
      });
    } else {
      updateProgress("SYSTEM FONTS READY");
    }

    // 2. Preload SVGs
    ASSET_MANIFEST.svgs.forEach((url) => {
      const img = new Image();
      img.src = url;
      img.onload = () => updateProgress(`LOADED LOGO ASSET: ${url.split("/").pop()}`);
      img.onerror = () => updateProgress(`CACHED VECTOR GRAPHICS`);
    });

    // 3. Preload High-Res Images
    ASSET_MANIFEST.images.forEach((url, idx) => {
      const img = new Image();
      img.src = url;
      img.onload = () => updateProgress(`BUFFERED SHOWCASE IMAGE [0${idx + 1}]`);
      img.onerror = () => updateProgress(`SYNCED SHOWCASE FRAME [0${idx + 1}]`);
    });

    // 4. Preload Video Media Asset
    ASSET_MANIFEST.videos.forEach((url) => {
      const video = document.createElement("video");
      video.src = url;
      video.preload = "auto";
      
      const handleVideoReady = () => {
        updateProgress("BRAND SHOWCASE VIDEO BUFFERED");
        video.removeEventListener("canplaythrough", handleVideoReady);
        video.removeEventListener("loadeddata", handleVideoReady);
      };

      video.addEventListener("canplaythrough", handleVideoReady);
      video.addEventListener("loadeddata", handleVideoReady);
      video.addEventListener("error", () => {
        updateProgress("SHOWCASE MEDIA STREAM READY");
      });

      // Trigger load
      video.load();
    });

    return () => {};
  }, [onComplete]);

  if (isDismissed) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-black text-white flex flex-col items-center justify-between p-8 select-none transition-all duration-700 ease-in-out ${
        isFinished ? "opacity-0 scale-105 pointer-events-none" : "opacity-100 scale-100"
      }`}
    >
      {/* ── Background Grid & Ambient Pulsing Glow ── */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div
          className="w-full h-full"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-[140px] pointer-events-none animate-pulse" />

      {/* ── Top Bar Branding ── */}
      <div className="w-full max-w-7xl flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <img src="/logo_white.svg" alt="Dev Noir Logo" className="w-8 h-8 object-contain filter drop-shadow" />
          <span className="font-orbitron font-extrabold text-lg tracking-[0.2em] text-white">
            DEV NOIR
          </span>
        </div>
      </div>

      {/* ── Center Futuristic Meter & Counter ── */}
      <div className="relative flex flex-col items-center justify-center z-10 my-auto">
        {/* Outer Circular Pulse Ring */}
        <div className="relative w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center">
          {/* Animated SVG Loader Ring */}
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="44"
              className="stroke-zinc-900 fill-none"
              strokeWidth="4"
            />
            <circle
              cx="50"
              cy="50"
              r="44"
              className="stroke-white fill-none transition-all duration-300 ease-out"
              strokeWidth="4"
              strokeDasharray={276}
              strokeDashoffset={276 - (276 * progress) / 100}
              strokeLinecap="round"
            />
          </svg>

          {/* Center Digital Percentage */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="font-orbitron font-extrabold text-4xl sm:text-5xl tracking-tighter text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]">
              {progress}%
            </span>
            <span className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase mt-1">
              {isFinished ? "LOAD COMPLETE" : "BUFFERING..."}
            </span>
          </div>
        </div>

        {/* Status Log & Live Ticker */}
        <div className="mt-8 flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-950/90 border border-white/15 text-xs font-mono text-zinc-300 shadow-2xl backdrop-blur-xl">
          <Cpu className="w-3.5 h-3.5 text-zinc-400 animate-spin" />
          <span className="tracking-wider uppercase">{statusLog}</span>
        </div>

        {/* Linear Progress Bar Sheen */}
        <div className="mt-6 w-64 sm:w-80 h-1 bg-zinc-900 rounded-full overflow-hidden border border-white/10 relative">
          <div
            className="h-full bg-gradient-to-r from-zinc-500 via-white to-zinc-300 transition-all duration-300 ease-out shadow-[0_0_10px_rgba(255,255,255,0.8)]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* ── Bottom Details Bar ── */}
      <div className="w-full max-w-7xl flex items-center justify-end text-[11px] font-mono text-zinc-500 z-10">
        {/* Quick Skip Button if user wants to enter immediately */}
        <button
          onClick={() => {
            setProgress(100);
            setIsFinished(true);
            setTimeout(() => {
              setIsDismissed(true);
              if (onComplete) onComplete();
            }, 300);
          }}
          className="hover:text-white transition-colors underline decoration-zinc-700 hover:decoration-white cursor-pointer"
        >
          SKIP PRELOADER &rarr;
        </button>
      </div>
    </div>
  );
}
