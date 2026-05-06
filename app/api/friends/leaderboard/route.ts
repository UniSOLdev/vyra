import { NextResponse } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { weekStartMondayISO } from "@/lib/week"

export const runtime = "nodejs"

export async function GET() {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const weekStart = weekStartMondayISO()

  const { data: outRows } = await supabase
    .from("friendships")
    .select("friend_user_id")
    .eq("user_id", user.id)
  const { data: inRows } = await supabase
    .from("friendships")
    .select("user_id")
    .eq("friend_user_id", user.id)

  const friendIds = new Set<string>()
  for (const r of outRows ?? []) friendIds.add(r.friend_user_id)
  for (const r of inRows ?? []) friendIds.add(r.user_id)
  friendIds.add(user.id)

  const ids = [...friendIds]
  if (!ids.length) return NextResponse.json({ weekStart, rows: [] })

  const { data: scores } = await supabase
    .from("weekly_scores")
    .select("user_id, score, workout_completion_pct")
    .eq("week_start", weekStart)
    .in("user_id", ids)

  const { data: profiles } = await supabase.from("profiles").select("id, username").in("id", ids)

  const nameById = new Map<string, string>()
  for (const p of profiles ?? []) {
    nameById.set(p.id, p.username ?? "unknown")
  }

  const rows = (scores ?? []).map((s) => ({
    userId: s.user_id,
    username: nameById.get(s.user_id) ?? "unknown",
    score: Number(s.score ?? 0),
    workoutPct: Number(s.workout_completion_pct ?? 0),
    isSelf: s.user_id === user.id,
  }))
  rows.sort((a, b) => b.score - a.score || a.username.localeCompare(b.username))

  return NextResponse.json({ weekStart, rows })
}
