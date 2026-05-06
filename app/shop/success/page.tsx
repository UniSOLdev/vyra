import Link from "next/link"
import { AppShell } from "@/components/AppShell"
import { PageContainer } from "@/components/PageContainer"
import { CTAButton } from "@/components/CTAButton"

export default function ShopSuccessPage() {
  return (
    <AppShell>
      <section className="border-b border-white/[0.07] bg-gradient-to-b from-black via-zinc-950 to-zinc-950">
        <PageContainer className="py-16 md:py-20 lg:py-24">
          <p className="text-caption text-vyra-lime/85">Payment confirmed</p>
          <h1 className="mt-5 max-w-3xl text-section-title">You’re locked in.</h1>
          <p className="text-body mt-6 max-w-2xl text-sm sm:text-base">
            We’ll email a receipt and share fulfillment updates as they ship.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <CTAButton href="/shop" variant="primary" size="lg">
              Back to shop
            </CTAButton>
            <Link
              href="/dashboard"
              className="inline-flex min-h-12 items-center justify-center rounded-full px-6 text-sm font-semibold text-zinc-400 transition-colors hover:text-white"
            >
              Dashboard
            </Link>
          </div>
        </PageContainer>
      </section>
    </AppShell>
  )
}

