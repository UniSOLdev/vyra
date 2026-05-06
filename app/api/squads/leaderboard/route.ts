import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { getOwnerIdFromHeader } from "@/lib/vyra-owner"
import { isProFromHeader } from "@/lib/vyra-pro"

export const runtime = "nodejs"

export async function GET(req: Request) {
  if (!isProFromHeader(req)) {
    return NextResponse.json({ error: "Pro required" }, { status: 403 })
  }

  const owner = getOwnerIdFromHeader(req)
  if (!owner) {
    return NextResponse.json({ error: "Missing owner" }, { status: 401 })
  }

  const url = new URL(req.url)
  const squadId = url.searchParams.get("squadId")?.trim() ?? ""
  const weekStart = url.searchParams.get("weekStart")?.trim() ?? ""
  if (!squadId || !weekStart) {
    return NextResponse.json({ error: "Missing params" }, { status: 400 })
  }

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

    const { data: rows, error } = await supabase
      .from("squad_week_scores")
      .select("user_id,sessions_completed,consistency_pct,streak_days,updated_at")
      .eq("squad_id", squadId)
      .eq("week_start", weekStart)
      .order("sessions_completed", { ascending: false })
      .order("consistency_pct", { ascending: false })
      .order("streak_days", { ascending: false })

    if (error) {
      return NextResponse.json({ error: "Could not load board" }, { status: 500 })
    }

    return NextResponse.json({ rows: rows ?? [] })
  } catch {
    return NextResponse.json({ error: "Unavailable" }, { status: 503 })
  }
}
