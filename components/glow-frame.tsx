import type { ReactNode } from "react";
import { GlowingEffect } from "@/components/ui/glowing-effect";

// A project picture frame whose border lights up near the pointer (Aceternity's
// Glowing Effect). It sits outside the picture's own overflow clipping, inset by
// 1px so the light lands on the picture's border instead of just outside it.
export function GlowFrame({ children }: { children: ReactNode }) {
  return (
    <div className="glow-frame relative rounded-[3px]">
      <GlowingEffect className="inset-px" spread={40} glow disabled={false} proximity={64} inactiveZone={0.01} borderWidth={2} />
      {children}
    </div>
  );
}
