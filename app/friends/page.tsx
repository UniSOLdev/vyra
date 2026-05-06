export const dynamic = "force-dynamic"

import { redirect } from "next/navigation"
import { AppShell } from "@/components/AppShell"
import { FriendsClient } from "./friends-client"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { weekStartMondayISO } from "@/lib/week"

export default async function FriendsPage() {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/login?next=/friends")

  const weekStart = weekStartMondayISO()

  const { data: outRows } = await supabase
    .from("friendships")
    .select("friend_user_id")
    .eq("user_id", user.id)
  const { data: inRows } = await supabase
    .from("friendships")
    .select("user_id")
    .eq("friend_user_id", user.id)

  const friendIds: string[] = []
  for (const r of outRows ?? []) friendIds.push(r.friend_user_id)
  for (const r of inRows ?? []) friendIds.push(r.user_id)

  const ids = Array.from(new Set([...friendIds, user.id]))

  const { data: scores } = await supabase
    .from("weekly_scores")
    .select("user_id, score, workout_completion_pct")
    .eq("week_start", weekStart)
    .in("user_id", ids.length ? ids : [user.id])

  const { data: profiles } = await supabase.from("profiles").select("id, username").in("id", ids.length ? ids : [user.id])

  const nameById = new Map<string, string>()
  for (const p of profiles ?? []) nameById.set(p.id, p.username ?? "unknown")

  const initialRows = (scores ?? []).map((s) => ({
    userId: s.user_id,
    username: nameById.get(s.user_id) ?? "unknown",
    score: Number(s.score ?? 0),
    workoutPct: Number(s.workout_completion_pct ?? 0),
    isSelf: s.user_id === user.id,
  }))
  initialRows.sort((a, b) => b.score - a.score || a.username.localeCompare(b.username))

  return (
    <AppShell>
      <FriendsClient initialRows={initialRows} />
    </AppShell>
  )
}
