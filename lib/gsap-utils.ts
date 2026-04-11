import { useEffect, useLayoutEffect } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

// Register ScrollTrigger plugin once
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

/**
 * Check if user prefers reduced motion.
 * Call this inside useEffect (client-side only).
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

// Touch capability doesn't change at runtime, so cache the result of the
// matchMedia probe after the first call.
let cachedIsTouch: boolean | null = null

/**
 * True on devices with no hover + coarse pointer (phones, tablets).
 * Used as the guard for Lenis (native momentum scroll on iOS beats any JS
 * smoothing) and for the useMagnetic hook (synthetic mousemove on iOS would
 * clobber GSAP transforms otherwise).
 */
export function isTouchDevice(): boolean {
  if (typeof window === "undefined") return false
  if (cachedIsTouch !== null) return cachedIsTouch
  cachedIsTouch = window.matchMedia("(hover: none) and (pointer: coarse)").matches
  return cachedIsTouch
}

/**
 * Scrub value for ScrollTrigger parallax: `true` on desktop (tight 1:1 with
 * scroll) and `0.5` on mobile (adds a lerp that decouples the tween from the
 * scroll event stream, drastically reducing repaints on iOS Safari under
 * native momentum scroll). Evaluated at ScrollTrigger creation time.
 */
export function getScrubValue(): true | number {
  if (typeof window === "undefined") return true
  return window.matchMedia("(max-width: 768px)").matches ? 0.5 : true
}

// useLayoutEffect logs a warning during SSR. For animation code that must run
// before first paint (GSAP take-control), prefer useLayoutEffect on the client
// and fall back to useEffect on the server to silence the warning.
export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect

export { gsap, ScrollTrigger }
