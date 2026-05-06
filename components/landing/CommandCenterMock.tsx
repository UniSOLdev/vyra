"use client"

import { motion } from "framer-motion"
import { DURATION, EASE_OUT } from "@/lib/motion"

export function CommandCenterMock() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: DURATION.slow, ease: EASE_OUT }}
      className="glass-panel relative overflow-hidden rounded-3xl p-7 shadow-vyra-lg ring-1 ring-white/[0.07] sm:p-9"
    >
      <div className="pointer-events-none absolute -right-20 -top-24 size-72 rounded-full bg-[radial-gradient(circle,oklch(0.9_0.24_128/0.22),transparent_65%)] blur-2xl" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.04] via-transparent to-transparent" />
      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="text-caption text-zinc-500">Today</p>
          <p className="mt-2 font-heading text-2xl font-bold text-white sm:text-3xl">
            Upper
          </p>
          <p className="mt-1 text-sm text-zinc-500">4 movements · 52 min est.</p>
        </div>
        <div className="relative grid size-[4.75rem] shrink-0 place-content-center">
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background:
                "conic-gradient(var(--color-vyra-lime) 72%, rgba(255,255,255,0.07) 0)",
            }}
          />
          <div className="relative z-10 grid size-[3.75rem] place-content-center rounded-full bg-zinc-950 text-center ring-1 ring-white/12">
            <span className="text-[10px] font-medium uppercase tracking-wide text-zinc-500">
              Day
            </span>
            <span className="font-heading text-lg font-bold leading-none text-white">
              72%
            </span>
          </div>
        </div>
      </div>
      <div className="relative mt-9 grid grid-cols-3 gap-3">
        {[
          { k: "Protein", v: "132g", p: 68 },
          { k: "Water", v: "2.4L", p: 54 },
          { k: "Steps", v: "8.1k", p: 74 },
        ].map((row) => (
          <div
            key={row.k}
            className="rounded-2xl border border-white/10 bg-black/50 px-3 py-3.5 shadow-inner"
          >
            <p className="text-[10px] font-semibold uppercase tracking-wide text-zinc-400">
              {row.k}
            </p>
            <p className="mt-1.5 font-heading text-base font-bold tracking-tight text-white sm:text-lg">
              {row.v}
            </p>
            <div className="mt-3 h-1 overflow-hidden rounded-full bg-zinc-800/90">
              <div
                className="h-full rounded-full bg-gradient-to-r from-vyra-lime to-vyra-lime-dim transition-[width] duration-500 [transition-timing-function:var(--ease-vy-out)]"
                style={{ width: `${row.p}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="relative mt-7 flex flex-wrap gap-2 border-t border-white/10 pt-6">
        {["Habits on track", "Coach note", "Supply pick"].map((t) => (
          <span
            key={t}
            className="rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-xs text-zinc-400"
          >
            {t}
          </span>
        ))}
      </div>
    </motion.div>
  )
}
