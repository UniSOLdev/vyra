export const dynamic = "force-dynamic"

import { redirect } from "next/navigation"
import { AppShell } from "@/components/AppShell"
import { WorkoutsClient } from "./workouts-client"
import { rowToUserProfile, type ProfileRow } from "@/lib/profile-map"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import type { WorkoutPlan } from "@/lib/types"
import { todayISO } from "@/lib/week"

export default async function WorkoutsPage() {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/login?next=/workouts")

  const { data: profileRow } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle()
  const profile = rowToUserProfile(profileRow as ProfileRow | null)

  const { data: planRow } = await supabase.from("user_workout_plans").select("plan").eq("user_id", user.id).maybeSingle()
  const plan = (planRow?.plan as WorkoutPlan | null) ?? null

  return (
    <AppShell>
      <WorkoutsClient initialPlan={plan} hasProfile={!!profile} sessionDate={todayISO()} />
    </AppShell>
  )
}
