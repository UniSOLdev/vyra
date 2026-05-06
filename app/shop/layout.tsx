import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Shop",
  description: "VYRA Supply — training, recovery, and hydration essentials.",
}

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return children
}
