import { pageMeta } from "@/lib/metadata";
import { StarField } from "@/components/starfield";
import { Reveal } from "@/components/reveal";

export const metadata = pageMeta({
  "title": "The 64-bit bug that broke my Telegram bot — Gabriel Wan",
  "description": "How a Telegram user ID ended up stored as 6123456789.0 in SQLite, and why it only affected users with large IDs.",
  "path": "/notes/the-64-bit-bug",
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
        <Reveal as="h1">The 64-bit bug that broke my Telegram bot</Reveal>
        <Reveal as="p" className="dek">How a Telegram user ID ended up stored as <code>6123456789.0</code>, and why it only affected some people.</Reveal>
        <p className="dateline"><time dateTime="2026-09-23">23 Sep 2026</time> · 4 minute read · About <a href="/projects/lounge-booking">Lounge Booking</a></p>
      </header>

      <section className="col sec">
        <p>In February I was reworking the lounge booking Mini App for my residential college, which about 130 residents use now. Some residents, about 40% of them, couldn't see their own bookings.</p>
        <p>When a bug only hits some users, the first thing to work out is what those users have in common. Here it was the size of their Telegram ID. (I'll use 6123456789 as the example throughout. It isn't a real person's ID.)</p>
      </section>

      <section className="col sec">
        <Reveal as="h2">How it happened</Reveal>
        <h3>Telegram IDs can be big</h3>
        <p>Telegram's docs say a user ID can need more than 32 bits, though never more than 52, so a 64-bit integer or a double can always hold one. Plenty of real IDs are bigger than 2,147,483,647, the largest number a signed 32-bit integer can hold.</p>
        <h3>JavaScript handles them fine</h3>
        <p>A JavaScript number is a 64-bit float, which stores whole numbers exactly up to 2<sup>53</sup>. In Node, 6123456789 is still exactly 6123456789.</p>
        <h3>The SQLite driver treats them differently</h3>
        <p>When <code>node-sqlite3</code> passes a JavaScript number into a query, it checks whether the number fits in a 32-bit integer. If it does, it's sent as an integer. If it doesn't, it's sent as a floating-point number. The logic is in <code>src/statement.cc</code>.</p>
<pre><code>{`// node-sqlite3, simplified from src/statement.cc
if (fitsInInt32(value)) bindAsInteger(value)   // 123456789
else                    bindAsFloat(value)     // 6123456789.0`}</code></pre>
        <p>So small IDs reached SQLite as integers and big ones reached it as floats.</p>
        <h3>The column was text</h3>
        <p>The <code>telegram_id</code> column was declared as text, which was the right idea. But SQLite converts whatever it gets into the column's type, and a float with nothing after the decimal point becomes text ending in ".0". You can reproduce it in a few lines of Python:</p>
<pre><code>{`db.execute("CREATE TABLE users (telegram_id TEXT UNIQUE)")
db.execute("INSERT INTO users VALUES (?)", (123456789,))     # integer
db.execute("INSERT INTO users VALUES (?)", (6123456789.0,))  # float
db.execute("SELECT telegram_id FROM users").fetchall()
# [('123456789',), ('6123456789.0',)]`}</code></pre>
        <h3>The lookup came from the URL</h3>
        <p>The "my bookings" endpoint read the ID from the URL, <code>/api/bookings/user/6123456789</code>. Anything from a URL is a string, so the query compared "6123456789" with the stored "6123456789.0", and they never matched. The bookings were in the database. The app just couldn't find them.</p>
        <p>For anyone whose ID fit in 32 bits, every step went through cleanly. For everyone else, it broke. That was the 40%.</p>
      </section>

      <section className="col sec">
        <Reveal as="h2">The fix</Reveal>
        <p>The fix I shipped turns the ID into a plain string everywhere it enters the backend: when a user is created, when bookings are looked up and when one is cancelled.</p>
<pre><code>{`const cleanId = String(telegramUser.id).split('.')[0];`}</code></pre>
        <p>It works, but it's a fix at every entry point. If I were starting again, I'd turn the ID into a string once, as soon as it arrives from Telegram, and never let it be a number anywhere in the code.</p>
      </section>

      <section className="col sec">
        <Reveal as="h2">What I took from it</Reveal>
        <p>You never do maths on an ID, so it shouldn't be a number. The same goes for phone numbers, postal codes and student numbers.</p>
        <p>The value went through Telegram's JSON, JavaScript, the driver and SQLite, then came back out through a URL. Each of those steps was reasonable on its own, and the bug was in how they fit together. Now I check what type a value is after it crosses one of those boundaries.</p>
        <p>Whether you ever see this bug depends on whose accounts you test with, which is a good reason to test with data that looks like your real users' and not just your own.</p>
        <p>The rest of the project, including a rate limiter that got confused by a proxy, is in the <a href="/projects/lounge-booking">Lounge Booking write-up</a>.</p>
      </section>
    </article>
    </>
  );
}
