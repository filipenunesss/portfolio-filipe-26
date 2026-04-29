"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const move = (e: MouseEvent) => {
      gsap.to(dot,  { x: e.clientX, y: e.clientY, duration: 0.1 });
      gsap.to(ring, { x: e.clientX, y: e.clientY, duration: 0.3 });
    };

    const isInteractive = (target: EventTarget | null) =>
      target instanceof Element && !!target.closest("a, button");

    const enter = (e: MouseEvent) => {
      if (!isInteractive(e.target)) return;
      gsap.to(dot,  { scale: 0,   duration: 0.2 });
      gsap.to(ring, { scale: 2.5, opacity: 0.5, duration: 0.3 });
    };

    const leave = (e: MouseEvent) => {
      if (!isInteractive(e.target)) return;
      gsap.to(dot,  { scale: 1, duration: 0.2 });
      gsap.to(ring, { scale: 1, opacity: 1, duration: 0.3 });
    };

    window.addEventListener("mousemove", move);
    document.addEventListener("mouseover", enter);
    document.addEventListener("mouseout",  leave);
    return () => {
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseover", enter);
      document.removeEventListener("mouseout",  leave);
    };
  }, []);

  const base =
    "fixed top-0 left-0 pointer-events-none -translate-x-1/2 -translate-y-1/2 mix-blend-difference hidden md:block";

  return (
    <>
      <div
        ref={dotRef}
        className={`${base} w-2 h-2 rounded-full bg-white z-[999]`}
      />
      <div
        ref={ringRef}
        className={`${base} w-8 h-8 rounded-full border border-white/40 z-[998]`}
      />
    </>
  );
}
