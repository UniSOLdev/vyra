import { PRODUCTS } from "@/data/products"
import type { Product } from "@/lib/types"

const STRIPE_PRICE_MAP: Record<string, string | undefined> = {
  "collagen-wellness-addon": process.env.STRIPE_PRICE_ID_COLLAGEN,
  "creatine-training-support": process.env.STRIPE_PRICE_ID_CREATINE,
  "daily-protein-support": process.env.STRIPE_PRICE_ID_PROTEIN,
  "smoothie-greens-blend": process.env.STRIPE_PRICE_ID_GREENS,
  "pre-workout-energy-support": process.env.STRIPE_PRICE_ID_PREWORKOUT,
  "vyra-shaker-bottle": process.env.STRIPE_PRICE_ID_SHAKER,
  "vyra-steel-water-bottle": process.env.STRIPE_PRICE_ID_STEEL_BOTTLE,
  "resistance-band-set": process.env.STRIPE_PRICE_ID_BANDS,
  "meal-prep-starter-kit": process.env.STRIPE_PRICE_ID_MEAL_PREP,
  "vyra-oversized-tee": process.env.STRIPE_PRICE_ID_OVERSIZED_TEE,
  "vyra-performance-tee": process.env.STRIPE_PRICE_ID_PERFORMANCE_TEE,
}

export function getStripePriceIdOrNull(slug: Product["slug"]): string | null {
  return STRIPE_PRICE_MAP[slug] ?? null
}

/**
 * True when Stripe secret is set and every shippable SKU has a price id env.
 */
export function isPodShopCheckoutConfigured(): boolean {
  if (!process.env.STRIPE_SECRET_KEY) return false
  for (const p of PRODUCTS) {
    if (p.category === "Supplements") continue
    if (!getStripePriceIdOrNull(p.slug)) return false
  }
  return true
}

/** Returns null when Pro subscription price is not configured (checkout disabled). */
export function getProSubscriptionPriceId(): string | null {
  return process.env.STRIPE_PRO_PRICE_ID ?? null
}

export function getStripePriceId(slug: Product["slug"]): string {
  const priceId = getStripePriceIdOrNull(slug)
  if (!priceId) {
    throw new Error("Missing Stripe price configuration for this product.")
  }
  return priceId
}

