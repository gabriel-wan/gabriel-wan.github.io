import { pageMeta } from "@/lib/metadata";
import { ShimmerLink } from "@/components/ui/shimmer-button";
import { StarField } from "@/components/starfield";
import { Reveal } from "@/components/reveal";
import { ProjectPager } from "@/components/pager";

export const metadata = pageMeta({
  "title": "UWash — Gabriel Wan",
  "description": "An IoT laundry system for NUS residences with ESP32 vibration sensors, a Flask backend and a Telegram bot. Top 8 at the NUS Student Life Hackathon 2026.",
  "path": "/projects/uwash",
  "image": "/videos/uwash.jpg",
  "ogTitle": "UWash: laundry machines that report when they're running",
  "type": "article"
});

export default function Page() {
  return (
    <>
    <StarField />
    <article>
      <header className="col page-head">
        <p className="crumb"><a href="/projects">Projects</a></p>
        <Reveal as="h1">UWash</Reveal>
        <Reveal as="p" className="dek">CAPT's laundry bot only knew a machine was running if someone told it. We put vibration sensors on the machines so they report it themselves, and made the top 8 at the NUS Student Life Hackathon 2026.</Reveal>
        <p className="dateline">Mar 2026 · NUS Student Life Hackathon, top 8</p>
        <div className="actions">
          <ShimmerLink background="#151e28" shimmerColor="#d6ebff" shimmerSize="2px" className="shim gap-1.5 px-3.5 py-1.5 text-[13px] font-medium border-white/25" href="https://drive.google.com/file/d/1ZUDJiysRXRrE5yWQg5wfWzUAJ6YI6aZ9/view">Watch the demo<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 16 16 8M9 8h7v7" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg></ShimmerLink>
          <ShimmerLink background="#151e28" shimmerColor="#d6ebff" shimmerSize="2px" className="shim gap-1.5 px-3.5 py-1.5 text-[13px] font-medium border-white/25" href="https://github.com/gabriel-wan/uwash-bot">Code on GitHub<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 16 16 8M9 8h7v7" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg></ShimmerLink>
        </div>
        <figure className="wide artifact shot">
          <img src="/images/uwash.jpg" alt="UWash dashboard analytics: an hourly usage chart with morning and evening peaks, and tiles for idle time, unregistered use, shared loads and water saved" width="1465" height="739" />
          <figcaption>The dashboard's analytics view, with demo data.</figcaption>
        </figure>
      </header>

      <section className="col sec" id="why">
        <Reveal as="h2">Why we built it</Reveal>
        <p>CAPT already had a Telegram laundry bot, built by earlier students. You picked a machine and started a timer, and the bot reminded you when your wash was done. But it only knew what people told it, so if someone didn't start a timer, the machine looked free when it wasn't, and you'd only find out after walking all the way to the laundry room. We mostly wanted to save people those wasted trips.</p>
      </section>

      <section className="col sec" id="built">
        <Reveal as="h2">What we built</Reveal>
        <div className="flows">
          <p className="flow-label">From the machine</p>
          <ol className="flow">
            <li>ESP32 + vibration sensor</li>
            <li>HTTPS with an API key</li>
            <li>Flask API</li>
            <li>SQLite</li>
          </ol>
          <p className="flow-label">To residents</p>
          <ol className="flow">
            <li>SQLite</li>
            <li>Flask API</li>
            <li>React dashboard</li>
          </ol>
          <ol className="flow">
            <li>SQLite</li>
            <li>Telegram bot</li>
            <li>A ping when your wash is done</li>
          </ol>
        </div>
        <p>A small ESP32 board with an SW-420 vibration sensor sits on each machine and tells the backend when the machine starts and stops. The dashboard shows every washer and dryer in your house as free, in use (with who's using it and how long is left), running with nobody registered, or done but not collected yet. It covers six colleges and 31 houses, each with its own machines.</p>
        <p>I worked on the backend: the Flask API that the sensors and the dashboard talk to, moving storage from JSON files to SQLite, the queue, and deploying it all on Railway. A teammate built the dashboard, and I connected it to the API.</p>
      </section>

      <section className="col sec" id="machines">
        <Reveal as="h2">What a machine's status means</Reveal>
        <p>The sensor knows a machine is shaking, but not how long its cycle will be. So when a sensor reports a machine running, the backend gives it a two-hour ceiling, and it shows as free again as soon as the sensor says it has stopped. If nobody started a timer for that run, the dashboard shows it as running with no user registered, rather than as free, which was exactly the gap in the old bot.</p>
        <p>When a cycle you registered ends, the machine stays marked as yours until you tap Done to say you've collected your laundry. Loads that are finished but not collected show up in a public banner at the top of the dashboard, as a gentle nudge.</p>
      </section>

      <section className="col sec" id="queue">
        <Reveal as="h2">The queue</Reveal>
        <p>If the machines are busy, you can join a queue for your house's washers or dryers. It's first come, first served, joining twice does nothing, and the dashboard estimates your wait from your place in line. When someone marks their laundry as collected, the machine goes straight to the next person in the queue.</p>
      </section>

      <section className="col sec" id="decisions">
        <Reveal as="h2">Decisions</Reveal>
        <h3>Sensing vibration</h3>
        <p>A vibration sensor can tell a cycle is running without touching the machine's electronics, so it can be fitted and removed without opening anything up.</p>
        <h3>Building on the existing bot</h3>
        <p>We forked the laundry bot that already existed and added the sensor side to it, instead of starting over and asking people to learn a new tool. The original is by <a href="https://github.com/jloh02">jloh02</a> and <a href="https://github.com/zzibo">zibo</a>.</p>
        <h3>A key for the sensors</h3>
        <p>The endpoint the sensors use to report a machine running or free needs an API key that only the sensors have, so nobody can fake a machine's status from outside. The timer and queue endpoints don't check who you are yet, which is the first thing I'd fix.</p>
      </section>

      <section className="col sec" id="results">
        <Reveal as="h2">Results</Reveal>
        <p>UWash made the top 8 at the NUS Student Life Hackathon 2026. There's a <a href="https://drive.google.com/file/d/1ZUDJiysRXRrE5yWQg5wfWzUAJ6YI6aZ9/view">demo video</a>.</p>
      </section>

      <section className="col sec" id="learned">
        <Reveal as="h2">What I learned</Reveal>
        <p>The biggest improvement was removing the need for anyone to report anything. Starting from a bot that already worked meant our hackathon time went into the sensors, which was the new part.</p>
      </section>
      <ProjectPager href="/projects/uwash" />
    </article>
    </>
  );
}
