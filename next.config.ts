import type { NextConfig } from "next";

// A fully static site for GitHub Pages: `next build` writes plain HTML to out/.
// /projects/uwash is written as projects/uwash.html, so the old .html links still work.
const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
};

export default nextConfig;
