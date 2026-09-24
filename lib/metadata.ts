import type { Metadata } from "next";

// Per-page metadata. Next.js replaces (not merges) openGraph from the layout,
// so the site name and link-preview image are filled in here for every page.
export function pageMeta(m: {
  title: string;
  description: string;
  path: string;
  ogTitle?: string;
  type?: "website" | "article";
  published?: string;
  noindex?: boolean;
}): Metadata {
  return {
    title: { absolute: m.title },
    description: m.description,
    alternates: { canonical: m.path },
    robots: m.noindex ? { index: false } : undefined,
    openGraph: {
      siteName: "Gabriel Wan",
      title: m.ogTitle ?? m.title.replace(" — Gabriel Wan", ""),
      description: m.description,
      url: m.path,
      images: ["/images/og.png?v=2"],
      ...(m.type === "article" ? { type: "article", publishedTime: m.published } : { type: "website" }),
    },
  };
}
