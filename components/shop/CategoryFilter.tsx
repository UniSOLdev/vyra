"use client"

import { cn } from "@/lib/utils"
import type { ProductCategory } from "@/lib/types"

export type ShopCategory = "All" | ProductCategory

const options: ShopCategory[] = [
  "All",
  "Apparel",
  "Bottles",
  "Gear",
  "Supplements",
]

export function CategoryFilter({
  value,
  onChange,
}: {
  value: ShopCategory
  onChange: (v: ShopCategory) => void
}) {
  return (
    <div>
      <p className="text-caption mb-3 text-zinc-500">Category</p>
      <div
        className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] sm:flex-wrap sm:overflow-visible [&::-webkit-scrollbar]:hidden"
        role="tablist"
        aria-label="Product categories"
      >
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            role="tab"
            aria-selected={value === opt}
            onClick={() => onChange(opt)}
            className={cn(
              "min-h-11 shrink-0 rounded-full border px-4 py-2.5 text-xs font-semibold uppercase tracking-wide transition-[border-color,background-color,color,box-shadow,transform] duration-200 [transition-timing-function:var(--ease-vy-out)] hover:scale-[1.02]",
              value === opt
                ? "border-vyra-lime/60 bg-vyra-lime/10 text-vyra-lime shadow-vyra-glow"
                : "border-white/10 bg-white/[0.03] text-zinc-400 hover:border-white/20 hover:text-white"
            )}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  )
}
