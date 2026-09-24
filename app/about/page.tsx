import type { Metadata } from "next";
import Link from "next/link";

// Old URL from the previous site. About now lives on the home page.
export const metadata: Metadata = { title: { absolute: "Gabriel Wan" }, robots: { index: false } };

export default function Page() {
  return (
    <section className="col hero">
      <meta httpEquiv="refresh" content="0; url=/#about" />
      <script dangerouslySetInnerHTML={{ __html: 'location.replace("/#about")' }} />
      <p>
        This page has moved to <Link href="/#about">About on the home page</Link>.
      </p>
    </section>
  );
}
