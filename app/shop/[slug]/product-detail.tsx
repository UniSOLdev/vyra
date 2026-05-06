"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import type { Product } from "@/lib/types"
import {
  isProductSaved,
  removeSavedProduct,
  saveProduct,
} from "@/lib/storage"
import { ProductVisual } from "@/components/shop/ProductVisual"
import { Button } from "@/components/ui/button"
import { CTAButton } from "@/components/CTAButton"
import { PageContainer } from "@/components/PageContainer"
import { DURATION, EASE_OUT } from "@/lib/motion"

const disclaimer =
  "VYRA provides general fitness and wellness information. It is not medical advice. Always consult a qualified professional before starting a new diet, supplement, or exercise program."

export function ProductDetail({ product }: { product: Product }) {
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const sync = () => setSaved(isProductSaved(product.slug))
    sync()
    window.addEventListener("vyra-storage", sync)
    return () => window.removeEventListener("vyra-storage", sync)
  }, [product.slug])

  const toggleSave = () => {
    if (saved) removeSavedProduct(product.slug)
    else saveProduct(product.slug)
    setSaved(!saved)
    window.dispatchEvent(new Event("vyra-storage"))
  }

  const isSupplement = product.category === "Supplements"

  return (
    <PageContainer className="py-8 sm:py-10 md:py-12">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: DURATION.slow, ease: EASE_OUT }}
        className="grid gap-10 lg:grid-cols-2 lg:items-start lg:gap-14"
      >
        <div className="lg:sticky lg:top-24">
          <div className="overflow-hidden rounded-3xl bg-[#0f0f0f] ring-1 ring-white/[0.09] shadow-[0_24px_60px_-28px_rgba(0,0,0,0.88)]">
            <ProductVisual
              product={product}
              priority
              className="aspect-square w-full rounded-3xl"
            />
          </div>
        </div>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-white/[0.08] bg-white/[0.04] px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.14em] text-zinc-500">
              {product.category}
            </span>
            <span className="rounded-full border border-white/[0.06] px-2.5 py-0.5 text-[10px] font-medium text-zinc-600">
              {product.badge}
            </span>
          </div>
          <h1 className="mt-4 text-section-title">{product.name}</h1>

          <div className="my-6 h-px bg-white/[0.06]" aria-hidden />

          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-600">
              Price
            </p>
            <p className="mt-1 font-heading text-3xl font-semibold tabular-nums tracking-tight text-white">
              ${product.price}
            </p>
          </div>

          <p className="text-body mt-5 max-w-xl text-xs leading-relaxed text-zinc-500 sm:text-sm">
            {product.copy}
          </p>

          <div className="glass-panel mt-8 space-y-4 rounded-2xl border border-white/10 p-5 sm:p-6">
            <h2 className="font-heading text-lg text-white">In the routine</h2>
            <p className="text-sm leading-relaxed text-zinc-400">
              Defaults that stay out of the way. Repeatable. No drama.
            </p>
            <h3 className="pt-1 font-medium text-white">Use</h3>
            <p className="text-sm leading-relaxed text-zinc-400">
              Follow the label from the maker. One anchor at a time beats a
              chaotic stack.
            </p>
            {isSupplement ? (
              <p className="text-xs leading-relaxed text-zinc-500">{disclaimer}</p>
            ) : null}
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button
              type="button"
              variant="outline"
              className="min-h-11 rounded-full border-white/15 px-6"
              onClick={toggleSave}
            >
              {saved ? "Saved" : "Save for later"}
            </Button>
            <CTAButton
              type="button"
              variant="primary"
              size="lg"
              disabled
              className="min-h-12 flex-1 rounded-full px-8 font-semibold sm:min-w-[200px]"
              title="Checkout opens at launch."
            >
              Add to bag
            </CTAButton>
          </div>
          <Link
            href="/shop"
            className="mt-8 inline-flex min-h-11 items-center text-sm font-medium text-zinc-400 transition-colors hover:text-white"
          >
            ← Shop
          </Link>
        </div>
      </motion.div>
    </PageContainer>
  )
}
