"use client"

import { useState } from "react"
import Link from "next/link"
import { TrendCharts } from "@/components/insights/TrendCharts"
import { CTAButton } from "@/components/CTAButton"
import { ProWaitlistForm } from "@/components/ProWaitlistForm"

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
  const [checkoutError, setCheckoutError] = useState(false)

  const startCheckout = async () => {
    setCheckoutError(false)
    const res = await fetch("/api/stripe/pro-checkout", { method: "POST" })
    const json = (await res.json()) as { url?: string; disabled?: boolean }
    if (json.url) {
      window.location.href = json.url
      return
    }
    setCheckoutError(true)
  }

  if (!isPro) {
    return (
      <div className="mx-auto max-w-2xl space-y-6 px-4 py-16 sm:px-6">
        <p className="text-caption text-zinc-500">Pro</p>
        <h1 className="text-section-title">Advanced insights</h1>
        <p className="text-body text-zinc-400">
          Four-week discipline and habit trends, expanded connections, and smarter weekly
          adjustments. $9/month.
        </p>
        {checkoutEnabled ? (
          <>
            <CTAButton
              type="button"
              variant="primary"
              size="lg"
              className="mt-4 w-full justify-center sm:w-auto"
              onClick={() => void startCheckout()}
            >
              Upgrade to Pro
            </CTAButton>
            {checkoutError ? (
              <p className="text-sm text-zinc-500">Unable to start checkout. Try again in a moment.</p>
            ) : null}
          </>
        ) : (
          <div className="mt-6 space-y-2 rounded-2xl border border-white/10 bg-zinc-900/40 p-6">
            <p className="text-sm font-medium text-white">Pro launching soon.</p>
            <p className="text-sm text-zinc-500">Join waitlist.</p>
            <ProWaitlistForm />
          </div>
        )}
        <Link
          href="/dashboard"
          className="mt-6 inline-block text-sm text-zinc-400 underline-offset-4 transition-colors hover:text-white"
        >
          Back to dashboard
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl space-y-10 px-4 py-12 sm:px-6 sm:py-16">
      <header className="space-y-2">
        <p className="text-caption text-zinc-500">Pro</p>
        <h1 className="text-section-title">Advanced insights</h1>
        <p className="text-body max-w-2xl text-sm text-zinc-400">
          Four-week trends from synced discipline scores and habit consistency.
        </p>
      </header>
      <TrendCharts disciplineSeries={disciplineSeries} habitSeries={habitSeries} />
      <p className="text-xs text-zinc-600">
        Weekly plan adjustments apply when equipment or cadence changes (Pro).
      </p>
    </div>
  )
}
