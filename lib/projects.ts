import type { Art } from "@/components/project-art";

// Projects shown on the home page. `art` is the project's picture; `large` is the bigger
// picture or short video (made with /brag) the home page shows, falling back to `art`.
export type Project = { href: string; title: string; date: string; blurb: string; art: Art; large?: Art };

export const PROJECTS: Project[] = [
  {
    href: "https://github.com/gabriel-wan/knowbuddy",
    title: "KnowBuddy",
    date: "Oct 2026 · Tencent Cloud hackathon",
    blurb: "One chat over a company's Slack, Drive, Jira and Confluence that only answers from what you're allowed to see.",
    art: { src: "/images/knowbuddy.jpg", alt: "The KnowBuddy cover: its robot connected to the Slack, Google Drive, Jira and Confluence logos, with the line Know what you need. No-buddy sees what they shouldn't.", width: 1280, height: 720 },
    large: { src: "/videos/knowbuddy.jpg", video: "/videos/knowbuddy.mp4", alt: "KnowBuddy answering the same question for two people: the contractor gets nothing, the compliance admin gets the answer with its Slack and Drive sources", width: 1920, height: 1080 },
  },
  {
    href: "/projects/mini-gabriel",
    title: "MiniGabriel",
    date: "Sep 2026",
    blurb: "An 8B model fine-tuned on my Telegram messages so it texts like me, down to the lowercase, short bursts and Singlish.",
    art: { src: "/images/mini-gabriel-wheel.webp", alt: "A Telegram chat with the bot. I ask how far along it is with an assignment and it answers in three short lowercase messages", width: 500, height: 289, fit: "chat" },
    large: { src: "/videos/mini-gabriel.jpg", video: "/videos/mini-gabriel.mp4", alt: "A Telegram chat with MiniGabriel replying in short lowercase bursts: i finished le, its not that deep, just lots of content", width: 1920, height: 1080 },
  },
  {
    href: "/projects/lounge-booking",
    title: "Lounge Booking",
    date: "Feb 2026",
    blurb: "A Telegram Mini App for booking the lounges in my residential college. About 130 residents use it.",
    art: { src: "/images/lounge-booking.jpg", alt: "The Lounge Booking app: a floor switcher, upcoming bookings and a calendar", width: 450, height: 850 },
    large: { src: "/videos/lounge-booking.jpg", video: "/videos/lounge-booking.mp4", alt: "The Lounge Booking app on a phone, highlighting picking a floor, seeing what's taken and picking a date", width: 1920, height: 1080 },
  },
  {
    href: "/projects/nus-gym-tracker",
    title: "NUS Gym Tracker",
    date: "Sep 2026 · Live",
    blurb: "A Telegram bot that tells you how full the NUS gyms are, and saves a reading every 5 minutes because NUS keeps no history.",
    art: { src: "/images/gym-reddit-wheel.webp", alt: "A post on r/nus asking when the least crowded time at the U-Town gym is", width: 700, height: 404, fit: "contain", bg: "#220c00" },
    large: { src: "/videos/nus-gym-tracker.jpg", video: "/videos/nus-gym-tracker.mp4", alt: "109 of 110 people in the USC gym, then the bot answering /gym with how full each gym is", width: 1920, height: 1080 },
  },
  {
    href: "/projects/kopikaki",
    title: "KopiKaki",
    date: "Aug 2026 · Build with Gemini hackathon",
    blurb: "A voice assistant that helps seniors find someone nearby to meet.",
    art: { src: "/images/kopikaki-wheel.webp", alt: "The KopiKaki app asking What do you feel like doing?, with its mascot and a Tap to speak button", width: 762, height: 440, fit: "contain", bg: "#fffaf5" },
    large: { src: "/videos/kopikaki.jpg", video: "/videos/kopikaki.mp4", alt: "A call with KopiKaki: Maybe kopi. Shall I ask them? Okay lor. Then the meetup it set up, kopi with Raymond and Helen tomorrow in Bishan", width: 1920, height: 1080 },
  },
  {
    href: "/projects/uwash",
    title: "UWash",
    date: "Mar 2026 · Top 8, NUS Student Life Hackathon",
    blurb: "Vibration sensors that tell a laundry bot when machines are free.",
    art: { src: "/images/uwash.jpg", alt: "The UWash dashboard's usage chart", width: 1465, height: 739 },
    large: { src: "/videos/uwash.jpg", video: "/videos/uwash.mp4", alt: "The UWash dashboard: Washer Two's vibration stops, it switches to available and the bot sends Washer Two is now available", width: 1920, height: 1080 },
  },
  {
    href: "https://github.com/gabriel-wan/hackomania_interledger",
    title: "Community Emergency Fund",
    date: "Mar 2026 · HackOMania",
    blurb: "A disaster relief fund that pays out over Interledger when a USGS or NWS alert hits members nearby.",
    art: { src: "/images/emergency-fund.jpg", alt: "The Community Fund dashboard with a world map of disaster signals", width: 1904, height: 908 },
    large: { src: "/videos/emergency-fund.jpg", video: "/videos/emergency-fund.mp4", alt: "The fund's disaster map pinging a USGS earthquake signal, with the line Pays out to members nearby, over Interledger", width: 1920, height: 1080 },
  },
];
