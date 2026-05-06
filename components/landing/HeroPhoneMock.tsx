"use client"

import { motion } from "framer-motion"
import { DURATION } from "@/lib/motion"

const easeOut = [0.22, 1, 0.36, 1] as const

const stats = [
  { label: "Protein", value: "128g", pct: 72 },
  { label: "Water", value: "2.1L", pct: 58 },
  { label: "Steps", value: "6.4k", pct: 64 },
]

export function HeroPhoneMock() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: DURATION.slow + 0.05, ease: easeOut }}
      className="relative mx-auto w-full max-w-sm"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-6 rounded-[2.5rem] bg-[radial-gradient(circle_at_30%_20%,rgba(190,242,100,0.18),transparent_55%),radial-gradient(circle_at_80%_60%,rgba(255,255,255,0.08),transparent_50%)] blur-2xl"
      />
      <div className="relative rounded-[2.4rem] border border-white/15 bg-gradient-to-b from-zinc-900 to-black p-3 shadow-vyra-lg">
        <div className="rounded-[2rem] border border-white/10 bg-zinc-950/90 p-5 shadow-inner">
          <div className="flex items-center justify-between text-xs text-zinc-500">
            <span>9:41</span>
            <span className="tracking-[0.3em] text-[10px] text-zinc-600">VYRA</span>
            <span className="flex gap-1">
              <span className="size-1.5 rounded-full bg-zinc-600" />
              <span className="size-1.5 rounded-full bg-zinc-600" />
            </span>
          </div>
          <p className="mt-6 text-sm text-zinc-500">Good morning.</p>
          <p className="mt-1 font-heading text-2xl font-bold tracking-tight text-white">
            Today, clean reps.
          </p>
          <div className="mt-6 flex items-center gap-4">
            <div className="relative grid size-24 place-content-center rounded-full border border-white/10 bg-black/40">
              <div
                className="absolute inset-1 rounded-full"
                style={{
                  background:
                    "conic-gradient(var(--color-vyra-lime) 68%, rgba(255,255,255,0.08) 0)",
                }}
              />
              <div className="relative z-10 grid size-[4.5rem] place-content-center rounded-full bg-zinc-950 text-center">
                <p className="text-[10px] uppercase tracking-wide text-zinc-500">
                  Today
                </p>
                <p className="text-sm font-semibold text-white">68%</p>
              </div>
            </div>
            <div>
              <p className="text-xs text-zinc-500">This week</p>
              <p className="font-heading text-lg font-semibold text-white">
                Upper body
              </p>
              <p className="text-xs text-zinc-500">Train clean. Stay sharp.</p>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-3 gap-2">
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-xl border border-white/10 bg-white/[0.03] p-2"
              >
                <p className="text-[10px] text-zinc-500">{s.label}</p>
                <p className="text-sm font-semibold text-white">{s.value}</p>
                <div className="mt-2 h-1 overflow-hidden rounded-full bg-zinc-800">
                  <div
                    className="h-full rounded-full bg-vyra-lime"
                    style={{ width: `${s.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <p className="text-xs text-zinc-500">Habits</p>
            <div className="mt-2 flex gap-2">
              {Array.from({ length: 7 }).map((_, i) => (
                <span
                  key={i}
                  className="size-3 rounded-full border border-white/15 bg-gradient-to-b from-zinc-800 to-zinc-950"
                  style={{
                    boxShadow:
                      i < 4 ? "0 0 12px rgba(190,242,100,0.35)" : undefined,
                    borderColor: i < 4 ? "rgba(190,242,100,0.5)" : undefined,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
