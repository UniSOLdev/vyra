import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Coach",
  description: "VYRA coach read — weekly consistency, fuel, and training signal.",
}

export default function CoachLayout({ children }: { children: React.ReactNode }) {
  return children
}
