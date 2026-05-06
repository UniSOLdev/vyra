import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Nutrition",
  description: "Targets and structure for daily fuel and hydration.",
}

export default function NutritionLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
