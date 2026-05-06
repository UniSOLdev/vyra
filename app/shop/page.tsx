import { Suspense } from "react"
import { AppShell } from "@/components/AppShell"
import { isPodShopCheckoutConfigured } from "@/lib/stripe-products"
import { ShopClient } from "./shop-client"

function ShopFallback() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 text-center text-zinc-500 sm:px-6">
      Loading storefront…
    </div>
  )
}

export default function ShopPage() {
  const checkoutAvailable = isPodShopCheckoutConfigured()
  return (
    <AppShell>
      <Suspense fallback={<ShopFallback />}>
        <ShopClient checkoutAvailable={checkoutAvailable} />
      </Suspense>
    </AppShell>
  )
}
