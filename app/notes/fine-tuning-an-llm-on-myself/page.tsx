import { pageMeta } from "@/lib/metadata";
import { StarField } from "@/components/starfield";
import { Reveal } from "@/components/reveal";
import { NotePager } from "@/components/pager";

export const metadata = pageMeta({
  "title": "Why I fine-tuned an LLM on myself — Gabriel Wan",
  "description": "I use LLMs every day but had never trained one, so I tried to get one to text like me.",
  "path": "/notes/fine-tuning-an-llm-on-myself",
  "type": "article",
  "published": "2026-09-23"
});

export default function Page() {
  return (
    <>
    <StarField />
    <article className="post">
      <header className="col page-head">
        <p className="crumb"><a href="/notes">Notes</a></p>
        <Reveal as="h1">Why I fine-tuned an LLM on myself</Reveal>
        <Reveal as="p" className="dek">I use LLMs every day but had never trained one, so I tried to get one to text like me.</Reveal>
        <p className="dateline"><time dateTime="2026-09-23">23 Sep 2026</time> · 2 min read · About <a href="/projects/mini-gabriel">MiniGabriel</a></p>
      </header>

      <section className="col sec">
        <p>I use LLMs every day, but I'd never actually trained one, and I wanted to understand what fine-tuning really involves. Doing it on something I could judge myself seemed like a fun way to learn, and nothing is easier for me to judge than the way I text.</p>
        <p>I text in a very particular way. Almost everything starts in lowercase, there are hardly any full stops, and I tend to send two or three short messages instead of one proper one. Ask a normal model to reply to "eh you free later" and you get the opposite: a polite little paragraph with capital letters and full stops.</p>
      </section>

      <section className="col sec">
        <Reveal as="h2">Most of it wasn't training</Reveal>
        <p>Telegram gave me about 113,000 messages, and most of the project was deciding what to do with them: what counts as one reply when I send three messages in a row, where one conversation ends and the next begins, and which chats should count at all.</p>
        <p>One thing I didn't see coming was how often I just reply "ok", or something like it. It's about one in ten of my replies, and if you train on all of them, the model learns that "ok" is the safest answer to anything. That's accurate, but not very useful, so I kept only a third of them.</p>
        <p>The training itself ran on the School of Computing's compute cluster, which was pretty cool to be able to use. Out of curiosity I looked up how much one of those GPUs costs and got quite a shock when I saw it was around 20k. With the queue, the job took close to two hours, and seeing it finally finish was probably my favourite moment of the whole project, along with getting the first message from the bot running on my own laptop.</p>
      </section>

      <section className="col sec">
        <Reveal as="h2">Did it work?</Reveal>
        <p>Mostly. It picked up the lowercase, the short bursts and the Singlish, and on a style score I wrote to compare its replies with mine, it got a lot closer after training. The numbers are in the <a href="/projects/mini-gabriel">project write-up</a>. When a friend tried it, they were shocked, which was exactly the reaction I was hoping for.</p>
        <p>It isn't perfect. It still sends too many one-word replies, and it only copies how I write, not whether a reply actually makes sense. It also learned from real chats that include my friends' names, so the bot stays private and the model stays on my laptop.</p>
        <p>Next I want to cut down the one-word replies, retrain it, and see whether the people I text can tell its replies apart from mine. The <a href="https://github.com/gabriel-wan/mini-gabriel">repository</a> has the full log if you're curious.</p>
      </section>
      <NotePager slug="fine-tuning-an-llm-on-myself" />
    </article>
    </>
  );
}
