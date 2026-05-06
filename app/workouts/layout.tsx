import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Workouts",
  description: "Plan and log VYRA training sessions.",
}

export default function WorkoutsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
