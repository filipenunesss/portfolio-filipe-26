"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SKILLS } from "@/lib/data";

const TEXT = SKILLS.join(" — ") + " — ";
const COPIES = 3;
const PIXELS_PER_SECOND = 60;

export default function Marquee() {
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const track = trackRef.current;
    if (!track) return;
    const first = track.firstElementChild as HTMLElement | null;
    if (!first) return;
    const w = first.offsetWidth;
    gsap.fromTo(
      track,
      { x: 0 },
      { x: -w, duration: w / PIXELS_PER_SECOND, ease: "none", repeat: -1 },
    );
  });

  return (
    <div
      className="relative mt-0.5 overflow-hidden"
      style={{
        maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
        WebkitMaskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
      }}
    >
      <div ref={trackRef} className="flex whitespace-nowrap will-change-transform">
        {Array.from({ length: COPIES }).map((_, i) => (
          <span
            key={i}
            className="text-xs font-bold uppercase tracking-widest text-white/80"
          >
            {TEXT}
          </span>
        ))}
      </div>
    </div>
  );
}
