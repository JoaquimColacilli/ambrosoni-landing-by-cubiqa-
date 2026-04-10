"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"

interface RevealOnScrollProps {
  children: ReactNode
  className?: string
  delay?: number // ms
  direction?: "up" | "down" | "left" | "right" | "fade"
  distance?: number // px
  duration?: number // ms
  once?: boolean
}

export function RevealOnScroll({
  children,
  className = "",
  delay = 0,
  direction = "up",
  distance = 30,
  duration = 700,
  once = true,
}: RevealOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isEnabled, setIsEnabled] = useState(true)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (prefersReducedMotion) {
      setIsEnabled(false)
      setIsVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          if (once) {
            observer.disconnect()
          }
        } else if (!once) {
          setIsVisible(false)
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -50px 0px" }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [once])

  const getTransform = () => {
    if (!isEnabled || isVisible) return "translate(0, 0)"
    
    switch (direction) {
      case "up":
        return `translateY(${distance}px)`
      case "down":
        return `translateY(-${distance}px)`
      case "left":
        return `translateX(${distance}px)`
      case "right":
        return `translateX(-${distance}px)`
      case "fade":
      default:
        return "translate(0, 0)"
    }
  }

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isEnabled ? (isVisible ? 1 : 0) : 1,
        transform: getTransform(),
        transition: isEnabled
          ? `opacity ${duration}ms cubic-bezier(0.23, 1, 0.32, 1) ${delay}ms, transform ${duration}ms cubic-bezier(0.23, 1, 0.32, 1) ${delay}ms`
          : "none",
      }}
    >
      {children}
    </div>
  )
}
