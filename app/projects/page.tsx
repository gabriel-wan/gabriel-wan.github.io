import { pageMeta } from "@/lib/metadata";
import type { CSSProperties } from "react";
import { GlowFrame } from "@/components/glow-frame";
import { ShimmerLink } from "@/components/ui/shimmer-button";
import { SkyStrip } from "@/components/sky-strip";
import Link from "next/link";
import { Reveal } from "@/components/reveal";

export const metadata = pageMeta({
  "title": "Projects — Gabriel Wan",
  "description": "Things Gabriel Wan has built over the past year, each with a write-up about why he made it, how it works and what went wrong.",
  "path": "/projects"
});

export default function Page() {
  return (
    <>
    <SkyStrip />
    <header className="col page-head">
      <Reveal as="h1">Projects</Reveal>
      <Reveal as="p" className="dek">Things I've built over the past year, newest first. Most have a write-up about why I made it, how it works and what went wrong.</Reveal>
    </header>

    <section className="col sec" aria-label="All projects">
      <ul className="index projects">
        <li>
          <GlowFrame><div className="art is-image is-chat" aria-hidden="true"><img src="/images/mini-gabriel-wheel.webp" alt="" width="500" height="289" loading="lazy" /></div></GlowFrame>
          <div>
            <span className="date">Sep 2026</span>
            <h2 className="item"><a href="/projects/mini-gabriel">MiniGabriel</a></h2>
            <p>I fine-tuned Qwen3-8B on about 15,000 of my Telegram messages to see if it would text like me, and built a way to measure how close it got.</p>
          </div>
        </li>
        <li>
          <GlowFrame><div className="art is-image is-fit" style={{ "--art-bg": "#220c00" } as CSSProperties} aria-hidden="true"><img src="/images/gym-reddit-wheel.webp" alt="" width="700" height="404" loading="lazy" /></div></GlowFrame>
          <div>
            <span className="date">Sep 2026</span>
            <h2 className="item"><a href="/projects/nus-gym-tracker">NUS Gym Tracker</a></h2>
            <p>A Telegram bot that saves how full the NUS gyms are every 5 minutes, because NUS keeps no history. Live since 18 September.</p>
          </div>
        </li>
        <li>
          <GlowFrame><div className="art is-image is-fit" style={{ "--art-bg": "#fffaf5" } as CSSProperties} aria-hidden="true"><img src="/images/kopikaki-wheel.webp" alt="" width="762" height="440" loading="lazy" /></div></GlowFrame>
          <div>
            <span className="date">Aug 2026</span>
            <h2 className="item"><a href="/projects/kopikaki">KopiKaki</a></h2>
            <p>A voice assistant that helps seniors find someone nearby to meet. Built at the Build with Gemini hackathon, where I did the matching.</p>
          </div>
        </li>
        <li>
          <GlowFrame><div className="art" aria-hidden="true"><table className="bars"><tbody><tr><th>Before</th><td className="track"><span className="bar" style={{ "--v": "100%" } as CSSProperties}></span></td><td className="num">30 min</td></tr><tr className="is-hi"><th>After</th><td className="track"><span className="bar" style={{ "--v": "3%" } as CSSProperties}></span></td><td className="num">&lt;1 min</td></tr></tbody></table></div></GlowFrame>
          <div>
            <span className="date">May – Aug 2026</span>
            <h2 className="item"><Link href="/#work">GSE battery dashboard</Link></h2>
            <p>A browser extension from my SIA Engineering internship that pulls battery data for 295 pieces of ground equipment into one page, taking a daily check from 30 minutes to under one.</p>
          </div>
        </li>
        <li>
          <GlowFrame><div className="art is-image" aria-hidden="true"><img src="/images/uwash.jpg" alt="" width="1465" height="739" loading="lazy" /></div></GlowFrame>
          <div>
            <span className="date">Mar 2026</span>
            <h2 className="item"><a href="/projects/uwash">UWash</a></h2>
            <p>Vibration sensors that tell a laundry bot when machines are free. Top 8 at the NUS Student Life Hackathon.</p>
          </div>
        </li>
        <li>
          <GlowFrame><div className="art is-image" aria-hidden="true"><img src="/images/emergency-fund.jpg" alt="" width="1904" height="908" loading="lazy" /></div></GlowFrame>
          <div>
            <span className="date">Mar 2026</span>
            <h2 className="item"><a href="https://github.com/gabriel-wan/hackomania_interledger">Community Emergency Fund</a></h2>
            <p>A disaster relief fund built at HackOMania. It watches USGS and NWS alerts, finds members near a disaster with ClickHouse geo queries, and pays them out over Interledger.</p>
          </div>
        </li>
        <li>
          <GlowFrame><div className="art is-image" aria-hidden="true"><img src="/images/lounge-booking.jpg" alt="" width="450" height="850" loading="lazy" /></div></GlowFrame>
          <div>
            <span className="date">Feb 2026</span>
            <h2 className="item"><a href="/projects/lounge-booking">Lounge Booking</a></h2>
            <p>A Telegram Mini App for booking the lounges in my residential college. About 130 residents use it.</p>
          </div>
        </li>
      </ul>
      <div className="actions">
        <ShimmerLink background="#151e28" shimmerColor="#d6ebff" shimmerSize="2px" className="shim gap-2 px-[18px] py-2.5 text-[15px] font-medium border-white/25" href="https://github.com/gabriel-wan"><svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" /></svg>More on GitHub</ShimmerLink>
      </div>
    </section>
    </>
  );
}
