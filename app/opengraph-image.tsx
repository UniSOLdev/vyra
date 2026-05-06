import { ImageResponse } from "next/og"
import { siteName, siteTagline } from "@/lib/site"

export const alt = `${siteName} — ${siteTagline}`
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background:
            "linear-gradient(145deg, #09090b 0%, #18181b 45%, #09090b 100%)",
          color: "white",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 22,
            letterSpacing: "0.35em",
            color: "#bef264",
            fontWeight: 700,
            marginBottom: 24,
          }}
        >
          {siteName}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 0,
            fontSize: 72,
            fontWeight: 800,
            lineHeight: 1.02,
            letterSpacing: "-0.03em",
            maxWidth: 900,
          }}
        >
          <div style={{ display: "flex" }}>TRAIN CLEAN.</div>
          <div style={{ display: "flex", color: "#bef264" }}>LIVE SHARP.</div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: 36,
            fontSize: 28,
            color: "#a1a1aa",
            maxWidth: 820,
            lineHeight: 1.35,
          }}
        >
          {`${siteTagline} — command center for training, habits, supply.`}
        </div>
      </div>
    ),
    { ...size }
  )
}
