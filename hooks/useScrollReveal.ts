import { useEffect, type RefObject } from "react"

// Scroll-reveal for touch devices only — desktop keeps GSAP.
// Observes every [data-reveal] element inside `scope` and adds `.is-revealed`
// when it crosses into view. Fires once per element (no re-trigger on scroll
// back). Cleans up will-change after the CSS animation finishes so idle
// elements don't keep a compositor layer pinned.
//
// Safety net: because [data-reveal] sets opacity:0 on touch devices, any
// element that the IntersectionObserver misses (iOS WebKit scroll-momentum
// race with initial callback, layout shift during font load, etc.) stays
// invisible forever. To prevent stuck-invisible elements, the hook runs an
// eager pass on mount (elements already in or above the viewport get revealed
// immediately) plus a watchdog timer that force-reveals anything still in
// view after 800 ms even if IO never fired.
export function useScrollReveal(
  scope: RefObject<HTMLElement | null>,
  opts?: { enabled?: boolean },
) {
  useEffect(() => {
    if (opts?.enabled === false) return
    if (typeof window === "undefined") return

    const root = scope.current
    if (!root) return

    // Gate the whole system on touch — matches the CSS media query that
    // hides [data-reveal] elements initially. On desktop nothing is hidden
    // and nothing needs to be observed.
    const isTouch = window.matchMedia("(hover: none) and (pointer: coarse)").matches
    if (!isTouch) return

    const elements = Array.from(root.querySelectorAll<HTMLElement>("[data-reveal]"))
    if (elements.length === 0) return

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduced) {
      elements.forEach((el) => {
        el.classList.add("is-revealed", "is-revealed-done")
      })
      return
    }

    const reveal = (el: HTMLElement) => {
      if (el.classList.contains("is-revealed")) return
      el.classList.add("is-revealed")
      el.addEventListener(
        "animationend",
        () => el.classList.add("is-revealed-done"),
        { once: true },
      )
    }

    // Eager pass: any element already in or above the viewport at mount
    // gets revealed synchronously. Handles the common failure mode where
    // IO's async initial callback races with iOS scroll momentum and
    // never fires `isIntersecting: true` for sections the user is already
    // looking at or has scrolled past.
    const viewportHeight = window.innerHeight
    const pending: HTMLElement[] = []
    elements.forEach((el) => {
      const rect = el.getBoundingClientRect()
      const alreadyVisibleOrPassed = rect.top < viewportHeight * 0.9
      if (alreadyVisibleOrPassed) {
        reveal(el)
      } else {
        pending.push(el)
      }
    })

    if (pending.length === 0) return

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          const el = entry.target as HTMLElement
          reveal(el)
          io.unobserve(el)
        })
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 },
    )

    pending.forEach((el) => io.observe(el))

    // Watchdog: 800 ms after mount, sweep anything still unrevealed that's
    // now on-screen. Catches cases where IO never fires due to layout
    // shifts from font loading or image decode finishing after mount.
    const watchdog = window.setTimeout(() => {
      pending.forEach((el) => {
        if (el.classList.contains("is-revealed")) return
        const rect = el.getBoundingClientRect()
        if (rect.top < window.innerHeight) {
          reveal(el)
          io.unobserve(el)
        }
      })
    }, 800)

    return () => {
      window.clearTimeout(watchdog)
      io.disconnect()
    }
  }, [scope, opts?.enabled])
}
