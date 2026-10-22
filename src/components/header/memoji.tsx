"use client";

import { useEffect, useRef, useState } from "react";
import { parseMp4 } from "@/lib/mp4";

const VIDEO_SRC = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/memoji.mp4`;
const MAX_QUEUE = 6;
const RESYNC_THRESHOLD = 500_000;
const UNLOCK_EVENTS = ["touchend", "click", "keydown"] as const;

export default function Memoji() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx || typeof VideoDecoder === "undefined") {
      setFallback(true);
      return;
    }

    const frames: VideoFrame[] = [];
    let decoder: VideoDecoder | null = null;
    let cancelled = false;
    let rafId = 0;

    const fail = () => {
      if (!cancelled) setFallback(true);
    };

    (async () => {
      const buffer = await fetch(VIDEO_SRC).then((res) => res.arrayBuffer());
      if (cancelled) return;

      const track = parseMp4(buffer);
      const config: VideoDecoderConfig = {
        codec: track.codec,
        description: track.description,
        codedWidth: track.width,
        codedHeight: track.height,
        optimizeForLatency: true,
      };
      const { supported } = await VideoDecoder.isConfigSupported(config);
      if (!supported) throw new Error("codec not supported");
      if (cancelled) return;

      canvas.width = track.width;
      canvas.height = track.height;

      const videoDecoder = new VideoDecoder({
        output: (frame) => {
          if (cancelled) frame.close();
          else frames.push(frame);
        },
        error: fail,
      });
      videoDecoder.configure(config);
      decoder = videoDecoder;

      let next = 0;
      let loop = 0;

      const feed = () => {
        while (
          videoDecoder.state === "configured" &&
          frames.length + videoDecoder.decodeQueueSize < MAX_QUEUE
        ) {
          const sample = track.samples[next];
          videoDecoder.decode(
            new EncodedVideoChunk({
              type: sample.key ? "key" : "delta",
              timestamp: loop * track.duration + sample.timestamp,
              duration: sample.duration,
              data: new Uint8Array(buffer, sample.offset, sample.size),
            }),
          );
          next += 1;
          if (next === track.samples.length) {
            next = 0;
            loop += 1;
          }
        }
      };

      let start = -1;
      let drawn: VideoFrame | null = null;

      const render = (now: number) => {
        const nowMicros = now * 1000;
        if (frames.length) {
          if (start < 0 || nowMicros - start - frames[0].timestamp > RESYNC_THRESHOLD) {
            start = nowMicros - frames[0].timestamp;
          }
          const time = nowMicros - start;
          while (frames.length > 1 && frames[1].timestamp <= time) frames.shift()!.close();
          if (frames[0] !== drawn) {
            drawn = frames[0];
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(drawn, 0, 0, canvas.width, canvas.height);
          }
        }
        feed();
        rafId = requestAnimationFrame(render);
      };

      videoDecoder.addEventListener("dequeue", feed);
      feed();
      rafId = requestAnimationFrame(render);
    })().catch(fail);

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
      frames.forEach((frame) => frame.close());
      frames.length = 0;
      if (decoder && decoder.state !== "closed") decoder.close();
    };
  }, []);

  if (fallback) return <MemojiVideo />;

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label="Filipe memoji"
      className="h-full w-full mix-blend-screen"
    />
  );
}

function MemojiVideo() {
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

    UNLOCK_EVENTS.forEach((e) => window.addEventListener(e, play, { passive: true }));
    video.addEventListener("playing", removeUnlock);
    play();

    return () => {
      removeUnlock();
      video.removeEventListener("playing", removeUnlock);
    };
  }, []);

  return (
    <video
      ref={videoRef}
      src={`${VIDEO_SRC}#t=0.001`}
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
