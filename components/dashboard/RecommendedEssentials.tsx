import Link from "next/link"
import type { Product } from "@/lib/types"
import { ProductVisual } from "@/components/shop/ProductVisual"

export function RecommendedEssentials({ products }: { products: Product[] }) {
  if (!products.length) return null
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {products.map((p) => (
        <Link
          key={p.slug}
          href={`/shop/${p.slug}`}
          className="flex gap-3 rounded-xl border border-white/10 bg-black/30 p-3 transition-colors hover:border-vyra-lime/40"
        >
          <div className="w-20 shrink-0">
            <ProductVisual product={p} className="aspect-square rounded-lg" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-wide text-zinc-500">
              {p.category}
            </p>
            <p className="truncate font-medium text-white">{p.name}</p>
            <p className="text-sm text-vyra-lime">${p.price}</p>
          </div>
        </Link>
      ))}
    </div>
  )
}
