// A still band of stars at the top of every page except home (which has the full
// night sky), so the site feels like one place. Plain SVG, no JavaScript; the stars
// are seeded so every page and every build draws the same sky.

const W = 1440;
const H = 440;

function stars() {
  let s = 19;
  const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
  return Array.from({ length: 130 }, () => ({
    x: +(rnd() * W).toFixed(1),
    y: +(rnd() ** 1.6 * H).toFixed(1), // denser high up
    r: +(rnd() * 1.05 + 0.3).toFixed(2),
    o: +(rnd() * 0.55 + 0.25).toFixed(2),
  }));
}

const STARS = stars();

export function SkyStrip() {
  return (
    <div className="sky-strip" aria-hidden="true">
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMin slice">
        {STARS.map((star, i) => (
          <circle key={i} cx={star.x} cy={star.y} r={star.r} opacity={star.o} />
        ))}
      </svg>
    </div>
  );
}
