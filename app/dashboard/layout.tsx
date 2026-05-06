import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "App",
  description: "VYRA training dashboard, targets, and habits.",
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
