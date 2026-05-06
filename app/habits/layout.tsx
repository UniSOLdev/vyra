import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Habits",
  description: "Daily habit checklist and streaks in VYRA.",
}

export default function HabitsLayout({ children }: { children: React.ReactNode }) {
  return children
}
