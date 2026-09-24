import { pageMeta } from "@/lib/metadata";
import type { CSSProperties } from "react";
import { ShimmerLink } from "@/components/ui/shimmer-button";
import { SkyStrip } from "@/components/sky-strip";
import { Reveal } from "@/components/reveal";

export const metadata = pageMeta({
  "title": "MiniGabriel — Gabriel Wan",
  "description": "Fine-tuning Qwen3-8B with LoRA on about 15,000 of my Telegram messages to see if it could text like me, and how I measured it.",
  "path": "/projects/mini-gabriel",
  "ogTitle": "MiniGabriel: fine-tuning a model on my own Telegram messages",
  "type": "article"
});

export default function Page() {
  return (
    <>
    <SkyStrip />
    <article>
      <header className="col page-head">
        <p className="crumb"><a href="/projects">Projects</a></p>
        <Reveal as="h1">MiniGabriel</Reveal>
        <Reveal as="p" className="dek">I fine-tuned an open-source language model on my own Telegram messages to see if it could learn to text like me. It picked up most of my habits, from the lowercase and the Singlish to replying in short bursts.</Reveal>
        <p className="dateline">Aug – Sep 2026 · Working, as a private Telegram bot</p>
        <div className="actions">
          <ShimmerLink background="#151e28" shimmerColor="#d6ebff" shimmerSize="2px" className="shim gap-1.5 px-3.5 py-1.5 text-[13px] font-medium border-white/25" href="https://github.com/gabriel-wan/mini-gabriel">Code on GitHub<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 16 16 8M9 8h7v7" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg></ShimmerLink>
        </div>
        <figure className="wide artifact">
          <table className="bars">
            <caption className="visually-hidden">Style distance to my real replies, lower is closer</caption>
            <tbody><tr><th scope="row">Base model, no fine-tuning</th><td className="track"><span className="bar" style={{ "--v": "100%" } as CSSProperties}></span></td><td className="num">0.3639</td></tr>
            <tr className="is-hi"><th scope="row">Fine-tuned</th><td className="track"><span className="bar" style={{ "--v": "17.5%" } as CSSProperties}></span></td><td className="num">0.0637</td></tr>
            <tr><th scope="row">Me vs. me</th><td className="track"><span className="bar" style={{ "--v": "6.5%" } as CSSProperties}></span></td><td className="num">0.0237</td></tr></tbody>
          </table>
          <figcaption>Style distance to my real replies, on 1,434 replies from four chats the model never saw. Lower is closer. "Me vs. me" is the floor.</figcaption>
        </figure>
      </header>

      <section className="col sec" id="why">
        <Reveal as="h2">Why I built it</Reveal>
        <p>Most language models write like a polite assistant, with capital letters, full stops and one tidy paragraph. I write almost the opposite. In the replies I held out for testing, 94.8% start with a lowercase letter, only 9.3% end with punctuation, and about 60% are split across two or three short messages. There's also a fair bit of Singlish.</p>
        <p>I wanted to know whether one person's chats were enough data to move a model toward that style. By style I mean wording, capitalisation, punctuation, slang, emoji, how long replies are, and splitting one reply into several messages. I wasn't trying to make it know things about me, so there's no retrieval or memory in it, only fine-tuning on how I write. It's also something I can check myself, since I know what my own replies look like.</p>
      </section>

      <section className="col sec" id="built">
        <Reveal as="h2">What I built</Reveal>
        <p>A pipeline of eight scripts, each producing something I could open and check before moving on.</p>
        <div className="table-scroll">
          <table className="table">
            <thead><tr><th>Stage</th><th>What came out</th></tr></thead>
            <tbody>
              <tr><td>Extract</td><td>432 chats, 113,053 messages from Telegram</td></tr>
              <tr><td>Select</td><td>58 chats: private chats and groups of 20 or fewer where I'd written at least 100 messages</td></tr>
              <tr><td>Build examples</td><td>17,001 examples: 54 chats for training, 4 held out</td></tr>
              <tr><td>Format</td><td>14,939 training rows in ChatML</td></tr>
              <tr><td>Train</td><td>A LoRA adapter, after 91 minutes on one A100 on the NUS School of Computing cluster</td></tr>
              <tr><td>Evaluate</td><td>Style distance on 1,434 held-out replies</td></tr>
              <tr><td>Export</td><td>A merged, 4-bit GGUF file of 4.79 GB</td></tr>
              <tr><td>Deploy</td><td>Ollama and a Telegram bot, running on my laptop's CPU</td></tr>
            </tbody>
          </table>
        </div>
        <p>The code that makes decisions (which chats count, where a turn or a conversation ends, how examples are cut, the style metric) is all in plain functions with no Telegram or GPU code in them. That let me test it with 190 tests on made-up data, which run in about two seconds, instead of debugging on my real messages.</p>
        <p>The bot splits the model's reply on newlines and sends each line as its own message with a short pause, so it texts in bursts the way I do.</p>
        <p>It's written in Python, with PyTorch, Unsloth and Hugging Face's TRL library for training, Slurm for the cluster jobs, and llama.cpp and Ollama for running it.</p>
      </section>

      <section className="col sec" id="decisions">
        <Reveal as="h2">Decisions</Reveal>
        <h3>Starting from the base model</h3>
        <p>I used Qwen3-8B-Base instead of the instruct version. Instruct models are trained toward the polite, capitalised style that my metric scores furthest from mine, so fine-tuning one would mostly be undoing that training.</p>
        <h3>Dropping Qwen3.5</h3>
        <p>I first picked the newer Qwen3.5-9B. Reading its config showed it was multimodal (image and text), and the loader I was using is for text-only models, so I switched to Qwen3-8B.</p>
        <h3>Plain LoRA in bf16</h3>
        <p>The 8B model needs about 20 GB of GPU memory with activations, which fits on a 40 GB A100. QLoRA is for when a model doesn't fit, and it costs some precision and 20 to 40% of the speed, so I didn't use it. At rank 16 that meant training 43.6 million parameters, 0.53% of the model.</p>
        <h3>Holding out whole chats</h3>
        <p>If I'd held out random messages, the model would be tested on conversations it had mostly already read. I set aside four entire chats and never trained on them.</p>
        <h3>Only training on my replies</h3>
        <p>Without masking, the model learns to predict everyone's messages, including my friends'. I turned on response-only masking and then decoded the training labels to check it was actually working before starting the run.</p>
        <h3>The smallest GPU that fits</h3>
        <p>On the cluster, the wait in the queue was longer than the job. Bigger GPUs use up more of my fair-share allocation (an H200 counts about five times an A100), which would have pushed every later job further back.</p>
        <h3>Running it on my laptop</h3>
        <p>For the bot I merged the adapter into the model, quantised it to 4 bits and ran it with Ollama. It went from 16 GB to 4.8 GB, and a reply takes a couple of seconds on CPU. vLLM is built for lots of users at once, and this only ever answers one chat at a time.</p>
      </section>

      <section className="col sec" id="measuring">
        <Reveal as="h2">How I measured it</Reveal>
        <p>Training loss doesn't tell you whether a model sounds like someone. A model that memorised every message would have great loss and be useless.</p>
        <p>So I wrote a style metric. It compares ten measurements between the model's replies and mine (length, number of messages, lowercase starts, ending punctuation, emoji, Singlish, questions, and bare replies like "ok") and averages the differences into one number, which I call style distance.</p>
        <p>Two halves of my own replies don't score zero against each other. They score 0.0237, because every measurement comes from a finite sample. That's the floor, and it's what the model should be compared to.</p>
        <p>Before training anything, I scored the base model with no fine-tuning to see if prompting alone would be enough. It scored 0.3639, about 15 times the floor. It was answering messages like "eh you free later" with around 30 messages and 410 characters.</p>
      </section>

      <section className="col sec" id="wrong">
        <Reveal as="h2">What went wrong</Reveal>
        <h3>The cluster's home directory only holds about 120 MB</h3>
        <p><code>pip install unsloth</code> failed halfway through one package. <code>quota</code> and <code>df</code> both looked fine because they report different filesystems, and <code>du -sh ~</code> was the only command that showed the limit. The job scripts now work around it by using the compute node's local disk.</p>
        <h3>Training took 91 minutes instead of about 25</h3>
        <p>Padding-free batching was switched off. With an average sequence of 104 tokens, most of the compute went on padding. I've fixed the setting but haven't re-run training yet.</p>
        <h3>It sends too many one-word replies</h3>
        <p>13.3% of its replies are bare acknowledgements, compared with 4.2% of mine, and that's the biggest part of the remaining distance. I'd expected something like this: 11% of my own turns are only acknowledgements, so the dataset already kept just a third of them. It wasn't enough.</p>
        <p>I tried changing the sampling temperature first, since that doesn't need retraining. Between 0.4 and 0.8 the score only moved from 0.0570 to 0.0637, which is within noise, and the acknowledgement rate didn't change at all, so the fix has to be in the training data. The bot uses 0.5, which I picked by reading the replies.</p>
        <h3>The metric only measures style</h3>
        <p>It checks habits like length, lowercase and punctuation, so it can't tell whether a reply fits the conversation. I judge that part by reading the replies, and there's no number for it yet.</p>
        <h3>One number matched for the wrong reason</h3>
        <p>The base model's acknowledgement rate (0.041) was almost exactly mine (0.042), but only because it never wrote a short reply at all.</p>
        <h3>Names inside messages weren't removed</h3>
        <p>I replaced the names of who sent each message, but not names typed inside the messages. The model can repeat them, so I'm not publishing the weights and the bot isn't public.</p>
      </section>

      <section className="col sec" id="results">
        <Reveal as="h2">Results</Reveal>
        <p>Fine-tuning cut the distance by 83%, from about 15 times the floor to 2.7 times, as the chart at the top shows. Most of the habits that make my texts recognisable came through:</p>
        <div className="table-scroll">
          <table className="table">
            <thead><tr><th>Habit</th><th className="num">Me</th><th className="num">Model</th></tr></thead>
            <tbody>
              <tr><td>Starts lowercase</td><td className="num">94.8%</td><td className="num">93.3%</td></tr>
              <tr><td>Split across several messages</td><td className="num">59.6%</td><td className="num">54.0%</td></tr>
              <tr><td>Messages per reply</td><td className="num">1.98</td><td className="num">1.90</td></tr>
              <tr><td>Singlish</td><td className="num">13.1%</td><td className="num">12.0%</td></tr>
              <tr><td>Ends with punctuation</td><td className="num">9.3%</td><td className="num">8.1%</td></tr>
              <tr><td>Average length (characters)</td><td className="num">43.9</td><td className="num">32.9</td></tr>
              <tr className="flagged"><td>Bare acknowledgements</td><td className="num">4.2%</td><td className="num">13.3%</td></tr>
            </tbody>
          </table>
        </div>
        <figure className="artifact shot">
          <img src="/images/mini-gabriel-chat.webp" alt="A Telegram chat with the MiniGabriel bot. I ask if it has started the CS2103 assignment. It replies in short lowercase bursts: i finished le, its not that deep, just lots of content, and later, i spent like a whole day on it" width="700" height="918" loading="lazy" />
          <figcaption>A chat with the bot. My messages are the blue ones. It replies in short lowercase bursts the way I do.</figcaption>
        </figure>
        <p>There's no blind test yet, so all I can say is that the style numbers are close. I can't say a friend wouldn't be able to tell.</p>
      </section>

      <section className="col sec" id="learned">
        <Reveal as="h2">What I learned</Reveal>
        <p>Training was the smallest part. It was one 91-minute job, and the decisions that mattered came before it: what counts as a conversation, how to split the data, what to mask, and how to measure the result.</p>
        <p>Next time I'd build the evaluation first, including the floor and the no-training baseline. Without those two, the 83% wouldn't mean much.</p>
        <p>Checking things by hand paid off. Decoding the labels took a few minutes and would have caught a masking mistake that could have wasted the whole run.</p>
        <p>I should have removed names inside messages in the data pipeline. Once they're in the weights, the only option left is not publishing them.</p>
      </section>

      <section className="col sec" id="next">
        <Reveal as="h2">What's next</Reveal>
        <ul>
          <li>Keep fewer acknowledgements in the training data and retrain.</li>
          <li>Try different LoRA ranks and epoch counts, now that there's a metric to compare them with.</li>
          <li>A blind test: mix real and generated replies and see if friends can pick out mine.</li>
        </ul>
        <p>I wrote about the project less formally in <a href="/notes/fine-tuning-an-llm-on-myself">a note</a>. The <a href="https://github.com/gabriel-wan/mini-gabriel">repository</a> has the full experiment log and evaluation design.</p>
        <nav className="pager" aria-label="More projects">
          <a className="prev" href="/projects"><span>Back to</span>All projects</a>
          <a className="next" href="/projects/lounge-booking"><span>Next</span>Lounge Booking</a>
        </nav>
      </section>
    </article>
    </>
  );
}
