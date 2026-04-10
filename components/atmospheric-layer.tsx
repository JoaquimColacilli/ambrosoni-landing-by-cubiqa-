"use client"

import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion"

/**
 * AtmosphericLayer — Protagonist warm light layer that spans the entire page.
 * Three large saturated amber orbs, visible without interaction, moving with scroll.
 * Fixed position, decorative, non-interactive.
 */
export function AtmosphericLayer() {
  const prefersReduced = useReducedMotion()
  const { scrollYProgress } = useScroll()

  const orbY1 = useTransform(scrollYProgress, [0, 1], ["-10%", "110%"])
  const orbY2 = useTransform(scrollYProgress, [0, 1], ["20%", "90%"])
  const orbY3 = useTransform(scrollYProgress, [0, 1], ["50%", "30%"])

  const orbX1 = useTransform(scrollYProgress, [0, 0.5, 1], ["0%", "5%", "-3%"])
  const orbX3 = useTransform(scrollYProgress, [0, 0.5, 1], ["0%", "-8%", "4%"])

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[5] overflow-hidden"
      aria-hidden="true"
    >
      {/* Orb 1 — Principal, top-center, saturated warm amber */}
      <motion.div
        className="absolute left-1/2 top-0 -translate-x-1/2"
        style={{
          width: "1600px",
          height: "1600px",
          background:
            "radial-gradient(circle at center, oklch(0.78 0.18 65 / 0.55) 0%, oklch(0.78 0.18 65 / 0.25) 25%, oklch(0.78 0.18 65 / 0.08) 50%, transparent 70%)",
          filter: "blur(120px)",
          mixBlendMode: "screen",
          y: prefersReduced ? "20%" : orbY1,
          x: prefersReduced ? "0%" : orbX1,
          willChange: "transform",
        }}
      />

      {/* Orb 2 — Secondary, left side, warmer gold */}
      <motion.div
        className="absolute left-[5%]"
        style={{
          width: "1300px",
          height: "1300px",
          background:
            "radial-gradient(circle at center, oklch(0.72 0.16 55 / 0.45) 0%, oklch(0.72 0.16 55 / 0.18) 35%, transparent 65%)",
          filter: "blur(140px)",
          mixBlendMode: "screen",
          y: prefersReduced ? "40%" : orbY2,
          willChange: "transform",
        }}
      />

      {/* Orb 3 — Tertiary, right side, lighter */}
      <motion.div
        className="absolute right-[-10%]"
        style={{
          width: "1400px",
          height: "1400px",
          background:
            "radial-gradient(circle at center, oklch(0.82 0.14 70 / 0.40) 0%, oklch(0.82 0.14 70 / 0.15) 40%, transparent 70%)",
          filter: "blur(130px)",
          mixBlendMode: "screen",
          y: prefersReduced ? "60%" : orbY3,
          x: prefersReduced ? "0%" : orbX3,
          willChange: "transform",
        }}
      />
    </div>
  )
}
