"use client"

import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion"

/**
 * AtmosphericLayer — capa fija de luz atmosférica que atraviesa toda la página.
 * Tres beams de luz cálida con blend mode plus-lighter (aditivo, visible sobre
 * cualquier background), movimiento sutil atado al scroll global.
 * Decorativo — pointer-events-none, aria-hidden.
 */
export function AtmosphericLayer() {
  const prefersReduced = useReducedMotion()
  const { scrollYProgress } = useScroll()

  // Beam principal: baja suavemente con el scroll
  const beamY1 = useTransform(scrollYProgress, [0, 1], ["-20%", "120%"])

  // Beam secundario: movimiento opuesto más lento (paralaje atmosférico)
  const beamY2 = useTransform(scrollYProgress, [0, 1], ["10%", "80%"])

  // Beam terciario: lado derecho, aparece desde la mitad inferior del scroll
  const beamY3 = useTransform(scrollYProgress, [0, 1], ["30%", "100%"])

  // Opacidad del beam principal: respira a lo largo del scroll
  const beamOpacity = useTransform(
    scrollYProgress,
    [0, 0.15, 0.85, 1],
    [0.35, 0.5, 0.5, 0.35],
  )

  // Opacidad del beam terciario: crece en la mitad inferior del scroll
  const beamOpacity3 = useTransform(
    scrollYProgress,
    [0, 0.3, 0.6, 1],
    [0, 0.15, 0.28, 0.2],
  )

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[5] overflow-hidden"
      aria-hidden="true"
    >
      {/* Beam principal — vertical, centrado */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 w-[700px] h-[900px]"
        style={{
          background:
            "radial-gradient(ellipse at center, oklch(0.80 0.07 65 / 0.55) 0%, oklch(0.83 0.05 68 / 0.22) 40%, transparent 75%)",
          filter: "blur(90px)",
          mixBlendMode: "multiply",
          y: prefersReduced ? "30%" : beamY1,
          opacity: prefersReduced ? 0.55 : beamOpacity,
          willChange: "transform, opacity",
        }}
      />

      {/* Beam secundario — off-center izquierda, movimiento opuesto */}
      <motion.div
        className="absolute left-[20%] w-[500px] h-[700px]"
        style={{
          background:
            "radial-gradient(ellipse at center, oklch(0.82 0.06 72 / 0.35) 0%, transparent 70%)",
          filter: "blur(110px)",
          mixBlendMode: "multiply",
          y: prefersReduced ? "20%" : beamY2,
          opacity: prefersReduced ? 0.4 : 0.5,
          willChange: "transform",
        }}
      />

      {/* Beam terciario — lado derecho, aparece en la mitad inferior */}
      <motion.div
        className="absolute right-[15%] w-[550px] h-[750px]"
        style={{
          background:
            "radial-gradient(ellipse at center, oklch(0.72 0.10 45 / 0.40) 0%, transparent 70%)",
          filter: "blur(100px)",
          mixBlendMode: "multiply",
          y: prefersReduced ? "60%" : beamY3,
          opacity: prefersReduced ? 0.25 : beamOpacity3,
          willChange: "transform, opacity",
        }}
      />
    </div>
  )
}
