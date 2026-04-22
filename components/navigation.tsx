"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { brand } from "@/config/brand"
import { motion, AnimatePresence } from "framer-motion"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import { useMagnetic } from "@/hooks/use-magnetic"
import { useSmoothScroll } from "@/components/smooth-scroll-provider"
import { gsap, useGSAP } from "@/lib/gsapConfig"

const NAV_OFFSET = -80 // compensar la altura del navbar fijo al scrollear

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const prefersReducedMotion = useReducedMotion()
  const desktopCtaMagnetic = useMagnetic<HTMLDivElement>({ strength: 0.35, radius: 100 })
  const smoothScroll = useSmoothScroll()

  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string, onDone?: () => void) => {
      if (!href.startsWith("#")) return
      e.preventDefault()
      if (href === "#") {
        smoothScroll?.scrollTo(0)
      } else {
        smoothScroll?.scrollTo(href, { offset: NAV_OFFSET })
      }
      onDone?.()
    },
    [smoothScroll],
  )

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
  // useGSAP runs pre-paint (via useLayoutEffect internally) and auto-reverts
  // the full context on unmount — the official Next.js App Router pattern.
  useGSAP(
    () => {
      const linkEls = linksRef.current
        ? (Array.from(linksRef.current.children) as HTMLElement[])
        : []

      // Hide elements synchronously before first paint.
      const allEls = [
        logoRef.current,
        ...linkEls,
        ctaRef.current,
        mobileBtnRef.current,
      ].filter(Boolean) as HTMLElement[]
      gsap.set(allEls, { opacity: 0, y: -20 })

      // The CTA wrapper has `transition-transform` on it (for the useMagnetic
      // smoothing). During the entry tween, that CSS transition would
      // interpolate every GSAP transform write with 300ms of easing, fighting
      // the tween. Suppress it for the duration of the entry and restore in
      // the CTA tween's onComplete.
      if (ctaRef.current) {
        ctaRef.current.style.transition = "none"
      }

      const mm = gsap.matchMedia()

      mm.add(
        {
          isDesktop: "(min-width: 769px) and (prefers-reduced-motion: no-preference)",
          isMobile: "(max-width: 768px) and (prefers-reduced-motion: no-preference)",
          reduced: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { isMobile, reduced } = context.conditions as {
            isDesktop: boolean
            isMobile: boolean
            reduced: boolean
          }

          if (reduced) {
            gsap.set(allEls, { opacity: 1, y: 0, clearProps: "willChange,transform" })
            if (ctaRef.current) ctaRef.current.style.transition = ""
            return
          }

          // Mobile variants: duration -20%, stagger -30%, gentler overshoot.
          const durMain = isMobile ? 0.72 : 0.9
          const durItem = isMobile ? 0.56 : 0.7
          const staggerItems = isMobile ? 0.049 : 0.07
          const ctaEase = isMobile ? "back.out(1.2)" : "back.out(1.6)"
          const baseEase = isMobile ? "power2.out" : "expo.out"

          const tl = gsap.timeline({
            delay: 0.8,
            defaults: { ease: baseEase },
          })

          if (logoRef.current) {
            tl.fromTo(
              logoRef.current,
              { opacity: 0, y: -20, willChange: "transform, opacity" },
              {
                opacity: 1,
                y: 0,
                duration: durMain,
                onComplete: () => {
                  if (logoRef.current) {
                    gsap.set(logoRef.current, { clearProps: "willChange,transform" })
                  }
                },
              },
              0,
            )
          }

          if (linkEls.length > 0) {
            tl.fromTo(
              linkEls,
              { opacity: 0, y: -18, willChange: "transform, opacity" },
              {
                opacity: 1,
                y: 0,
                duration: durItem,
                stagger: staggerItems,
                onComplete: () => {
                  gsap.set(linkEls, { clearProps: "willChange,transform" })
                },
              },
              0.15,
            )
          }

          if (ctaRef.current) {
            tl.fromTo(
              ctaRef.current,
              { opacity: 0, y: -18, scale: 0.9, willChange: "transform, opacity" },
              {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: durItem,
                ease: ctaEase,
                onComplete: () => {
                  const el = ctaRef.current
                  if (!el) return
                  gsap.set(el, { clearProps: "willChange,transform" })
                  // Restore the CSS transition so the magnetic effect smoothing
                  // and hover/active feedback work normally after entry.
                  el.style.transition = ""
                },
              },
              0.4,
            )
          }

          if (mobileBtnRef.current) {
            tl.fromTo(
              mobileBtnRef.current,
              { opacity: 0, y: -18, willChange: "transform, opacity" },
              {
                opacity: 1,
                y: 0,
                duration: durItem,
                onComplete: () => {
                  if (mobileBtnRef.current) {
                    gsap.set(mobileBtnRef.current, { clearProps: "willChange,transform" })
                  }
                },
              },
              0.4,
            )
          }
        },
      )
    },
    { scope: navRef },
  )

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
        className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
          isScrolled
            ? "bg-[#1a1a1a] md:backdrop-blur-md border-b border-border"
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <a
              ref={logoRef}
              href="#"
              onClick={(e) => handleNavClick(e, "#")}
              className="flex items-center gap-2 sm:gap-3 group min-w-0"
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
                  onClick={(e) => handleNavClick(e, item.href)}
                  className="text-sm text-white hover:text-white/80 transition-colors duration-300 relative group font-medium"
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
              onMouseEnter={desktopCtaMagnetic.handleMouseEnter}
              onMouseMove={desktopCtaMagnetic.handleMouseMove}
              onMouseLeave={desktopCtaMagnetic.handleMouseLeave}
              className="hidden lg:block transition-transform duration-300 ease-out"
            >
              <Button
                onClick={() => smoothScroll?.scrollTo("#contacto", { offset: NAV_OFFSET })}
                className="bg-white text-black hover:bg-gray-100 active:scale-[0.97] animate-glow-pulse font-semibold"
              >
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
                onClick={(e) => handleNavClick(e, "#", () => setIsMobileMenuOpen(false))}
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
                  onClick={(e) => handleNavClick(e, item.href, () => setIsMobileMenuOpen(false))}
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
                onClick={() => {
                  setIsMobileMenuOpen(false)
                  smoothScroll?.scrollTo("#contacto", { offset: NAV_OFFSET })
                }}
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
