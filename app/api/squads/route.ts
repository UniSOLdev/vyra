import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { getOwnerIdFromHeader } from "@/lib/vyra-owner"
import { isProFromHeader } from "@/lib/vyra-pro"

export const runtime = "nodejs"

export async function GET(req: Request) {
  const owner = getOwnerIdFromHeader(req)
  if (!owner) {
    return NextResponse.json({ error: "Missing owner" }, { status: 401 })
  }

  if (!isProFromHeader(req)) {
    return NextResponse.json({ squads: [] })
  }

  try {
    const supabase = createAdminClient()
    const { data: owned, error: oErr } = await supabase
      .from("squads")
      .select("id,name,owner_id,invite_token,created_at")
      .eq("owner_id", owner)
    if (oErr) {
      return NextResponse.json({ error: "Could not load squads" }, { status: 500 })
    }

    const { data: memberships, error: mErr } = await supabase
      .from("squad_members")
      .select("squad_id")
      .eq("user_id", owner)
    if (mErr) {
      return NextResponse.json({ error: "Could not load squads" }, { status: 500 })
    }

    const memberIds = [...new Set((memberships ?? []).map((r) => r.squad_id))]
    let joined: typeof owned = []
    if (memberIds.length) {
      const { data: j, error: jErr } = await supabase
        .from("squads")
        .select("id,name,owner_id,invite_token,created_at")
        .in("id", memberIds)
      if (jErr) {
        return NextResponse.json({ error: "Could not load squads" }, { status: 500 })
      }
      joined = j ?? []
    }

    const map = new Map<string, (typeof owned)[0]>()
    for (const s of [...(owned ?? []), ...joined]) {
      map.set(s.id, s)
    }
    return NextResponse.json({ squads: [...map.values()] })
  } catch {
    return NextResponse.json({ error: "Unavailable" }, { status: 503 })
  }
}

export async function POST(req: Request) {
  if (!isProFromHeader(req)) {
    return NextResponse.json({ error: "Pro required" }, { status: 403 })
  }

  const owner = getOwnerIdFromHeader(req)
  if (!owner) {
    return NextResponse.json({ error: "Missing owner" }, { status: 401 })
  }

  const body = (await req.json().catch(() => null)) as { name?: string } | null
  const name = body?.name?.trim() ?? ""
  if (!name) {
    return NextResponse.json({ error: "Name required" }, { status: 400 })
  }

  try {
    const supabase = createAdminClient()
    const { data: squad, error: sErr } = await supabase
      .from("squads")
      .insert({ name, owner_id: owner })
      .select("id,name,owner_id,invite_token,created_at")
      .single()
    if (sErr || !squad) {
      return NextResponse.json({ error: "Could not create squad" }, { status: 500 })
    }

    const { error: memErr } = await supabase.from("squad_members").insert({
      squad_id: squad.id,
      user_id: owner,
    })
    if (memErr) {
      return NextResponse.json({ error: "Could not add owner" }, { status: 500 })
    }

    return NextResponse.json({ squad })
  } catch {
    return NextResponse.json({ error: "Unavailable" }, { status: 503 })
  }
}
