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

// useLayoutEffect logs a warning during SSR. For animation code that must run
// before first paint (GSAP take-control), prefer useLayoutEffect on the client
// and fall back to useEffect on the server to silence the warning.
export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect

export { gsap, ScrollTrigger }
