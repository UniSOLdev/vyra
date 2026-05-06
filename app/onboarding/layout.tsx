import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Setup",
  description: "Personalize your VYRA plan — goals, training, nutrition, interests.",
}

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
