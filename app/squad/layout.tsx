import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Squad",
  description: "Small groups. Weekly discipline. No ego metrics.",
  openGraph: {
    title: "Squad · VYRA",
    description: "Small groups. Weekly discipline. No ego metrics.",
  },
}

export default function SquadLayout({ children }: { children: React.ReactNode }) {
  return children
}
