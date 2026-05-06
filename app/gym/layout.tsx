import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Gym",
  description: "Define your equipment so sessions stay realistic.",
  openGraph: {
    title: "Gym · VYRA",
    description: "Define your equipment so sessions stay realistic.",
  },
}

export default function GymLayout({ children }: { children: React.ReactNode }) {
  return children
}
