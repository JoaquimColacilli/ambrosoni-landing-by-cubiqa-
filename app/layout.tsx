import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { brand } from "@/config/brand"
import { SmoothScrollProvider } from "@/components/smooth-scroll-provider"
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
        {/* Fixed ambient background that follows scroll */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-amber-500/10 rounded-full blur-[150px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-yellow-500/8 rounded-full blur-[120px]" />
        </div>
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
