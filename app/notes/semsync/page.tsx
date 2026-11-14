import { pageMeta } from "@/lib/metadata";
import { ShimmerLink } from "@/components/ui/shimmer-button";
import { StarField } from "@/components/starfield";
import { Reveal } from "@/components/reveal";
import { NotePager } from "@/components/pager";
import { ProjectArt } from "@/components/project-art";

export const metadata = pageMeta({
  "title": "Putting my semester in my calendar — Gabriel Wan",
  "description": "Why I built Semsync, which puts Canvas deadlines, NUSMods classes and exams into Google Calendar by itself, and the Google permission that took longest to get right.",
  "path": "/notes/semsync",
  "image": "/videos/semsync.jpg",
  "type": "article",
  "published": "2026-11-14"
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
    <article className="post">
      <header className="col page-head">
        <p className="crumb"><a href="/notes">Notes</a></p>
        <Reveal as="h1">Putting my semester in my calendar</Reveal>
        <Reveal as="p" className="dek">Canvas deadlines, NUSMods classes and exams in my Google Calendar, without typing any of it in.</Reveal>
        <p className="dateline"><time dateTime="2026-11-14">14 Nov 2026</time> · 3 min read · About <a href="/projects/semsync">Semsync</a></p>
        <div className="actions">
          <ShimmerLink background="#151e28" shimmerColor="#d6ebff" shimmerSize="2px" className="shim gap-1.5 px-3.5 py-1.5 text-[13px] font-medium border-white/25" href="https://semsync.live">Try it<Arrow /></ShimmerLink>
          <ShimmerLink background="#151e28" shimmerColor="#d6ebff" shimmerSize="2px" className="shim gap-1.5 px-3.5 py-1.5 text-[13px] font-medium border-white/25" href="https://github.com/gabriel-wan/semsync">Code on GitHub<Arrow /></ShimmerLink>
        </div>
      </header>

      <section className="col sec">
        <p>I rely on my calendar a lot, and if something isn't in it, there's a good chance I'll forget about it. As a student, a big part of my life is classes, deadlines and exams, but none of them ended up in my calendar on their own. Deadlines lived on Canvas, my timetable lived on NUSMods, and I'd been meaning to build something that put them together for a really long time.</p>
        <p>I was already working on it when a friend, Kei Lok, launched his own product, <a href="https://cue.8starlabs.com">Cue</a>, a free terminal autocomplete for Apple Terminal and VS Code (go support him!). Seeing that made me rush to get mine out the same day. Positive peer pressure, I guess.</p>
        <p>Semsync takes your Canvas calendar link and your NUSMods timetable link and puts your deadlines, classes and exams into Google Calendar. It checks Canvas every hour, so if a deadline moves, it moves in your calendar too.</p>
        <figure className="artifact shot">
          <ProjectArt art={{ src: "/videos/semsync.jpg", video: "/videos/semsync.mp4", alt: "Pasting the Canvas and NUSMods links into Semsync, then a week of classes and deadlines filling the calendar, a deadline moving when Canvas changes, and one being ticked off", width: 1920, height: 1080 }} />
        </figure>
        <p>I built it for myself first and then shared it with people around me. I'm not really pushing it, but it's been nice to see about ten real people using it so far.</p>
      </section>

      <section className="col sec">
        <Reveal as="h2">The part that took longest</Reveal>
        <p>Surprisingly, it wasn't Canvas or NUSMods. It was Google sign-in, and working out how much access Semsync should ask for.</p>
        <p>My first version asked for access to your whole calendar. Google counts that as sensitive, so everyone signing in was shown a warning that the app wasn't verified, and an unverified app asking for that much can only have 100 users. Getting verified means going through Google's review process, which felt like a lot for a side project.</p>
        <p>What fixed it was asking for less. There's a permission that only lets an app manage calendars it created itself, and since that one doesn't need a review, Semsync now makes its own "NUS semester" calendar and only ever touches that. The warning and the 100-user cap both went away, and as a bonus, Semsync can't see anything else in your calendar. The catch was that I made the change on launch day, so the first few people who had signed up had to connect Google one more time.</p>
      </section>

      <section className="col sec">
        <Reveal as="h2">The first feedback</Reveal>
        <p>It came as a GitHub issue from a friend. Semsync used to remind you a day and three hours before every deadline, and they wanted an earlier heads-up for bigger assignments, along with a way to stop the reminders once something was handed in. Both were in two days later, so you can now choose your own reminder times and tick off a deadline to stop its reminders.</p>
      </section>

      <section className="col sec">
        <Reveal as="h2">Where it is now</Reveal>
        <p>I like it a lot, and I'll definitely be using it for a long time to come. If I add anything, it might be reading Canvas announcements and pulling the dates out of them, but that would need a Canvas API token, which is a lot more access than a calendar link, so I haven't decided yet. I've also wondered about opening it up to other universities, which I'm still thinking about.</p>
        <p>It's free at <a href="https://semsync.live">semsync.live</a>, and the code is on <a href="https://github.com/gabriel-wan/semsync">GitHub</a>.</p>
      </section>
      <NotePager slug="semsync" />
    </article>
    </>
  );
}
