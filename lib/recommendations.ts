import { PRODUCTS } from "@/data/products"
import type { Product, UserProfile } from "@/lib/types"

const interestMap: Record<string, Product["category"][]> = {
  Apparel: ["Apparel"],
  Bottles: ["Bottles"],
  Gear: ["Gear"],
  Protein: ["Supplements"],
  Creatine: ["Supplements"],
  "Pre-workout": ["Supplements"],
  Smoothies: ["Supplements"],
  Wellness: ["Supplements"],
}

export function recommendProducts(profile: UserProfile | null, limit = 4): Product[] {
  if (!profile) {
    return PRODUCTS.slice(0, limit)
  }

  const categories = new Set<Product["category"]>()
  for (const interest of profile.shoppingInterests) {
    const mapped = interestMap[interest]
    if (mapped) mapped.forEach((c) => categories.add(c))
  }

  const scored = PRODUCTS.map((p) => {
    let score = 0
    if (categories.has(p.category)) score += 3
    if (profile.goal === "build_muscle" && p.badge === "Protein") score += 2
    if (profile.goal === "improve_cardio" && p.category === "Bottles") score += 1
    if (profile.mainStruggle === "meal_planning" && p.badge === "Routine") score += 2
    return { p, score }
  })

  scored.sort((a, b) => b.score - a.score || a.p.name.localeCompare(b.p.name))
  const out: Product[] = []
  const seen = new Set<string>()
  for (const { p } of scored) {
    if (out.length >= limit) break
    if (seen.has(p.slug)) continue
    seen.add(p.slug)
    out.push(p)
  }
  return out
}
