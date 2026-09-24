import { pageMeta } from "@/lib/metadata";
import { SkyStrip } from "@/components/sky-strip";
import { Reveal } from "@/components/reveal";

export const metadata = pageMeta({
  "title": "Page not found — Gabriel Wan",
  "description": "This page doesn't exist.",
  "path": "/404",
  "noindex": true
});

export default function NotFound() {
  return (
    <>
    <SkyStrip />
    <header className="col page-head">
      <p className="crumb">404</p>
      <Reveal as="h1">This page doesn't exist</Reveal>
      <Reveal as="p" className="dek">It might have moved when I reorganised the site. The <a href="/projects">projects</a> and <a href="/notes">notes</a> are good places to start.</Reveal>
    </header>
    </>
  );
}
