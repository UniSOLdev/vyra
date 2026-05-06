export const dynamic = "force-dynamic"

import { redirect } from "next/navigation"
import { AppShell } from "@/components/AppShell"
import { DashboardClient } from "./dashboard-client"
import { rowToUserProfile, type ProfileRow } from "@/lib/profile-map"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import type { DailyLogs, WorkoutPlan } from "@/lib/types"
import { addDaysToISO, rotatingDayIndex, todayISO, weekStartMondayISO } from "@/lib/week"

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/login?next=/dashboard")

  const weekStart = weekStartMondayISO()
  const today = todayISO()

  const { data: profileRow } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle()
  const profile = rowToUserProfile(profileRow as ProfileRow | null)

  const { data: metricsRow } = await supabase
    .from("daily_metrics")
    .select("protein_g, water_l, steps")
    .eq("user_id", user.id)
    .eq("metric_date", today)
    .maybeSingle()

  const { data: planRow } = await supabase.from("user_workout_plans").select("plan").eq("user_id", user.id).maybeSingle()

  const plan = (planRow?.plan as WorkoutPlan | null) ?? null
  const planWeekStart = (profileRow as { plan_week_start?: string } | null)?.plan_week_start ?? weekStart
  const dayIndex =
    plan?.days?.length ? rotatingDayIndex(planWeekStart, plan.days.length) : 0
  const todayPlanDay = plan?.days?.[dayIndex] ?? null

  const { data: completionsToday } = await supabase
    .from("workout_day_completions")
    .select("day_id, completed")
    .eq("user_id", user.id)
    .eq("completion_date", today)

  const completionMap: Record<string, boolean> = {}
  for (const c of completionsToday ?? []) {
    if (c.day_id) completionMap[c.day_id] = !!c.completed
  }

  const { data: scoreRow } = await supabase
    .from("weekly_scores")
    .select("*")
    .eq("user_id", user.id)
    .eq("week_start", weekStart)
    .maybeSingle()

  const habitSince = addDaysToISO(today, -21)
  const { data: habitRows } = await supabase
    .from("habit_daily_logs")
    .select("log_date, habit_id, done")
    .eq("user_id", user.id)
    .gte("log_date", habitSince)
    .lte("log_date", today)

  const habitLogs: DailyLogs = {}
  for (const h of habitRows ?? []) {
    if (!h.log_date) continue
    habitLogs[h.log_date] = { ...(habitLogs[h.log_date] ?? {}), [h.habit_id]: !!h.done }
  }

  return (
    <AppShell>
      <DashboardClient
        today={today}
        initialProfile={profile}
        initialMetrics={{
          protein_g: metricsRow?.protein_g ?? 0,
          water_l: Number(metricsRow?.water_l ?? 0),
          steps: metricsRow?.steps ?? 0,
        }}
        initialPlan={plan}
        planWeekStart={planWeekStart}
        todayPlanDayId={todayPlanDay?.id ?? null}
        todayPlanDayName={todayPlanDay?.name ?? null}
        todayPlanExerciseCount={todayPlanDay?.exercises?.length ?? 0}
        todayWorkoutDone={todayPlanDay ? !!completionMap[todayPlanDay.id] : false}
        initialWeeklyScore={scoreRow}
        habitLogs={habitLogs}
      />
    </AppShell>
  )
}
