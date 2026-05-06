"use client"

import { useEffect, useMemo, useState } from "react"
import { DEFAULT_HABITS, HABIT_IDS } from "@/lib/habits"
import {
  calculateStreak,
  weeklyHabitCompletionPct,
} from "@/lib/fitness"
import { syncHabitDayAction } from "@/app/actions/vyra"
import type { DailyLogs } from "@/lib/types"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"

export function HabitChecklist({
  initialLogs,
  todayKey,
}: {
  initialLogs: DailyLogs
  todayKey: string
}) {
  const [logs, setLogs] = useState<DailyLogs>(initialLogs)

  useEffect(() => {
    const h = window.setTimeout(() => setLogs(initialLogs), 0)
    return () => window.clearTimeout(h)
  }, [initialLogs])

  const day = logs[todayKey] ?? {}
  const streak = useMemo(() => calculateStreak(logs), [logs])
  const weekPct = useMemo(() => weeklyHabitCompletionPct(logs, [...HABIT_IDS]), [logs])

  const toggle = async (habitId: string, checked: boolean) => {
    setLogs((prev) => ({
      ...prev,
      [todayKey]: { ...(prev[todayKey] ?? {}), [habitId]: checked },
    }))
    const res = await syncHabitDayAction({ logDate: todayKey, habitId, done: checked })
    if (res?.error) {
      setLogs((prev) => ({
        ...prev,
        [todayKey]: { ...(prev[todayKey] ?? {}), [habitId]: !checked },
      }))
    }
  }

  const resetDay = async () => {
    const prevDay = { ...(logs[todayKey] ?? {}) }
    setLogs((prev) => {
      const next = { ...prev }
      delete next[todayKey]
      return next
    })
    for (const id of Object.keys(prevDay)) {
      if (prevDay[id]) await syncHabitDayAction({ logDate: todayKey, habitId: id, done: false })
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-4">
          <p className="text-xs uppercase tracking-wide text-zinc-500">Current streak</p>
          <p className="mt-2 font-heading text-3xl text-white">{streak} days</p>
          <p className="mt-1 text-sm text-zinc-500">Based on training check-ins.</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-4">
          <p className="text-xs uppercase tracking-wide text-zinc-500">This week</p>
          <p className="mt-2 font-heading text-3xl text-vyra-lime">{weekPct}%</p>
          <p className="mt-1 text-sm text-zinc-500">Habit completion mix.</p>
        </div>
      </div>
      <ul className="space-y-3 rounded-2xl border border-white/10 bg-black/30 p-4">
        {DEFAULT_HABITS.map((h) => (
          <li key={h.id} className="flex items-center gap-3">
            <Checkbox
              checked={!!day[h.id]}
              onCheckedChange={(c) => void toggle(h.id, !!c)}
            />
            <span className="text-sm text-zinc-200">{h.label}</span>
          </li>
        ))}
      </ul>
      <Button
        type="button"
        variant="outline"
        className="rounded-full border-white/15"
        onClick={() => void resetDay()}
      >
        Reset today
      </Button>
    </div>
  )
}
