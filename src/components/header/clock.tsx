"use client";

import { useEffect, useState } from "react";

const FORMATTER = new Intl.DateTimeFormat("pt-BR", {
  timeZone: "America/Sao_Paulo",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
});

export default function Clock() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const tick = () => setTime(FORMATTER.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="text-sm md:text-base font-medium text-white/30 tabular-nums">
      {time}
    </span>
  );
}
