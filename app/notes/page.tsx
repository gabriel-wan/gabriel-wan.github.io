import { pageMeta } from "@/lib/metadata";
import { StarField } from "@/components/starfield";
import { Reveal } from "@/components/reveal";
import { NOTES } from "@/lib/notes";

export const metadata = pageMeta({
  "title": "Notes — Gabriel Wan",
  "description": "Things I'm building, breaking and figuring out, written mostly for my own future reference.",
  "path": "/notes"
});

export default function Page() {
  return (
    <>
    <StarField />
    <header className="col page-head">
      <Reveal as="h1">Notes</Reveal>
      <Reveal as="p" className="dek">Things I'm building, breaking and figuring out, written mostly for my own future reference.</Reveal>
    </header>

    <section className="col sec" aria-label="All notes">
      <ul className="index notes">
        {NOTES.map((n) => (
          <li key={n.slug}>
            <span className="date">{n.date.replace(/^\d+ /, "")}<span className="read">{n.read}</span></span>
            <div>
              <h2 className="item"><a href={`/notes/${n.slug}`}>{n.title}</a></h2>
              <p>{n.summary}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
    </>
  );
}
