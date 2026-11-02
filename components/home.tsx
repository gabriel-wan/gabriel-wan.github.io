import { HorizonScene } from "@/components/horizon-scene";
import { ProjectsReel } from "@/components/project-reel";
import { Reveal } from "@/components/reveal";
import { WorkEntries, type Job } from "@/components/work-entries";

// The home page: About, Projects, Work and Education.

const JOBS: Job[] = [
  {
    key: "govtech",
    company: "GovTech",
    logo: { src: "/images/logo-govtech.png", alt: "GovTech logo" },
    role: "Data Scientist Intern (incoming)",
    dates: "Jan – Jun 2027",
    summary: "Joining the Cybersecurity Group to fine-tune open-weight LLMs that generate payloads for automated red-teaming.",
  },
  {
    key: "siaec",
    company: "SIA Engineering Company",
    logo: { src: "/images/logo-siaec.png", alt: "SIA Engineering Company logo" },
    role: "Digital Transformation Intern",
    dates: "May – Aug 2026",
    summary: "Built internal tools for the ground equipment team, including a browser extension that cut a 30-minute daily battery check to under a minute.",
    letter: "/testimonials/siaec-recommendation.pdf",
  },
  {
    key: "aimazing",
    company: "Aimazing",
    logo: { src: "/images/logo-aimazing.png", alt: "Aimazing logo" },
    role: "Business Management Intern",
    dates: "Jan – Jun 2025",
    summary: "Rolled out 500+ IoT loyalty devices across three malls at a retail-tech startup, and onboarded 200+ merchants onto the product.",
    letter: "/testimonials/aimazing-recommendation.pdf",
  },
];

export function HomePage() {
  return (
    <>
      <section className="col hero horizon intro" id="about">
        <HorizonScene />
        <div className="intro-text">
          <Reveal as="h1">Hi, I&apos;m Gabriel.</Reveal>
          <p className="hero-line">
            I <span>build small apps.</span>
          </p>
          <Reveal as="p" className="lede">
            I&apos;m a Year 2 Computer Science student at NUS. I like building things that make life a little easier, and sometimes just building things because I find them interesting.
          </Reveal>
          <Reveal as="p" className="lede">
            Beyond the screen, you&apos;ll usually find me playing squash, at the gym, out running, or more recently, journalling and putting my thoughts down.
          </Reveal>
        </div>
        <figure className="intro-photo">
          <img src="/images/gabriel-portrait.jpg" alt="Gabriel Wan standing at a railing at dusk, with hills behind" width="480" height="600" />
        </figure>
      </section>

      <ProjectsReel />

      <section className="col group-head" id="work">
        <Reveal as="h2">Work</Reveal>
        <WorkEntries jobs={JOBS} />
      </section>

      <section className="col group-head" id="education">
        <Reveal as="h2">Education</Reveal>
        <ul className="entries">
          <li className="entry-row">
            <img className="logo" src="/images/logo-nus.png" alt="National University of Singapore logo" width="128" height="128" loading="lazy" />
            <div>
              <h3>National University of Singapore</h3>
              <p className="dateline">
                Computer Science (Honours)&nbsp;· <span className="nw">2025 – 2028</span>
              </p>
            </div>
          </li>
          <li className="entry-row">
            <img className="logo" src="/images/logo-asrjc.png" alt="Anderson Serangoon Junior College logo" width="128" height="128" loading="lazy" />
            <div>
              <h3>Anderson Serangoon Junior College</h3>
              <p className="dateline">
                GCE A-Level&nbsp;· <span className="nw">2021 – 2022</span>
              </p>
            </div>
          </li>
        </ul>
      </section>
    </>
  );
}
