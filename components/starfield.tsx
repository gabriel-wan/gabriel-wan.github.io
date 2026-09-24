"use client";

import { useEffect, useRef } from "react";
import { startStars } from "@/components/stars";

// Twinkling stars fixed behind every page except home (which has the full night
// sky), so the whole site feels like one place. Fewer stars than home, so text
// stays easy to read.
export function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => (canvasRef.current ? startStars(canvasRef.current, { density: 4200, sky: false }) : undefined), []);
  return (
    <div className="starfield" aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  );
}
