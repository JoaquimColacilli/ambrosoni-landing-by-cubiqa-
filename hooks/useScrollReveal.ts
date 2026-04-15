import { useEffect, type RefObject } from "react"

// Scroll-reveal for touch devices only — desktop keeps GSAP.
// Observes every [data-reveal] element inside `scope` and adds `.is-revealed`
// when it crosses into view. Fires once per element (no re-trigger on scroll
// back). Cleans up will-change after the CSS animation finishes so idle
// elements don't keep a compositor layer pinned.
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

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          const el = entry.target as HTMLElement
          el.classList.add("is-revealed")
          io.unobserve(el)
          el.addEventListener(
            "animationend",
            () => el.classList.add("is-revealed-done"),
            { once: true },
          )
        })
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 },
    )

    elements.forEach((el) => io.observe(el))

    return () => io.disconnect()
  }, [scope, opts?.enabled])
}
