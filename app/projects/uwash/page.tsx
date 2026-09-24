import { pageMeta } from "@/lib/metadata";
import { Reveal } from "@/components/reveal";

export const metadata = pageMeta({
  "title": "UWash — Gabriel Wan",
  "description": "An IoT laundry system for NUS residences with ESP32 vibration sensors, a Flask backend and a Telegram bot. Top 8 at the NUS Student Life Hackathon 2026.",
  "path": "/projects/uwash",
  "ogTitle": "UWash: laundry machines that report when they're running",
  "type": "article"
});

export default function Page() {
  return (
    <>
    <article>
      <header className="col page-head">
        <p className="crumb"><a href="/projects">Projects</a></p>
        <Reveal as="h1">UWash</Reveal>
        <Reveal as="p" className="dek">CAPT's laundry bot only knew a machine was running if someone told it. We put vibration sensors on the machines so they report it themselves, and made the top 8 at the NUS Student Life Hackathon 2026.</Reveal>
        <p className="dateline">Mar 2026 · NUS Student Life Hackathon, top 8</p>
        <div className="actions">
          <a className="btn btn-small" href="https://drive.google.com/file/d/1ZUDJiysRXRrE5yWQg5wfWzUAJ6YI6aZ9/view">Watch the demo<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 16 16 8M9 8h7v7" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg></a>
          <a className="btn btn-small" href="https://github.com/gabriel-wan/uwash-bot">Code on GitHub<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 16 16 8M9 8h7v7" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg></a>
        </div>
        <figure className="wide artifact shot">
          <img src="/images/uwash.jpg" alt="UWash dashboard analytics: an hourly usage chart with morning and evening peaks, and tiles for idle time, unregistered use, shared loads and water saved" width="1465" height="739" />
          <figcaption>The dashboard's analytics view, with demo data.</figcaption>
        </figure>
      </header>

      <section className="col sec" id="why">
        <Reveal as="h2">Why we built it</Reveal>
        <p>CAPT already had a Telegram laundry bot, built by earlier students. You picked a machine and started a timer, and the bot reminded you when your wash was done. But it only knew what people told it, so if someone didn't start a timer, the machine looked free when it wasn't. We wanted the machines to report their own status.</p>
      </section>

      <section className="col sec" id="built">
        <Reveal as="h2">What we built</Reveal>
        <div className="flows">
          <p className="flow-label">From the machine</p>
          <ol className="flow">
            <li>ESP32 + vibration sensor</li><li className="arrow" aria-hidden="true">→</li>
            <li>HTTPS with an API key</li><li className="arrow" aria-hidden="true">→</li>
            <li>Flask API</li><li className="arrow" aria-hidden="true">→</li>
            <li>SQLite</li>
          </ol>
          <p className="flow-label">To residents</p>
          <ol className="flow">
            <li>SQLite</li><li className="arrow" aria-hidden="true">→</li>
            <li>React dashboard</li>
          </ol>
          <ol className="flow">
            <li>SQLite</li><li className="arrow" aria-hidden="true">→</li>
            <li>Telegram bot: status, timers, "your laundry's done"</li>
          </ol>
        </div>
        <p>A small ESP32 board with an SW-420 vibration sensor sits on each machine and sends its state to the backend. The React dashboard shows which machines are free and when the laundry room is busiest. The Telegram bot tells you what's free, runs timers and messages you when your cycle ends. It works for several residences, each with its own machines.</p>
        <p>I worked on the backend and the Telegram bot: the Flask API that the sensors and dashboard talk to, the SQLite database, and the bot with its notifications and digital queue. It's written in Python with python-telegram-bot, hosted on Railway, with the dashboard on Vercel.</p>
      </section>

      <section className="col sec" id="decisions">
        <Reveal as="h2">Decisions</Reveal>
        <h3>Sensing vibration</h3>
        <p>A vibration sensor can tell a cycle is running without touching the machine's electronics, so it can be fitted and removed without opening anything up.</p>
        <h3>Building on the existing bot</h3>
        <p>We forked the laundry bot that already existed and added the sensor side to it, instead of starting over and asking people to learn a new tool. The original is by <a href="https://github.com/jloh02">jloh02</a> and <a href="https://github.com/zzibo">zibo</a>.</p>
        <h3>Anyone can read, only sensors can write</h3>
        <p>The dashboard and bot can read machine status freely. The endpoint that changes a machine's status needs an API key that only the sensors have.</p>
      </section>

      <section className="col sec" id="results">
        <Reveal as="h2">Results</Reveal>
        <p>UWash made the top 8 at the NUS Student Life Hackathon 2026. There's a <a href="https://drive.google.com/file/d/1ZUDJiysRXRrE5yWQg5wfWzUAJ6YI6aZ9/view">demo video</a>.</p>
      </section>

      <section className="col sec" id="learned">
        <Reveal as="h2">What I learned</Reveal>
        <p>The biggest improvement was removing the need for anyone to report anything. Starting from a bot that already worked meant our hackathon time went into the sensors, which was the new part.</p>
        <nav className="pager" aria-label="More projects">
          <a className="prev" href="/projects/kopikaki"><span>Previous</span>KopiKaki</a>
          <a className="next" href="/projects"><span>Back to</span>All projects</a>
        </nav>
      </section>
    </article>
    </>
  );
}
