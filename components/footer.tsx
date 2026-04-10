"use client"

import { brand } from "@/config/brand"
import { Instagram, Mail, Phone, MapPin, ArrowUpRight } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative bg-background border-t border-border/50">
      {/* Main footer content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <span className="text-2xl font-bold text-foreground tracking-tight">
                {brand.project}
              </span>
              <span className="block text-sm text-muted-foreground mt-1">
                por {brand.company}
              </span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              Desarrollo inmobiliario de alta gama en Victoria, San Fernando. 
              Diseño contemporaneo y calidad premium.
            </p>
          </div>

          {/* Navigation column */}
          <div className="lg:col-span-1">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-6">
              Navegacion
            </h3>
            <nav className="flex flex-col gap-3">
              {brand.navItems.slice(0, 5).map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-muted-foreground hover:text-foreground transition-colors text-sm group flex items-center gap-1"
                >
                  {item.label}
                  <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </a>
              ))}
            </nav>
          </div>

          {/* Contact column */}
          <div className="lg:col-span-1">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-6">
              Contacto
            </h3>
            <div className="flex flex-col gap-4">
              <a
                href={`mailto:${brand.email}`}
                className="text-muted-foreground hover:text-foreground transition-colors text-sm flex items-center gap-3 group"
              >
                <Mail className="w-4 h-4 text-foreground/50 group-hover:text-foreground transition-colors" />
                {brand.email}
              </a>
              {brand.phones.map((phone) => (
                <a
                  key={phone.whatsappNumber}
                  href={`https://wa.me/${phone.whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors text-sm flex items-center gap-3 group"
                >
                  <Phone className="w-4 h-4 text-foreground/50 group-hover:text-foreground transition-colors" />
                  {phone.name}: {phone.number}
                </a>
              ))}
            </div>
          </div>

          {/* Location column */}
          <div className="lg:col-span-1">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-6">
              Ubicacion
            </h3>
            <div className="flex flex-col gap-4">
              <div className="text-muted-foreground text-sm flex items-start gap-3">
                <MapPin className="w-4 h-4 text-foreground/50 mt-0.5 shrink-0" />
                <span>
                  {brand.location.address}
                  <br />
                  {brand.location.area}
                  <br />
                  {brand.location.city}, {brand.location.country}
                </span>
              </div>
              <a
                href={brand.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors text-sm flex items-center gap-3 group"
              >
                <Instagram className="w-4 h-4 text-foreground/50 group-hover:text-foreground transition-colors" />
                {brand.instagram.handle}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border/50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-muted-foreground text-xs">
              {currentYear} {brand.project} by {brand.company}. Todos los derechos reservados.
            </p>
            <div className="flex items-center gap-6">
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors text-xs"
              >
                Terminos y condiciones
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors text-xs"
              >
                Politica de privacidad
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Cubiqa credit */}
      <div className="border-t border-border/30 bg-background/50">
        <div className="container mx-auto px-4 py-4">
          <p className="text-center text-muted-foreground/60 text-xs">
            Desarrollado por{" "}
            <a
              href="https://cubiqa.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors font-medium"
            >
              Cubiqa
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
