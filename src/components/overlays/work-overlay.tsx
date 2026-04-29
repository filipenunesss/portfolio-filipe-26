"use client";

import Overlay from "@/components/overlays/overlay";
import SectionList from "@/components/overlays/section-list";
import { WORK } from "@/lib/data";

type Props = { open: boolean; onClose: () => void };

export default function WorkOverlay({ open, onClose }: Props) {
  return (
    <Overlay open={open} onClose={onClose} title="Work">
      <div className="w-full">
        <div className="mb-1 flex flex-col gap-3 sm:flex-row sm:items-center">
          <h3 className="text-2xl md:text-3xl font-bold text-black">
            {WORK.company}
          </h3>
          <span className="inline-block rounded-full border border-black/15 px-4 py-2 text-center text-xs text-black/50">
            {WORK.period}
          </span>
        </div>
        <p className="mb-6 mt-3 font-bold">{WORK.role}</p>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12">
          {WORK.sections.map((s) => (
            <SectionList key={s.title} section={s} />
          ))}
        </div>
      </div>
    </Overlay>
  );
}
