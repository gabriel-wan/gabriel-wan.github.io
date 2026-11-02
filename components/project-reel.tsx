"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { ProjectArt, SoundToggle, type Art } from "@/components/project-art";
import { Reveal } from "@/components/reveal";
import { PROJECTS } from "@/lib/projects";

// The projects on the home page as big pictures in a row. With a mouse or trackpad the
// section holds still while you scroll and the row slides sideways, easing after the
// scroll so a mouse wheel's jumps come out smooth; swiping sideways on a trackpad works
// too. On touch screens, with reduced motion, or in a short window it's a row you swipe
// or scroll sideways. The numbers by the heading show where you are and jump to a project.
// Project videos play muted; the button in a video's corner turns sound on for all of them.

const PER_PROJECT = 280; // px of page scroll it takes to move one project along
const pad = (i: number) => String(i + 1).padStart(2, "0");

// Wide pictures fill the frame. Tall ones and screenshots sit in the middle of a blurred
// copy of themselves.
function ReelMedia({ art }: { art: Art }) {
  const fit = art.fit === "contain" || art.width / art.height < 1.5;
  return (
    <div className={fit ? "reel-media is-fit" : "reel-media"}>
      {fit && <img className="reel-backdrop" src={art.src} alt="" aria-hidden="true" loading="lazy" />}
      <ProjectArt art={{ ...art, fit: fit ? "contain" : "cover" }} />
    </div>
  );
}

