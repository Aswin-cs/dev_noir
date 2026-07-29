import Link from "next/link";
import React from "react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black relative overflow-hidden">
      
      {/* ── Custom 404 Animations ── */}
      <style>{`
        @keyframes liquid-shimmer {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .metallic-text {
          background: linear-gradient(to right, #111111 10%, #666666 30%, #ffffff 50%, #666666 70%, #111111 90%);
          background-size: 200% auto;
          color: #000;
          background-clip: text;
          text-fill-color: transparent;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: liquid-shimmer 6s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }

        @keyframes ambient-float {
          0%, 100% { 
            transform: translateY(0) scale(1); 
            filter: drop-shadow(0 0 10px rgba(255,255,255,0.05)); 
          }
          50% { 
            transform: translateY(-8px) scale(1.02); 
            filter: drop-shadow(0 0 35px rgba(255,255,255,0.25)); 
          }
        }
        
        .animate-float {
          animation: ambient-float 5s ease-in-out infinite;
        }
      `}</style>

      {/* Pure Black Background */}

      <div className="relative z-10 flex flex-col items-center text-center px-4 w-full max-w-4xl mx-auto">
        
        {/* Animated Metallic Shimmer & Float 404 Text */}
        <div className="relative animate-float mb-4">
          <h1 
            className="metallic-text text-9xl sm:text-[12rem] md:text-[15rem] font-orbitron font-black tracking-tighter select-none"
          >
            404
          </h1>
        </div>
        
        <h2 className="text-2xl sm:text-3xl md:text-5xl font-syncopate uppercase tracking-[0.25em] text-white/90 mb-8 font-light">
          Void Reached
        </h2>
        
        <p className="text-sm md:text-base font-sans text-zinc-400 max-w-md mb-14 leading-relaxed font-light">
          The digital coordinate you are seeking does not exist in this sector. It may have been relocated, or it never materialized in the matrix.
        </p>
        
        <Link 
          href="/"
          className="group/btn relative inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white text-black text-sm font-orbitron font-extrabold uppercase tracking-widest transition-all duration-300 ease-out overflow-hidden hover:text-white cursor-pointer border border-white select-none hover:scale-105 shadow-[0_0_30px_rgba(255,255,255,0.35)] hover:shadow-[0_0_55px_rgba(255,255,255,0.8)]"
        >
          <span className="absolute inset-0 bg-zinc-950 -translate-x-full group-hover/btn:translate-x-0 transition-transform duration-500 ease-out rounded-full" />
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />
          <span className="relative z-10 transition-colors duration-500">INITIALIZE RETURN</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="relative z-10 transition-transform duration-500 ease-out group-hover/btn:translate-x-1.5 group-hover/btn:-translate-y-1.5 group-hover/btn:rotate-45">
            <line x1="7" y1="17" x2="17" y2="7"></line>
            <polyline points="7 7 17 7 17 17"></polyline>
          </svg>
        </Link>
      </div>
      
    </div>
  );
}
