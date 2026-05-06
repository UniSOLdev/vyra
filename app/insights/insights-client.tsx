"use client"

import Link from "next/link"
import { TrendCharts } from "@/components/insights/TrendCharts"
import { CTAButton } from "@/components/CTAButton"

export function InsightsClient({
  isPro,
  disciplineSeries,
  habitSeries,
  checkoutEnabled,
}: {
  isPro: boolean
  disciplineSeries: { label: string; value: number }[]
  habitSeries: { label: string; value: number }[]
  checkoutEnabled: boolean
}) {
  const startCheckout = async () => {
    const res = await fetch("/api/stripe/pro-checkout", { method: "POST" })
    const json = (await res.json()) as { url?: string; disabled?: boolean; error?: string }
    if (json.url) window.location.href = json.url
    else if (json.disabled) alert("Stripe Pro price is not configured in this environment.")
    else if (json.error) alert(json.error)
  }

  if (!isPro) {
    return (
      <div className="mx-auto max-w-2xl space-y-6 px-4 py-16 sm:px-6">
        <p className="text-caption text-vyra-lime">Pro</p>
        <h1 className="text-section-title">Advanced insights</h1>
        <p className="text-body text-zinc-400">
          Four-week discipline and habit trends, unlimited friends, and smarter weekly adjustments. $9/month.
        </p>
        {checkoutEnabled ? (
          <CTAButton type="button" variant="primary" size="lg" className="mt-4" onClick={() => void startCheckout()}>
            Upgrade to Pro
          </CTAButton>
        ) : (
          <p className="mt-4 text-sm text-zinc-500">
            Stripe Pro checkout is disabled until STRIPE_PRO_PRICE_ID and STRIPE_SECRET_KEY are configured.
          </p>
        )}
        <Link href="/dashboard" className="mt-6 inline-block text-sm text-vyra-lime hover:underline">
          Back to dashboard
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl space-y-10 px-4 py-12 sm:px-6 sm:py-16">
      <header className="space-y-2">
        <p className="text-caption text-vyra-lime">Pro</p>
        <h1 className="text-section-title">Advanced insights</h1>
        <p className="text-body max-w-2xl text-sm text-zinc-400">
          Four-week trends from your synced discipline scores and habit consistency.
        </p>
      </header>
      <TrendCharts disciplineSeries={disciplineSeries} habitSeries={habitSeries} />
      <p className="text-xs text-zinc-600">
        Weekly adjustments to your plan apply automatically when equipment or cadence changes (Pro).
      </p>
    </div>
  )
}
