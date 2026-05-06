import type { Product } from "@/lib/types"

/**
 * Map product slugs to Stripe Price IDs.
 * These are stored in env so you can swap SKUs without code changes.
 */
/** Returns null when Pro subscription price is not configured (checkout disabled). */
export function getProSubscriptionPriceId(): string | null {
  return process.env.STRIPE_PRO_PRICE_ID ?? null
}

export function getStripePriceId(slug: Product["slug"]): string {
  const map: Record<string, string | undefined> = {
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

  const priceId = map[slug]
  if (!priceId) {
    throw new Error(
      `Missing Stripe price id env var for slug: ${slug}. Set STRIPE_PRICE_ID_* in Vercel.`
    )
  }
  return priceId
}

