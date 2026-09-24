import React, { type ComponentPropsWithoutRef, type CSSProperties, type ReactNode } from "react"

import { cn } from "@/lib/utils"

// Shimmer Button from Magic UI (via 21st.dev). Changed here: a ShimmerLink version
// for buttons that are really links, and inline-flex so it sits in running layout.

type ShimmerOptions = {
  shimmerColor?: string
  shimmerSize?: string
  borderRadius?: string
  shimmerDuration?: string
  background?: string
  className?: string
  children?: ReactNode
}

export interface ShimmerButtonProps extends ComponentPropsWithoutRef<"button">, ShimmerOptions {}
export interface ShimmerLinkProps extends ComponentPropsWithoutRef<"a">, ShimmerOptions {}

function shimmerStyle({
  shimmerColor = "#ffffff",
  shimmerSize = "0.05em",
  shimmerDuration = "3s",
  borderRadius = "100px",
  background = "rgba(0, 0, 0, 1)",
}: ShimmerOptions) {
  return {
    "--spread": "90deg",
    "--shimmer-color": shimmerColor,
    "--radius": borderRadius,
    "--speed": shimmerDuration,
    "--cut": shimmerSize,
    "--bg": background,
  } as CSSProperties
}

const shimmerClass =
  "group relative z-0 inline-flex cursor-pointer items-center justify-center overflow-hidden [border-radius:var(--radius)] border border-white/10 px-6 py-3 whitespace-nowrap text-white no-underline [background:var(--bg)] transform-gpu transition-transform duration-300 ease-in-out active:translate-y-px"

function ShimmerParts({ children }: { children?: ReactNode }) {
  return (
    <>
      {/* spark container */}
      <div className={cn("-z-30 blur-[2px]", "@container-[size] absolute inset-0 overflow-visible")}>
        {/* spark */}
        <div className="animate-shimmer-slide absolute inset-0 aspect-[1] h-[100cqh] rounded-none [mask:none]">
          {/* spark before */}
          <div className="animate-spin-around absolute -inset-full w-auto [translate:0_0] rotate-0 [background:conic-gradient(from_calc(270deg-(var(--spread)*0.5)),transparent_0,var(--shimmer-color)_var(--spread),transparent_var(--spread))]" />
        </div>
      </div>
      {children}

      {/* Highlight */}
      <div
        className={cn(
          "absolute inset-0 size-full",
          "rounded-2xl px-4 py-1.5 text-sm font-medium shadow-[inset_0_-8px_10px_#ffffff1f]",
          // transition
          "transform-gpu transition-all duration-300 ease-in-out",
          // on hover
          "group-hover:shadow-[inset_0_-6px_10px_#ffffff3f]",
          // on click
          "group-active:shadow-[inset_0_-10px_10px_#ffffff3f]"
        )}
      />

      {/* backdrop */}
      <div className={cn("absolute inset-(--cut) -z-20 [border-radius:var(--radius)] [background:var(--bg)]")} />
    </>
  )
}

export const ShimmerButton = React.forwardRef<HTMLButtonElement, ShimmerButtonProps>(
  ({ shimmerColor, shimmerSize, shimmerDuration, borderRadius, background, className, children, ...props }, ref) => (
    <button
      style={shimmerStyle({ shimmerColor, shimmerSize, shimmerDuration, borderRadius, background })}
      className={cn(shimmerClass, className)}
      ref={ref}
      {...props}
    >
      <ShimmerParts>{children}</ShimmerParts>
    </button>
  )
)

ShimmerButton.displayName = "ShimmerButton"

export const ShimmerLink = React.forwardRef<HTMLAnchorElement, ShimmerLinkProps>(
  ({ shimmerColor, shimmerSize, shimmerDuration, borderRadius, background, className, children, ...props }, ref) => (
    <a
      style={shimmerStyle({ shimmerColor, shimmerSize, shimmerDuration, borderRadius, background })}
      className={cn(shimmerClass, className)}
      ref={ref}
      {...props}
    >
      <ShimmerParts>{children}</ShimmerParts>
    </a>
  )
)

ShimmerLink.displayName = "ShimmerLink"
