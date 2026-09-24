import { Spotlight } from "@/components/ui/spotlight";

// Aceternity's Spotlight: a soft beam falling across the home headline from the
// top left. It starts above the header and fades out towards the bottom.
export function HeroSpotlight() {
  return (
    <div className="hero-light" aria-hidden="true">
      <Spotlight className="-top-40 left-0 md:-top-10 md:left-[38%]" fill="white" />
    </div>
  );
}
