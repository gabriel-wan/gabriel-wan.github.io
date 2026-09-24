"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

// Reveals each .split element the first time it scrolls into view. Until this runs,
// CSS keeps the words hidden, with a failsafe that shows them if it never does.
export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(".split:not(.in)");
    document.documentElement.classList.add("reveal-ready");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("in", "revealed"));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target as HTMLElement;
        observer.unobserve(el);
        el.classList.add("in");
        window.setTimeout(() => el.classList.add("revealed"), Number(el.dataset.revealMs) || 1400);
      });
    });
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
