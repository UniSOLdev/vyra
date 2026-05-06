import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Insights",
  description: "Pro discipline trends and habit consistency over four weeks.",
  openGraph: {
    title: "Insights · VYRA",
    description: "Pro discipline trends and habit consistency over four weeks.",
  },
}

export default function InsightsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
