"use client"

import { useEffect, useRef } from "react"
import { prefersReducedMotion } from "@/lib/gsapConfig"

interface NetworkNodesProps {
  className?: string
  nodeCount?: number
  connectionDistance?: number
}

interface Node {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
}

export function NetworkNodes({
  className = "",
  nodeCount = 28,
  connectionDistance = 160,
}: NetworkNodesProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const nodesRef = useRef<Node[]>([])
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({
    x: 0,
    y: 0,
    active: false,
  })
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

    const initNodes = () => {
      nodesRef.current = Array.from({ length: nodeCount }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        radius: Math.random() * 1.5 + 1,
      }))
    }

    resize()
    initNodes()

    const handleResize = () => {
      resize()
      initNodes()
    }
    window.addEventListener("resize", handleResize)

    // Mouse tracking — relative to wrapper, captured globally
    const handleMouseMove = (e: MouseEvent) => {
      const rect = wrapper.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const inside = x >= 0 && x <= rect.width && y >= 0 && y <= rect.height
      mouseRef.current = { x, y, active: inside }
    }
    window.addEventListener("mousemove", handleMouseMove)

    // IntersectionObserver — pause animation when offscreen
    const io = new IntersectionObserver(
      ([entry]) => {
        isInViewportRef.current = entry.isIntersecting
      },
      { threshold: 0 },
    )
    io.observe(wrapper)

    const animate = () => {
      rafRef.current = requestAnimationFrame(animate)
      if (!isInViewportRef.current) return

      ctx.clearRect(0, 0, width, height)

      const nodes = nodesRef.current
      const mouse = mouseRef.current

      // Update node positions
      for (const node of nodes) {
        // Idle drift
        node.x += node.vx
        node.y += node.vy

        // Bounce off edges
        if (node.x < 0 || node.x > width) node.vx *= -1
        if (node.y < 0 || node.y > height) node.vy *= -1

        // Mouse attraction — gentle pull toward cursor within radius
        if (mouse.active) {
          const dx = mouse.x - node.x
          const dy = mouse.y - node.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 200 && dist > 0) {
            const force = (200 - dist) / 200
            node.vx += (dx / dist) * force * 0.03
            node.vy += (dy / dist) * force * 0.03
          }
        }

        // Velocity damping to prevent runaway acceleration
        node.vx *= 0.98
        node.vy *= 0.98
      }

      // Draw connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x
          const dy = nodes[i].y - nodes[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < connectionDistance) {
            const alpha = (1 - dist / connectionDistance) * 0.35
            ctx.beginPath()
            ctx.moveTo(nodes[i].x, nodes[i].y)
            ctx.lineTo(nodes[j].x, nodes[j].y)
            ctx.strokeStyle = `oklch(0.35 0.02 60 / ${alpha})`
            ctx.lineWidth = 0.6
            ctx.stroke()
          }
        }
      }

      // Draw nodes — warm accent for ones near cursor
      for (const node of nodes) {
        let nearMouse = false
        if (mouse.active) {
          const dx = mouse.x - node.x
          const dy = mouse.y - node.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          nearMouse = dist < 150
        }
        ctx.beginPath()
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2)
        ctx.fillStyle = nearMouse
          ? "oklch(0.72 0.12 45 / 0.9)"
          : "oklch(0.35 0.02 60 / 0.55)"
        ctx.fill()
      }
    }

    animate()

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("mousemove", handleMouseMove)
      io.disconnect()
    }
  }, [nodeCount, connectionDistance])

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
