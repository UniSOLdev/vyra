import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { AppShell } from "@/components/AppShell"
import { getProductBySlug } from "@/data/products"
import { isPodShopCheckoutConfigured } from "@/lib/stripe-products"
import { ProductDetail } from "./product-detail"

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = getProductBySlug(slug)
  if (!product) return { title: "Product" }
  return {
    title: product.name,
    description: product.copy,
    openGraph: {
      title: `${product.name} · VYRA Supply`,
      description: product.copy,
    },
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const product = getProductBySlug(slug)
  if (!product) notFound()

  const checkoutAvailable = isPodShopCheckoutConfigured()

  return (
    <AppShell>
      <ProductDetail product={product} checkoutAvailable={checkoutAvailable} />
    </AppShell>
  )
}
