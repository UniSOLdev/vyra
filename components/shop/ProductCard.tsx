"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Bookmark } from "lucide-react"
import type { Product } from "@/lib/types"
import { ProductVisual } from "@/components/shop/ProductVisual"
import { Button } from "@/components/ui/button"
import { CTAButton } from "@/components/CTAButton"
import { cn } from "@/lib/utils"
import { isProductSaved, removeSavedProduct, saveProduct } from "@/lib/storage"
import { DURATION, EASE_OUT } from "@/lib/motion"

export function ProductCard({
  product,
  imagePriority,
  checkoutAvailable,
}: {
  product: Product
  imagePriority?: boolean
  checkoutAvailable: boolean
}) {
  const router = useRouter()
  const [saved, setSaved] = useState(false)
  const [buying, setBuying] = useState(false)

  useEffect(() => {
    const sync = () => setSaved(isProductSaved(product.slug))
    sync()
    window.addEventListener("vyra-storage", sync)
    return () => window.removeEventListener("vyra-storage", sync)
  }, [product.slug])

  const toggle = () => {
    if (saved) removeSavedProduct(product.slug)
    else saveProduct(product.slug)
    setSaved(!saved)
    window.dispatchEvent(new Event("vyra-storage"))
  }

  const isSupplement = product.category === "Supplements"
  const canCheckout = !isSupplement && checkoutAvailable

  const buyNow = async () => {
    if (!canCheckout) return
    if (buying) return
    setBuying(true)
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ slug: product.slug, quantity: 1 }),
      })
      const data = (await res.json().catch(() => null)) as { url?: string } | null
      if (data?.url) {
        window.location.href = data.url
        return
      }
      router.refresh()
    } finally {
      setBuying(false)
    }
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-48px" }}
      transition={{ duration: DURATION.slow, ease: EASE_OUT }}
      className={cn(
        "group flex min-h-0 flex-col overflow-hidden rounded-3xl bg-zinc-950/70",
        "shadow-[0_20px_50px_-28px_rgba(0,0,0,0.85)] ring-1 ring-white/[0.09]",
        "transition-[box-shadow,ring-color] duration-300 [transition-timing-function:var(--ease-vy-out)]",
        "hover:shadow-[0_28px_60px_-24px_rgba(0,0,0,0.9)] hover:ring-white/[0.12]"
      )}
    >
      <Link
        href={`/shop/${product.slug}`}
        className="relative block aspect-square w-full min-h-0 shrink-0 overflow-hidden bg-[#0f0f0f] outline-none ring-offset-2 ring-offset-zinc-950 focus-visible:ring-2 focus-visible:ring-white/40"
        aria-label={`View ${product.name}`}
      >
        <div
          className={cn(
            "absolute inset-0 origin-center",
            "transition-transform duration-300 [transition-timing-function:var(--ease-vy-out)]",
            "group-hover:scale-[1.03]"
          )}
        >
          <ProductVisual
            product={product}
            fillContainer
            priority={imagePriority}
          />
        </div>
      </Link>

      <div className="flex min-h-0 flex-1 flex-col gap-0 px-6 pb-6 pt-5 sm:px-7 sm:pb-7 sm:pt-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-white/[0.08] bg-white/[0.04] px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.14em] text-zinc-500">
            {product.category}
          </span>
          <span className="rounded-full border border-white/[0.06] px-2.5 py-0.5 text-[10px] font-medium text-zinc-600">
            {product.badge}
          </span>
        </div>

        <Link
          href={`/shop/${product.slug}`}
          className="mt-3 block font-heading text-lg font-semibold tracking-tight text-white transition-colors hover:text-zinc-200"
        >
          {product.name}
        </Link>

        <div className="my-4 h-px bg-white/[0.06]" aria-hidden />

        <p className="line-clamp-2 text-xs leading-relaxed text-zinc-500">
          {product.copy}
        </p>

        <div className="mt-auto flex flex-col gap-4 pt-6">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-600">
                Price
              </p>
              <p className="mt-1 font-heading text-2xl font-semibold tabular-nums tracking-tight text-white">
                ${product.price}
              </p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className={cn(
                "size-11 min-h-11 min-w-11 shrink-0 rounded-full border border-white/10 text-zinc-400",
                saved && "border-vyra-lime/25 text-vyra-lime"
              )}
              onClick={toggle}
              aria-pressed={saved}
              aria-label={saved ? "Remove from saved" : "Save for later"}
            >
              <Bookmark className={cn("size-4", saved && "fill-current")} />
            </Button>
          </div>

          {isSupplement ? (
            <CTAButton
              type="button"
              variant="primary"
              size="lg"
              disabled
              className="w-full min-h-12 rounded-full font-semibold opacity-80 shadow-vyra-md"
              title="Supplements coming soon"
            >
              Coming soon
            </CTAButton>
          ) : canCheckout ? (
            <CTAButton
              type="button"
              variant="primary"
              size="lg"
              disabled={buying}
              onClick={buyNow}
              className="w-full min-h-12 rounded-full font-semibold shadow-vyra-md"
              title="Secure checkout"
            >
              {buying ? "Redirecting…" : "Add to bag"}
            </CTAButton>
          ) : (
            <CTAButton
              type="button"
              variant="primary"
              size="lg"
              disabled
              className="w-full min-h-12 rounded-full font-semibold opacity-80 shadow-vyra-md"
              title="Checkout opening soon"
            >
              Coming soon
            </CTAButton>
          )}

          <Link
            href={`/shop/${product.slug}`}
            className="mx-auto inline-flex min-h-10 items-center justify-center text-xs font-medium text-zinc-500 underline-offset-4 transition-colors duration-200 hover:text-zinc-300"
          >
            View details
          </Link>
        </div>
      </div>
    </motion.article>
  )
}
