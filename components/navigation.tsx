"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { brand } from "@/config/brand"
import { motion, AnimatePresence } from "framer-motion"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import { useMagnetic } from "@/hooks/use-magnetic"
import { gsap, prefersReducedMotion as gsapReduced } from "@/lib/gsap-utils"

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const prefersReducedMotion = useReducedMotion()
  const desktopCtaMagnetic = useMagnetic<HTMLDivElement>({ strength: 0.35, radius: 100 })

  const navRef = useRef<HTMLElement>(null)
  const logoRef = useRef<HTMLAnchorElement>(null)
  const linksRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const mobileBtnRef = useRef<HTMLButtonElement>(null)

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: prefersReducedMotion ? { duration: 0 } : { duration: 0.25, ease: [0.23, 1, 0.32, 1] },
    },
    exit: {
      opacity: 0,
      transition: prefersReducedMotion ? { duration: 0 } : { duration: 0.2, ease: [0.23, 1, 0.32, 1] },
    },
  }

  const menuLinkVariants = {
    hidden: {
      opacity: 0,
      y: 16,
    },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: prefersReducedMotion
        ? { duration: 0 }
        : {
            duration: 0.4,
            ease: [0.23, 1, 0.32, 1],
            delay: 0.1 + i * 0.06,
          },
    }),
    exit: {
      opacity: 0,
      y: 8,
      transition: prefersReducedMotion ? { duration: 0 } : { duration: 0.12, ease: [0.23, 1, 0.32, 1] },
    },
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Entry animation — coordinated with the hero timeline.
  // The hero's bg starts revealing at 0s; we slide the navbar chrome in
  // starting at ~0.8s so it feels like the UI settling after the scene loads.
  useEffect(() => {
    const reduced = gsapReduced()
    const linkEls = linksRef.current
      ? Array.from(linksRef.current.children) as HTMLElement[]
      : []

    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set(
          [logoRef.current, ...linkEls, ctaRef.current, mobileBtnRef.current].filter(Boolean),
          { opacity: 1, y: 0 },
        )
        return
      }

      const tl = gsap.timeline({
        delay: 0.8,
        defaults: { ease: "expo.out" },
      })

      if (logoRef.current) {
        tl.fromTo(
          logoRef.current,
          { opacity: 0, y: -20 },
          { opacity: 1, y: 0, duration: 0.9 },
          0,
        )
      }

      if (linkEls.length > 0) {
        tl.fromTo(
          linkEls,
          { opacity: 0, y: -18 },
          { opacity: 1, y: 0, duration: 0.7, stagger: 0.07 },
          0.15,
        )
      }

      if (ctaRef.current) {
        tl.fromTo(
          ctaRef.current,
          { opacity: 0, y: -18, scale: 0.9 },
          { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: "back.out(1.6)" },
          0.4,
        )
      }

      if (mobileBtnRef.current) {
        tl.fromTo(
          mobileBtnRef.current,
          { opacity: 0, y: -18 },
          { opacity: 1, y: 0, duration: 0.7 },
          0.4,
        )
      }
    }, navRef)

    return () => ctx.revert()
  }, [])

  // Lock body scroll while the mobile menu is open.
  useEffect(() => {
    if (!isMobileMenuOpen) return
    const previous = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = previous
    }
  }, [isMobileMenuOpen])

  // Close on Escape key.
  useEffect(() => {
    if (!isMobileMenuOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMobileMenuOpen(false)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [isMobileMenuOpen])

  return (
    <>
      <nav
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled ? "bg-[#1a1a1a] backdrop-blur-md border-b border-border" : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <a
              ref={logoRef}
              href="#"
              className="flex items-center gap-2 sm:gap-3 group min-w-0"
              style={{ opacity: 0 }}
            >
              <div className="relative w-10 h-10 sm:w-12 sm:h-12 shrink-0 transition-transform duration-300 group-hover:scale-110">
                <Image src={brand.logo} alt={brand.logoAlt} fill className="object-contain" />
              </div>
              <span className="text-lg sm:text-xl font-bold tracking-tight hidden sm:block truncate">
                {brand.project}
                <span className="text-primary">.</span>
              </span>
            </a>

            {/* Desktop Navigation */}
            <div ref={linksRef} className="hidden lg:flex items-center gap-8">
              {brand.navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-sm text-white hover:text-white/80 transition-colors duration-300 relative group font-medium"
                  style={{ opacity: 0 }}
                >
                  {item.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
                </a>
              ))}
            </div>

            {/* Desktop CTA Button */}
            <div
              ref={(node) => {
                ctaRef.current = node
                desktopCtaMagnetic.ref.current = node
              }}
              onMouseMove={desktopCtaMagnetic.handleMouseMove}
              onMouseLeave={desktopCtaMagnetic.handleMouseLeave}
              className="hidden lg:block transition-transform duration-300 ease-out"
              style={{ opacity: 0 }}
            >
              <Button className="bg-white text-black hover:bg-gray-100 active:scale-[0.97] animate-glow-pulse font-semibold">
                {brand.cta.nav}
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              ref={mobileBtnRef}
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Abrir menú"
              aria-expanded={isMobileMenuOpen}
              className="lg:hidden -mr-2 p-2 text-white"
              style={{ opacity: 0 }}
            >
              <Menu size={26} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu — fullscreen overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            key="mobile-menu"
            className="fixed inset-0 z-[60] lg:hidden bg-[#1a1a1a] flex flex-col"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            role="dialog"
            aria-modal="true"
          >
            {/* Top bar inside overlay: logo + close */}
            <div className="flex items-center justify-between h-16 sm:h-20 px-4 sm:px-6 border-b border-white/10">
              <a
                href="#"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2 sm:gap-3 min-w-0"
              >
                <div className="relative w-10 h-10 sm:w-12 sm:h-12 shrink-0">
                  <Image src={brand.logo} alt={brand.logoAlt} fill className="object-contain" />
                </div>
                <span className="text-lg sm:text-xl font-bold tracking-tight text-white truncate">
                  {brand.project}
                  <span className="text-primary">.</span>
                </span>
              </a>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Cerrar menú"
                className="-mr-2 p-2 text-white"
              >
                <X size={26} />
              </button>
            </div>

            {/* Links — centered vertically on the remaining space */}
            <div className="flex-1 flex flex-col justify-center items-center gap-6 px-6 overflow-y-auto">
              {brand.navItems.map((item, i) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-white text-3xl sm:text-4xl font-bold tracking-tight hover:text-primary transition-colors"
                  variants={menuLinkVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  custom={i}
                >
                  {item.label}
                </motion.a>
              ))}
            </div>

            {/* Bottom CTA — respects iOS safe area */}
            <motion.div
              className="px-6 pt-4 pb-[calc(env(safe-area-inset-bottom)+1.5rem)]"
              variants={menuLinkVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              custom={brand.navItems.length}
            >
              <Button
                onClick={() => setIsMobileMenuOpen(false)}
                className="bg-white text-black hover:bg-gray-100 w-full h-14 text-base font-semibold"
              >
                {brand.cta.nav}
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
