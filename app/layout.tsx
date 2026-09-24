import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { RevealObserver } from "@/components/reveal-observer";
import { SiteHeader } from "@/components/site-header";
import { TextHoverEffect } from "@/components/ui/text-hover-effect";
import "./globals.css";

// Loaded straight from Google Fonts (not next/font) so Bodoni keeps the same optical
// size as before; the self-hosted copy rendered with hairline-thin hyphens.
const FONTS = "https://fonts.googleapis.com/css2?family=Bodoni+Moda:opsz,wght@6..96,400&family=Public+Sans:wght@400;500;600&display=swap";

export const metadata: Metadata = {
  metadataBase: new URL("https://gabrielwan.me"),
  authors: [{ name: "Gabriel Wan" }],
  openGraph: { siteName: "Gabriel Wan", type: "website", images: ["/images/og.png"] },
  twitter: { card: "summary_large_image" },
  icons: {
    icon: [
      { url: "/images/icons/favicon.ico", sizes: "any" },
      { url: "/images/icons/favicon-32.png", type: "image/png", sizes: "32x32" },
    ],
    apple: { url: "/images/icons/apple-touch-icon.png", sizes: "180x180" },
  },
};

export const viewport: Viewport = { themeColor: "#000000", colorScheme: "dark" };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        {/* Before first paint: lets CSS hide words that are about to reveal. */}
        <script dangerouslySetInnerHTML={{ __html: 'document.documentElement.classList.add("js")' }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href={FONTS} />
      </head>
      <body>
        <a className="skip" href="#main">
          Skip to content
        </a>
        <SiteHeader />
        <main id="main">{children}</main>
        <footer className="site-footer col">
          <div className="site-bar">
            <p>© 2026 Gabriel Wan</p>
          </div>
          <div className="wordmark">
            <TextHoverEffect text="Gabriel Wan" />
          </div>
        </footer>
        <RevealObserver />
      </body>
    </html>
  );
}
