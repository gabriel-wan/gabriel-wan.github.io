import type { Metadata } from "next";
import Link from "next/link";

// Old URL from the previous site. Work now lives on the home page.
export const metadata: Metadata = { title: { absolute: "Gabriel Wan" }, robots: { index: false } };

export default function Page() {
  return (
    <section className="col hero">
      <meta httpEquiv="refresh" content="0; url=/#work" />
      <script dangerouslySetInnerHTML={{ __html: 'location.replace("/#work")' }} />
      <p>
        This page has moved to <Link href="/#work">Work on the home page</Link>.
      </p>
    </section>
  );
}
