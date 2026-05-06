import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Friends",
  description: "Weekly discipline leaderboard with your crew.",
  openGraph: {
    title: "Friends · VYRA",
    description: "Weekly discipline leaderboard with your crew.",
  },
}

export default function FriendsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
