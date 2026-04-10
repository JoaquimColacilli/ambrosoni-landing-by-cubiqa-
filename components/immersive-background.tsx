"use client"

import { useEffect, useRef, useState } from "react"

/**
 * ImmersiveBackground — Elegant floating particles that follow the user through the page.
 * Creates a premium, luxury feel with subtle gold dust particles.
 */
export function ImmersiveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const rafRef = useRef<number>(0)
  const scrollRef = useRef(0)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (prefersReducedMotion) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight * 3 // Cover more scroll area
    }
    resize()
    window.addEventListener("resize", resize)

    // Create particles
    const particleCount = 60
    particlesRef.current = []
    
    for (let i = 0; i < particleCount; i++) {
      particlesRef.current.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: Math.random() * 0.2 + 0.05,
        opacity: Math.random() * 0.5 + 0.2,
        hue: Math.random() * 20 + 35, // Gold range 35-55
      })
    }

    setIsReady(true)

    // Track scroll
    const handleScroll = () => {
      scrollRef.current = window.scrollY
    }
    window.addEventListener("scroll", handleScroll, { passive: true })

    // Animation loop
    const animate = () => {
      if (!ctx || !canvas) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const scrollOffset = scrollRef.current * 0.3

      particlesRef.current.forEach((p) => {
        // Update position
        p.x += p.speedX
        p.y += p.speedY

        // Wrap around
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y > canvas.height) p.y = 0

        // Draw particle with glow
        const drawY = (p.y - scrollOffset) % canvas.height
        if (drawY < 0 || drawY > window.innerHeight * 1.5) return

        // Glow effect
        const gradient = ctx.createRadialGradient(p.x, drawY, 0, p.x, drawY, p.size * 4)
        gradient.addColorStop(0, `hsla(${p.hue}, 70%, 60%, ${p.opacity})`)
        gradient.addColorStop(0.5, `hsla(${p.hue}, 60%, 50%, ${p.opacity * 0.3})`)
        gradient.addColorStop(1, `hsla(${p.hue}, 50%, 40%, 0)`)

        ctx.beginPath()
        ctx.arc(p.x, drawY, p.size * 4, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()

        // Core
        ctx.beginPath()
        ctx.arc(p.x, drawY, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${p.hue}, 80%, 70%, ${p.opacity})`
        ctx.fill()
      })

      rafRef.current = requestAnimationFrame(animate)
    }

    rafRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener("resize", resize)
      window.removeEventListener("scroll", handleScroll)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-[2] transition-opacity duration-1000 ${
        isReady ? "opacity-100" : "opacity-0"
      }`}
      style={{ top: "100vh" }} // Start below hero
      aria-hidden="true"
    />
  )
}

interface Particle {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  opacity: number
  hue: number
}
