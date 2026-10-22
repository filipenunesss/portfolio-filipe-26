"use client";

import { useEffect, useRef } from "react";

const VIDEO_SRC = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/memoji.mp4#t=0.001`;
const UNLOCK_EVENTS = ["touchend", "click", "keydown"] as const;

export default function Memoji() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.setAttribute("muted", "");

    const play = () => {
      if (video.paused) video.play().catch(() => {});
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

  return (
    <video
      ref={videoRef}
      src={VIDEO_SRC}
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
      aria-label="Filipe memoji"
      className="h-full w-full object-cover mix-blend-screen"
    />
  );
}
