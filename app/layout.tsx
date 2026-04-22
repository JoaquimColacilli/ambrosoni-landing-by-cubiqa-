import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { brand } from "@/config/brand"
import { SmoothScrollProvider } from "@/components/smooth-scroll-provider"
import { AtmosphericLayerClient } from "@/components/atmospheric-layer-client"
import "./globals.css"

export const metadata: Metadata = {
  title: brand.metadata.title,
  description: brand.metadata.description,
  openGraph: {
    title: brand.metadata.ogTitle,
    description: brand.metadata.ogDescription,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className="dark overflow-x-hidden">
      <head>
        {/* Resource hints: pre-warm conexión a Kuula (iframe 360°) */}
        <link rel="preconnect" href="https://kuula.co" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://kuula.co" />
      </head>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased overflow-x-hidden`}>
        <AtmosphericLayerClient />
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
