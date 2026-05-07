import type React from "react"
import type { Metadata, Viewport } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { brand } from "@/config/brand"
import { SmoothScrollProvider } from "@/components/smooth-scroll-provider"
import { SITE_URL, allSchemas } from "@/lib/seo/schemas"
import "./globals.css"

// ─── Metadata ────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: "/",
  },
  ...(brand.seo.googleVerification
    ? { verification: { google: brand.seo.googleVerification } }
    : {}),
  title: brand.seo.schema.title,
  description: brand.seo.schema.description,
  // icons: Next.js descubre app/icon.tsx automaticamente (file convention).
  // No agregar manualmente o dispara 404 en /favicon.ico y /apple-icon.png.
  // TODO: cuando AR Building entregue favicon/apple-icon definitivos, dropearlos
  // como app/icon.png + app/apple-icon.png y reemplazara al programatico.
  openGraph: {
    type: "website",
    locale: brand.seo.schema.locale,
    url: SITE_URL,
    siteName: brand.seo.schema.siteName,
    title: brand.seo.schema.ogTitle,
    description: brand.seo.schema.ogDescription,
    images: [
      {
        url: brand.seo.ogImage,
        width: 1200,
        height: 630,
        alt: `${brand.project} — ${brand.seo.schema.title}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: brand.seo.schema.ogTitle,
    description: brand.seo.schema.twitterDescription,
    images: [brand.seo.ogImage],
  },
  other: {
    "og:locality": brand.location.area,
    "og:region": brand.location.city,
    "og:country-name": brand.location.country,
    "og:postal-code": brand.seo.postalCode,
  },
}

export const viewport: Viewport = {
  themeColor: brand.seo.themeColor,
  width: "device-width",
  initialScale: 1,
}

// ─── Root Layout ─────────────────────────────────────────────────────────────

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang={brand.seo.schema.htmlLang} className="dark overflow-x-hidden">
      <head>
        {/* Resource hints: pre-warm conexión a Kuula (iframe 360°) */}
        <link rel="preconnect" href="https://kuula.co" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://kuula.co" />
        {/* Schema.org JSON-LD: Organization, RealEstateAgent, ApartmentComplex,
            WebSite, BreadcrumbList, FAQPage. Generados desde config/brand.ts.
            Nota: FAQPage rich-results limitados a gov/health desde Aug 2023,
            pero sigue siendo valioso para AI citations (ChatGPT, Perplexity, Claude). */}
        {allSchemas.map((schema, idx) => (
          <script
            key={idx}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        ))}
      </head>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased overflow-x-hidden`}>
        <SmoothScrollProvider>
          <Suspense fallback={<div>Loading...</div>}>
            {children}
            <Analytics />
          </Suspense>
        </SmoothScrollProvider>
      </body>
    </html>
  )
}
