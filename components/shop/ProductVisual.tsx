"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"
import type { Product } from "@/lib/types"

export function ProductVisual({
  product,
  className,
  priority,
  fillContainer,
}: {
  product: Product
  className?: string
  priority?: boolean
  /** When true, fills a parent with fixed aspect (e.g. product card) */
  fillContainer?: boolean
}) {
  return (
    <div
      className={cn(
        "relative isolate min-h-0 overflow-hidden bg-[#0f0f0f]",
        fillContainer
          ? "absolute inset-0 h-full w-full"
          : "aspect-square w-full",
        className
      )}
    >
      <Image
        src={product.image}
        alt={product.name}
        fill
        priority={priority}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="object-contain object-center"
        draggable={false}
      />
    </div>
  )
}
