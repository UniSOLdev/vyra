export const dynamic = "force-dynamic"

import { redirect } from "next/navigation"
import { AppShell } from "@/components/AppShell"
import { InsightsClient } from "./insights-client"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { addDaysToISO, weekStartMondayISO } from "@/lib/week"

export default async function InsightsPage() {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/login?next=/insights")

  const { data: profile } = await supabase.from("profiles").select("is_pro").eq("id", user.id).single()
  const isPro = !!profile?.is_pro

  const current = weekStartMondayISO()
  const weeks = [0, 1, 2, 3].map((i) => addDaysToISO(current, -7 * i)).reverse()

  const { data: scores } = await supabase
    .from("weekly_scores")
    .select("week_start, score, habit_week_pct")
    .eq("user_id", user.id)
    .in("week_start", weeks)

  const byWeek = new Map<string, { score: number; habit: number }>()
  for (const s of scores ?? []) {
    byWeek.set(s.week_start, {
      score: Number(s.score ?? 0),
      habit: Number(s.habit_week_pct ?? 0),
    })
  }

  const disciplineSeries = weeks.map((w) => ({
    label: w.slice(5),
    value: byWeek.get(w)?.score ?? 0,
  }))
  const habitSeries = weeks.map((w) => ({
    label: w.slice(5),
    value: byWeek.get(w)?.habit ?? 0,
  }))

  const checkoutEnabled = !!process.env.STRIPE_SECRET_KEY && !!process.env.STRIPE_PRO_PRICE_ID

  return (
    <AppShell>
      <InsightsClient
        isPro={isPro}
        disciplineSeries={disciplineSeries}
        habitSeries={habitSeries}
        checkoutEnabled={checkoutEnabled}
      />
    </AppShell>
  )
}
