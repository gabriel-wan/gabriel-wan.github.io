// The last version of the site used /projects/ and /notes/ with a trailing slash.
// Next.js writes projects.html and notes.html, so also write them as folder indexes.
import { copyFileSync } from "node:fs";

for (const page of ["projects", "notes"]) {
  copyFileSync(`out/${page}.html`, `out/${page}/index.html`);
}
