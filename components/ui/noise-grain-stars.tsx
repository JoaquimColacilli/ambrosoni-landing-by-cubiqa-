"use client"

import { useEffect, useRef } from "react"
import { prefersReducedMotion } from "@/lib/gsapConfig"

interface NoiseGrainStarsProps {
  className?: string
  starCount?: number
}

interface Star {
  x: number
  y: number
  radius: number
  baseAlpha: number
  phase: number
  twinkleSpeed: number
  warm: boolean
}

export function NoiseGrainStars({
  className = "",
  starCount = 140,
}: NoiseGrainStarsProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const starsRef = useRef<Star[]>([])
  const rafRef = useRef<number>(0)
  const isInViewportRef = useRef(false)

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

    const initStars = () => {
      starsRef.current = Array.from({ length: starCount }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.2 + 0.3,
        baseAlpha: Math.random() * 0.5 + 0.15,
        phase: Math.random() * Math.PI * 2,
        twinkleSpeed: Math.random() * 0.002 + 0.001,
        warm: Math.random() > 0.88, // ~12% warm
      }))
    }

    resize()
    initStars()

    const handleResize = () => {
      resize()
      initStars()
    }
    window.addEventListener("resize", handleResize)

    const io = new IntersectionObserver(
      ([entry]) => {
        isInViewportRef.current = entry.isIntersecting
      },
      { threshold: 0 },
    )
    io.observe(wrapper)

    const animate = (time: number) => {
      rafRef.current = requestAnimationFrame(animate)
      if (!isInViewportRef.current) return

      ctx.clearRect(0, 0, width, height)

      for (const star of starsRef.current) {
        const twinkle = Math.sin(time * star.twinkleSpeed + star.phase) * 0.5 + 0.5
        const alpha = star.baseAlpha * (0.4 + twinkle * 0.6)

        ctx.beginPath()
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2)
        if (star.warm) {
          ctx.fillStyle = `oklch(0.82 0.1 55 / ${alpha * 1.3})`
        } else {
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`
        }
        ctx.fill()
      }
    }

    rafRef.current = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener("resize", handleResize)
      io.disconnect()
    }
  }, [starCount])

  return (
    <div
      ref={wrapperRef}
      className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="w-full h-full" />
      {/* Grain overlay */}
      <div
        className="absolute inset-0 opacity-[0.08] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
        }}
      />
    </div>
  )
}
