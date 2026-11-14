import { pageMeta } from "@/lib/metadata";
import { StarField } from "@/components/starfield";
import { Reveal } from "@/components/reveal";
import { NotePager } from "@/components/pager";

export const metadata = pageMeta({
  "title": "The 64-bit bug that broke my Telegram bot — Gabriel Wan",
  "description": "How a Telegram user ID ended up stored as 6123456789.0 in SQLite, and why it only affected users with large IDs.",
  "path": "/notes/the-64-bit-bug",
  "type": "article",
  "published": "2026-02-25"
});

export default function Page() {
  return (
    <>
    <StarField />
    <article className="post">
      <header className="col page-head">
        <p className="crumb"><a href="/notes">Notes</a></p>
        <Reveal as="h1">The 64-bit bug that broke my Telegram bot</Reveal>
        <Reveal as="p" className="dek">How a Telegram user ID ended up stored as <code>6123456789.0</code>, and why it only affected some people.</Reveal>
        <p className="dateline"><time dateTime="2026-02-25">25 Feb 2026</time> · 3 min read · About <a href="/projects/lounge-booking">Lounge Booking</a></p>
      </header>

      <section className="col sec">
        <p>In February I was reworking the lounge booking Mini App for my residential college, and before letting everyone use it, I asked some friends to make a few test bookings. A few of them came back saying their bookings weren't showing up.</p>
        <p>The bookings had been saved, and I could see them in the database, but the app just couldn't find them. So I started querying the database and working backwards from what was stored, and it turned out the people affected all had one thing in common: big Telegram IDs. That was about 40% of users. (I'll use 6123456789 as the example here, which isn't a real person's ID.)</p>
      </section>

      <section className="col sec">
        <Reveal as="h2">How it happened</Reveal>
        <h3>Telegram IDs can be big</h3>
        <p>Telegram's docs say a user ID can need more than 32 bits, though never more than 52, so a 64-bit integer or a double can always hold one. Plenty of real IDs are bigger than 2,147,483,647, which is the largest number a signed 32-bit integer can hold.</p>
        <h3>JavaScript handles them fine</h3>
        <p>A JavaScript number is a 64-bit float, which stores whole numbers exactly up to 2<sup>53</sup>, so in Node, 6123456789 is still exactly 6123456789.</p>
        <h3>The SQLite driver treats them differently</h3>
        <p>When <code>node-sqlite3</code> passes a JavaScript number into a query, it first checks whether the number fits in a 32-bit integer. If it does, it's sent as an integer, and if it doesn't, it's sent as a floating-point number instead (the logic is in <code>src/statement.cc</code>).</p>
<pre><code>{`// node-sqlite3, simplified from src/statement.cc
if (fitsInInt32(value)) bindAsInteger(value)   // 123456789
else                    bindAsFloat(value)     // 6123456789.0`}</code></pre>
        <p>That meant small IDs reached SQLite as integers, while big ones reached it as floats.</p>
        <h3>The column was text</h3>
        <p>The <code>telegram_id</code> column was declared as text, which was the right idea, but SQLite converts whatever it gets into the column's type, and a float with nothing after the decimal point becomes text ending in ".0". You can reproduce it in a few lines of Python:</p>
<pre><code>{`db.execute("CREATE TABLE users (telegram_id TEXT UNIQUE)")
db.execute("INSERT INTO users VALUES (?)", (123456789,))     # integer
db.execute("INSERT INTO users VALUES (?)", (6123456789.0,))  # float
db.execute("SELECT telegram_id FROM users").fetchall()
# [('123456789',), ('6123456789.0',)]`}</code></pre>
        <h3>The lookup came from the URL</h3>
        <p>The "my bookings" endpoint read the ID from the URL, <code>/api/bookings/user/6123456789</code>, and anything from a URL is a string, so the query compared "6123456789" with the stored "6123456789.0" and never found a match. For anyone whose ID fit in 32 bits, every step went through cleanly, but for everyone else it broke, and that was the 40%.</p>
      </section>

      <section className="col sec">
        <Reveal as="h2">The fix</Reveal>
        <p>The fix I shipped turns the ID into a plain string everywhere it enters the backend: when a user is created, when bookings are looked up and when one is cancelled.</p>
<pre><code>{`const cleanId = String(telegramUser.id).split('.')[0];`}</code></pre>
        <p>It works, but it's a fix at every entry point, and if I were starting again, I'd turn the ID into a string once, as soon as it arrives from Telegram.</p>
        <p>Honestly, it felt pretty good to crack, and if my friends hadn't tried it first, I'm not sure when I would have found it. The rest of the project is in the <a href="/projects/lounge-booking">Lounge Booking write-up</a>.</p>
      </section>
      <NotePager slug="the-64-bit-bug" />
    </article>
    </>
  );
}
