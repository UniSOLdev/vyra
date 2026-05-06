import { ImageResponse } from "next/og"

export const size = { width: 32, height: 32 }
export const contentType = "image/png"

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#09090b",
          color: "#bef264",
          fontSize: 15,
          fontWeight: 800,
          letterSpacing: "0.35em",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        V
      </div>
    ),
    { ...size }
  )
}
