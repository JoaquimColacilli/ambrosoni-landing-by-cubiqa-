"use client"

import { useEffect, useRef } from "react"
import { prefersReducedMotion } from "@/lib/gsap-utils"

interface DotMatrixProps {
  className?: string
  dotSpacing?: number
  dotBaseRadius?: number
}

interface Dot {
  x: number
  y: number
  baseRadius: number
  radius: number
  targetRadius: number
  warmth: number // 0 to 1, how close to warm accent
  targetWarmth: number
}

export function DotMatrix({
  className = "",
  dotSpacing = 42,
  dotBaseRadius = 1.3,
}: DotMatrixProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const dotsRef = useRef<Dot[]>([])
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({
    x: 0,
    y: 0,
    active: false,
  })
  const rafRef = useRef<number>(0)
  const isInViewportRef = useRef(false)
  const rippleStartRef = useRef<number | null>(null)

  useEffect(() => {
    if (prefersReducedMotion()) return
    if (!canvasRef.current || !wrapperRef.current) return

    const canvas = canvasRef.current
    const wrapper = wrapperRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let width = 0
    let height = 0
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    const resize = () => {
      const rect = wrapper.getBoundingClientRect()
      width = rect.width
      height = rect.height
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.scale(dpr, dpr)
    }

    const initDots = () => {
      const cols = Math.ceil(width / dotSpacing)
      const rows = Math.ceil(height / dotSpacing)
      const offsetX = (width - (cols - 1) * dotSpacing) / 2
      const offsetY = (height - (rows - 1) * dotSpacing) / 2

      const dots: Dot[] = []
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          dots.push({
            x: offsetX + c * dotSpacing,
            y: offsetY + r * dotSpacing,
            baseRadius: dotBaseRadius,
            radius: 0, // start invisible for ripple entry
            targetRadius: dotBaseRadius,
            warmth: 0,
            targetWarmth: 0,
          })
        }
      }
      dotsRef.current = dots
    }

    resize()
    initDots()

    const handleResize = () => {
      resize()
      initDots()
      rippleStartRef.current = null
    }
    window.addEventListener("resize", handleResize)

    const handleMouseMove = (e: MouseEvent) => {
      const rect = wrapper.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const inside = x >= 0 && x <= rect.width && y >= 0 && y <= rect.height
      mouseRef.current = { x, y, active: inside }
    }
    window.addEventListener("mousemove", handleMouseMove)

    // IntersectionObserver — trigger ripple first time it's seen, pause when offscreen
    const io = new IntersectionObserver(
      ([entry]) => {
        isInViewportRef.current = entry.isIntersecting
        if (entry.isIntersecting && rippleStartRef.current === null) {
          rippleStartRef.current = performance.now()
        }
      },
      { threshold: 0.1 },
    )
    io.observe(wrapper)

    const animate = (time: number) => {
      rafRef.current = requestAnimationFrame(animate)
      if (!isInViewportRef.current) return

      ctx.clearRect(0, 0, width, height)

      const dots = dotsRef.current
      const mouse = mouseRef.current
      const rippleStart = rippleStartRef.current

      const cx = width / 2
      const cy = height / 2

      for (const dot of dots) {
        // --- Ripple entry animation on first viewport enter ---
        if (rippleStart !== null) {
          const elapsed = time - rippleStart
          const distFromCenter = Math.sqrt(
            (dot.x - cx) ** 2 + (dot.y - cy) ** 2,
          )
          // Each dot activates based on distance from center
          const dotDelay = distFromCenter * 2.5 // ms per pixel
          const localElapsed = elapsed - dotDelay
          if (localElapsed > 0) {
            const progress = Math.min(1, localElapsed / 600)
            // Ease out
            const eased = 1 - Math.pow(1 - progress, 3)
            dot.targetRadius = dot.baseRadius * eased
          }
        }

        // --- Mouse proximity warmth ---
        if (mouse.active) {
          const dx = mouse.x - dot.x
          const dy = mouse.y - dot.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 140) {
            const proximity = 1 - dist / 140
            dot.targetWarmth = proximity
            dot.targetRadius = dot.baseRadius * (1 + proximity * 2.2)
          } else {
            dot.targetWarmth = 0
            dot.targetRadius = dot.baseRadius
          }
        } else {
          dot.targetWarmth = 0
          dot.targetRadius = dot.baseRadius
        }

        // Smooth lerp toward targets
        dot.radius += (dot.targetRadius - dot.radius) * 0.15
        dot.warmth += (dot.targetWarmth - dot.warmth) * 0.15

        // --- Draw ---
        if (dot.radius < 0.2) continue
        ctx.beginPath()
        ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2)
        // Blend between neutral dark and warm accent based on warmth
        if (dot.warmth > 0.01) {
          // Warm accent: oklch(0.72 0.12 45)
          const alpha = 0.35 + dot.warmth * 0.55
          ctx.fillStyle = `oklch(0.72 0.12 45 / ${alpha})`
        } else {
          ctx.fillStyle = "oklch(0.3 0.02 60 / 0.35)"
        }
        ctx.fill()
      }
    }

    rafRef.current = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("mousemove", handleMouseMove)
      io.disconnect()
    }
  }, [dotSpacing, dotBaseRadius])

  return (
    <div
      ref={wrapperRef}
      className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  )
}
