import { pageMeta } from "@/lib/metadata";
import { ShimmerLink } from "@/components/ui/shimmer-button";
import { StarField } from "@/components/starfield";
import { Reveal } from "@/components/reveal";
import { ProjectPager } from "@/components/pager";
import { ProjectArt } from "@/components/project-art";

export const metadata = pageMeta({
  "title": "Semsync — Gabriel Wan",
  "description": "Semsync puts Canvas deadlines, NUSMods classes and exams into your calendar and keeps them up to date. How it works, and the decisions behind it.",
  "path": "/projects/semsync",
  "image": "/videos/semsync.jpg",
  "ogTitle": "Semsync: Canvas and NUSMods in your calendar, kept up to date",
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
        <Reveal as="h1">Semsync</Reveal>
        <Reveal as="p" className="dek">Paste two links once, and your Canvas deadlines, NUSMods classes and exams stay in your calendar for the rest of the semester.</Reveal>
        <p className="dateline">Nov 2026 · Live at semsync.live · about ten people using it</p>
        <div className="actions">
          <ShimmerLink background="#151e28" shimmerColor="#d6ebff" shimmerSize="2px" className="shim gap-1.5 px-3.5 py-1.5 text-[13px] font-medium border-white/25" href="https://semsync.live">Try it<Arrow /></ShimmerLink>
          <ShimmerLink background="#151e28" shimmerColor="#d6ebff" shimmerSize="2px" className="shim gap-1.5 px-3.5 py-1.5 text-[13px] font-medium border-white/25" href="https://github.com/gabriel-wan/semsync">Code on GitHub<Arrow /></ShimmerLink>
        </div>
        <figure className="wide artifact shot">
          <ProjectArt art={{ src: "/videos/semsync.jpg", video: "/videos/semsync.mp4", alt: "Pasting the Canvas and NUSMods links into Semsync, then a week of classes and deadlines filling the calendar, a deadline moving when Canvas changes, and one being ticked off", width: 1920, height: 1080 }} />
          <figcaption>Pasting the two links, then a week filling in. When a deadline moves on Canvas, it moves in the calendar too.</figcaption>
        </figure>
      </header>

      <section className="col sec" id="why">
        <Reveal as="h2">Why I built it</Reveal>
        <p>My deadlines lived on Canvas and my timetable on NUSMods, but the place I actually look is my calendar. I wrote about why I built it, and about the first feedback, in <a href="/notes/semsync">a note</a>. This page is about how it works.</p>
      </section>

      <section className="col sec" id="how">
        <Reveal as="h2">How it works</Reveal>
        <p>You sign in with Google and paste your Canvas calendar link, plus your NUSMods share link if you want your classes too. From then on, Semsync keeps a calendar called "NUS semester" up to date: deadlines titled with their module code, classes only in the weeks they actually run, your exams, a "Week N" label at the top of each week and a colour for each module. A semester comes to about 250 events. Google Calendar gets them directly, and Outlook, Apple Calendar and Notion Calendar can subscribe to a feed with the same events.</p>
        <div className="flows">
          <p className="flow-label">About once an hour, for each person</p>
          <ol className="flow">
            <li>Canvas feed + NUSMods</li><li className="arrow" aria-hidden="true">→</li>
            <li>Build the semester's events</li><li className="arrow" aria-hidden="true">→</li>
            <li>Compare with the last sync</li><li className="arrow" aria-hidden="true">→</li>
            <li>Send only the changes to Google</li>
          </ol>
        </div>
        <p>A scheduled job in the database runs every 20 minutes and picks up anyone who hasn't been synced in the last hour. For each of them, Semsync downloads the Canvas feed and works out the semester's classes from the NUSMods API, leaving out recess week, public holidays and NUS Well-Being Days, then compares the result with what it sent last time.</p>
      </section>

      <section className="col sec" id="decisions">
        <Reveal as="h2">Decisions</Reveal>
        <h3>Only touching its own calendar</h3>
        <p>Semsync only asks Google for permission to manage calendars it created, so everything goes into its own "NUS semester" calendar and it can't see anything else in yours. Google treats that permission as non-sensitive, which also means there's no "unverified app" warning and no 100-user cap. The <a href="/notes/semsync">note</a> has the story of how I got there.</p>
        <h3>Doing nothing when nothing changed</h3>
        <p>Every event gets an ID worked out from where it came from, so the same deadline always maps to the same calendar event, and Semsync keeps a hash of each event it sent. That way a sync only sends what's new, moved or gone. Most hours nothing has changed at all, so after downloading the Canvas feed, Semsync compares a fingerprint of everything that goes into your calendar with last time's and stops there if they match. It also never deletes past events, since Canvas drops items from its feed about 30 days after they happen.</p>
        <h3>Treating the Canvas link like a password</h3>
        <p>Anyone with your Canvas calendar link can read your deadlines, so Semsync encrypts it before storing it, along with your Google sign-in. Subscription links are only ever stored as hashes.</p>
        <h3>Letting an AI read it, carefully</h3>
        <p>Semsync also has an MCP server, so you can ask an assistant like Claude what's due this week. It's read-only, and it never returns links, rooms or descriptions, because an assistant might follow instructions hidden in them.</p>
      </section>

      <section className="col sec" id="stack">
        <Reveal as="h2">What it runs on</Reveal>
        <p>It's written in TypeScript with Hono, and runs on Vercel with Postgres on Supabase, both in Singapore. I tried Cloudflare D1 and then Turso first, and moved to Supabase on the third day because Turso had no Singapore region. There are about 200 tests, which run in GitHub Actions against an in-memory Postgres.</p>
      </section>
      <ProjectPager href="/projects/semsync" />
    </article>
    </>
  );
}
