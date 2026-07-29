"use client";

import React, { useRef, useEffect } from "react";
import { X, Volume2, VolumeX, Play, Pause, Maximize2, Sparkles } from "lucide-react";

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function VideoModal({ isOpen, onClose }: VideoModalProps) {
  const modalVideoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = React.useState(true);
  const [isMuted, setIsMuted] = React.useState(false);

  useEffect(() => {
    if (isOpen && modalVideoRef.current) {
      modalVideoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-black/90 backdrop-blur-2xl transition-all duration-300">
      {/* Modal Container */}
      <div className="relative w-full max-w-5xl bg-zinc-950 border border-white/15 rounded-2xl overflow-hidden shadow-2xl shadow-purple-950/50 flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-zinc-900/80 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="font-mono text-xs font-semibold text-zinc-200 tracking-wider">
              DEV NOIR BRAND SHOWCASE • UNBLURRED CINEMATIC REEL
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player Box */}
        <div className="relative aspect-video w-full bg-black flex items-center justify-center overflow-hidden">
          <video
            ref={modalVideoRef}
            autoPlay
            loop
            muted={isMuted}
            controls={false}
            className="w-full h-full object-contain"
          >
            {/* Always serve highest quality in the modal — user intentionally opened it */}
            <source src="/dev_noir_brandShowCase_1.webm" type="video/webm" />
            <source src="/dev_noir_brandShowCase_1.mp4" type="video/mp4" />
          </video>

          {/* Floating Controls Overlay inside Modal */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between px-4 py-2.5 bg-black/70 backdrop-blur-md rounded-xl border border-white/10">
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  if (modalVideoRef.current) {
                    if (isPlaying) {
                      modalVideoRef.current.pause();
                      setIsPlaying(false);
                    } else {
                      modalVideoRef.current.play();
                      setIsPlaying(true);
                    }
                  }
                }}
                className="p-2 text-white hover:text-purple-400 bg-white/10 hover:bg-white/20 rounded-lg transition-all"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
              </button>

              <button
                onClick={() => {
                  if (modalVideoRef.current) {
                    modalVideoRef.current.muted = !isMuted;
                    setIsMuted(!isMuted);
                  }
                }}
                className="p-2 text-white hover:text-cyan-400 bg-white/10 hover:bg-white/20 rounded-lg transition-all"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>

              <span className="text-xs text-zinc-400 font-mono hidden sm:inline-block">
                dev_noir_brandShowCase_1.webm
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] px-2.5 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 font-mono">
                1080p HDR
              </span>
              <button
                onClick={onClose}
                className="text-xs font-semibold px-3 py-1.5 bg-white text-black rounded-lg hover:bg-zinc-200 transition-colors"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
