import { pageMeta } from "@/lib/metadata";
import type { CSSProperties } from "react";
import { Reveal } from "@/components/reveal";

export const metadata = pageMeta({
  "title": "NUS Gym Tracker — Gabriel Wan",
  "description": "A Telegram bot on Cloudflare Workers that tells you how busy the NUS gyms are and saves a reading every 5 minutes. Live since 18 September 2026.",
  "path": "/projects/nus-gym-tracker",
  "ogTitle": "NUS Gym Tracker: saving the gym history NUS doesn't keep",
  "type": "article"
});

export default function Page() {
  return (
    <>
    <article>
      <header className="col page-head">
        <p className="crumb"><a href="/projects">Projects</a></p>
        <Reveal as="h1">NUS Gym Tracker</Reveal>
        <Reveal as="p" className="dek">NUS shows how full its gyms are right now, but keeps no history. I wrote a Telegram bot that tells you how busy the gyms are and saves a reading every 5 minutes, so there will eventually be enough data to say when they're usually quiet.</Reveal>
        <p className="dateline">Sep 2026 – ongoing · Live, collecting since 18 September</p>
        <div className="actions">
          <a className="btn btn-small" href="https://t.me/NUSGymTrackerBot">Open @NUSGymTrackerBot<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 16 16 8M9 8h7v7" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg></a>
          <a className="btn btn-small" href="https://github.com/gabriel-wan/nus-gym-tracker">Code on GitHub<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 16 16 8M9 8h7v7" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg></a>
        </div>
        <figure className="wide artifact">
          <table className="bars">
            <caption className="visually-hidden">Gym readings on Wednesday 17 September 2026 at 20:38</caption>
            <tbody><tr className="is-hi"><th scope="row">University Sports Centre</th><td className="track"><span className="bar" style={{ "--v": "99.1%" } as CSSProperties}></span></td><td className="num">109 / 110</td></tr>
            <tr className="is-flag"><th scope="row">University Town</th><td className="track"><span className="bar" style={{ "--v": "0%" } as CSSProperties}></span></td><td className="num">0 / 120</td></tr></tbody>
          </table>
          <figcaption>What the NUS page showed at 20:38 on a Wednesday, the busiest time of the evening. UTown was closed, but the page shows a closed gym, an empty gym and a broken counter the same way.</figcaption>
        </figure>
      </header>

      <section className="col sec" id="why">
        <Reveal as="h2">Why I built it</Reveal>
        <p>The REBOKS capacity page shows how many people are in each NUS gym right now. It doesn't show anything else, so you can't tell whether 7pm is always this bad or whether 9pm is quieter. On that Wednesday evening the University Sports Centre gym was at 109 out of 110, which is worth knowing before you walk over.</p>
        <p>Other students ask the same things on r/nus.</p>
        <figure className="wide artifact shot">
          <img src="/images/gym-reddit-crowded.webp" alt="A post on r/nus asking when the least crowded time at the U-Town gym is" width="954" height="298" loading="lazy" />
          <img src="/images/gym-reddit-capacity.webp" alt="A post on r/nus asking how to check current gym capacity. REBOKS now redirects to a landing page, and the poster later finds the QR code at the bottom of it" width="985" height="386" loading="lazy" />
          <figcaption>Two posts on r/nus. The first asks when the gym is least crowded, which needs the history the page doesn't keep. The second is from someone who couldn't find the numbers after REBOKS started redirecting.</figcaption>
        </figure>
        <p>Checking also means opening one app, getting redirected to another and reading a page. A Telegram message is quicker, but the history is the main reason I built it. It tracks the University Town and University Sports Centre gyms. REBOKS also lists two pools, which the parser understands but I don't store.</p>
        <figure className="artifact shot">
          <img src="/images/gym-chat.webp" alt="A Telegram chat. A friend asks how the gym bot tracks the gyms. I reply that it pulls the numbers from the REBOKS website, because that's the only place that shows how many people are inside, and that I plan to collect data to predict with a model later" width="705" height="800" loading="lazy" />
          <figcaption>Explaining the bot to a friend the day it started collecting.</figcaption>
        </figure>
      </section>

      <section className="col sec" id="source">
        <Reveal as="h2">Looking at the data source first</Reveal>
        <p>Before writing any of the bot, I spent a whole stage working out how that one page behaves, using a small Python script.</p>
        <p>It needs no login. A plain request with no cookies returns the numbers already written into the HTML, so there's no session handling and no headless browser.</p>
        <p>The page's JavaScript refers to a JSON endpoint for the gym numbers, but every version of that URL I tried returned 404. A path I made up as a control returned exactly the same response, byte for byte, so as far as the server is concerned the endpoint doesn't exist. The page's own auto-refresh is broken too, because it builds its URL from an element that isn't on the page.</p>
        <p>That left parsing the HTML. I used a regex, which I'd normally avoid, but here each facility is one identical machine-generated line with nothing nested inside it. If nothing matches, the parser throws an error instead of returning an empty list, because an empty list would look the same as every gym being empty.</p>
        <p>The page is there for students to look at, so the bot makes one request every 5 minutes, with an honest User-Agent and no aggressive retries.</p>
      </section>

      <section className="col sec" id="how">
        <Reveal as="h2">How it works</Reveal>
        <p>There are two loops sharing one Cloudflare Worker and one database.</p>
        <div className="flows">
          <p className="flow-label">Collecting, every 5 minutes</p>
          <ol className="flow">
            <li>Cron trigger</li><li className="arrow" aria-hidden="true">→</li>
            <li>Worker</li><li className="arrow" aria-hidden="true">→</li>
            <li>Fetch the REBOKS page</li><li className="arrow" aria-hidden="true">→</li>
            <li>Parse</li><li className="arrow" aria-hidden="true">→</li>
            <li>Save to D1</li>
          </ol>
          <p className="flow-label">Answering, when someone asks</p>
          <ol className="flow">
            <li>/gym on Telegram</li><li className="arrow" aria-hidden="true">→</li>
            <li>Webhook</li><li className="arrow" aria-hidden="true">→</li>
            <li>Worker</li><li className="arrow" aria-hidden="true">→</li>
            <li>Read from D1</li><li className="arrow" aria-hidden="true">→</li>
            <li>Reply</li>
          </ol>
        </div>
        <p>The bot answers <code>/gym</code> with both gyms right now, and <code>/history</code> with today's readings as a small bar chart. It's written in TypeScript and costs nothing to run: Cloudflare's free tier covers it with about 250 times the headroom it needs. There are 58 tests, including the parser against a real saved copy of the page.</p>
        <figure className="artifact shot">
          <img src="/images/gym-bot.webp" alt="The bot's reply to /gym: USC Gym 17 of 110, 15%, UTown Gym 45 of 120, 38%, USC Gym is quieter right now, updated 3 minutes ago, and a warning that counts are based on QR scans" width="700" height="456" loading="lazy" />
          <figcaption>The reply to <code>/gym</code>, with the warning about QR scans at the bottom.</figcaption>
        </figure>
      </section>

      <section className="col sec" id="decisions">
        <Reveal as="h2">Decisions</Reveal>
        <h3>Answering from the database</h3>
        <p>The bot never scrapes when someone asks. It reads the latest saved row, so NUS gets the same 12 requests an hour however many people use it, and replies are instant.</p>
        <h3>Webhooks for Telegram</h3>
        <p>Long polling needs a process running all the time. Webhooks let the whole thing run serverless.</p>
        <h3>Saving when I collected it</h3>
        <p>The page's "last updated" time is just when the page was rendered, and cron triggers don't fire exactly on time. The collection time is the only honest timestamp. It's stored in UTC and converted to Singapore time for display.</p>
        <h3>Saving the capacity every time</h3>
        <p>Capacity seems to change, so it's stored with each reading instead of once per gym.</p>
        <h3>No prediction yet</h3>
        <p>The limit here is how many weeks of data there are. A week has about 105 day-and-hour slots, and I only get one new reading of each per week. A prediction has to beat a plain average for that day and hour, and that needs about a month of data.</p>
        <h3>Hiding numbers after closing</h3>
        <p>After 22:00 the counter freezes. Showing that number would describe an empty building, and showing 0 would be a number REBOKS never reported, so the bot shows nothing outside opening hours.</p>
        <h3>16-character bars</h3>
        <p>Telegram's font is proportional, so the chart has to be in monospace. At 10 characters wide, 15% and 25% looked the same. I also dropped the character for the empty part of the bar, because in some fonts it's a different width from the filled one and it skewed every row.</p>
      </section>

      <section className="col sec" id="data">
        <Reveal as="h2">What the data showed</Reveal>
        <h3>A zero can mean three different things</h3>
        <p>Look at the readings at the top of this page: one gym at 99% and the other at exactly 0, at the busiest time of the evening. UTown was closed and reopened the next day, but I only knew because someone told me. The page shows a closed gym, an empty gym and a broken counter the same way, so zeros are saved as reported and never shown as "empty".</p>
        <h3>The counter freezes at closing</h3>
        <div className="table-scroll">
          <table className="table">
            <caption className="visually-hidden">Readings around closing time, Saturday 19 September 2026</caption>
            <thead><tr><th>Sat 19 Sep</th><th className="num">UTown</th><th className="num">USC</th></tr></thead>
            <tbody>
              <tr><td>21:00</td><td className="num">65.3</td><td className="num">40.0</td></tr>
              <tr><td>21:30</td><td className="num">64.8</td><td className="num">36.2</td></tr>
              <tr className="hi"><td>22:00, closing</td><td className="num">61.0</td><td className="num">31.0</td></tr>
              <tr><td>22:30</td><td className="num">61.0</td><td className="num">31.0</td></tr>
              <tr><td>23:00</td><td className="num">61.0</td><td className="num">31.0</td></tr>
              <tr><td>23:30</td><td className="num">61.0</td><td className="num">31.0</td></tr>
            </tbody>
          </table>
        </div>
        <p>Nothing changes for two hours after closing, and both gyms read 0 again at 06:00. Four days of data answered something the page couldn't: the count resets overnight. So I collect from 06:00 to 23:59 but only analyse 07:00 to 22:00. The frozen number is still useful as a rough count of how many people came that day.</p>
        <h3>It's counting QR scans</h3>
        <p>People scan in and mostly don't scan out, so the number drifts upward through the day. That's why the bot tells you which gym is quieter. Both are counted the same way, so comparing them is more reliable than either number on its own.</p>
        <h3>Still open</h3>
        <p>USC's count goes up and down during the day. UTown's climbs and mostly stays there. If UTown users scan out less, comparing the two by percentage is shakier than it looks, and I don't have enough weeks of data to say yet.</p>
      </section>

      <section className="col sec" id="wrong">
        <Reveal as="h2">What went wrong</Reveal>
        <h3>I tested the database layer late</h3>
        <p>The pure functions had tests from the start. The D1 queries and the webhook didn't, until I added tests that run inside Cloudflare's own runtime, and that untested layer is where a real bug with stale data turned out to be.</p>
        <h3>Missed readings can't be recovered</h3>
        <p>NUS sometimes returns an error, and a gap in the history is gone for good. I added an optional alert when collection fails. So it doesn't alert every 5 minutes during an outage, it checks how old the newest saved row is before sending another. Retrying once on failure is still on the to-do list.</p>
      </section>

      <section className="col sec" id="learned">
        <Reveal as="h2">What I learned</Reveal>
        <p>Most of the design came from the stage where I only looked at the data source. I'd do that first again on anything that depends on someone else's page.</p>
        <p>The failures that worry me are the quiet ones. If REBOKS changes its HTML the parser crashes and I find out, but a broken counter reading 0 looks exactly like real data.</p>
        <p>I'm also holding off on features until there's data for them. "Best time to go" and predictions can wait until there's a month of readings.</p>
      </section>

      <section className="col sec" id="next">
        <Reveal as="h2">What's next</Reveal>
        <ul>
          <li><code>/best</code>: the quietest time today, once there are four weeks of data.</li>
          <li><code>/predict</code>: how busy it'll be in 30 to 90 minutes, only if it beats the plain average.</li>
          <li><code>/alert</code>: a message when a gym drops below a level you pick.</li>
        </ul>
        <nav className="pager" aria-label="More projects">
          <a className="prev" href="/projects/lounge-booking"><span>Previous</span>Lounge Booking</a>
          <a className="next" href="/projects/kopikaki"><span>Next</span>KopiKaki</a>
        </nav>
      </section>
    </article>
    </>
  );
}
