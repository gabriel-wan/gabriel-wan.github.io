import type { ReactNode } from "react";

// The notes, newest first. The Notes page lists them in this order, and each note links
// to the one before and after it.
export type Note = { slug: string; title: string; date: string; read: string; summary: ReactNode };

export const NOTES: Note[] = [
  {
    slug: "semsync",
    title: "Putting my semester in my calendar",
    date: "14 Nov 2026",
    read: "3 min read",
    summary: "Why I built Semsync, and the Google permission that took longest to get right.",
  },
  {
    slug: "fine-tuning-an-llm-on-myself",
    title: "Why I fine-tuned an LLM on myself",
    date: "23 Sep 2026",
    read: "2 min read",
    summary: "I use LLMs every day but had never trained one, so I tried to get one to text like me.",
  },
  {
    slug: "the-64-bit-bug",
    title: "The 64-bit bug that broke my Telegram bot",
    date: "25 Feb 2026",
    read: "3 min read",
    summary: (
      <>
        Friends testing my lounge booking app couldn&apos;t see their bookings. The reason was a <code>.0</code>.
      </>
    ),
  },
];
