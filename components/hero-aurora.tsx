"use client"

import { motion } from "framer-motion"

/**
 * HeroAurora — Animated mesh gradient behind the hero image.
 * Creates a breathing aurora effect with warm ambient lights.
 * Overlaid on top of the hero background image with soft blend mode.
 */
export function HeroAurora() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* Aurora blob 1 — slow rotation, warm orange */}
      <motion.div
        className="absolute left-[10%] top-[20%] h-[600px] w-[600px] rounded-full"
        style={{
          background:
            "radial-gradient(circle at center, oklch(0.75 0.2 50 / 0.4), transparent 60%)",
          filter: "blur(80px)",
          mixBlendMode: "screen",
        }}
        animate={{
          x: [0, 60, -40, 0],
          y: [0, -40, 30, 0],
          scale: [1, 1.15, 0.95, 1],
        }}
        transition={{
          duration: 18,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      />

      {/* Aurora blob 2 — counter-rotation, golden yellow */}
      <motion.div
        className="absolute right-[15%] top-[40%] h-[500px] w-[500px] rounded-full"
        style={{
          background:
            "radial-gradient(circle at center, oklch(0.8 0.17 80 / 0.35), transparent 60%)",
          filter: "blur(90px)",
          mixBlendMode: "screen",
        }}
        animate={{
          x: [0, -50, 30, 0],
          y: [0, 40, -20, 0],
          scale: [1, 0.9, 1.1, 1],
        }}
        transition={{
          duration: 22,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      />

      {/* Aurora blob 3 — deep amber accent, bottom-left */}
      <motion.div
        className="absolute bottom-[10%] left-[30%] h-[450px] w-[450px] rounded-full"
        style={{
          background:
            "radial-gradient(circle at center, oklch(0.68 0.19 45 / 0.3), transparent 65%)",
          filter: "blur(100px)",
          mixBlendMode: "screen",
        }}
        animate={{
          x: [0, 40, -30, 0],
          y: [0, -30, 20, 0],
          scale: [1, 1.2, 0.9, 1],
        }}
        transition={{
          duration: 25,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      />
    </div>
  )
}
