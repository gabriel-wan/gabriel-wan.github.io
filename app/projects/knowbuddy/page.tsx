import { pageMeta } from "@/lib/metadata";
import { ShimmerLink } from "@/components/ui/shimmer-button";
import { StarField } from "@/components/starfield";
import { Reveal } from "@/components/reveal";
import { ProjectPager } from "@/components/pager";
import { ProjectArt } from "@/components/project-art";

export const metadata = pageMeta({
  "title": "KnowBuddy — Gabriel Wan",
  "description": "One chat over a company's Slack, Google Drive, Jira and Confluence that only answers from what you're allowed to see. Built with two friends at Tencent Cloud's AI hackathon.",
  "path": "/projects/knowbuddy",
  "image": "/videos/knowbuddy.jpg",
  "ogTitle": "KnowBuddy: an AI that only answers from what you're allowed to see",
  "type": "article"
});

function Arrow() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M8 16 16 8M9 8h7v7" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Page() {
  return (
    <>
    <StarField />
    <article>
      <header className="col page-head">
        <p className="crumb"><a href="/projects">Projects</a></p>
        <Reveal as="h1">KnowBuddy</Reveal>
        <Reveal as="p" className="dek">Ask one chat about your company's Slack, Google Drive, Jira and Confluence, and only get answers from what you're already allowed to see.</Reveal>
        <p className="dateline">Oct 2026 · Tencent Cloud AI CAN DO IT Hackathon, FinTech track · with two friends</p>
        <div className="actions">
          <ShimmerLink background="#151e28" shimmerColor="#d6ebff" shimmerSize="2px" className="shim gap-1.5 px-3.5 py-1.5 text-[13px] font-medium border-white/25" href="https://knowbuddy.xyz">Try it<Arrow /></ShimmerLink>
          <ShimmerLink background="#151e28" shimmerColor="#d6ebff" shimmerSize="2px" className="shim gap-1.5 px-3.5 py-1.5 text-[13px] font-medium border-white/25" href="https://github.com/gabriel-wan/knowbuddy">Code on GitHub<Arrow /></ShimmerLink>
        </div>
        <figure className="wide artifact shot">
          <ProjectArt art={{ src: "/videos/knowbuddy.jpg", video: "/videos/knowbuddy.mp4", alt: "Two people ask KnowBuddy the same question. The contractor gets nothing back; the compliance admin gets the answer with its Slack and Drive sources.", width: 1920, height: 1080 }} />
          <figcaption>Same question, two people. The contractor gets "I could not find this in the sources you have access to." The compliance admin gets the answer, with sources.</figcaption>
        </figure>
      </header>

      <section className="col sec" id="why">
        <Reveal as="h2">Why we built it</Reveal>
        <p>Two friends and I signed up for Tencent Cloud's hackathon because we wanted to learn more about LLM security. A lot of apps today are vibe-coded, and an AI that can read a company's documents is an easy place for something to leak.</p>
        <p>The FinTech track had a challenge from Aspire that fit that exactly: an "internal brain" that answers questions across a company's tools, with access control and an audit trail.</p>
      </section>

      <section className="col sec" id="how">
        <Reveal as="h2">How it works</Reveal>
        <p>The model never decides who can see what. Instead, code checks it twice before the model sees anything, first against the permissions copied from each tool, and then by asking each tool, as the person asking, whether they can still read each document. Only what passes both checks reaches the model.</p>
        <p>That means when a contractor asks about a security incident they aren't cleared for, they get the same reply as if it never happened, and nothing about it ever reaches the model. Card numbers, NRICs, bank accounts and phone numbers in what does get through are masked first, unless the source names you as the person handling them.</p>
        <p>My part was the query pipeline, meaning the search and the two permission checks, the audit log, the defences against hidden instructions and the deployment, while my two friends did the connectors, the syncing, the masking and the frontend.</p>
      </section>

      <section className="col sec" id="audit">
        <Reveal as="h2">The audit log</Reveal>
        <p>Every question goes into the log with who asked, every document that was considered, whether it was allowed or denied and why, and what the model was actually sent. Admin actions, like changing which channels and folders KnowBuddy may use, go in too.</p>
        <p>Each entry stores a SHA-256 hash of the one before it, so changing or deleting an old entry breaks every hash after it. The database also refuses updates and deletes on that table, and the app connects with its own login that can only read and add entries. An admin can re-check the whole chain at any time and see the first entry that doesn't match. Someone with the database owner's password could still rewrite the chain and re-hash it, so the latest hash is worth writing down somewhere outside the system.</p>
      </section>

      <section className="col sec" id="injection">
        <Reveal as="h2">Hidden instructions</Reveal>
        <p>A Slack message or a Confluence page can contain text written for the AI rather than for people. Our demo company had one planted in its #eng channel, a "note to AI assistants" telling it to lie about a project and send people to a fake sign-in page. Before anything reaches the model, lines like that, in English or Chinese, are replaced with <code>[instruction removed]</code>. Each source is wrapped and labelled as untrusted data, and any citation or link in the answer that the model wasn't actually given is stripped out before you see it.</p>
        <p>I used fixed patterns rather than asking a second model to spot attacks, because a classifier adds time and cost and can be fooled in the same way. Against <code>hy3</code>, it held up to all 30 of our attempts, ten different attacks run three times each.</p>
      </section>

      <section className="col sec" id="stack">
        <Reveal as="h2">What it runs on</Reveal>
        <p>It's built with Next.js, FastAPI and PostgreSQL with pgvector, using Tencent Cloud's <code>hy3</code> model. Turning off the model's thinking mode took answers from about 7 seconds to between 2 and 4. Everything runs in Docker, so the containers on our server in Singapore are the same ones we ran on our laptops, with a Caddy proxy in front for HTTPS, and GitHub Actions runs the tests before each deploy.</p>
      </section>

      <section className="col sec" id="submission">
        <Reveal as="h2">Recording the submission</Reveal>
        <p>We spent an entire day recording the video for our submission, from about 4pm to midnight, and kept having to retake it because we couldn't stop laughing.</p>
      </section>
      <ProjectPager href="/projects/knowbuddy" />
    </article>
    </>
  );
}
