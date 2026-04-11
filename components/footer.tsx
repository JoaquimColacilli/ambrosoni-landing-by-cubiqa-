"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import { Instagram, Mail, MapPin, Phone } from "lucide-react"
import { brand } from "@/config/brand"
import { NoiseGrainStars } from "@/components/ui/noise-grain-stars"
import { gsap, prefersReducedMotion } from "@/lib/gsap-utils"

export function Footer() {
  const year = new Date().getFullYear()
  const footerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const reduced = prefersReducedMotion()
    if (!footerRef.current) return

    const ctx = gsap.context(() => {
      const columns = footerRef.current!.querySelectorAll<HTMLElement>("[data-footer-col]")
      const bottomBar = footerRef.current!.querySelector<HTMLElement>("[data-footer-bottom]")

      const footerTl = gsap.timeline({
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 85%",
          once: true,
        },
        defaults: { ease: "expo.out" },
      })

      if (columns.length > 0) {
        footerTl.fromTo(
          columns,
          {
            opacity: 0,
            y: 40,
            filter: "blur(8px)",
          },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: reduced ? 0 : 0.9,
            stagger: 0.12,
            ease: "power3.out",
          },
          0,
        )
      }

      if (bottomBar) {
        footerTl.fromTo(
          bottomBar,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: reduced ? 0 : 0.7,
            ease: "power3.out",
          },
          reduced ? 0 : 0.8,
        )
      }
    }, footerRef)

    return () => {
      ctx.revert()
    }
  }, [])

  return (
    <footer
      ref={footerRef}
      className="relative bg-[#0a0a0a] text-white border-t border-white/10 overflow-hidden"
    >
      <NoiseGrainStars />
      <div className="relative container mx-auto px-4 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div data-footer-col className="space-y-4 will-change-transform">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 shrink-0">
                <Image
                  src={brand.logo}
                  alt={brand.logoAlt}
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <div className="text-xl font-bold tracking-tight">
                  {brand.project}
                </div>
                <div className="text-xs text-white/50 uppercase tracking-wider">
                  {brand.company}
                </div>
              </div>
            </div>
            <p className="text-sm text-white/60 leading-relaxed">
              Un nuevo desarrollo inmobiliario en {brand.location.area}. Departamentos diseñados para vivir una experiencia única.
            </p>
          </div>

          {/* Navigation */}
          <div data-footer-col className="will-change-transform">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/80 mb-4">
              Navegación
            </h3>
            <ul className="space-y-2">
              {brand.navItems.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="text-sm text-white/60 hover:text-white transition-colors"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div data-footer-col className="will-change-transform">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/80 mb-4">
              Contacto
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-white/60">
                <MapPin size={16} className="mt-0.5 shrink-0" />
                <span>{brand.location.full}</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-white/60">
                <Mail size={16} className="shrink-0" />
                <a
                  href={`mailto:${brand.email}`}
                  className="hover:text-white transition-colors"
                >
                  {brand.email}
                </a>
              </li>
              {brand.phones.map((phone) => (
                <li
                  key={phone.whatsappNumber}
                  className="flex items-center gap-2 text-sm text-white/60"
                >
                  <Phone size={16} className="shrink-0" />
                  <a
                    href={`tel:${phone.number.replace(/\s/g, "")}`}
                    className="hover:text-white transition-colors"
                  >
                    {phone.number}{" "}
                    <span className="text-white/40">({phone.name})</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Hours + Social */}
          <div data-footer-col className="will-change-transform">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/80 mb-4">
              Horarios
            </h3>
            <ul className="space-y-1 text-sm text-white/60 mb-6">
              <li>{brand.officeHours.weekdays}</li>
              <li>{brand.officeHours.saturday}</li>
              <li>{brand.officeHours.sunday}</li>
            </ul>
            <a
              href={brand.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
            >
              <Instagram size={16} />
              {brand.instagram.handle}
            </a>
          </div>
        </div>

        {/* Divider + copyright */}
        <div
          data-footer-bottom
          className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/40 will-change-transform"
        >
          <p>
            © {year} {brand.company}. Todos los derechos reservados.
          </p>
          <p>{brand.project} — {brand.location.area}</p>
        </div>
      </div>
    </footer>
  )
}
