import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Shop",
  description: "VYRA Supply — apparel, bottles, and gear built to repeat.",
  openGraph: {
    title: "Shop · VYRA",
    description: "VYRA Supply — apparel, bottles, and gear built to repeat.",
  },
}

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return children
}
