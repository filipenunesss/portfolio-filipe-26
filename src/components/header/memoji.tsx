"use client";

import { useEffect, useRef, useState } from "react";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const FRAME_SIZE = 128;
const FRAME_COUNT = 248;
const COLUMNS = 16;
const FPS = 15;
const UNLOCK_EVENTS = ["touchend", "click", "keydown"] as const;

export default function Memoji() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [videoPlaying, setVideoPlaying] = useState(false);

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

    const onPlaying = () => {
      removeUnlock();
      setVideoPlaying(true);
    };

    const onVisibility = () => {
      if (document.visibilityState === "visible") play();
    };

    UNLOCK_EVENTS.forEach((e) => window.addEventListener(e, play, { passive: true }));
    video.addEventListener("playing", onPlaying);
    document.addEventListener("visibilitychange", onVisibility);
    play();

    return () => {
      removeUnlock();
      video.removeEventListener("playing", onPlaying);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  useEffect(() => {
    if (videoPlaying) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    const sprite = new Image();
    let rafId = 0;
    let start = 0;
    let lastFrame = -1;

    const draw = (time: number) => {
      if (!start) start = time;
      const frame = Math.floor(((time - start) / 1000) * FPS) % FRAME_COUNT;
      if (frame !== lastFrame) {
        lastFrame = frame;
        ctx.drawImage(
          sprite,
          (frame % COLUMNS) * FRAME_SIZE,
          Math.floor(frame / COLUMNS) * FRAME_SIZE,
          FRAME_SIZE,
          FRAME_SIZE,
          0,
          0,
          FRAME_SIZE,
          FRAME_SIZE,
        );
      }
      rafId = requestAnimationFrame(draw);
    };

    sprite.onload = () => {
      rafId = requestAnimationFrame(draw);
    };
    sprite.src = `${BASE_PATH}/memoji-sprite.webp`;

    return () => {
      cancelAnimationFrame(rafId);
      sprite.onload = null;
    };
  }, [videoPlaying]);

  return (
    <div className="relative h-full w-full">
      <video
        ref={videoRef}
        src={`${BASE_PATH}/memoji.mp4`}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        aria-hidden
        className={`absolute inset-0 h-full w-full object-cover mix-blend-screen ${
          videoPlaying ? "opacity-100" : "opacity-0"
        }`}
      />
      {!videoPlaying && (
        <canvas
          ref={canvasRef}
          width={FRAME_SIZE}
          height={FRAME_SIZE}
          role="img"
          aria-label="Filipe memoji"
          className="absolute inset-0 h-full w-full mix-blend-screen"
        />
      )}
    </div>
  );
}
