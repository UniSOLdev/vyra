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

  const body = (await req.json().catch(() => null)) as { token?: string } | null
  const token = body?.token?.trim() ?? ""
  if (!token) {
    return NextResponse.json({ error: "Token required" }, { status: 400 })
  }

  try {
    const supabase = createAdminClient()
    const { data: squad, error: sErr } = await supabase
      .from("squads")
      .select("id,name")
      .eq("invite_token", token)
      .maybeSingle()
    if (sErr || !squad) {
      return NextResponse.json({ error: "Invalid invite" }, { status: 404 })
    }

    const { error: iErr } = await supabase.from("squad_members").insert({
      squad_id: squad.id,
      user_id: owner,
    })
    if (iErr) {
      if (iErr.code === "23505") {
        return NextResponse.json({ ok: true, squad })
      }
      return NextResponse.json({ error: "Could not join" }, { status: 500 })
    }

    return NextResponse.json({ ok: true, squad })
  } catch {
    return NextResponse.json({ error: "Unavailable" }, { status: 503 })
  }
}
