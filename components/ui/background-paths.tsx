"use client"

import { useRef } from "react"
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsapConfig"

// FloatingPaths — 20 SVG stroke paths with a looping dashoffset shimmer plus a
// breathing opacity. Migrated from framer-motion to GSAP so that in sections
// that already run GSAP ScrollTriggers (concept-section), we don't compound
// two independent ticker systems on iOS. Everything here lives on gsap.ticker
// alongside the rest of the page's animations.
export function FloatingPaths({
  position,
  svgClassName,
}: {
  position: number
  svgClassName?: string
}) {
  const svgRef = useRef<SVGSVGElement>(null)

  const paths = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
      380 - i * 5 * position
    } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
      152 - i * 5 * position
    } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
      684 - i * 5 * position
    } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
    width: 0.3 + i * 0.015,
  }))

  useGSAP(
    () => {
      if (!svgRef.current || prefersReducedMotion()) return

      const pathEls = svgRef.current.querySelectorAll<SVGPathElement>("[data-floating-path]")

      pathEls.forEach((pathEl) => {
        const length = pathEl.getTotalLength()
        // Long dash + small gap so the "gap" travels the path as the
        // shimmer effect — identical visual to the original framer-motion
        // pathLength/pathOffset trick, but on gsap.ticker.
        gsap.set(pathEl, {
          strokeDasharray: `${length * 0.7} ${length * 0.3}`,
          strokeDashoffset: length,
        })

        const duration = 45 + Math.random() * 20

        // Shimmer loop — dashoffset drift
        gsap.to(pathEl, {
          strokeDashoffset: -length,
          duration,
          ease: "none",
          repeat: -1,
        })

        // Breathing opacity — 0.35 → 0.55 → 0.35 forever
        gsap.to(pathEl, {
          opacity: 0.55,
          duration: duration / 2,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        })
      })
    },
    { scope: svgRef, dependencies: [position] },
  )

  return (
    <div className="absolute inset-0 pointer-events-none">
      <svg
        ref={svgRef}
        className={`w-full h-full ${svgClassName ?? "text-slate-950 dark:text-white"}`}
        viewBox="0 0 696 316"
        fill="none"
      >
        <title>Background Paths</title>
        {paths.map((path) => (
          <path
            key={path.id}
            data-floating-path
            d={path.d}
            stroke="currentColor"
            strokeWidth={path.width}
            strokeOpacity={0.1 + path.id * 0.015}
            opacity={0.35}
          />
        ))}
      </svg>
    </div>
  )
}
