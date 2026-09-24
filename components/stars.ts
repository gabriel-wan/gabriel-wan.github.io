// Twinkling stars on a canvas, shared by the home sky (horizon-scene.tsx) and the
// starfield on every other page (starfield.tsx). Stars twinkle, the sky drifts a
// few pixels a second, and now and then a shooting star crosses. With reduced
// motion they're drawn once and stay still. Returns a function that stops it.

type Star = { x: number; y: number; r: number; a: number; speed: number; phase: number };

export function startStars(
  canvas: HTMLCanvasElement,
  { density, sky }: { density: number; sky: boolean }, // px² of canvas per star; sky: thin out towards a horizon
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return () => {};
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let stars: Star[] = [];
  let width = 0;
  let height = 0;
  let frame = 0;
  let shooting: { x: number; y: number; vx: number; vy: number; life: number } | null = null;
  let nextShot = performance.now() + 4000;

  function size() {
    // Phones resize the viewport as the address bar hides; only redraw the stars
    // when the width changes, so they don't jump around.
    const w = canvas.clientWidth;
    if (w === width && stars.length) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = w;
    height = canvas.clientHeight;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    stars = Array.from({ length: Math.round((width * height) / density) }, () => ({
      x: Math.random() * width,
      y: sky ? Math.random() ** 1.6 * height * 0.85 : Math.random() * height,
      r: Math.random() * 1.1 + 0.25,
      a: Math.random() * 0.6 + 0.25,
      speed: Math.random() * 1.4 + 0.4,
      phase: Math.random() * Math.PI * 2,
    }));
  }

  function draw(t: number) {
    ctx!.clearRect(0, 0, width, height);
    const drift = reduce ? 0 : (t / 1000) * 3;
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

  size();
  if (reduce) draw(0);
  else frame = requestAnimationFrame(loop);

  const onResize = () => {
    size();
    if (reduce) draw(0);
  };
  window.addEventListener("resize", onResize);

  return () => {
    cancelAnimationFrame(frame);
    window.removeEventListener("resize", onResize);
  };
}
