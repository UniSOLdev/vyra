import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Progress",
  description: "Log weight, measurements, and notes in VYRA.",
}

export default function ProgressLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
