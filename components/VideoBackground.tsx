"use client";

import React, { useRef, useState, useEffect } from "react";
import { Volume2, VolumeX, Pause, Play, Sparkles, Sliders, Eye, RefreshCw } from "lucide-react";
import { useNetworkQualityContext } from "@/components/NetworkQualityProvider";

export type BlurPreset = "cinematic" | "dreamy" | "soft" | "crisp";

interface VideoBackgroundProps {
  blurPreset: BlurPreset;
  onBlurPresetChange: (preset: BlurPreset) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export function VideoBackground({
  blurPreset,
  onBlurPresetChange,
  isPlaying,
  onTogglePlay,
  isMuted,
  onToggleMute,
}: VideoBackgroundProps) {
  const { quality } = useNetworkQualityContext();

  // Resolve adaptive video sources based on network quality
  // "high"   → full-quality WebM (best compression) + MP4 fallback
  // "medium" → medium MP4 (0.9 MB, smaller than medium WebM) + WebM fallback
  // "low"    → same medium files (still playable on 3G, avoids jarring disappearance)
  // "lowest" → no video at all (true 2G/slow-2g; saves bandwidth)
  const videoSources = quality === "high"
    ? { primary: "/dev_noir_brandShowCase_1.webm", fallback: "/dev_noir_brandShowCase_1.mp4", primaryType: "video/webm", fallbackType: "video/mp4" }
    : quality === "lowest"
    ? null
    : { primary: "/dev_noir_brandShowCase_1_medium.mp4", fallback: "/dev_noir_brandShowCase_1_medium.webm", primaryType: "video/mp4", fallbackType: "video/webm" };
  const videoRef = useRef<HTMLVideoElement>(null);
  const blurVideoRef = useRef<HTMLVideoElement>(null);

  // Sync play/pause state with video elements
  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
      }
    }
    if (blurVideoRef.current) {
      if (isPlaying) {
        blurVideoRef.current.play().catch(() => {});
      } else {
        blurVideoRef.current.pause();
      }
    }
  }, [isPlaying]);

  // Sync mute state
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  // Blur class mapping for main backdrop
  const getBlurClasses = () => {
    switch (blurPreset) {
      case "dreamy":
        return {
          bgVideoBlur: "blur-3xl scale-125 opacity-70",
          backdropFilter: "backdrop-blur-2xl bg-black/60",
          glowOpacity: "opacity-80",
        };
      case "soft":
        return {
          bgVideoBlur: "blur-md scale-105 opacity-40",
          backdropFilter: "backdrop-blur-sm bg-black/45",
          glowOpacity: "opacity-30",
        };
      case "crisp":
        return {
          bgVideoBlur: "blur-[2px] scale-100 opacity-30",
          backdropFilter: "backdrop-blur-[2px] bg-black/35",
          glowOpacity: "opacity-20",
        };
      case "cinematic":
      default:
        return {
          bgVideoBlur: "blur-2xl scale-110 opacity-60",
          backdropFilter: "backdrop-blur-md bg-black/50",
          glowOpacity: "opacity-50",
        };
    }
  };

  const currentStyles = getBlurClasses();

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none bg-[#050508]">
      {/* 1. Deep Blurred Aura Video Layer (ambient light source) */}
      <div className="absolute inset-0 z-0">
        {videoSources ? (
          <video
            ref={blurVideoRef}
            autoPlay
            loop
            muted
            playsInline
            className={`w-full h-full object-cover transition-all duration-700 ease-out transform ${currentStyles.bgVideoBlur}`}
          >
            <source src={videoSources.primary} type={videoSources.primaryType} />
            <source src={videoSources.fallback} type={videoSources.fallbackType} />
          </video>
        ) : (
          /* Lowest only: static ambient gradient instead of video */
          <div className={`w-full h-full bg-gradient-to-br from-purple-950/40 via-black to-cyan-950/30 ${currentStyles.bgVideoBlur}`} />
        )}
      </div>

      {/* 2. Direct Video Display Layer */}
      <div className="absolute inset-0 z-10 opacity-75">
        {videoSources ? (
          <video
            ref={videoRef}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            className="w-full h-full object-cover"
          >
            <source src={videoSources.primary} type={videoSources.primaryType} />
            <source src={videoSources.fallback} type={videoSources.fallbackType} />
          </video>
        ) : (
          /* Low/Lowest: static dark gradient fallback */
          <div className="w-full h-full bg-gradient-to-b from-zinc-950 via-black to-zinc-900" />
        )}
      </div>

      {/* 3. Backdrop Blur & Overlay Filter Layer */}
      <div
        className={`absolute inset-0 z-20 transition-all duration-700 ${currentStyles.backdropFilter}`}
      />

      {/* 4. Ambient Gradient Radial Glows */}
      <div
        className={`absolute -top-40 -left-40 w-[600px] h-[600px] bg-purple-600/30 rounded-full blur-[140px] z-20 pointer-events-none transition-opacity duration-700 ${currentStyles.glowOpacity}`}
      />
      <div
        className={`absolute -bottom-40 -right-40 w-[700px] h-[700px] bg-cyan-600/25 rounded-full blur-[160px] z-20 pointer-events-none transition-opacity duration-700 ${currentStyles.glowOpacity}`}
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-indigo-500/10 rounded-full blur-[180px] z-20 pointer-events-none" />

      {/* 5. Vignette & Mesh Texture Overlay */}
      <div className="absolute inset-0 z-30 bg-gradient-to-t from-[#060608] via-transparent to-black/70 pointer-events-none" />
      <div className="absolute inset-0 z-30 bg-gradient-to-r from-black/80 via-transparent to-black/80 pointer-events-none" />
      <div className="absolute inset-0 z-30 bg-grid-pattern opacity-25 mix-blend-overlay pointer-events-none" />
    </div>
  );
}
