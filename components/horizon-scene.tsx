"use client";

import { useEffect, useRef } from "react";

// A night sky behind the home headline, after 21st.dev's "Horizon Hero Section" but
// without three.js: twinkling stars on a canvas, a glow on the horizon, and three
// mountain ridges that move at different speeds as you scroll (--p on the section).
// With reduced motion the stars are drawn once and nothing moves.

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

export function HorizonScene() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const scene = sceneRef.current;
    const canvas = canvasRef.current;
    const section = scene?.parentElement;
    const ctx = canvas?.getContext("2d");
    if (!scene || !canvas || !section || !ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let stars: Star[] = [];
    let width = 0;
    let height = 0;
    let dpr = 1;
    let running = false;
    let frame = 0;
    let shooting: { x: number; y: number; vx: number; vy: number; life: number } | null = null;
    let nextShot = performance.now() + 4000;

    function size() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas!.clientWidth;
      height = canvas!.clientHeight;
      canvas!.width = Math.round(width * dpr);
      canvas!.height = Math.round(height * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round((width * height) / 5200);
      stars = Array.from({ length: count }, () => {
        const y = Math.random() ** 1.6 * height * 0.8; // denser high up, thinning towards the horizon
        return { x: Math.random() * width, y, r: Math.random() * 1.1 + 0.25, a: Math.random() * 0.6 + 0.25, speed: Math.random() * 1.4 + 0.4, phase: Math.random() * Math.PI * 2 };
      });
    }

    function draw(t: number) {
      ctx!.clearRect(0, 0, width, height);
      const drift = reduce ? 0 : (t / 1000) * 3; // the sky turns a few pixels a second
      for (const s of stars) {
        const twinkle = reduce ? 1 : 0.65 + 0.35 * Math.sin((t / 1000) * s.speed + s.phase);
        const x = (s.x + drift) % width;
        ctx!.globalAlpha = s.a * twinkle;
        ctx!.fillStyle = "#e4e8ec";
        ctx!.beginPath();
        ctx!.arc(x, s.y, s.r, 0, Math.PI * 2);
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
      if (running) frame = requestAnimationFrame(loop);
    }

    // Scroll progress through the hero: 0 at the top, 1 once it has scrolled away.
    function onScroll() {
      const p = Math.min(1, Math.max(0, window.scrollY / section!.offsetHeight));
      section!.style.setProperty("--p", p.toFixed(4));
    }

    size();
    if (reduce) {
      draw(0);
    } else {
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
    }

    // Only animate while the sky is on screen.
    const observer = new IntersectionObserver(([entry]) => {
      if (reduce) return;
      if (entry.isIntersecting && !running) {
        running = true;
        frame = requestAnimationFrame(loop);
      } else if (!entry.isIntersecting) {
        running = false;
        cancelAnimationFrame(frame);
      }
    });
    observer.observe(scene);

    const onResize = () => {
      size();
      if (reduce) draw(0);
    };
    window.addEventListener("resize", onResize);

    return () => {
      running = false;
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div ref={sceneRef} className="horizon-scene" aria-hidden="true">
      <canvas ref={canvasRef} className="horizon-stars" />
      <div className="horizon-glow" />
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
