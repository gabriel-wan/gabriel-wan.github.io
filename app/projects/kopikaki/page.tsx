import { pageMeta } from "@/lib/metadata";
import { ShimmerLink } from "@/components/ui/shimmer-button";
import { Reveal } from "@/components/reveal";

export const metadata = pageMeta({
  "title": "KopiKaki — Gabriel Wan",
  "description": "A voice assistant for seniors built with Gemini Live, Next.js and Firebase at the Build with Gemini hackathon. You call it, say what you feel like doing, and it tries to set up a meetup with someone nearby.",
  "path": "/projects/kopikaki",
  "ogTitle": "KopiKaki: a voice assistant that helps seniors meet people",
  "type": "article"
});

export default function Page() {
  return (
    <>
    <article>
      <header className="col page-head">
        <p className="crumb"><a href="/projects">Projects</a></p>
        <Reveal as="h1">KopiKaki</Reveal>
        <Reveal as="p" className="dek">A voice assistant for seniors. You call it, say what you feel like doing, and it tries to set up a meetup with a real person nearby. We built it at the Build with Gemini hackathon.</Reveal>
        <p className="dateline">Aug 2026 · Build with Gemini hackathon, Best Elderly Hack track</p>
        <div className="actions">
          <ShimmerLink className="shim gap-1.5 px-3.5 py-1.5 text-[13px] font-medium" href="https://kopikaki--kopikakis-cc6d5.asia-southeast1.hosted.app/">Try it<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 16 16 8M9 8h7v7" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg></ShimmerLink>
          <ShimmerLink className="shim gap-1.5 px-3.5 py-1.5 text-[13px] font-medium" href="https://github.com/gabriel-wan/kopikaki">Code on GitHub<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 16 16 8M9 8h7v7" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg></ShimmerLink>
        </div>
        <figure className="artifact dialogue">
          <p><span className="who">Uncle</span><span className="human">Hello KopiKaki.</span></p>
          <p><span className="who">KopiKaki</span><span className="ai">Hello Uncle David! What are you up to today?</span></p>
          <p><span className="who">Uncle</span><span className="human">Nothing lah. At home very boring.</span></p>
          <p><span className="who">KopiKaki</span><span className="ai">Want to get out of the house?</span></p>
          <p><span className="who">Uncle</span><span className="human">Maybe kopi.</span></p>
          <p><span className="who">KopiKaki</span><span className="ai">Can. There are two people around Bishan who are also free this afternoon. Raymond likes chess like you. Shall I ask them?</span></p>
          <p><span className="who">Uncle</span><span className="human">Okay lor.</span></p>
          <p><span className="who">KopiKaki</span><span className="ai">Done. I'll let you know when they reply.</span></p>
          <figcaption>The call we designed the demo around, from our product spec. Afterwards the app shows the confirmed meetup: kopi with Raymond and Helen, tomorrow at 9:30 AM in Bishan, with an "I'm going" button.</figcaption>
        </figure>
      </header>

      <section className="col sec" id="brief">
        <Reveal as="h2">The brief</Reveal>
        <p>The Best Elderly Hack track pointed out that nearly one in three people will be seniors by 2030, and that most tech isn't built with them in mind. It asked for something that helps them stay connected. The organisers also asked for no more dashboards or health trackers.</p>
      </section>

      <section className="col sec" id="framing">
        <Reveal as="h2">How we framed it</Reveal>
        <p>The obvious idea is an AI companion for lonely seniors. We didn't want the AI to be the friend. We wanted it to handle the awkward part of meeting someone: finding a person nearby who's free and wants to do the same thing, and setting it up. A good call with KopiKaki should be short and end with a plan for tomorrow, like the one at the top of this page.</p>
      </section>

      <section className="col sec" id="decisions">
        <Reveal as="h2">Product decisions</Reveal>
        <h3>Voice to decide, the app to confirm</h3>
        <p>Uncle talks because it's easier than tapping through menus. The app doesn't repeat the call. It shows your next meetup, a big call button and the people you've met through it, and we kept it to three screens.</p>
        <figure className="wide artifact shot-phone">
          <div className="frame"><img src="/images/kopikaki.webp" alt="The KopiKaki app asking What do you feel like doing?, with a Tap to speak button, a box to type in instead, and a Find my kaki button" width="517" height="901" loading="lazy" /></div>
          <figcaption>The first screen of the live app. You can tap to speak, or type what you want.</figcaption>
        </figure>
        <h3>No preference forms</h3>
        <p>Instead of a form, the assistant keeps short notes from what people say, like "my knees not so good, cannot walk far", "I don't like big groups" or "Mandarin easier for me", and uses them in later calls.</p>
        <h3>Always offering something</h3>
        <p>The obvious question from judges is what happens when no one nearby is using the app. The matcher first looks for meetups that are already planned, so a second caller joins the first person's plan. After that it tries people, then groups, then activities. A check in the build fails if that order ever changes.</p>
        <h3>One flow, done properly</h3>
        <p>Call, match, confirm, home screen. We cut or postponed phone sign-in, SOS contacts, onboarding, notifications, profiles and group chat, and wrote the cuts down so nobody drifted into them.</p>
        <h3>Testing the risky part first</h3>
        <p>Gemini Live audio in a phone browser, especially Safari on iPhone, was the part most likely to fail, so it was tested on its own before any interface was built on top of it.</p>
      </section>

      <section className="col sec" id="how">
        <Reveal as="h2">How it works</Reveal>
        <div className="flows">
          <p className="flow-label">The call</p>
          <ol className="flow">
            <li>Phone browser</li><li className="arrow" aria-hidden="true">→</li>
            <li>Server mints a one-time token</li><li className="arrow" aria-hidden="true">→</li>
            <li>Audio to and from Gemini Live</li>
          </ol>
          <p className="flow-label">The match</p>
          <ol className="flow">
            <li>What the caller asked for</li><li className="arrow" aria-hidden="true">→</li>
            <li>/api/match</li><li className="arrow" aria-hidden="true">→</li>
            <li>Gemini function calling</li><li className="arrow" aria-hidden="true">→</li>
            <li>Firestore</li><li className="arrow" aria-hidden="true">→</li>
            <li>Home screen updates</li>
          </ol>
        </div>
        <p>The Gemini API key never reaches the phone. The server creates a single-use token, and the browser uses it to stream audio to Gemini Live. Matching runs on the server using Gemini's function calling over Firestore, and falls back to a simple local parser if Gemini is unavailable. The home screen listens to Firestore directly, so a confirmed meetup shows up without a refresh. It's built with Next.js, TypeScript and Firebase.</p>
        <p>My part was the matching: the order it searches in (existing meetups, then people, groups and activities), the Gemini function calling across those four, the Firestore data model and security rules, and seeding the database with candidates so a match could actually be found during the demo.</p>
      </section>

      <section className="col sec" id="safety">
        <Reveal as="h2">Safety</Reveal>
        <ul>
          <li>The assistant only saves notes about things the caller actually said, never conclusions it drew itself.</li>
          <li>Each person can have at most 12 notes, so personal details can't keep piling up.</li>
          <li>If the notes fail to load or are missing, the call falls back to a normal greeting and everything else still works.</li>
        </ul>
      </section>

      <section className="col sec" id="unfinished">
        <Reveal as="h2">What's unfinished</Reveal>
        <ul>
          <li>Real phone sign-in isn't wired up. The demo signs in anonymously as a test user.</li>
          <li>What the assistant remembers can answer direct questions, like who's free for badminton at 3, but it doesn't change how matches are ranked yet.</li>
        </ul>
      </section>

      <section className="col sec" id="learned">
        <Reveal as="h2">What I learned</Reveal>
        <p>How we described the product changed what we built. An AI companion would want long calls. Ours wanted short ones that end with a plan.</p>
        <p>The fallback order was our whole answer to "what if no one's around?", so it made sense to protect it with its own check in the build.</p>
        <p>In a one-day build, having the cuts written down kept us from drifting into features nobody would see in the demo.</p>
        <nav className="pager" aria-label="More projects">
          <a className="prev" href="/projects/nus-gym-tracker"><span>Previous</span>NUS Gym Tracker</a>
          <a className="next" href="/projects/uwash"><span>Next</span>UWash</a>
        </nav>
      </section>
    </article>
    </>
  );
}
