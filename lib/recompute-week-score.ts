import type { SupabaseClient } from "@supabase/supabase-js"
import { computeDisciplineScore, DISCIPLINE_DEFAULT_TARGETS } from "@/lib/discipline"
import {
  calculateProteinTarget,
  calculateStepsTarget,
  calculateWaterTargetMl,
  weeklyHabitCompletionPct,
} from "@/lib/fitness"
import { HABIT_IDS } from "@/lib/habits"
import { rowToUserProfile } from "@/lib/profile-map"
import type { DailyLogs } from "@/lib/types"

function addDaysISO(iso: string, days: number): string {
  const d = new Date(`${iso}T12:00:00`)
  d.setDate(d.getDate() + days)
  const y = d.getFullYear()
  const m = `${d.getMonth() + 1}`.padStart(2, "0")
  const day = `${d.getDate()}`.padStart(2, "0")
  return `${y}-${m}-${day}`
}

export async function recomputeWeeklyScore(
  supabase: SupabaseClient,
  userId: string,
  weekStartISO: string
) {
  const { data: profileRow } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle()

  const appProfile = rowToUserProfile(profileRow as never)

  const proteinT =
    appProfile?.targetProteinG ??
    (appProfile ? calculateProteinTarget(appProfile) : DISCIPLINE_DEFAULT_TARGETS.proteinG)
  const waterT =
    appProfile?.targetWaterL != null
      ? appProfile.targetWaterL
      : appProfile
        ? calculateWaterTargetMl(appProfile) / 1000
        : DISCIPLINE_DEFAULT_TARGETS.waterL
  const stepsT =
    appProfile?.targetSteps ??
    (appProfile ? calculateStepsTarget(appProfile) : DISCIPLINE_DEFAULT_TARGETS.steps)

  const weekEnd = addDaysISO(weekStartISO, 6)

  const { data: metrics } = await supabase
    .from("daily_metrics")
    .select("metric_date, protein_g, water_l, steps")
    .eq("user_id", userId)
    .gte("metric_date", weekStartISO)
    .lte("metric_date", weekEnd)

  const { data: completions } = await supabase
    .from("workout_day_completions")
    .select("completion_date, completed")
    .eq("user_id", userId)
    .gte("completion_date", weekStartISO)
    .lte("completion_date", weekEnd)

  const { data: habits } = await supabase
    .from("habit_daily_logs")
    .select("log_date, habit_id, done")
    .eq("user_id", userId)
    .gte("log_date", weekStartISO)
    .lte("log_date", weekEnd)

  const logs: DailyLogs = {}
  for (const h of habits ?? []) {
    if (!h.log_date) continue
    logs[h.log_date] = { ...(logs[h.log_date] ?? {}), [h.habit_id]: !!h.done }
  }
  const habitWeekPct = weeklyHabitCompletionPct(logs, [...HABIT_IDS])

  let proteinHits = 0
  let waterHits = 0
  let stepsHits = 0
  for (let i = 0; i < 7; i++) {
    const day = addDaysISO(weekStartISO, i)
    const m = metrics?.find((x) => x.metric_date === day)
    if (m && m.protein_g >= proteinT) proteinHits++
    if (m && Number(m.water_l) >= waterT) waterHits++
    if (m && m.steps >= stepsT) stepsHits++
  }

  const proteinHitPct = (proteinHits / 7) * 100
  const waterHitPct = (waterHits / 7) * 100
  const stepsHitPct = (stepsHits / 7) * 100

  const daysPerWeek = Math.min(7, Math.max(1, profileRow?.days_per_week ?? 4))
  const distinctCompletedDays = new Set(
    (completions ?? []).filter((c) => c.completed).map((c) => c.completion_date)
  ).size
  const workoutCompletionPct = Math.min(
    100,
    (distinctCompletedDays / daysPerWeek) * 100
  )

  const score = computeDisciplineScore({
    workoutCompletionPct,
    proteinHitPct,
    waterHitPct,
    stepsHitPct,
  })

  await supabase.from("weekly_scores").upsert(
    {
      user_id: userId,
      week_start: weekStartISO,
      score,
      workout_completion_pct: workoutCompletionPct,
      protein_hit_pct: proteinHitPct,
      water_hit_pct: waterHitPct,
      steps_hit_pct: stepsHitPct,
      habit_week_pct: habitWeekPct,
      components: { proteinT, waterT, stepsT, daysPerWeek },
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,week_start" }
  )
}
