"use client";

import { useEffect, useRef, type ReactNode } from "react";

// The project strip on the home page. With a mouse or trackpad, the section locks in
// the middle of the screen while you scroll and the projects slide sideways. On touch
// screens, with reduced motion, or in a window too short to lock it, it's a strip you
// swipe or scroll sideways. Either way the project nearest the centre is highlighted
// and the line underneath shows how far along you are.
export function ProjectWheel({ children, ...rest }: { children: ReactNode } & Record<string, unknown>) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = ref.current;
    if (!section) return;
    const stage = section.querySelector<HTMLElement>(".wheel-stage")!;
    const inner = section.querySelector<HTMLElement>(".wheel-inner")!;
    const wheel = section.querySelector<HTMLElement>(".wheel")!;
    const track = section.querySelector<HTMLElement>(".wheel-track")!;
    const fill = section.querySelector<HTMLElement>(".wheel-progress span");
    const items = Array.from(track.children) as HTMLElement[];
    const canPin = window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    let pinned = false;
    let distance = 0;
    let pinTop = 0;
    let active = -1;

    // How far the strip has to move for this item to sit in the centre.
    const offsetFor = (item: HTMLElement) => item.offsetLeft + item.offsetWidth / 2 - wheel.clientWidth / 2;

    function update() {
      let position: number;
      let progress: number;
      if (pinned) {
        progress = distance ? Math.min(1, Math.max(0, (pinTop - section!.getBoundingClientRect().top) / distance)) : 0;
        position = progress * distance;
        track.style.transform = `translate3d(${-position}px, 0, 0)`;
        if (wheel.scrollLeft) wheel.scrollLeft = 0;
      } else {
        const max = wheel.scrollWidth - wheel.clientWidth;
        position = wheel.scrollLeft;
        progress = max > 0 ? position / max : 0;
      }
      if (fill) fill.style.transform = `scaleX(${progress})`;

      let best = 0;
      let bestGap = Infinity;
      items.forEach((item, i) => {
        const gap = Math.abs(offsetFor(item) - position);
        if (gap < bestGap) {
          bestGap = gap;
          best = i;
        }
      });
      if (best !== active) {
        active = best;
        items.forEach((item, i) => item.classList.toggle("is-active", i === best));
      }
    }

    function layout() {
      distance = Math.max(0, track.offsetWidth - wheel.clientWidth);
      const pin = canPin.matches && distance > 0 && inner.offsetHeight <= window.innerHeight;
      if (pin !== pinned) {
        pinned = pin;
        wheel.scrollLeft = 0;
        section!.classList.toggle("is-pinned", pin);
        if (!pin) {
          section!.style.height = "";
          track.style.transform = "";
        }
      }
      // The stage sticks centred on screen; the section's extra height is the sideways distance.
      if (pinned) {
        pinTop = Math.max(0, (window.innerHeight - stage.offsetHeight) / 2);
        section!.style.setProperty("--pin-top", `${pinTop}px`);
        section!.style.height = `${stage.offsetHeight + distance}px`;
      }
      update();
    }

    let queued = false;
    const queue = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        update();
      });
    };
    const onWindowScroll = () => pinned && queue();
    const onWheelScroll = () => !pinned && queue();

    // Tabbing onto a project scrolls the page to where that project is centred.
    const focusHandlers = items.map((item) => {
      const handler = () => {
        if (!pinned) return;
        const target = Math.min(distance, Math.max(0, offsetFor(item)));
        window.setTimeout(() => {
          window.scrollTo(0, section!.getBoundingClientRect().top + window.scrollY - pinTop + target);
        }, 0);
      };
      item.addEventListener("focusin", handler);
      return handler;
    });

    window.addEventListener("scroll", onWindowScroll, { passive: true });
    wheel.addEventListener("scroll", onWheelScroll, { passive: true });
    window.addEventListener("resize", layout);
    window.addEventListener("load", layout);
    canPin.addEventListener("change", layout);
    wheel.classList.add("ready");
    layout();

    return () => {
      window.removeEventListener("scroll", onWindowScroll);
      wheel.removeEventListener("scroll", onWheelScroll);
      window.removeEventListener("resize", layout);
      window.removeEventListener("load", layout);
      canPin.removeEventListener("change", layout);
      items.forEach((item, i) => item.removeEventListener("focusin", focusHandlers[i]));
    };
  }, []);

  return (
    <section ref={ref} className="wheel-section" {...rest}>
      {children}
    </section>
  );
}
