import { pageMeta } from "@/lib/metadata";
import { Reveal } from "@/components/reveal";

export const metadata = pageMeta({
  "title": "Notes — Gabriel Wan",
  "description": "Notes from Gabriel Wan on things he's building, breaking and figuring out.",
  "path": "/notes"
});

export default function Page() {
  return (
    <>
    <header className="col page-head">
      <Reveal as="h1">Notes</Reveal>
      <Reveal as="p" className="dek">Things I'm building, breaking and figuring out, written mostly for my own future reference.</Reveal>
    </header>

    <section className="col sec" aria-label="All notes">
      <ul className="index notes">
        <li>
          <span className="date">23 Sep 2026</span>
          <div>
            <h2 className="item"><a href="/notes/fine-tuning-an-llm-on-myself">Why I fine-tuned an LLM on myself</a></h2>
            <p>What 15,000 of my messages could and couldn't teach an 8B model, and why measuring it took more work than training it.</p>
          </div>
        </li>
        <li>
          <span className="date">23 Sep 2026</span>
          <div>
            <h2 className="item"><a href="/notes/the-64-bit-bug">The 64-bit bug that broke my Telegram bot</a></h2>
            <p>How a Telegram user ID ended up stored as <code>6123456789.0</code>, and why it only affected some people.</p>
          </div>
        </li>
      </ul>
    </section>
    </>
  );
}
