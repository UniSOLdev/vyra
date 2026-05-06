"use client"

import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Search } from "lucide-react"
import { PRODUCTS } from "@/data/products"
import {
  CategoryFilter,
  type ShopCategory,
} from "@/components/shop/CategoryFilter"
import { ProductCard } from "@/components/shop/ProductCard"
import { SupplementsEarlyAccess } from "@/components/shop/SupplementsEarlyAccess"
import { VyraUniformSection } from "@/components/shop/VyraUniformSection"
import { PageContainer } from "@/components/PageContainer"
import { Input } from "@/components/ui/input"
import type { Product } from "@/lib/types"

type ShopSort = "name" | "price-asc" | "price-desc"

function sortProducts(list: Product[], sort: ShopSort): Product[] {
  const next = [...list]
  if (sort === "name") {
    next.sort((a, b) => a.name.localeCompare(b.name))
  } else if (sort === "price-asc") {
    next.sort((a, b) => a.price - b.price)
  } else {
    next.sort((a, b) => b.price - a.price)
  }
  return next
}

export function ShopClient() {
  const search = useSearchParams()
  const initial = (search.get("category") as ShopCategory | null) ?? "All"

  const [category, setCategory] = useState<ShopCategory>(
    ["All", "Apparel", "Bottles", "Gear", "Supplements"].includes(initial)
      ? initial
      : "All"
  )
  const [sort, setSort] = useState<ShopSort>("name")
  const [query, setQuery] = useState("")

  useEffect(() => {
    const c = search.get("category") as ShopCategory | null
    if (c && ["All", "Apparel", "Bottles", "Gear", "Supplements"].includes(c)) {
      queueMicrotask(() => setCategory(c))
    }
  }, [search])

  const filtered = useMemo(() => {
    let list = category === "All" ? PRODUCTS : PRODUCTS.filter((p) => p.category === category)
    const q = query.trim().toLowerCase()
    if (q) {
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) || p.copy.toLowerCase().includes(q)
      )
    }
    return sortProducts(list, sort)
  }, [category, sort, query])

  return (
    <>
      <section className="border-b border-white/[0.07] bg-gradient-to-b from-black via-zinc-950 to-zinc-950">
        <PageContainer className="py-16 md:py-20 lg:py-24">
          <p className="text-caption text-vyra-lime/85">VYRA Supply</p>
          <h1 className="mt-5 max-w-3xl text-section-title">
            Essentials for training days.
          </h1>
          <p className="text-body mt-6 max-w-2xl text-sm sm:text-base">
            Curated gear and staples — save what you want until checkout opens.
          </p>
        </PageContainer>
      </section>

      <PageContainer className="space-y-10 py-12 sm:space-y-12 md:py-16">
        <VyraUniformSection />

        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0 flex-1 space-y-2">
            <p className="text-caption text-zinc-500">Search</p>
            <div className="relative">
              <Search
                aria-hidden
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500"
              />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Filter by name or description"
                aria-label="Search products"
                className="h-11 min-h-11 rounded-full border-white/10 bg-white/[0.04] pl-10 pr-4 text-white placeholder:text-zinc-600"
              />
            </div>
          </div>
          <div className="w-full shrink-0 space-y-2 lg:max-w-[220px]">
            <p className="text-caption text-zinc-500">Sort</p>
            <label className="sr-only" htmlFor="shop-sort">
              Sort products
            </label>
            <select
              id="shop-sort"
              value={sort}
              onChange={(e) => setSort(e.target.value as ShopSort)}
              className="h-11 min-h-11 w-full appearance-none rounded-full border border-white/10 bg-white/[0.04] px-4 pr-10 text-sm font-medium text-white outline-none transition-[border-color,box-shadow] duration-200 [transition-timing-function:var(--ease-vy-out)] focus-visible:border-vyra-lime/50 focus-visible:ring-2 focus-visible:ring-vyra-lime/30"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23a1a1aa'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m19 9-7 7-7-7'/%3E%3C/svg%3E")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 0.85rem center",
                backgroundSize: "1rem",
              }}
            >
              <option value="name">Name (A–Z)</option>
              <option value="price-asc">Price (low → high)</option>
              <option value="price-desc">Price (high → low)</option>
            </select>
          </div>
        </div>

        <CategoryFilter value={category} onChange={setCategory} />

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p, i) => (
            <ProductCard
              key={p.slug}
              product={p}
              imagePriority={i < 6}
            />
          ))}
        </div>

        {filtered.length === 0 ? (
          <p className="py-8 text-center text-sm text-zinc-500">
            Nothing matches that search in this category.
          </p>
        ) : null}

        {category === "Supplements" ? <SupplementsEarlyAccess /> : null}

        <div className="border-t border-white/[0.06] pt-10">
          <p className="text-center text-xs font-medium uppercase tracking-[0.2em] text-zinc-600">
            How we plan to serve you
          </p>
          <p className="mx-auto mt-4 max-w-3xl text-center text-sm leading-relaxed text-zinc-500">
            Fast fulfillment where possible · 30-day returns on qualified orders
            · Secure checkout at launch · Premium-quality staples we stand
            behind — final policy details ship with the storefront.
          </p>
        </div>
      </PageContainer>
    </>
  )
}
