export const dynamic = "force-dynamic"

import { redirect } from "next/navigation"
import { AppShell } from "@/components/AppShell"
import { HabitChecklist } from "@/components/habits/HabitChecklist"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import type { DailyLogs } from "@/lib/types"
import { addDaysToISO, todayISO } from "@/lib/week"

export default async function HabitsPage() {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/login?next=/habits")

  const start = addDaysToISO(todayISO(), -28)
  const end = todayISO()
  const { data: rows } = await supabase
    .from("habit_daily_logs")
    .select("log_date, habit_id, done")
    .eq("user_id", user.id)
    .gte("log_date", start)
    .lte("log_date", end)

  const logs: DailyLogs = {}
  for (const h of rows ?? []) {
    if (!h.log_date) continue
    logs[h.log_date] = { ...(logs[h.log_date] ?? {}), [h.habit_id]: !!h.done }
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-10">
        <h1 className="font-heading text-3xl text-white sm:text-4xl">Habit tracker</h1>
        <p className="mt-2 text-zinc-400">Synced to your account. Updates feed your weekly discipline score.</p>
        <div className="mt-8">
          <HabitChecklist initialLogs={logs} todayKey={todayISO()} />
        </div>
      </div>
    </AppShell>
  )
}
