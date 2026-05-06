"use client"

import { useEffect, useState } from "react"
import { DEFAULT_HABITS, HABIT_IDS } from "@/lib/habits"
import {
  calculateStreak,
  todayKey,
  weeklyHabitCompletionPct,
} from "@/lib/fitness"
import {
  getDailyLogs,
  saveDailyLog,
  saveDailyLogs,
} from "@/lib/storage"
import type { DailyLogs } from "@/lib/types"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"

export function HabitChecklist() {
  const key = todayKey()
  const [logs, setLogs] = useState<DailyLogs>(() => getDailyLogs())

  const sync = () => setLogs(getDailyLogs())

  useEffect(() => {
    const fn = () => sync()
    window.addEventListener("vyra-storage", fn)
    return () => window.removeEventListener("vyra-storage", fn)
  }, [])

  const day = logs[key] ?? {}
  const streak = calculateStreak(logs)
  const weekPct = weeklyHabitCompletionPct(logs, [...HABIT_IDS])

  const toggle = (habitId: string, checked: boolean) => {
    saveDailyLog(key, { [habitId]: checked })
    window.dispatchEvent(new Event("vyra-storage"))
    sync()
  }

  const resetDay = () => {
    const next = { ...logs }
    delete next[key]
    saveDailyLogs(next)
    window.dispatchEvent(new Event("vyra-storage"))
    sync()
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-4">
          <p className="text-xs uppercase tracking-wide text-zinc-500">
            Current streak
          </p>
          <p className="mt-2 font-heading text-3xl text-white">{streak} days</p>
          <p className="mt-1 text-sm text-zinc-500">
            Based on training check-ins.
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-4">
          <p className="text-xs uppercase tracking-wide text-zinc-500">
            This week
          </p>
          <p className="mt-2 font-heading text-3xl text-vyra-lime">{weekPct}%</p>
          <p className="mt-1 text-sm text-zinc-500">Habit completion mix.</p>
        </div>
      </div>
      <ul className="space-y-3 rounded-2xl border border-white/10 bg-black/30 p-4">
        {DEFAULT_HABITS.map((h) => (
          <li key={h.id} className="flex items-center gap-3">
            <Checkbox
              checked={!!day[h.id]}
              onCheckedChange={(c) => toggle(h.id, !!c)}
            />
            <span className="text-sm text-zinc-200">{h.label}</span>
          </li>
        ))}
      </ul>
      <Button
        type="button"
        variant="outline"
        className="rounded-full border-white/15"
        onClick={resetDay}
      >
        Reset today
      </Button>
    </div>
  )
}
