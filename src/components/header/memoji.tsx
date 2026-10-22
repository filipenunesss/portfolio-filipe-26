"use client";

import { useEffect, useRef, useState } from "react";
import { preload } from "react-dom";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const VIDEO_SRC = `${BASE_PATH}/memoji.mp4`;
const POSTER_SRC = `${BASE_PATH}/memoji-poster.webp`;
const SPRITE_SRC = `${BASE_PATH}/memoji-sprite.webp`;
const FRAME_SIZE = 128;
const FRAME_COUNT = 248;
const COLUMNS = 16;
const FPS = 15;
const FALLBACK_DELAY = 1200;
const UNLOCK_EVENTS = ["touchend", "click", "keydown"] as const;

export default function Memoji() {
  preload(POSTER_SRC, { as: "image", fetchPriority: "high" });

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [useSprite, setUseSprite] = useState(false);
  const [spriteReady, setSpriteReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.setAttribute("muted", "");

    const fallbackTimer = window.setTimeout(() => setUseSprite(true), FALLBACK_DELAY);

    const play = () => {
      if (video.paused) video.play().catch(() => setUseSprite(true));
    };

    const removeUnlock = () => {
      UNLOCK_EVENTS.forEach((e) => window.removeEventListener(e, play));
    };

    const onPlaying = () => {
      window.clearTimeout(fallbackTimer);
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
      window.clearTimeout(fallbackTimer);
      removeUnlock();
      video.removeEventListener("playing", onPlaying);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  const showSprite = useSprite && !videoPlaying;

  useEffect(() => {
    if (!showSprite) return;
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
        ctx.clearRect(0, 0, FRAME_SIZE, FRAME_SIZE);
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
      setSpriteReady(true);
    };
    sprite.src = SPRITE_SRC;

    return () => {
      cancelAnimationFrame(rafId);
      sprite.onload = null;
    };
  }, [showSprite]);

  const spriteVisible = showSprite && spriteReady;

  return (
    <div className="relative h-full w-full">
      <video
        ref={videoRef}
        src={VIDEO_SRC}
        poster={POSTER_SRC}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        aria-hidden
        className={`absolute inset-0 h-full w-full object-cover mix-blend-screen ${
          spriteVisible ? "opacity-0" : "opacity-100"
        }`}
      />
      {showSprite && (
        <canvas
          ref={canvasRef}
          width={FRAME_SIZE}
          height={FRAME_SIZE}
          aria-hidden
          className={`absolute inset-0 h-full w-full mix-blend-screen ${
            spriteVisible ? "opacity-100" : "opacity-0"
          }`}
        />
      )}
      <span className="sr-only">Filipe memoji</span>
    </div>
  );
}
