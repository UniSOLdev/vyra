import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { getOwnerIdFromHeader } from "@/lib/vyra-owner"
import { isProFromHeader } from "@/lib/vyra-pro"

export const runtime = "nodejs"

export async function POST(req: Request) {
  if (!isProFromHeader(req)) {
    return NextResponse.json({ error: "Pro required" }, { status: 403 })
  }

  const owner = getOwnerIdFromHeader(req)
  if (!owner) {
    return NextResponse.json({ error: "Missing owner" }, { status: 401 })
  }

  const body = (await req.json().catch(() => null)) as {
    squadId?: string
    weekStart?: string
    sessions_completed?: number
    consistency_pct?: number
    streak_days?: number
  } | null

  const squadId = body?.squadId?.trim() ?? ""
  const weekStart = body?.weekStart?.trim() ?? ""
  if (!squadId || !weekStart) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
  }

  const sessions = Math.min(7, Math.max(0, Math.floor(body?.sessions_completed ?? 0)))
  const consistency = Math.min(100, Math.max(0, Math.floor(body?.consistency_pct ?? 0)))
  const streak = Math.min(365, Math.max(0, Math.floor(body?.streak_days ?? 0)))

  try {
    const supabase = createAdminClient()
    const { data: member } = await supabase
      .from("squad_members")
      .select("id")
      .eq("squad_id", squadId)
      .eq("user_id", owner)
      .maybeSingle()

    const { data: squad } = await supabase
      .from("squads")
      .select("owner_id")
      .eq("id", squadId)
      .maybeSingle()

    const allowed = !!member || squad?.owner_id === owner
    if (!allowed) {
      return NextResponse.json({ error: "Not a member" }, { status: 403 })
    }

    const { error } = await supabase.from("squad_week_scores").upsert(
      {
        squad_id: squadId,
        user_id: owner,
        week_start: weekStart,
        sessions_completed: sessions,
        consistency_pct: consistency,
        streak_days: streak,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "squad_id,user_id,week_start" }
    )

    if (error) {
      return NextResponse.json({ error: "Could not save score" }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: "Unavailable" }, { status: 503 })
  }
}
