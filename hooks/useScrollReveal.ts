import { useEffect, useLayoutEffect, type RefObject } from "react"

// Use useLayoutEffect on the client so .js-hidden is applied synchronously
// before the first paint after hydration. Fall back to useEffect during SSR
// to silence React's "useLayoutEffect on the server" warning.
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect

// Scroll-reveal for touch devices only — desktop keeps GSAP.
//
// Inverted-default design: CSS base keeps [data-reveal] elements VISIBLE.
// This hook is what actually hides below-fold elements (via .js-hidden)
// and reveals them when they enter the viewport (via .is-revealed). If JS
// never runs, elements stay visible. There is no stuck-invisible failure
// mode anymore.
//
// Three layers of robustness for the reveal trigger:
//   1. IntersectionObserver — primary.
//   2. Passive scroll listener, rAF-throttled — fallback for iOS WebKit
//      dropping IO callbacks during momentum scroll.
//   3. Watchdog at 1500ms — final safety net for anything on-screen that
//      both the IO and the scroll listener somehow missed.
export function useScrollReveal(
  scope: RefObject<HTMLElement | null>,
  opts?: { enabled?: boolean },
) {
  useIsomorphicLayoutEffect(() => {
    if (opts?.enabled === false) return
    if (typeof window === "undefined") return

    const root = scope.current
    if (!root) return

    // Gate on touch — matches the CSS media query that scopes .js-hidden
    // and the reveal animation classes.
    const isTouch = window.matchMedia("(hover: none) and (pointer: coarse)").matches
    if (!isTouch) return

    const elements = Array.from(root.querySelectorAll<HTMLElement>("[data-reveal]"))
    if (elements.length === 0) return

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduced) {
      // Reduced motion: do not hide anything, do not animate. Elements
      // stay at their visible CSS default.
      return
    }

    const animateReveal = (el: HTMLElement) => {
      if (el.classList.contains("is-revealed")) return
      el.classList.remove("js-hidden")
      el.classList.add("is-revealed")
      el.addEventListener(
        "animationend",
        () => el.classList.add("is-revealed-done"),
        { once: true },
      )
    }

    // --- Eager pass (synchronous, pre-paint via useLayoutEffect) ---
    // Elements already in or above the viewport at mount: leave alone.
    // They render at their visible CSS default with no animation. Small
    // aesthetic trade-off (no entry animation for above-fold reveal
    // elements) in exchange for zero FOUC there.
    // Below-fold elements: add .js-hidden synchronously before the next
    // paint so they are hidden until scrolled into view.
    const viewportHeight = window.innerHeight
    const pending: HTMLElement[] = []
    for (const el of elements) {
      const rect = el.getBoundingClientRect()
      if (rect.top >= viewportHeight * 0.9) {
        el.classList.add("js-hidden")
        pending.push(el)
      }
    }

    if (pending.length === 0) return

    // --- Layer 1: IntersectionObserver (primary) ---
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const el = entry.target as HTMLElement
          animateReveal(el)
          io.unobserve(el)
          const idx = pending.indexOf(el)
          if (idx >= 0) pending.splice(idx, 1)
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 },
    )
    for (const el of pending) io.observe(el)

    // --- Layer 2: passive scroll listener, rAF-throttled ---
    // Catches elements iOS WebKit drops during momentum scroll. One
    // getBoundingClientRect per pending element per rAF while scrolling —
    // composited read, negligible cost at ~9 elements.
    let rafId: number | null = null
    const sweepOnScroll = () => {
      rafId = null
      if (pending.length === 0) return
      const triggerY = window.innerHeight * 0.9
      for (let i = pending.length - 1; i >= 0; i--) {
        const el = pending[i]
        if (el.getBoundingClientRect().top < triggerY) {
          animateReveal(el)
          io.unobserve(el)
          pending.splice(i, 1)
        }
      }
    }
    const onScroll = () => {
      if (rafId !== null) return
      rafId = requestAnimationFrame(sweepOnScroll)
    }
    window.addEventListener("scroll", onScroll, { passive: true })

    // --- Layer 3: watchdog (final safety net at 1500ms) ---
    const watchdog = window.setTimeout(() => {
      if (pending.length === 0) return
      const vh = window.innerHeight
      for (let i = pending.length - 1; i >= 0; i--) {
        const el = pending[i]
        if (el.getBoundingClientRect().top < vh) {
          animateReveal(el)
          io.unobserve(el)
          pending.splice(i, 1)
        }
      }
    }, 1500)

    return () => {
      window.removeEventListener("scroll", onScroll)
      if (rafId !== null) cancelAnimationFrame(rafId)
      window.clearTimeout(watchdog)
      io.disconnect()
    }
  }, [scope, opts?.enabled])
}
