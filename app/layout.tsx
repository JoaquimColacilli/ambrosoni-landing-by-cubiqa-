import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { brand } from "@/config/brand"
import { SmoothScrollProvider } from "@/components/smooth-scroll-provider"
import { AtmosphericLayer } from "@/components/atmospheric-layer"
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
    <html lang="es" className="dark scroll-smooth overflow-x-hidden">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased overflow-x-hidden`}>
        <AtmosphericLayer />
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
