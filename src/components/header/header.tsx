"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Clock from "@/components/header/clock";
import Marquee from "@/components/header/marquee";
import SpotifyPlayer from "@/components/header/spotify-player";
import SpotifyIcon from "@/components/header/spotify-icon";
import EqBars from "@/components/header/eq-bars";

const UNLOCK_EVENTS = ["touchend", "click", "keydown"] as const;

export default function Header() {
  const headerRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [spotifyOpen, setSpotifyOpen] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.setAttribute("muted", "");

    const play = () => {
      if (!video.paused) return;
      video.play().catch(() => {});
    };

    const removeUnlock = () => {
      UNLOCK_EVENTS.forEach((e) => window.removeEventListener(e, play));
    };

    const onVisibility = () => {
      if (document.visibilityState === "visible") play();
    };

    UNLOCK_EVENTS.forEach((e) => window.addEventListener(e, play, { passive: true }));
    video.addEventListener("playing", removeUnlock);
    document.addEventListener("visibilitychange", onVisibility);
    play();

    return () => {
      removeUnlock();
      video.removeEventListener("playing", removeUnlock);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  useGSAP(() => {
    gsap.fromTo(
      headerRef.current,
      { y: -80, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
    );
  });

  return (
    <header ref={headerRef} className="shrink-0 opacity-0">
      <div className="bg-navbar overflow-hidden rounded-2xl">
        <div className="flex items-center gap-4 px-3 py-3 md:px-4">
          <div className="h-14 w-14 md:h-16 md:w-16 shrink-0 overflow-hidden rounded-xl">
            <video
              ref={videoRef}
              src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/memoji.mp4`}
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              className="h-full w-full object-cover mix-blend-screen"
            />
          </div>

          <div className="min-w-0 flex-1 overflow-hidden">
            <div className="flex items-center gap-3">
              <h1 className="text-sm md:text-base font-medium uppercase tracking-tight text-white">
                Filipe
              </h1>
              <Clock />
            </div>
            <Marquee />
          </div>

          <button
            type="button"
            onClick={() => setSpotifyOpen((v) => !v)}
            aria-label={spotifyOpen ? "Close Spotify player" : "Open Spotify player"}
            aria-expanded={spotifyOpen}
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
              spotifyOpen
                ? "bg-[#1DB954] shadow-[0_0_12px_rgba(29,185,84,0.4)]"
                : "bg-white/10 hover:bg-white/15"
            }`}
          >
            {spotifyOpen ? <EqBars /> : <SpotifyIcon />}
          </button>
        </div>

        <SpotifyPlayer open={spotifyOpen} />
      </div>
    </header>
  );
}
