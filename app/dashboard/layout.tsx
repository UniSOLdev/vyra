import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Today’s session, targets, discipline score, and weekly rhythm.",
  openGraph: {
    title: "Dashboard · VYRA",
    description: "Today’s session, targets, discipline score, and weekly rhythm.",
  },
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
