"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Phone, MapPin } from "lucide-react"
import SplitType from "split-type"
import { brand } from "@/config/brand"
import { AntiGravityCanvas } from "@/components/ui/particle-effect-for-hero"
import { useScrollReveal } from "@/hooks/useScrollReveal"
import { gsap, prefersReducedMotion, isTouchDevice, useGSAP } from "@/lib/gsapConfig"

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const leftColRef = useRef<HTMLDivElement>(null)
  const formCardRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (isTouchDevice()) return
      const reduced = prefersReducedMotion()

      // ----------------------------------------------------------
      // HEADER
      // ----------------------------------------------------------
      if (headerRef.current) {
        const eyebrow = headerRef.current.querySelector<HTMLElement>("[data-eyebrow]")
        const h2 = headerRef.current.querySelector<HTMLHeadingElement>("h2")
        const paragraph = headerRef.current.querySelector<HTMLParagraphElement>("p")

        const splitH2 =
          h2 && !reduced ? new SplitType(h2, { types: "words" }) : null

        const headerTl = gsap.timeline({
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 78%",
            once: true,
          },
          defaults: { ease: "expo.out" },
        })

        if (eyebrow) {
          headerTl.fromTo(
            eyebrow,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: reduced ? 0 : 0.6 },
            0,
          )
        }

        if (splitH2?.words && splitH2.words.length > 0) {
          headerTl.fromTo(
            splitH2.words,
            { opacity: 0, y: 50, rotateX: -45 },
            {
              opacity: 1,
              y: 0,
              rotateX: 0,
              duration: 1.0,
              stagger: 0.07,
            },
            0.15,
          )
        }

        if (paragraph) {
          headerTl.fromTo(
            paragraph,
            { opacity: 0, y: 24, filter: "blur(6px)" },
            {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              duration: reduced ? 0 : 0.8,
              ease: "power3.out",
            },
            reduced ? 0 : 0.85,
          )
        }
      }

      // ----------------------------------------------------------
      // LEFT COLUMN — info cards + office hours
      // ----------------------------------------------------------
      if (leftColRef.current) {
        const h3 = leftColRef.current.querySelector<HTMLHeadingElement>("h3")
        const intro = leftColRef.current.querySelector<HTMLParagraphElement>("[data-intro]")
        const infoCards = leftColRef.current.querySelectorAll<HTMLElement>("[data-info-card]")
        const hoursBox = leftColRef.current.querySelector<HTMLElement>("[data-hours-box]")

        const leftTl = gsap.timeline({
          scrollTrigger: {
            trigger: leftColRef.current,
            start: "top 80%",
            once: true,
          },
          defaults: { ease: "expo.out" },
        })

        if (h3) {
          leftTl.fromTo(
            h3,
            { opacity: 0, x: -30 },
            { opacity: 1, x: 0, duration: reduced ? 0 : 0.7 },
            0,
          )
        }

        if (intro) {
          leftTl.fromTo(
            intro,
            { opacity: 0, y: 20, filter: "blur(6px)" },
            {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              duration: reduced ? 0 : 0.7,
              ease: "power3.out",
            },
            reduced ? 0 : 0.2,
          )
        }

        if (infoCards.length > 0) {
          leftTl.fromTo(
            infoCards,
            { opacity: 0, x: -40, scale: 0.92 },
            {
              opacity: 1,
              x: 0,
              scale: 1,
              duration: reduced ? 0 : 0.7,
              stagger: 0.1,
              ease: "back.out(1.4)",
            },
            reduced ? 0 : 0.4,
          )
        }

        if (hoursBox) {
          leftTl.fromTo(
            hoursBox,
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              duration: reduced ? 0 : 0.7,
              ease: "power3.out",
            },
            reduced ? 0 : 0.9,
          )
        }
      }

      // ----------------------------------------------------------
      // FORM CARD — clip-path reveal + inputs stagger
      // ----------------------------------------------------------
      if (formCardRef.current) {
        const fields = formCardRef.current.querySelectorAll<HTMLElement>("[data-form-field]")
        const submitBtn = formCardRef.current.querySelector<HTMLButtonElement>("button[type='submit']")

        const formTl = gsap.timeline({
          scrollTrigger: {
            trigger: formCardRef.current,
            start: "top 80%",
            once: true,
          },
          defaults: { ease: "expo.out" },
        })

        formTl.fromTo(
          formCardRef.current,
          {
            opacity: 0,
            x: 40,
            scale: 0.97,
          },
          {
            opacity: 1,
            x: 0,
            scale: 1,
            duration: reduced ? 0 : 1.0,
            ease: "power3.out",
          },
          0,
        )

        if (fields.length > 0) {
          formTl.fromTo(
            fields,
            { opacity: 0, y: 25, filter: "blur(5px)" },
            {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              duration: reduced ? 0 : 0.6,
              stagger: 0.08,
              ease: "power3.out",
            },
            reduced ? 0 : 0.35,
          )
        }

        if (submitBtn) {
          formTl.fromTo(
            submitBtn,
            { opacity: 0, y: 20, scale: 0.92 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: reduced ? 0 : 0.6,
              ease: "back.out(1.6)",
            },
            reduced ? 0 : 0.85,
          )
        }
      }
    },
    { scope: sectionRef },
  )

  // Touch-only CSS reveal (header fade-up + info col slide-in-left +
  // form slide-in-right + inputs stagger).
  useScrollReveal(sectionRef)

  useEffect(() => {
    const messageTextarea = document.getElementById("message") as HTMLTextAreaElement
    if (messageTextarea) {
      const handleInput = () => {
        setFormData((prev) => ({ ...prev, message: messageTextarea.value }))
      }
      messageTextarea.addEventListener("input", handleInput)
      return () => messageTextarea.removeEventListener("input", handleInput)
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    setFormData({
      name: "",
      email: "",
      phone: "",
      message: "",
    })
  }

  return (
    <section id="contacto" ref={sectionRef} className="relative py-16 overflow-hidden">
      <AntiGravityCanvas invert />
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div ref={headerRef} className="text-center mb-16" style={{ perspective: "1000px" }}>
          <span
            data-eyebrow
            data-reveal="fade-up"
            className="text-black/60 text-sm font-semibold tracking-wider uppercase"
          >
            Contacto
          </span>
          <h2
            data-reveal="fade-up"
            style={{ ["--reveal-delay" as string]: "80ms" }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mt-4 mb-6 text-balance text-black"
          >
            Tu hogar en San Fernando
            <br />
            <span className="text-black">empieza con una consulta.</span>
          </h2>
          <p
            data-reveal="fade-up"
            style={{ ["--reveal-delay" as string]: "160ms" }}
            className="text-lg text-black/70 max-w-2xl mx-auto text-pretty"
          >
            Completá el formulario y un asesor se contacta para contarte todo: precios, tipologías disponibles, formas
            de pago y cómo reservar tu unidad.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <div ref={leftColRef} data-reveal="slide-in-left" className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold mb-6 text-black">Información de Contacto</h3>
              <p data-intro className="text-black/70 mb-8 leading-relaxed">
                Estamos disponibles para responder todas tus consultas sobre el proyecto. Agendá una visita virtual o
                presencial.
              </p>
            </div>

            <div className="space-y-6">
              <div data-info-card className="flex items-start gap-4 will-change-transform">
                <div className="w-12 h-12 rounded-full bg-black/5 backdrop-blur-sm border border-black/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="text-black" size={20} />
                </div>
                <div>
                  <h4 className="font-semibold mb-1 text-black">Email</h4>
                  <a href={`mailto:${brand.email}`} className="text-black/70 hover:text-black transition-colors">
                    {brand.email}
                  </a>
                </div>
              </div>

              <div data-info-card className="flex items-start gap-4 will-change-transform">
                <div className="w-12 h-12 rounded-full bg-black/5 backdrop-blur-sm border border-black/10 flex items-center justify-center flex-shrink-0">
                  <Phone className="text-black" size={20} />
                </div>
                <div>
                  <h4 className="font-semibold mb-1 text-black">Teléfono</h4>
                  <a href={`tel:${brand.phones[0].number}`} className="text-black/70 hover:text-black transition-colors">
                    {brand.phones[0].number}
                  </a>
                </div>
              </div>

              <div data-info-card className="flex items-start gap-4 will-change-transform">
                <div className="w-12 h-12 rounded-full bg-black/5 backdrop-blur-sm border border-black/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="text-black" size={20} />
                </div>
                <div>
                  <h4 className="font-semibold mb-1 text-black">Oficina</h4>
                  <p className="text-black/70">
                    {brand.location.address}
                    <br />
                    {brand.location.area}
                  </p>
                </div>
              </div>
            </div>

            {/* Office Hours */}
            <div
              data-hours-box
              className="p-6 bg-white/50 backdrop-blur-md border border-black/10 rounded-lg"
            >
              <h4 className="font-semibold mb-3 text-black">Horarios de Atención</h4>
              <div className="space-y-2 text-sm text-black/70">
                <p>{brand.officeHours.weekdays}</p>
                <p>{brand.officeHours.saturday}</p>
                <p>{brand.officeHours.sunday}</p>
              </div>
            </div>
          </div>

          <div
            ref={formCardRef}
            data-reveal="slide-in-right"
            style={{ ["--reveal-delay" as string]: "120ms" }}
            className="bg-white/50 backdrop-blur-md border border-black/10 rounded-xl p-8 will-change-transform"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div data-form-field data-reveal="fade-up" style={{ ["--reveal-delay" as string]: "260ms" }}>
                <label htmlFor="name" className="block text-sm font-medium mb-2 text-black/80">
                  Nombre completo
                </label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Juan Pérez"
                  value={formData.name}
                  onChange={(e: any) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-white/60 border-black/20 focus:border-black text-black placeholder:text-black/40"
                  required
                />
              </div>

              <div data-form-field data-reveal="fade-up" style={{ ["--reveal-delay" as string]: "320ms" }}>
                <label htmlFor="email" className="block text-sm font-medium mb-2 text-black/80">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="juan@ejemplo.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-white/60 border-black/20 focus:border-black text-black placeholder:text-black/40"
                  required
                />
              </div>

              <div data-form-field data-reveal="fade-up" style={{ ["--reveal-delay" as string]: "380ms" }}>
                <label htmlFor="phone" className="block text-sm font-medium mb-2 text-black/80">
                  Teléfono
                </label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+54 11 1234-5678"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="bg-white/60 border-black/20 focus:border-black text-black placeholder:text-black/40"
                  required
                />
              </div>

              <div data-form-field data-reveal="fade-up" style={{ ["--reveal-delay" as string]: "440ms" }}>
                <label htmlFor="message" className="block text-sm font-medium mb-2 text-black/80">
                  Mensaje
                </label>
                <Textarea
                  id="message"
                  placeholder="Contanos sobre tu interés en el proyecto..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="bg-white/60 border-black/20 focus:border-black text-black placeholder:text-black/40 min-h-32"
                  required
                />
              </div>

              <Button type="submit" className="w-full bg-black text-white hover:bg-black/90 active:scale-[0.97] transition-transform duration-100" size="lg">
                Enviar Consulta
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
