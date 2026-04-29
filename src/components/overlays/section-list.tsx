import type { Section } from "@/lib/data";

export default function SectionList({ section }: { section: Section }) {
  return (
    <div>
      <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-black/70">
        {section.title}
      </h4>
      <ul className="space-y-4">
        {section.items.map((item, i) => (
          <li
            key={i}
            className="flex gap-3 text-sm leading-relaxed text-black/50"
          >
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-black/30" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
