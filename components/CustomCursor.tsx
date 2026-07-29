"use client";

import React, { useEffect, useState, useRef } from "react";
import { gsap } from "gsap";

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [isPointerFine, setIsPointerFine] = useState(false);

  const mouseRef = useRef({ x: -100, y: -100 });
  const posRef = useRef({ x: -100, y: -100 });

  useEffect(() => {
    // Only activate custom cursor on fine pointer devices (desktop mouse/trackpad)
    const mediaQuery = window.matchMedia("(pointer: fine)");
    const checkPointer = () => setIsPointerFine(mediaQuery.matches);
    checkPointer();

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", checkPointer);
    } else {
      mediaQuery.addListener(checkPointer);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", checkPointer);
      }
    };
  }, []);

  useEffect(() => {
    if (!isPointerFine) return;

    const cursor = cursorRef.current;
    if (!cursor) return;

    // Zero-latency GSAP position setters
    const setX = gsap.quickSetter(cursor, "x", "px");
    const setY = gsap.quickSetter(cursor, "y", "px");

    const handlePointerMove = (e: PointerEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;

      if (!isVisible) setIsVisible(true);
    };

    const handlePointerDown = () => setIsPressed(true);
    const handlePointerUp = () => setIsPressed(false);
    const handlePointerLeave = () => setIsVisible(false);
    const handlePointerEnter = () => setIsVisible(true);

    // Hide custom cursor when hovering over interactive buttons/links
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactiveEl = target.closest<HTMLElement>(
        'button, a, [role="button"], input, select, textarea, .cursor-pointer, [data-cursor]'
      );

      if (interactiveEl) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointerup", handlePointerUp);
    document.addEventListener("mouseleave", handlePointerLeave);
    document.addEventListener("mouseenter", handlePointerEnter);
    window.addEventListener("mouseover", handleMouseOver, { passive: true });

    let animationFrameId: number;

    const render = () => {
      // Smooth lerp physics
      posRef.current.x += (mouseRef.current.x - posRef.current.x) * 0.22;
      posRef.current.y += (mouseRef.current.y - posRef.current.y) * 0.22;

      setX(posRef.current.x);
      setY(posRef.current.y);

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerup", handlePointerUp);
      document.removeEventListener("mouseleave", handlePointerLeave);
      document.removeEventListener("mouseenter", handlePointerEnter);
      window.removeEventListener("mouseover", handleMouseOver);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPointerFine, isVisible]);

  if (!isPointerFine) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden select-none">
      {/* 
        Default State: Solid White Circle with White Border & Glow
        Button Hover State: Custom cursor hides smoothly so the button's white border highlight shines through
      */}
      <div
        ref={cursorRef}
        className={`fixed top-0 left-0 w-5 h-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white border border-white shadow-[0_0_15px_rgba(255,255,255,0.85)] transition-[opacity,transform] duration-200 ease-out will-change-transform ${
          isVisible ? "opacity-100" : "opacity-0 scale-50"
        } ${isPressed ? "scale-75" : isHovered ? "scale-125" : "scale-100"}`}
      />
    </div>
  );
}
