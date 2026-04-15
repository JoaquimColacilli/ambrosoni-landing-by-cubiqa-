import { useEffect, useRef, useState, type RefObject } from "react"

// Lightweight counter driven by IntersectionObserver + requestAnimationFrame.
// Replaces the GSAP proxy tween on touch devices where the full GSAP/Lenis
// pipeline is gated off. Runs once and uses ease-out-cubic to match the
// "power2.out" feel of the original GSAP counter.
export function useCountUp(
  target: number,
  opts?: {
    duration?: number
    enabled?: boolean
    trigger?: RefObject<HTMLElement | null>
  },
): { ref: RefObject<HTMLElement | null>; value: number } {
  const [value, setValue] = useState(0)
  const internalRef = useRef<HTMLElement | null>(null)
  const ref = opts?.trigger ?? internalRef
  const duration = opts?.duration ?? 1800

  useEffect(() => {
    if (opts?.enabled === false) {
      setValue(target)
      return
    }
    if (typeof window === "undefined") return
    const node = ref.current
    if (!node) return

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduced) {
      setValue(target)
      return
    }

    let rafId: number | null = null
    let cancelled = false

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          io.unobserve(node)

          const start = performance.now()
          const tick = (now: number) => {
            if (cancelled) return
            const t = Math.min(1, (now - start) / duration)
            const eased = 1 - Math.pow(1 - t, 3)
            setValue(Math.round(target * eased))
            if (t < 1) rafId = requestAnimationFrame(tick)
            else setValue(target)
          }
          rafId = requestAnimationFrame(tick)
        })
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 },
    )
    io.observe(node)

    return () => {
      cancelled = true
      if (rafId !== null) cancelAnimationFrame(rafId)
      io.disconnect()
    }
  }, [target, duration, opts?.enabled, ref])

  return { ref, value }
}
