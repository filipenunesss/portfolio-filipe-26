"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useLenis } from "@/lib/lenis";

type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
};

export default function Overlay({ open, onClose, title, children }: Props) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();

  useGSAP(() => {
    if (!overlayRef.current) return;
    if (open) {
      gsap.fromTo(
        overlayRef.current,
        { y: "100%" },
        { y: 0, duration: 0.6, ease: "power3.out" },
      );
    } else {
      gsap.to(overlayRef.current, {
        y: "100%",
        duration: 0.4,
        ease: "power3.in",
      });
    }
  }, [open]);

  useEffect(() => {
    if (open) {
      lenis.stop();
      document.body.style.overflow = "hidden";
      if (scrollRef.current) scrollRef.current.scrollTop = 0;
    } else {
      document.body.style.overflow = "";
      lenis.start();
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open, lenis]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 top-16 z-40 translate-y-full touch-none"
    >
      <div className="flex h-full flex-col bg-white shadow-[0_-4px_30px_rgba(0,0,0,0.1)]">
        <div className="flex shrink-0 items-center justify-between border-b border-black/[0.06] px-6 md:px-10 py-6">
          <h2 className="text-xl md:text-2xl font-bold uppercase tracking-tight">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={`Close ${title}`}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-black/[0.04] transition-colors hover:bg-black/[0.08]"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              aria-hidden
            >
              <path d="M1 1l12 12M13 1L1 13" />
            </svg>
          </button>
        </div>

        <div
          ref={scrollRef}
          className="flex-1 overflow-y-scroll overscroll-contain touch-pan-y px-6 md:px-10 py-10"
        >
          {children}
        </div>
      </div>
    </div>
  );
}
