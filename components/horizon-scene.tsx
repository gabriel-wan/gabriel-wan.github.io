"use client";

import { useEffect, useRef } from "react";

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

type Star = { x: number; y: number; r: number; a: number; speed: number; phase: number };

const clamp = (v: number) => Math.min(1, Math.max(0, v));

export function HorizonScene() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const scene = sceneRef.current;
    const canvas = canvasRef.current;
    const hero = scene?.parentElement;
    const ctx = canvas?.getContext("2d");
    if (!scene || !canvas || !hero || !ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let stars: Star[] = [];
    let width = 0;
    let height = 0;
    let frame = 0;
    let shooting: { x: number; y: number; vx: number; vy: number; life: number } | null = null;
    let nextShot = performance.now() + 4000;

    function size() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      // Phones resize the viewport as the address bar hides; only redraw the stars
      // when the width changes, so they don't jump around.
      const w = canvas!.clientWidth;
      if (w === width && stars.length) return;
      width = w;
      height = canvas!.clientHeight;
      canvas!.width = Math.round(width * dpr);
      canvas!.height = Math.round(height * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round((width * height) / 5200);
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() ** 1.6 * height * 0.85, // denser high up, thinning towards the horizon
        r: Math.random() * 1.1 + 0.25,
        a: Math.random() * 0.6 + 0.25,
        speed: Math.random() * 1.4 + 0.4,
        phase: Math.random() * Math.PI * 2,
      }));
    }

    function draw(t: number) {
      ctx!.clearRect(0, 0, width, height);
      const drift = reduce ? 0 : (t / 1000) * 3; // the sky turns a few pixels a second
      ctx!.fillStyle = "#e4e8ec";
      for (const s of stars) {
        const twinkle = reduce ? 1 : 0.65 + 0.35 * Math.sin((t / 1000) * s.speed + s.phase);
        ctx!.globalAlpha = s.a * twinkle;
        ctx!.beginPath();
        ctx!.arc((s.x + drift) % width, s.y, s.r, 0, Math.PI * 2);
        ctx!.fill();
      }
      if (!reduce) {
        if (!shooting && t > nextShot) {
          shooting = { x: Math.random() * width * 0.6 + width * 0.2, y: Math.random() * height * 0.25, vx: -6 - Math.random() * 3, vy: 2.2 + Math.random(), life: 1 };
          nextShot = t + 7000 + Math.random() * 7000;
        }
        if (shooting) {
          const s = shooting;
          const grad = ctx!.createLinearGradient(s.x, s.y, s.x - s.vx * 14, s.y - s.vy * 14);
          grad.addColorStop(0, "rgba(228,232,236,0.9)");
          grad.addColorStop(1, "rgba(228,232,236,0)");
          ctx!.globalAlpha = s.life;
          ctx!.strokeStyle = grad;
          ctx!.lineWidth = 1.2;
          ctx!.beginPath();
          ctx!.moveTo(s.x, s.y);
          ctx!.lineTo(s.x - s.vx * 14, s.y - s.vy * 14);
          ctx!.stroke();
          s.x += s.vx;
          s.y += s.vy;
          s.life -= 0.018;
          if (s.life <= 0) shooting = null;
        }
      }
      ctx!.globalAlpha = 1;
    }

    function loop(t: number) {
      draw(t);
      frame = requestAnimationFrame(loop);
    }

    function onScroll() {
      const vh = window.innerHeight;
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - vh;
      scene!.style.setProperty("--hero", clamp(y / (vh * 0.8)).toFixed(4));
      scene!.style.setProperty("--dawn", (max > 0 ? clamp(1 - (max - y) / (vh * 0.4)) : 0).toFixed(4));
      hero!.style.setProperty("--hp", clamp(y / hero!.offsetHeight).toFixed(4));
    }

    size();
    if (reduce) {
      draw(0);
    } else {
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
      frame = requestAnimationFrame(loop);
    }

    const onResize = () => {
      size();
      if (reduce) draw(0);
      else onScroll();
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
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
