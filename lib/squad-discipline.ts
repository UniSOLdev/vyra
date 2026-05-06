import { calculateStreak, weeklyHabitCompletionPct } from "@/lib/fitness"
import { HABIT_IDS } from "@/lib/habits"
import { getDailyLogs, getWorkoutPlan } from "@/lib/storage"

function dateKeyDaysAgo(daysAgo: number) {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() - daysAgo)
  const y = d.getFullYear()
  const m = `${d.getMonth() + 1}`.padStart(2, "0")
  const day = `${d.getDate()}`.padStart(2, "0")
  return `${y}-${m}-${day}`
}

/** Monday of the current week in local time, YYYY-MM-DD */
export function mondayDateString(d = new Date()) {
  const c = new Date(d)
  c.setHours(0, 0, 0, 0)
  const day = c.getDay()
  const diff = (day + 6) % 7
  c.setDate(c.getDate() - diff)
  const y = c.getFullYear()
  const m = `${c.getMonth() + 1}`.padStart(2, "0")
  const dayM = `${c.getDate()}`.padStart(2, "0")
  return `${y}-${m}-${dayM}`
}

/** Discipline metrics for leaderboard (no weight). */
export function getDisciplineMetrics() {
  const logs = getDailyLogs()
  const consistency_pct = weeklyHabitCompletionPct(logs, [...HABIT_IDS])
  const streak_days = calculateStreak(logs, "workout")

  let sessions_completed = 0
  for (let i = 6; i >= 0; i--) {
    const k = dateKeyDaysAgo(i)
    if (logs[k]?.["workout"]) sessions_completed += 1
  }

  const plan = getWorkoutPlan()
  if (plan?.days?.length) {
    const done = plan.days.filter((day) => day.dayCompleted).length
    sessions_completed = Math.max(sessions_completed, done)
  }

  return {
    consistency_pct: Math.min(100, Math.max(0, consistency_pct)),
    streak_days: Math.min(365, Math.max(0, streak_days)),
    sessions_completed: Math.min(7, Math.max(0, sessions_completed)),
  }
}
