import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"

export const runtime = "nodejs"

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as {
    email?: string
  } | null
  const raw = body?.email?.trim().toLowerCase() ?? ""
  if (!raw || !EMAIL_RE.test(raw)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 })
  }

  try {
    const supabase = createAdminClient()
    const { error } = await supabase.from("early_access").insert({ email: raw })

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json({ ok: true })
      }
      return NextResponse.json({ error: "Could not save" }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: "Waitlist unavailable" }, { status: 503 })
  }
}
