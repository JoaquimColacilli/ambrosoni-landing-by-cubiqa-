"use client"

import { useRef } from "react"
import { gsap, getScrubValue, prefersReducedMotion, isTouchDevice, useGSAP } from "@/lib/gsapConfig"

interface GeometricShapesProps {
  className?: string
}

interface Shape {
  id: string
  type: "square" | "circle" | "triangle" | "line"
  x: number // % of container
  y: number // % of container
  size: number // px
  rotation: number // deg
  parallax: number // strength 0..1
  color: "neutral" | "warm"
  strokeWidth: number
}

const shapes: Shape[] = [
  { id: "s1", type: "square", x: 8, y: 15, size: 60, rotation: 15, parallax: 0.3, color: "neutral", strokeWidth: 1 },
  { id: "s2", type: "circle", x: 85, y: 10, size: 80, rotation: 0, parallax: 0.5, color: "warm", strokeWidth: 1.2 },
  { id: "s3", type: "triangle", x: 15, y: 70, size: 70, rotation: -20, parallax: 0.4, color: "warm", strokeWidth: 1 },
  { id: "s4", type: "square", x: 78, y: 60, size: 90, rotation: 30, parallax: 0.25, color: "neutral", strokeWidth: 1 },
  { id: "s5", type: "circle", x: 45, y: 85, size: 50, rotation: 0, parallax: 0.6, color: "warm", strokeWidth: 1 },
  { id: "s6", type: "line", x: 5, y: 40, size: 120, rotation: 45, parallax: 0.35, color: "neutral", strokeWidth: 1.5 },
  { id: "s7", type: "line", x: 90, y: 35, size: 140, rotation: -35, parallax: 0.4, color: "warm", strokeWidth: 1.5 },
  { id: "s8", type: "square", x: 52, y: 12, size: 40, rotation: 45, parallax: 0.5, color: "neutral", strokeWidth: 1 },
  { id: "s9", type: "triangle", x: 60, y: 45, size: 55, rotation: 180, parallax: 0.3, color: "neutral", strokeWidth: 1 },
]

export function GeometricShapes({ className = "" }: GeometricShapesProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (isTouchDevice()) return
      const reduced = prefersReducedMotion()
      if (!wrapperRef.current) return

      const shapeEls = wrapperRef.current.querySelectorAll<HTMLElement>(
        "[data-shape]",
      )

      // Entry reveal — fade + rotate
      gsap.fromTo(
        shapeEls,
        {
          opacity: 0,
          scale: 0.4,
          rotation: (i, el) =>
            Number(el.getAttribute("data-init-rotation") ?? 0) - 30,
        },
        {
          opacity: 1,
          scale: 1,
          rotation: (i, el) =>
            Number(el.getAttribute("data-init-rotation") ?? 0),
          duration: reduced ? 0 : 1.4,
          stagger: 0.08,
          ease: "expo.out",
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: "top 80%",
            once: true,
          },
        },
      )

      // Scroll-linked parallax — each shape drifts at its own speed
      if (!reduced) {
        const scrub = getScrubValue()
        shapeEls.forEach((el) => {
          const strength = Number(el.getAttribute("data-parallax") ?? 0.3)
          gsap.to(el, {
            yPercent: -strength * 60,
            ease: "none",
            scrollTrigger: {
              trigger: wrapperRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub,
            },
          })
        })

        // Subtle idle rotation loop on some shapes
        shapeEls.forEach((el, i) => {
          if (i % 2 === 0) {
            gsap.to(el, {
              rotation: `+=${i % 4 === 0 ? 360 : -360}`,
              duration: 40 + i * 5,
              ease: "none",
              repeat: -1,
              transformOrigin: "center center",
            })
          }
        })
      }
    },
    { scope: wrapperRef },
  )

  return (
    <div
      ref={wrapperRef}
      className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {shapes.map((shape) => {
        const isWarm = shape.color === "warm"
        const stroke = isWarm
          ? "oklch(0.72 0.12 45 / 0.45)"
          : "oklch(0.35 0.015 60 / 0.3)"

        const style = {
          left: `${shape.x}%`,
          top: `${shape.y}%`,
          width: `${shape.size}px`,
          height: `${shape.size}px`,
          transform: `translate(-50%, -50%) rotate(${shape.rotation}deg)`,
        } as const

        return (
          <div
            key={shape.id}
            data-shape
            data-init-rotation={shape.rotation}
            data-parallax={shape.parallax}
            className="absolute will-change-transform"
            style={style}
          >
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 100 100"
              xmlns="http://www.w3.org/2000/svg"
            >
              {shape.type === "square" && (
                <rect
                  x="5"
                  y="5"
                  width="90"
                  height="90"
                  fill="none"
                  stroke={stroke}
                  strokeWidth={shape.strokeWidth * 2}
                  vectorEffect="non-scaling-stroke"
                />
              )}
              {shape.type === "circle" && (
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke={stroke}
                  strokeWidth={shape.strokeWidth * 2}
                  vectorEffect="non-scaling-stroke"
                />
              )}
              {shape.type === "triangle" && (
                <polygon
                  points="50,5 95,90 5,90"
                  fill="none"
                  stroke={stroke}
                  strokeWidth={shape.strokeWidth * 2}
                  vectorEffect="non-scaling-stroke"
                />
              )}
              {shape.type === "line" && (
                <line
                  x1="5"
                  y1="50"
                  x2="95"
                  y2="50"
                  stroke={stroke}
                  strokeWidth={shape.strokeWidth * 2}
                  vectorEffect="non-scaling-stroke"
                />
              )}
            </svg>
          </div>
        )
      })}
    </div>
  )
}
