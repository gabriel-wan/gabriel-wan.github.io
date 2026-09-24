import { pageMeta } from "@/lib/metadata";
import type { CSSProperties } from "react";
import { HorizonScene } from "@/components/horizon-scene";
import { GlowFrame } from "@/components/glow-frame";
import { ShimmerLink } from "@/components/ui/shimmer-button";
import { Reveal } from "@/components/reveal";
import { ProjectWheel } from "@/components/project-wheel";

export const metadata = pageMeta({
  "title": "Gabriel Wan",
  "description": "Gabriel Wan is a computer science student at NUS who builds small apps and tools, mostly for problems around him. Projects, write-ups and notes.",
  "path": "/"
});

export default function Page() {
  return (
    <>
    <section className="col hero horizon"><HorizonScene />
      <Reveal as="h1"><span className="greet">Hi, I'm Gabriel.</span> I build small apps and tools, mostly for problems around me.</Reveal>
      <Reveal as="p" className="lede">The thing people have actually used most is a lounge booking app for my residential college, which about 130 residents use.</Reveal>
    </section>

    <section className="col group-head" id="about">
      <Reveal as="h2">About</Reveal>
      <div className="about">
        <img src="/images/gabriel-portrait.jpg" alt="Gabriel Wan standing at a railing at dusk, with hills behind" width="480" height="600" loading="lazy" />
        <div>
          <p>I'm a Year 2 Computer Science student at NUS. I like building things that make life a little easier, and sometimes just building things because I find them interesting.</p>
          <p>Beyond the screen, you'll usually find me playing squash, at the gym, out running, or more recently, journalling and putting my thoughts down.</p>
        </div>
      </div>
    </section>

    <section className="col group-head" id="work">
      <Reveal as="h2">Work</Reveal>
      <ul className="entries">
        <li className="entry-row">
          <img className="logo" src="/images/logo-siaec.png" alt="SIA Engineering Company logo" width="128" height="128" loading="lazy" />
          <div>
            <h3>SIA Engineering Company</h3>
            <p className="dateline">Digital Transformation Intern · <span className="nw">May – Aug 2026</span></p>
            <p>Built internal tools for the ground equipment team, including a browser extension that cut a 30-minute daily battery check to under a minute.</p>
            <ShimmerLink background="#151e28" shimmerColor="#d6ebff" shimmerSize="2px" className="shim gap-1.5 px-3.5 py-1.5 text-[13px] font-medium border-white/25" href="/testimonials/siaec-recommendation.pdf" target="_blank" rel="noopener">Testimonial<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 16 16 8M9 8h7v7" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg></ShimmerLink>
          </div>
        </li>
        <li className="entry-row">
          <img className="logo" src="/images/logo-aimazing.png" alt="Aimazing logo" width="128" height="128" loading="lazy" />
          <div>
            <h3>Aimazing</h3>
            <p className="dateline">Business Management Intern · <span className="nw">Jan – Jun 2025</span></p>
            <p>Rolled out 500+ IoT loyalty devices across three malls at a retail-tech startup, and onboarded 200+ merchants onto the product.</p>
            <ShimmerLink background="#151e28" shimmerColor="#d6ebff" shimmerSize="2px" className="shim gap-1.5 px-3.5 py-1.5 text-[13px] font-medium border-white/25" href="/testimonials/aimazing-recommendation.pdf" target="_blank" rel="noopener">Testimonial<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 16 16 8M9 8h7v7" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg></ShimmerLink>
          </div>
        </li>
      </ul>
    </section>

    <section className="col group-head" id="education">
      <Reveal as="h2">Education</Reveal>
      <ul className="entries">
        <li className="entry-row">
          <img className="logo" src="/images/logo-nus.png" alt="National University of Singapore logo" width="128" height="128" loading="lazy" />
          <div>
            <h3>National University of Singapore</h3>
            <p className="dateline">Computer Science (Honours) · <span className="nw">2025 – 2028</span></p>
            <p>Product Associate, NUS Developer Group</p>
          </div>
        </li>
        <li className="entry-row">
          <img className="logo" src="/images/logo-asrjc.png" alt="Anderson Serangoon Junior College logo" width="128" height="128" loading="lazy" />
          <div>
            <h3>Anderson Serangoon Junior College</h3>
            <p className="dateline">GCE A-Level · <span className="nw">2021 – 2022</span></p>
            <p>Tennis</p>
          </div>
        </li>
      </ul>
    </section>

    <ProjectWheel id="projects" aria-labelledby="projects-title">
      <div className="wheel-stage">
        <div className="col group-head wheel-inner">
          <Reveal as="h2" id="projects-title">Projects</Reveal>
          <div className="wheel">
            <ul className="wheel-track">
              <li className="wheel-item">
                <a className="wheel-link" href="/projects/mini-gabriel">
                  <GlowFrame><div className="art is-image is-chat"><img src="/images/mini-gabriel-wheel.webp" alt="A Telegram chat with the bot. I ask how far along it is with an assignment and it answers in three short lowercase messages" width="500" height="289" loading="lazy" /></div></GlowFrame>
                  <p className="dateline">Sep 2026</p>
                  <h3>MiniGabriel</h3>
                  <p>An 8B model fine-tuned on my Telegram messages so it texts like me, down to the lowercase, short bursts and Singlish.</p>
                </a>
              </li>
              <li className="wheel-item">
                <a className="wheel-link" href="/projects/lounge-booking">
                  <GlowFrame><div className="art is-image"><img src="/images/lounge-booking.jpg" alt="The Lounge Booking app: a floor switcher, upcoming bookings and a calendar" width="450" height="850" loading="lazy" /></div></GlowFrame>
                  <p className="dateline">Feb 2026</p>
                  <h3>Lounge Booking</h3>
                  <p>A Telegram Mini App for booking the lounges in my residential college. About 130 residents use it.</p>
                </a>
              </li>
              <li className="wheel-item">
                <a className="wheel-link" href="/projects/nus-gym-tracker">
                  <GlowFrame><div className="art is-image is-fit" style={{ "--art-bg": "#220c00" } as CSSProperties}><img src="/images/gym-reddit-wheel.webp" alt="A post on r/nus asking when the least crowded time at the U-Town gym is" width="700" height="404" loading="lazy" /></div></GlowFrame>
                  <p className="dateline">Sep 2026 · Live</p>
                  <h3>NUS Gym Tracker</h3>
                  <p>A Telegram bot that tells you how full the NUS gyms are, and saves a reading every 5 minutes because NUS keeps no history.</p>
                </a>
              </li>
              <li className="wheel-item">
                <a className="wheel-link" href="/projects/kopikaki">
                  <GlowFrame><div className="art is-image is-fit" style={{ "--art-bg": "#fffaf5" } as CSSProperties}><img src="/images/kopikaki-wheel.webp" alt="The KopiKaki app asking What do you feel like doing?, with its mascot and a Tap to speak button" width="762" height="440" loading="lazy" /></div></GlowFrame>
                  <p className="dateline">Aug 2026 · Build with Gemini hackathon</p>
                  <h3>KopiKaki</h3>
                  <p>A voice assistant that helps seniors find someone nearby to meet.</p>
                </a>
              </li>
              <li className="wheel-item">
                <a className="wheel-link" href="/projects/uwash">
                  <GlowFrame><div className="art is-image"><img src="/images/uwash.jpg" alt="The UWash dashboard's usage chart" width="1465" height="739" loading="lazy" /></div></GlowFrame>
                  <p className="dateline">Mar 2026 · Top 8, NUS Student Life Hackathon</p>
                  <h3>UWash</h3>
                  <p>Vibration sensors that tell a laundry bot when machines are free.</p>
                </a>
              </li>
              <li className="wheel-item">
                <a className="wheel-link" href="https://github.com/gabriel-wan/hackomania_interledger">
                  <GlowFrame><div className="art is-image"><img src="/images/emergency-fund.jpg" alt="The Community Fund dashboard with a world map of disaster signals" width="1904" height="908" loading="lazy" /></div></GlowFrame>
                  <p className="dateline">Mar 2026 · HackOMania</p>
                  <h3>Community Emergency Fund</h3>
                  <p>A disaster relief fund that pays out over Interledger when a USGS or NWS alert hits members nearby.</p>
                </a>
              </li>
            </ul>
          </div>
          <div className="wheel-progress" aria-hidden="true"><span></span></div>
        </div>
      </div>
    </ProjectWheel>
    </>
  );
}
