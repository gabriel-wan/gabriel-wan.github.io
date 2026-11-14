import { NOTES } from "@/lib/notes";
import { PROJECTS } from "@/lib/projects";

// The cards at the end of a note or a write-up: the one before and the one up next, in the
// same order as the Notes page and the home page's projects.

function Pager({ label, prev, next }: { label: string; prev?: { href: string; title: string }; next?: { href: string; title: string } }) {
  if (!prev && !next) return null;
  return (
    <section className="col sec">
      <nav className="pager" aria-label={label}>
        {prev && (
          <a className="prev" href={prev.href}>
            <span>Previous</span>
            {prev.title}
          </a>
        )}
        {next && (
          <a className="next" href={next.href}>
            <span>Next up</span>
            {next.title}
          </a>
        )}
      </nav>
    </section>
  );
}

export function NotePager({ slug }: { slug: string }) {
  const i = NOTES.findIndex((n) => n.slug === slug);
  const link = (n?: (typeof NOTES)[number]) => n && { href: `/notes/${n.slug}`, title: n.title };
  return <Pager label="More notes" prev={link(NOTES[i - 1])} next={link(NOTES[i + 1])} />;
}

// Projects that have a write-up here, in the order the home page shows them.
const WRITE_UPS = PROJECTS.filter((p) => p.href.startsWith("/projects/"));

export function ProjectPager({ href }: { href: string }) {
  const i = WRITE_UPS.findIndex((p) => p.href === href);
  const link = (p?: (typeof WRITE_UPS)[number]) => p && { href: p.href, title: p.title };
  return <Pager label="More projects" prev={link(WRITE_UPS[i - 1])} next={link(WRITE_UPS[i + 1])} />;
}
