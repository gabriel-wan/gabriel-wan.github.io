"use client";

import { useEffect, useRef, useSyncExternalStore, type CSSProperties } from "react";

// A project's picture.
// Give it a `video` (a short clip in public/videos) and it plays that instead, muted,
// only while it's on screen; the image becomes the poster and the fallback. Nothing
// downloads until a video is about to play.
// With reduced motion the video stays on its first frame unless sound is turned on.

export type Art = {
  src: string;
  alt: string;
  width: number;
  height: number;
  fit?: "cover" | "chat" | "contain"; // contain: show all of it on `bg`
  bg?: string;
  video?: string;
};

// One sound setting for every project video: turning it on in one card turns it on for
// all of them, so you can keep listening as you scroll. Off until someone asks for it.
let soundOn = false;
const listeners = new Set<() => void>();
const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};
export function setProjectSound(on: boolean) {
  soundOn = on;
  listeners.forEach((listener) => listener());
}
export function useProjectSound() {
  return useSyncExternalStore(subscribe, () => soundOn, () => false);
}

// Only one project video plays at a time: the one most on screen, if at least half of it
// is. Between two cards both can be half visible, and two clips with sound is a mess.
const onScreen = new Map<HTMLVideoElement, number>();
let playing: HTMLVideoElement | null = null;
function choosePlaying() {
  let best: HTMLVideoElement | null = null;
  let bestRatio = 0.5;
  onScreen.forEach((ratio, video) => {
    if (ratio >= bestRatio && (!best || ratio > bestRatio)) {
      best = video;
      bestRatio = ratio;
    }
  });
  if (best === playing) return;
  playing = best;
  listeners.forEach((listener) => listener());
}

export function ProjectArt({ art }: { art: Art }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function play() {
      video!.play().catch(() => {
        // a browser that won't play it with sound still plays it muted
        video!.muted = true;
        video!.play().catch(() => {});
      });
    }
    function sync() {
      video!.muted = !soundOn;
      if (playing === video && (soundOn || !still)) play();
      else if (!video!.paused || video!.currentTime) {
        // back to the first frame, which is the settled poster, so it never sits half-animated
        video!.pause();
        video!.currentTime = 0;
      }
    }

    const observer = new IntersectionObserver(([entry]) => {
      onScreen.set(video, entry.isIntersecting ? entry.intersectionRatio : 0);
      choosePlaying();
    }, { threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1] });
    observer.observe(video);
    const unsubscribe = subscribe(sync);
    sync();
    return () => {
      observer.disconnect();
      unsubscribe();
      onScreen.delete(video);
      if (playing === video) {
        playing = null;
        choosePlaying();
      }
    };
  }, []);

  const cls = ["art", "is-image", art.fit === "chat" && "is-chat", art.fit === "contain" && "is-fit"].filter(Boolean).join(" ");
  const style = art.bg ? ({ "--art-bg": art.bg } as CSSProperties) : undefined;

  return (
    <div className={cls} style={style}>
      {art.video ? (
        <video ref={videoRef} src={art.video} poster={art.src} muted loop playsInline preload="none" aria-label={art.alt} />
      ) : (
        <img src={art.src} alt={art.alt} width={art.width} height={art.height} loading="lazy" />
      )}
    </div>
  );
}

// The small round button in the corner of a project video that turns sound on and off.
export function SoundToggle({ className }: { className?: string }) {
  const on = useProjectSound();
  return (
    <button
      type="button"
      className={className}
      aria-pressed={on}
      aria-label="Sound"
      title={on ? "Sound off" : "Sound on"}
      onClick={() => setProjectSound(!on)}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" fill="currentColor" />
        {on ? (
          <>
            <path d="M15.5 9a4 4 0 0 1 0 6" />
            <path d="M18 6.5a7.5 7.5 0 0 1 0 11" />
          </>
        ) : (
          <path d="m16 9.5 5 5m0-5-5 5" />
        )}
      </svg>
    </button>
  );
}
