"use client"

import { useRef, type ReactNode, type MouseEvent as ReactMouseEvent } from "react"

interface MagneticButtonProps {
  children: ReactNode
  className?: string
  strength?: number
  as?: "button" | "a" | "div"
  onClick?: () => void
  href?: string
  target?: string
  rel?: string
  type?: "button" | "submit" | "reset"
  disabled?: boolean
}

export function MagneticButton({
  children,
  className = "",
  strength = 0.3,
  as = "button",
  onClick,
  href,
  target,
  rel,
  type = "button",
  disabled = false,
}: MagneticButtonProps) {
  const ref = useRef<HTMLElement>(null)

  const handleMouseMove = (e: ReactMouseEvent) => {
    if (typeof window === "undefined") return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    if (!ref.current || disabled) return

    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const deltaX = e.clientX - centerX
    const deltaY = e.clientY - centerY

    const x = deltaX * strength
    const y = deltaY * strength
    ref.current.style.transform = `translate(${x}px, ${y}px)`
  }

  const handleMouseLeave = () => {
    if (typeof window === "undefined") return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    if (!ref.current) return
    ref.current.style.transform = "translate(0px, 0px)"
  }

  const commonProps = {
    ref: ref as any,
    className: `transition-transform duration-300 ease-out ${className}`,
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
  }

  if (as === "a") {
    return (
      <a {...commonProps} href={href} target={target} rel={rel}>
        {children}
      </a>
    )
  }

  if (as === "div") {
    return (
      <div {...commonProps} onClick={onClick}>
        {children}
      </div>
    )
  }

  return (
    <button {...commonProps} onClick={onClick} type={type} disabled={disabled}>
      {children}
    </button>
  )
}
