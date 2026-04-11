"use client"

import dynamic from "next/dynamic"

// Client-only wrapper for AtmosphericLayer. The server renders nothing
// here, so on iPhone there are no blurred multiply-blend divs in the
// hydration DOM for Safari to composite — the inner component's
// isTouchDevice() check then no-ops on the client for touch devices.
// next/dynamic({ ssr: false }) has to live inside a "use client" module;
// app/layout.tsx is a Server Component (exports metadata).
export const AtmosphericLayerClient = dynamic(
  () => import("./atmospheric-layer").then((m) => m.AtmosphericLayer),
  { ssr: false },
)