export function ProjectsReel() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = ref.current;
    if (!section) return;
    const stage = section.querySelector<HTMLElement>(".reel-stage")!;
    const reel = section.querySelector<HTMLElement>(".reel")!;
    const track = section.querySelector<HTMLElement>(".reel-track")!;
    const items = Array.from(track.children) as HTMLElement[];
    const dots = Array.from(section.querySelectorAll<HTMLButtonElement>(".reel-index button"));
    const canPin = window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    let pinned = false;
    let distance = 0; // how far the row moves sideways in total
    let speed = 1; // sideways px per px scrolled
    let target = 0; // where the scroll says the row should be
    let pos = 0; // where it is, catching up
    let frame = 0;
    let last = 0;
    let active = -1;

    // How far the row moves for project i to sit where the first one starts.
    const stopFor = (i: number) => Math.min(distance, Math.max(0, items[i].offsetLeft - items[0].offsetLeft));
    const sectionTop = () => section.getBoundingClientRect().top + window.scrollY;

    function mark(position: number) {
      let best = 0;
      items.forEach((_, i) => {
        if (Math.abs(stopFor(i) - position) < Math.abs(stopFor(best) - position)) best = i;
      });
      if (best === active) return;
      active = best;
      dots.forEach((dot, i) => dot.setAttribute("aria-current", i === best ? "true" : "false"));
    }

    function draw(now: number) {
      frame = 0;
      const dt = last ? Math.min(64, now - last) : 16;
      pos += (target - pos) * (1 - Math.exp(-dt / 110));
      if (Math.abs(target - pos) < 0.4) pos = target;
      track.style.transform = `translate3d(${-pos}px, 0, 0)`;
      mark(pos);
      if (pos !== target) {
        last = now;
        frame = requestAnimationFrame(draw);
      } else last = 0;
    }

    function follow(jump = false) {
      const scrollLen = distance / speed;
      const progress = scrollLen ? Math.min(1, Math.max(0, -section!.getBoundingClientRect().top / scrollLen)) : 0;
      target = progress * distance;
      if (jump) pos = target;
      if (!frame) frame = requestAnimationFrame(draw);
    }

    function layout() {
      distance = Math.max(0, track.offsetWidth - reel.clientWidth);
      speed = items.length > 1 ? Math.max(1, (items[1].offsetLeft - items[0].offsetLeft) / PER_PROJECT) : 1;
      const pin = canPin.matches && distance > 0 && window.innerHeight >= 600;
      if (pin !== pinned) {
        pinned = pin;
        reel.scrollLeft = 0;
        section!.classList.toggle("is-pinned", pin);
        if (!pin) {
          section!.style.height = "";
          track.style.transform = "";
        }
        // the cards change size with the mode, so measure again
        if (pin) return layout();
      }
      if (pinned) {
        section!.style.height = `${stage.offsetHeight + distance / speed}px`;
        follow(true);
      } else mark(reel.scrollLeft);
    }

    const onScroll = () => pinned && follow();
    const onReelScroll = () => !pinned && mark(reel.scrollLeft);

    // A sideways swipe on a trackpad scrolls the page by the matching amount.
    const onWheel = (event: WheelEvent) => {
      if (!pinned || Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;
      const top = sectionTop();
      const next = window.scrollY + event.deltaX / speed;
      if (next < top || next > top + distance / speed) return;
      event.preventDefault();
      window.scrollTo(0, next);
    };

    function go(i: number) {
      if (pinned) window.scrollTo({ top: sectionTop() + stopFor(i) / speed, behavior: "smooth" });
      else reel.scrollTo({ left: stopFor(i), behavior: "smooth" });
    }
    const dotHandlers = dots.map((dot, i) => {
      const handler = () => go(i);
      dot.addEventListener("click", handler);
      return handler;
    });

    // Tabbing onto a project brings it into view. Only for the keyboard: a click (on the
    // sound button, say) mustn't move the page out from under the pointer.
    const focusHandlers = items.map((item, i) => {
      const handler = (event: FocusEvent) => {
        if (!pinned || !(event.target as HTMLElement).matches(":focus-visible")) return;
        window.scrollTo(0, sectionTop() + stopFor(i) / speed);
        follow(true);
      };
      item.addEventListener("focusin", handler);
      return handler;
    });

    // The cards slide in the first time the row comes into view.
    const seen = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      reel.classList.add("in");
      seen.disconnect();
    }, { threshold: 0.2 });
    seen.observe(reel);

    window.addEventListener("scroll", onScroll, { passive: true });
    reel.addEventListener("scroll", onReelScroll, { passive: true });
    reel.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("resize", layout);
    window.addEventListener("load", layout);
    canPin.addEventListener("change", layout);
    layout();

    return () => {
      cancelAnimationFrame(frame);
      seen.disconnect();
      window.removeEventListener("scroll", onScroll);
      reel.removeEventListener("scroll", onReelScroll);
      reel.removeEventListener("wheel", onWheel);
      window.removeEventListener("resize", layout);
      window.removeEventListener("load", layout);
      canPin.removeEventListener("change", layout);
      items.forEach((item, i) => item.removeEventListener("focusin", focusHandlers[i]));
      dots.forEach((dot, i) => dot.removeEventListener("click", dotHandlers[i]));
    };
  }, []);

  return (
    <section ref={ref} className="reel-section" id="projects" aria-labelledby="projects-title">
      <div className="reel-stage">
        <div className="col group-head">
          <div className="reel-head">
            <Reveal as="h2" id="projects-title">Projects</Reveal>
            <div className="reel-index" role="group" aria-label="Jump to a project">
              {PROJECTS.map((p, i) => (
                <button key={p.title} type="button" aria-label={p.title} aria-current={i === 0 ? "true" : "false"}>
                  {pad(i)}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="reel">
          <ul className="reel-track">
            {PROJECTS.map((p, i) => (
              <li className="reel-item" key={p.title} style={{ "--i": i } as CSSProperties}>
                <a className="reel-link" href={p.href}>
                  <ReelMedia art={p.large ?? p.art} />
                  <div className="reel-text">
                    <div>
                      <p className="dateline">
                        <span className="reel-num">{pad(i)}</span>
                        {p.date}
                      </p>
                      <h3>{p.title}</h3>
                    </div>
                    <p className="reel-blurb">{p.blurb}</p>
                  </div>
                </a>
                {(p.large ?? p.art).video && <SoundToggle className="reel-sound" />}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
