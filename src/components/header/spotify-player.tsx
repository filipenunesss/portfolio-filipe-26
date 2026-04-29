"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SPOTIFY_PLAYLIST_ID } from "@/lib/data";

export default function SpotifyPlayer({ open }: { open: boolean }) {
  const wrapRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!wrapRef.current) return;
    gsap.to(wrapRef.current, {
      height: open ? 152 : 0,
      marginBottom: open ? 12 : 0,
      duration: 0.4,
      ease: "power3.inOut",
    });
  }, [open]);

  return (
    <div ref={wrapRef} className="mx-3 h-0 mb-0 overflow-hidden">
      <iframe
        title="Spotify playlist"
        src={`https://open.spotify.com/embed/playlist/${SPOTIFY_PLAYLIST_ID}?utm_source=generator&theme=0`}
        width="100%"
        height="152"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        className="block border-0"
      />
    </div>
  );
}
