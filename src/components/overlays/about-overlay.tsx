"use client";

import Overlay from "@/components/overlays/overlay";
import SectionList from "@/components/overlays/section-list";
import { ABOUT } from "@/lib/data";

type Props = { open: boolean; onClose: () => void };

export default function AboutOverlay({ open, onClose }: Props) {
  return (
    <Overlay open={open} onClose={onClose} title="About">
      <div className="space-y-8">
        {ABOUT.map((s) => (
          <SectionList key={s.title} section={s} />
        ))}
      </div>
    </Overlay>
  );
}
