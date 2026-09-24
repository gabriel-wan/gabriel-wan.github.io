import { pageMeta } from "@/lib/metadata";
import { ShimmerLink } from "@/components/ui/shimmer-button";
import { Reveal } from "@/components/reveal";

export const metadata = pageMeta({
  "title": "Lounge Booking — Gabriel Wan",
  "description": "A Telegram Mini App for booking the shared lounges in my residential college at NUS. About 130 residents use it, and for a while a bug with large Telegram IDs broke it for 40% of them.",
  "path": "/projects/lounge-booking",
  "ogTitle": "Lounge Booking: a Telegram Mini App used by 130+ residents",
  "type": "article"
});

export default function Page() {
  return (
    <>
    <article>
      <header className="col page-head">
        <p className="crumb"><a href="/projects">Projects</a></p>
        <Reveal as="h1">Lounge Booking</Reveal>
        <Reveal as="p" className="dek">A Telegram Mini App for booking the three shared lounges in my residential college at NUS. About 130 residents use it, and for a while a bug broke it for 40% of them.</Reveal>
        <p className="dateline">Feb 2026 – now · In use by about 130 residents</p>
        <div className="actions">
          <ShimmerLink background="#90bde2" shimmerColor="#ffffff" shimmerSize="0.1em" className="shim gap-1.5 px-3.5 py-1.5 text-[13px] font-medium text-black" href="https://github.com/Garuda-Techs/LoungeBookingBot">Code on GitHub<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 16 16 8M9 8h7v7" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg></ShimmerLink>
        </div>
        <figure className="wide artifact shot-phone">
          <div className="frame"><img src="/images/lounge-booking.jpg" alt="The app: a floor switcher for Levels 9 to 11, upcoming bookings for Level 9, a month calendar and a My Bookings list" width="450" height="850" /></div>
          <figcaption>Pick a floor, see what's already taken, then pick a date. Nobody signs up: the name at the top comes from Telegram.</figcaption>
        </figure>
      </header>

      <section className="col sec" id="why">
        <Reveal as="h2">Why I built it</Reveal>
        <p>Garuda House, my house at the College of Alice &amp; Peter Tan (CAPT), has shared lounges on Levels 9, 10 and 11. People need to see what's free and book a slot without clashing with someone else. The app belongs to Garuda Techs, the house committee's tech team, which I'm part of.</p>
        <p>I made it a Telegram Mini App because that's where residents already talk to each other. It opens inside the chat and Telegram already knows who you are, so there's no sign-up or password, and every booking comes with a name attached.</p>
      </section>

      <section className="col sec" id="built">
        <Reveal as="h2">What it does</Reveal>
        <ul>
          <li>Each lounge has its own calendar and bookings.</li>
          <li>You can book several hours in a row at once, and the server checks for overlaps on that floor.</li>
          <li>Consecutive hours show up as one block, like 12:00–15:00.</li>
          <li>Each floor has a strip of upcoming bookings, so you can see what's taken at a glance.</li>
          <li>Admins can cancel bookings, and the list of admins lives in an environment variable.</li>
        </ul>
        <p>I'm the main developer. From mid-February I reworked the first version into the one residents use now, fixed the bugs below, and built the interface and the admin tools. 46 of the 54 commits in the repository are mine. It runs on Node.js, Express and SQLite, hosted on Railway.</p>
      </section>

      <section className="col sec" id="decisions">
        <Reveal as="h2">Decisions</Reveal>
        <h3>One row per hour</h3>
        <p>Each booked hour is its own row in the database, which keeps the overlap check simple because an hour is either taken or it isn't. The interface merges consecutive hours so people see 12:00–15:00 instead of three separate entries.</p>
        <h3>Admins in an environment variable</h3>
        <p>Committee members change. Adding or removing an admin is a variable change on Railway, with no code change or redeploy.</p>
        <h3>SQLite on a volume</h3>
        <p>For one house's bookings, a separate database server would just be one more thing to run. The SQLite file sits on a Railway volume so it survives restarts and redeploys.</p>
      </section>

      <section className="col sec" id="wrong">
        <Reveal as="h2">What went wrong</Reveal>
        <h3>The app couldn't find 40% of users' bookings</h3>
        <p>Telegram user IDs can be bigger than 2,147,483,647, the largest 32-bit integer. The SQLite driver sends a JavaScript number to the database as an integer if it fits in 32 bits, and as a floating-point number if it doesn't. The ID column was text, so SQLite stored the big IDs as <code>6123456789.0</code>. Everyone whose ID was below that threshold was fine.</p>
        <p>The "my bookings" lookup used the ID from the URL, <code>6123456789</code>, which never matched. I fixed it by turning every ID into a plain string wherever it comes into the backend (<code>String(id).split('.')[0]</code> when creating a user, looking up bookings and cancelling). There's a <a href="/notes/the-64-bit-bug">longer write-up in a note</a>.</p>
        <h3>The rate limiter was blocking the wrong people</h3>
        <p>Behind Railway's proxy, every request looked like it came from the proxy instead of from each resident, which threw off the per-user rate limit. Setting Express to trust the proxy's forwarded address fixed it.</p>
        <h3>Identity came from the client</h3>
        <p>The early version took the user's Telegram ID from the request, so someone could send a hand-made request and act as another resident. In August a teammate moved identity to the server. Every request now carries Telegram's signed <code>initData</code>, and the server checks the signature before trusting it. User-supplied names are now escaped too, which closed a stored XSS hole.</p>
      </section>

      <section className="col sec" id="learned">
        <Reveal as="h2">What I learned</Reveal>
        <p>IDs shouldn't be numbers. You never do maths on a Telegram ID, so it should be a string from the moment it arrives. This bug also only shows up for IDs above one threshold, so whether you'd ever notice it depends on whose accounts you test with.</p>
        <p>In a Mini App, the server should check what Telegram signed instead of trusting whatever ID the client sends.</p>
        <p>A lot of what broke only exists in production: the proxy, restarts and the volume. None of that was on my laptop.</p>
        <nav className="pager" aria-label="More projects">
          <a className="prev" href="/projects/mini-gabriel"><span>Previous</span>MiniGabriel</a>
          <a className="next" href="/projects/nus-gym-tracker"><span>Next</span>NUS Gym Tracker</a>
        </nav>
      </section>
    </article>
    </>
  );
}
