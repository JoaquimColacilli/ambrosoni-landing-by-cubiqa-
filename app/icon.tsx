import { ImageResponse } from "next/og"

// TODO: favicon definitivo AR Building pendiente de Cubiqa
// Placeholder programático con las iniciales AM (AMBROSONI)

export const runtime = "edge"
export const size = { width: 32, height: 32 }
export const contentType = "image/png"

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 20,
          background: "#1f1f1f",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontWeight: 700,
          letterSpacing: "-0.05em",
        }}
      >
        AM
      </div>
    ),
    { ...size },
  )
}
