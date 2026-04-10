"use client"

import { useEffect, useRef, useState } from "react"

interface Point {
  x: number
  y: number
  age: number
}

export function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pointsRef = useRef<Point[]>([])
  const mouseRef = useRef({ x: 0, y: 0 })
  const rafRef = useRef<number>(0)
  const [isVisible, setIsVisible] = useState(false)
  const [isTouchDevice, setIsTouchDevice] = useState(false)

  useEffect(() => {
    const isTouchDeviceCheck = "ontouchstart" in window || navigator.maxTouchPoints > 0
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    
    setIsTouchDevice(isTouchDeviceCheck)
    
    if (isTouchDeviceCheck || prefersReducedMotion) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener("resize", resize)

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
      setIsVisible(true)
      
      pointsRef.current.push({
        x: e.clientX,
        y: e.clientY,
        age: 0,
      })
      
      // Keep more points for longer trail
      if (pointsRef.current.length > 35) {
        pointsRef.current.shift()
      }
    }

    const handleMouseLeave = () => {
      setIsVisible(false)
    }

    const animate = () => {
      if (!ctx || !canvas) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const points = pointsRef.current

      // Age all points
      for (let i = points.length - 1; i >= 0; i--) {
        points[i].age += 1
        if (points[i].age > 40) {
          points.splice(i, 1)
        }
      }

      if (points.length > 2) {
        // Draw multiple layers for glow effect
        for (let layer = 3; layer >= 0; layer--) {
          ctx.beginPath()
          ctx.moveTo(points[0].x, points[0].y)

          for (let i = 1; i < points.length; i++) {
            const p0 = points[i - 1]
            const p1 = points[i]
            const midX = (p0.x + p1.x) / 2
            const midY = (p0.y + p1.y) / 2
            ctx.quadraticCurveTo(p0.x, p0.y, midX, midY)
          }

          // Gold gradient
          const gradient = ctx.createLinearGradient(
            points[0].x,
            points[0].y,
            points[points.length - 1].x,
            points[points.length - 1].y
          )
          
          const alpha = layer === 0 ? 0.9 : layer === 1 ? 0.4 : layer === 2 ? 0.2 : 0.1
          gradient.addColorStop(0, `rgba(212, 175, 55, 0)`)
          gradient.addColorStop(0.3, `rgba(212, 175, 55, ${alpha * 0.5})`)
          gradient.addColorStop(0.7, `rgba(255, 200, 87, ${alpha})`)
          gradient.addColorStop(1, `rgba(255, 215, 0, ${alpha})`)

          ctx.strokeStyle = gradient
          ctx.lineWidth = layer === 0 ? 3 : layer === 1 ? 6 : layer === 2 ? 10 : 16
          ctx.lineCap = "round"
          ctx.lineJoin = "round"
          ctx.stroke()
        }
      }

      // Draw cursor dot
      if (points.length > 0) {
        const lastPoint = points[points.length - 1]
        const dotGradient = ctx.createRadialGradient(
          lastPoint.x, lastPoint.y, 0,
          lastPoint.x, lastPoint.y, 12
        )
        dotGradient.addColorStop(0, "rgba(255, 215, 0, 0.8)")
        dotGradient.addColorStop(0.5, "rgba(212, 175, 55, 0.3)")
        dotGradient.addColorStop(1, "rgba(212, 175, 55, 0)")
        
        ctx.beginPath()
        ctx.arc(lastPoint.x, lastPoint.y, 12, 0, Math.PI * 2)
        ctx.fillStyle = dotGradient
        ctx.fill()
      }

      rafRef.current = requestAnimationFrame(animate)
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseleave", handleMouseLeave)
    rafRef.current = requestAnimationFrame(animate)

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseleave", handleMouseLeave)
      window.removeEventListener("resize", resize)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  if (isTouchDevice) return null

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-[9999] transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      aria-hidden="true"
    />
  )
}
