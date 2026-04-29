"use client";

import { useState } from "react";
import Cursor from "@/components/cursor";
import Header from "@/components/header/header";
import BentoGrid from "@/components/bento-grid";
import WorkOverlay from "@/components/overlays/work-overlay";
import AboutOverlay from "@/components/overlays/about-overlay";

export default function Home() {
  const [workOpen, setWorkOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);

  return (
    <div className="flex h-screen flex-col overflow-hidden p-3 md:p-4">
      <Cursor />
      <div className="flex flex-1 flex-col gap-3 md:gap-4">
        <Header />
        <BentoGrid
          onWorkClick={() => setWorkOpen(true)}
          onAboutClick={() => setAboutOpen(true)}
        />
      </div>
      <WorkOverlay  open={workOpen}  onClose={() => setWorkOpen(false)} />
      <AboutOverlay open={aboutOpen} onClose={() => setAboutOpen(false)} />
    </div>
  );
}
