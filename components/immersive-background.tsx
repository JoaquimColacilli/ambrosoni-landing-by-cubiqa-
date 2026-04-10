"use client"

import { useRef, useEffect, useState } from "react"
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from "framer-motion"

/**
 * ImmersiveBackground — Subtle ambient layer that follows the user through the page.
 * Features:
 * - Floating grid lines that respond to scroll
 * - Subtle gradient orbs that move slowly
 * - Grain texture overlay for premium feel
 * - Only visible below the hero section
 */
export function ImmersiveBackground() {
  const prefersReduced = useReducedMotion()
  const containerRef = useRef<HTMLDivElement>(null)
  const [windowHeight, setWindowHeight] = useState(0)
  
  const { scrollYProgress } = useScroll()
  
  // Smooth spring for parallax effects
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 50,
    damping: 30,
    restDelta: 0.001,
  })

  // Transform values for ambient elements
  const gridOpacity = useTransform(smoothProgress, [0, 0.1, 0.9, 1], [0, 0.03, 0.03, 0])
  const orb1Y = useTransform(smoothProgress, [0, 1], ["0%", "-30%"])
  const orb2Y = useTransform(smoothProgress, [0, 1], ["0%", "-50%"])
  const orb3Y = useTransform(smoothProgress, [0, 1], ["0%", "-20%"])

  useEffect(() => {
    setWindowHeight(window.innerHeight)
    const handleResize = () => setWindowHeight(window.innerHeight)
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  if (prefersReduced) {
    return null
  }

  return (
    <div
      ref={containerRef}
      className="pointer-events-none fixed inset-0 z-[1] overflow-hidden"
      style={{ top: windowHeight }}
      aria-hidden="true"
    >
      {/* Subtle grain texture */}
      <div 
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Floating grid lines */}
      <motion.div 
        className="absolute inset-0"
        style={{ opacity: gridOpacity }}
      >
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
              <path
                d="M 80 0 L 0 0 0 80"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
                className="text-foreground"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </motion.div>

      {/* Ambient orb 1 — Very subtle, top-right */}
      <motion.div
        className="absolute -right-[20%] top-[10%]"
        style={{
          width: "800px",
          height: "800px",
          background: "radial-gradient(circle at center, oklch(0.20 0.02 240 / 0.15) 0%, transparent 70%)",
          filter: "blur(100px)",
          y: orb1Y,
        }}
      />

      {/* Ambient orb 2 — Very subtle, left side */}
      <motion.div
        className="absolute -left-[15%] top-[40%]"
        style={{
          width: "600px",
          height: "600px",
          background: "radial-gradient(circle at center, oklch(0.18 0.01 200 / 0.12) 0%, transparent 70%)",
          filter: "blur(120px)",
          y: orb2Y,
        }}
      />

      {/* Ambient orb 3 — Very subtle, bottom-right */}
      <motion.div
        className="absolute right-[10%] top-[70%]"
        style={{
          width: "700px",
          height: "700px",
          background: "radial-gradient(circle at center, oklch(0.22 0.02 220 / 0.10) 0%, transparent 70%)",
          filter: "blur(110px)",
          y: orb3Y,
        }}
      />

      {/* Horizontal accent line that moves with scroll */}
      <motion.div
        className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-foreground/5 to-transparent"
        style={{
          top: useTransform(smoothProgress, [0, 1], ["20%", "80%"]),
        }}
      />
    </div>
  )
}
