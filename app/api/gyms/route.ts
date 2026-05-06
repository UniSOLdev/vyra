import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { getOwnerIdFromHeader } from "@/lib/vyra-owner"

export const runtime = "nodejs"

const MACHINE_TYPES = new Set([
  "Plate-loaded",
  "Cable",
  "Dumbbell",
  "Barbell",
  "Cardio",
  "Bodyweight",
])

type MachineRow = { machine_name: string; machine_type: string }

export async function GET(req: Request) {
  const owner = getOwnerIdFromHeader(req)
  if (!owner) {
    return NextResponse.json({ error: "Missing owner" }, { status: 401 })
  }

  try {
    const supabase = createAdminClient()
    const { data: gym, error: gErr } = await supabase
      .from("gyms")
      .select("id,gym_name,created_at")
      .eq("user_id", owner)
      .maybeSingle()
    if (gErr) {
      return NextResponse.json({ error: "Could not load gym" }, { status: 500 })
    }
    if (!gym) {
      return NextResponse.json({ gym: null, machines: [] })
    }
    const { data: machines, error: mErr } = await supabase
      .from("gym_machines")
      .select("id,machine_name,machine_type,created_at")
      .eq("gym_id", gym.id)
    if (mErr) {
      return NextResponse.json({ error: "Could not load machines" }, { status: 500 })
    }
    return NextResponse.json({ gym, machines: machines ?? [] })
  } catch {
    return NextResponse.json({ error: "Unavailable" }, { status: 503 })
  }
}

export async function POST(req: Request) {
  const owner = getOwnerIdFromHeader(req)
  if (!owner) {
    return NextResponse.json({ error: "Missing owner" }, { status: 401 })
  }

  const body = (await req.json().catch(() => null)) as {
    gymName?: string
    machines?: MachineRow[]
  } | null
  const gymName = body?.gymName?.trim() ?? ""
  const machines = Array.isArray(body?.machines) ? body!.machines! : []
  if (!gymName) {
    return NextResponse.json({ error: "Gym name required" }, { status: 400 })
  }
  for (const m of machines) {
    if (!m.machine_name?.trim() || !m.machine_type?.trim()) {
      return NextResponse.json({ error: "Invalid machine row" }, { status: 400 })
    }
    if (!MACHINE_TYPES.has(m.machine_type.trim())) {
      return NextResponse.json({ error: "Invalid machine type" }, { status: 400 })
    }
  }

  try {
    const supabase = createAdminClient()
    const { data: existing } = await supabase
      .from("gyms")
      .select("id")
      .eq("user_id", owner)
      .maybeSingle()

    let gymId: string
    if (existing?.id) {
      gymId = existing.id
      const { error: uErr } = await supabase
        .from("gyms")
        .update({ gym_name: gymName })
        .eq("id", gymId)
      if (uErr) {
        return NextResponse.json({ error: "Could not update gym" }, { status: 500 })
      }
      await supabase.from("gym_machines").delete().eq("gym_id", gymId)
    } else {
      const { data: inserted, error: iErr } = await supabase
        .from("gyms")
        .insert({ user_id: owner, gym_name: gymName })
        .select("id")
        .single()
      if (iErr || !inserted?.id) {
        return NextResponse.json({ error: "Could not create gym" }, { status: 500 })
      }
      gymId = inserted.id
    }

    if (machines.length) {
      const rows = machines.map((m) => ({
        gym_id: gymId,
        machine_name: m.machine_name.trim(),
        machine_type: m.machine_type.trim(),
      }))
      const { error: insErr } = await supabase.from("gym_machines").insert(rows)
      if (insErr) {
        return NextResponse.json({ error: "Could not save machines" }, { status: 500 })
      }
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: "Unavailable" }, { status: 503 })
  }
}
