import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"

// gsap.core.globals() is a runtime method but not exposed in the TS types.
// The cast is deliberate — we check it to avoid re-registering the plugin
// on hot reloads or across RSC boundaries in Next.js App Router.
if (
  typeof window !== "undefined" &&
  !(gsap.core as unknown as { globals: () => Record<string, unknown> }).globals()["ScrollTrigger"]
) {
  gsap.registerPlugin(ScrollTrigger, useGSAP)
}

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

let cachedIsTouch: boolean | null = null

// True on devices with no hover + coarse pointer. Used to gate Lenis (native
// iOS momentum beats JS smoothing) and useMagnetic (synthetic mousemove on
// iOS would clobber GSAP transforms).
export function isTouchDevice(): boolean {
  if (typeof window === "undefined") return false
  if (cachedIsTouch !== null) return cachedIsTouch
  cachedIsTouch = window.matchMedia("(hover: none) and (pointer: coarse)").matches
  return cachedIsTouch
}

// scrub:0.5 on mobile decouples the tween from iOS's native momentum scroll
// event stream — far fewer repaints per flick.
export function getScrubValue(): true | number {
  if (typeof window === "undefined") return true
  return window.matchMedia("(max-width: 768px)").matches ? 0.5 : true
}

export { gsap, ScrollTrigger, useGSAP }
