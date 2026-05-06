"use client"

import { motion } from "framer-motion"
import { Check } from "lucide-react"
import { DURATION, EASE_OUT } from "@/lib/motion"
import { CTAButton } from "@/components/CTAButton"

const perks = [
  "Custom AI plan",
  "Weekly check-ins",
  "Smart grocery list",
  "Advanced progress insights",
  "Exclusive product drops",
  "Member pricing",
]

export function ProComingSoon() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: DURATION.slow, ease: EASE_OUT }}
      className="vy-border-glow relative mx-auto max-w-5xl rounded-[2rem] bg-gradient-to-br from-zinc-900/95 via-zinc-950 to-black p-8 shadow-vyra-lg sm:p-12 md:p-14"
    >
      <div className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-vyra-lime/12 blur-3xl" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-vyra-lime/25 to-transparent" />
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center rounded-full border border-vyra-lime/35 bg-vyra-lime/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-vyra-lime">
          Founding access
        </span>
        <span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-400">
          Coming soon
        </span>
      </div>
      <div className="relative mt-8 grid gap-14 lg:grid-cols-[1fr_1.05fr] lg:items-center">
        <div>
          <p className="text-caption text-zinc-500">VYRA Pro</p>
          <h3 className="mt-4 text-section-title">Guided depth. Same discipline.</h3>
          <p className="text-body mt-5 max-w-md text-sm sm:text-base">
            More structure when you want it — still grounded in how you train.
          </p>
          <div className="mt-10 flex flex-wrap items-end gap-8">
            <div className="glass-panel max-w-[14rem] rounded-3xl border border-white/12 px-6 py-6 shadow-vyra-md ring-1 ring-white/[0.06]">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
                Preview price
              </p>
              <div className="mt-3 flex items-baseline gap-1.5">
                <span className="font-heading text-6xl font-black tracking-tighter text-white sm:text-7xl">
                  $9
                </span>
                <span className="text-sm font-medium text-zinc-500">/ mo</span>
              </div>
            </div>
            <CTAButton href="/onboarding" variant="primary" size="lg">
              Join waitlist
            </CTAButton>
          </div>
        </div>
        <ul className="space-y-2.5">
          {perks.map((p, i) => (
            <motion.li
              key={p}
              initial={{ opacity: 0, x: 10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04, duration: DURATION.base, ease: EASE_OUT }}
              className="flex min-h-12 items-center gap-3 rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-sm text-zinc-200 shadow-vyra-sm backdrop-blur-sm transition-[transform,box-shadow] duration-200 [transition-timing-function:var(--ease-vy-out)] hover:scale-[1.01]"
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-vyra-lime/12 text-vyra-lime ring-1 ring-vyra-lime/20">
                <Check className="size-4" strokeWidth={2.5} />
              </span>
              {p}
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.section>
  )
}
