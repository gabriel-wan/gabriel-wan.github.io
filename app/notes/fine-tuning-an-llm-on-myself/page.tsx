import { pageMeta } from "@/lib/metadata";
import { Reveal } from "@/components/reveal";

export const metadata = pageMeta({
  "title": "Why I fine-tuned an LLM on myself — Gabriel Wan",
  "description": "What 15,000 of my Telegram messages could and couldn't teach an 8B language model, and why measuring it took more work than training it.",
  "path": "/notes/fine-tuning-an-llm-on-myself",
  "type": "article",
  "published": "2026-09-23"
});

export default function Page() {
  return (
    <>
    <article className="post">
      <header className="col page-head">
        <p className="crumb"><a href="/notes">Notes</a></p>
        <Reveal as="h1">Why I fine-tuned an LLM on myself</Reveal>
        <Reveal as="p" className="dek">What 15,000 of my Telegram messages could and couldn't teach an 8B model.</Reveal>
        <p className="dateline"><time dateTime="2026-09-23">23 Sep 2026</time> · 5 minute read · About <a href="/projects/mini-gabriel">MiniGabriel</a></p>
      </header>

      <section className="col sec">
        <p>94.8% of my messages start with a lowercase letter. I know because I measured it. Fewer than one in ten end with a full stop, more than half the time I reply in two or three short messages instead of one proper one, and there's a fair amount of Singlish.</p>
        <p>If you ask a language model to reply to "eh you free later", you get the opposite: capital letters, full stops, polite and long. The base model I started with answered messages like that with around 30 messages and 400-odd characters.</p>
        <p>So I wanted to see whether an open-source model trained on my own messages could learn to write like me. It didn't need to know anything about me. It only had to write the way I do.</p>
      </section>

      <section className="col sec">
        <Reveal as="h2">Why start with this</Reveal>
        <p>It's a small enough question to actually answer. You can't really test "build a digital version of me", but you can test whether fine-tuning moves a model's style toward mine.</p>
        <p>I could also judge the results myself, since I know what my own replies look like better than anyone. The catch is that the data is my own conversations, and those include other people's messages as context. That made privacy something I had to think about properly, and in the end it decided what I could publish.</p>
      </section>

      <section className="col sec">
        <Reveal as="h2">Most of the work was before training</Reveal>
        <p>Telegram gave me 113,053 messages across 432 chats, and most of the project was deciding what those should turn into.</p>
        <p>I write in bursts, so one reply is often several messages. Messages sent within 5 minutes of each other became one turn, and a gap of 3 hours started a new conversation. Only private chats and small groups where I'd written at least 100 messages counted, which left 58 chats. Each training example showed the model up to 10 earlier turns.</p>
        <p>Holding out a random 10% of replies for testing would have meant testing the model on conversations it had mostly already read, so I held out four whole chats instead.</p>
        <p>11% of my turns are only a short acknowledgement. If you train on all of them, the most likely reply becomes "ok", which is accurate and useless, so I kept a third of them.</p>
        <p>The model also had to learn to predict only my side of each conversation. There's a setting for that, and I decoded the training labels to check it by eye before trusting it.</p>
        <p>After all that, the training itself was one 91-minute job on an A100.</p>
      </section>

      <section className="col sec">
        <Reveal as="h2">Measuring it</Reveal>
        <p>Training loss can't tell you whether a model sounds like someone. A model that memorised every message would score well and be useless. So I wrote a style metric that compares ten things, like length, bursts, lowercase starts, punctuation, emoji and Singlish, and averages the differences into one number.</p>
        <p>I also needed a floor. If you split my own replies in half and compare the halves, they don't score zero. They score 0.0237, because every number comes from a limited sample, so zero was never the target.</p>
        <p>Before training anything, I scored the base model on its own. It got 0.3639, about 15 times the floor, so prompting alone wasn't going to get there. The fine-tuned model scored 0.0637 on 1,434 replies from chats it never trained on, which is 83% closer than the base model and 2.7 times the floor.</p>
      </section>

      <section className="col sec">
        <Reveal as="h2">What it can't do</Reveal>
        <p>The metric measures habits, so it can't tell whether a reply fits the conversation. I still judge that part by reading the replies.</p>
        <p>It's also too terse. 13% of its replies are bare acknowledgements, against my 4%, even after I'd cut them down in the data. I tried changing the sampling temperature first, hoping for a quick fix. The score moved by less than 0.007 and the acknowledgement rate stayed the same, so the fix has to be in the data.</p>
        <p>Then there's privacy. I replaced the names of who sent each message, but not names typed inside the messages, and the model can repeat them. So the weights stay on my laptop, and the bot is only for people who know me.</p>
      </section>

      <section className="col sec">
        <Reveal as="h2">What I'd do differently</Reveal>
        <p>I'd build the evaluation before anything else, floor and baseline included. Without a way to measure, every run is guesswork.</p>
        <p>I'd deal with names inside messages in the data pipeline, because once they're in the weights the only thing left to do is not publish them.</p>
        <p>And I'd keep reading the outputs. When the metric couldn't tell two temperatures apart, reading the replies could.</p>
        <p>Next I'm keeping fewer acknowledgements, retraining, and then running a blind test to see if the people I actually text can tell which replies are mine. The <a href="/projects/mini-gabriel">project write-up</a> has the full numbers, and the <a href="https://github.com/gabriel-wan/mini-gabriel">repository</a> has the experiment log.</p>
      </section>
    </article>
    </>
  );
}
