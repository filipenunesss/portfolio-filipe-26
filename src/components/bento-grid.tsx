"use client";

import { useRef } from "react";
import gsap from "gsap";
import { TextPlugin } from "gsap/dist/TextPlugin";
import { useGSAP } from "@gsap/react";
import { CARDS } from "@/lib/data";

gsap.registerPlugin(TextPlugin);

type Props = {
  onWorkClick: () => void;
  onAboutClick: () => void;
};

const CARD_CLASS =
  "bento-card group relative flex items-end overflow-hidden rounded-2xl border border-black/[0.03] bg-black/[0.015] p-4 md:p-6 opacity-0 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] backdrop-blur-sm transition-all duration-300 hover:bg-black/[0.03]";

const LABEL_CLASS =
  "card-label z-10 text-sm md:text-base font-medium text-foreground";

export default function BentoGrid({ onWorkClick, onAboutClick }: Props) {
  const gridRef = useRef<HTMLDivElement>(null);
  const actions = { work: onWorkClick, about: onAboutClick };

  useGSAP(
    () => {
      const cards = gridRef.current?.querySelectorAll(".bento-card");
      if (!cards?.length) return;

      gsap.fromTo(
        cards,
        { y: 80, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.06,
          delay: 0.15,
        },
      );

      const labels = gridRef.current?.querySelectorAll(".card-label");
      labels?.forEach((label, i) => {
        const text = CARDS[i].label;
        gsap
          .timeline({ repeat: -1, delay: 0.8 + i * 0.06 })
          .to(label, {
            text: { value: text },
            duration: text.length * 0.08,
            ease: "none",
          })
          .to(label, {
            text: { value: "" },
            duration: text.length * 0.05,
            ease: "none",
            delay: 5,
          });
      });
    },
    { scope: gridRef },
  );

  return (
    <div ref={gridRef} className="min-h-0 flex-1">
      <div className="bento-grid">
        {CARDS.map((card) => {
          const style = { gridArea: card.area };

          if (card.type === "action") {
            return (
              <button
                key={card.label}
                type="button"
                onClick={actions[card.action]}
                style={style}
                className={`${CARD_CLASS} text-left`}
              >
                <span className={LABEL_CLASS} />
              </button>
            );
          }

          return (
            <a
              key={card.label}
              href={card.href}
              target="_blank"
              rel="noopener noreferrer"
              style={style}
              className={CARD_CLASS}
            >
              <span className={LABEL_CLASS} />
            </a>
          );
        })}
      </div>
    </div>
  );
}
