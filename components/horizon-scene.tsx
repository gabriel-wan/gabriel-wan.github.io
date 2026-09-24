"use client";

import { useEffect, useRef } from "react";
import { startStars } from "@/components/stars";

// The night sky behind the whole home page, after 21st.dev's "Horizon Hero Section"
// but without three.js. It stays fixed behind the page and changes as you scroll:
// at the top it's the full night scene; while you read, the mountains sink and the
// glow dims (--hero); as you reach the footer the sky warms and a sun rises (--dawn).
// With reduced motion the stars are drawn once and the scene stays as it is.

const W = 1440;
const H = 320;

// Deterministic ridge line, so the server and the browser draw the same mountains.
function ridge(seed: number, base: number, amp: number, rough: number) {
  let s = seed;
  const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
  const ph = [rnd(), rnd(), rnd()].map((v) => v * Math.PI * 2);
  const pts: string[] = [];
  for (let x = 0; x <= W; x += 12) {
    const t = x / W;
    const y =
      base -
      amp * (0.55 * Math.sin(t * 2.1 * Math.PI + ph[0]) + 0.3 * Math.sin(t * 5.3 * Math.PI + ph[1]) + 0.15 * Math.sin(t * 11.7 * Math.PI + ph[2])) -
      rough * (rnd() - 0.5);
    pts.push(`${x} ${y.toFixed(1)}`);
  }
  return `M0 ${H} L${pts.join(" L")} L${W} ${H} Z`;
}

const RIDGES = [
  { className: "ridge ridge-back", d: ridge(11, 150, 70, 7) },
  { className: "ridge ridge-mid", d: ridge(29, 205, 55, 5) },
  { className: "ridge ridge-front", d: ridge(47, 262, 38, 4) },
];

const clamp = (v: number) => Math.min(1, Math.max(0, v));

export function HorizonScene() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const scene = sceneRef.current;
    const canvas = canvasRef.current;
    const hero = scene?.parentElement;
    if (!scene || !canvas || !hero) return;

    const stopStars = startStars(canvas, { density: 2600, sky: true });
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return stopStars;

    function onScroll() {
      const vh = window.innerHeight;
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - vh;
      scene!.style.setProperty("--hero", clamp(y / (vh * 0.8)).toFixed(4));
      scene!.style.setProperty("--dawn", (max > 0 ? clamp(1 - (max - y) / (vh * 0.4)) : 0).toFixed(4));
      hero!.style.setProperty("--hp", clamp(y / hero!.offsetHeight).toFixed(4));
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      stopStars();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div ref={sceneRef} className="horizon-scene" aria-hidden="true">
      <canvas ref={canvasRef} className="horizon-stars" />
      <div className="horizon-dawn" />
      <div className="horizon-glow" />
      <div className="horizon-sun" />
      <div className="horizon-ridges">
        {RIDGES.map((r) => (
          <svg key={r.className} className={r.className} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMax slice">
            <path d={r.d} />
          </svg>
        ))}
      </div>
    </div>
  );
}
