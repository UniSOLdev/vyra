"use client"

import { motion } from "framer-motion"
import { Dumbbell, ShieldCheck, Sparkle } from "lucide-react"
import { DURATION, EASE_OUT } from "@/lib/motion"

const items = [
  {
    title: "Built for outcomes",
    copy: "Schedule and recovery first.",
    icon: Dumbbell,
  },
  {
    title: "Coaching that adjusts",
    copy: "Signal over noise.",
    icon: Sparkle,
  },
  {
    title: "Supply, curated",
    copy: "Staples only. No clutter.",
    icon: ShieldCheck,
  },
]

export function TrustRow() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: DURATION.slow, ease: EASE_OUT }}
      className="grid gap-10 pt-14 sm:grid-cols-3 sm:gap-12 sm:pt-16"
    >
      {items.map((it) => (
        <div key={it.title} className="flex flex-col items-start gap-4">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-white/[0.04] text-vyra-lime shadow-vyra-sm ring-1 ring-white/[0.06] transition-[transform,box-shadow] duration-200 [transition-timing-function:var(--ease-vy-out)] hover:scale-[1.02]">
            <it.icon className="size-5" strokeWidth={1.75} />
          </div>
          <div className="min-w-0 space-y-2">
            <p className="text-sm font-semibold tracking-tight text-white">
              {it.title}
            </p>
            <p className="text-sm leading-snug text-zinc-500">{it.copy}</p>
          </div>
        </div>
      ))}
    </motion.div>
  )
}
