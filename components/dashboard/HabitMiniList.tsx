"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { DEFAULT_HABITS } from "@/lib/habits"
import { todayKey } from "@/lib/fitness"
import { saveDailyLog } from "@/lib/storage"
import type { DailyLogs } from "@/lib/types"
import { Checkbox } from "@/components/ui/checkbox"
import { EASE_OUT } from "@/lib/motion"

export function HabitMiniList({ logs }: { logs: DailyLogs }) {
  const key = todayKey()
  const day = logs[key] ?? {}
  const [pulseId, setPulseId] = useState<string | null>(null)

  const toggle = (habitId: string, checked: boolean) => {
    saveDailyLog(key, { [habitId]: checked })
    window.dispatchEvent(new Event("vyra-storage"))
    if (checked) {
      setPulseId(habitId)
      window.setTimeout(() => {
        setPulseId((cur) => (cur === habitId ? null : cur))
      }, 400)
    }
  }

  return (
    <ul className="space-y-1">
      {DEFAULT_HABITS.slice(0, 5).map((h) => {
        const done = !!day[h.id]
        return (
          <motion.li
            key={h.id}
            layout
            animate={
              pulseId === h.id ? { scale: [1, 1.08, 1] } : { scale: 1 }
            }
            transition={{ duration: 0.38, ease: EASE_OUT }}
          >
            <label className="flex min-h-11 cursor-pointer items-center gap-3 rounded-xl px-1 py-1 transition-colors duration-200 [transition-timing-function:var(--ease-vy-out)] hover:bg-white/[0.04]">
              <Checkbox
                checked={done}
                onCheckedChange={(c) => toggle(h.id, !!c)}
                className="size-5 shrink-0 rounded-md border-white/20 data-checked:border-primary"
              />
              <span
                className={`text-sm ${done ? "text-white" : "text-zinc-400"}`}
              >
                {h.label}
              </span>
            </label>
          </motion.li>
        )
      })}
    </ul>
  )
}
