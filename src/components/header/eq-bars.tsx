const BAR_CLASS = "w-[3px] rounded-full bg-white";

export default function EqBars() {
  return (
    <div className="flex items-end gap-[3px] h-[14px]">
      <span className={BAR_CLASS} style={{ animation: "eq-1 0.6s ease-in-out infinite" }} />
      <span className={BAR_CLASS} style={{ animation: "eq-2 0.7s ease-in-out infinite" }} />
      <span className={BAR_CLASS} style={{ animation: "eq-3 0.5s ease-in-out infinite" }} />
      <span className={BAR_CLASS} style={{ animation: "eq-4 0.8s ease-in-out infinite" }} />
    </div>
  );
}
