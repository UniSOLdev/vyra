export const dynamic = "force-dynamic"

import Link from "next/link"
import { redirect } from "next/navigation"
import { Logo } from "@/components/Logo"
import { OnboardingClient } from "./onboarding-client"
import { createSupabaseServerClient } from "@/lib/supabase/server"

export default async function OnboardingPage() {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/login?next=/onboarding")

  const { data: row } = await supabase
    .from("profiles")
    .select("username, goal, is_pro")
    .eq("id", user.id)
    .maybeSingle()

  if (row?.username && row?.goal) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="border-b border-white/10 px-4 py-4 sm:px-6">
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <Link href="/">
            <Logo />
          </Link>
          <Link href="/dashboard" className="text-sm text-zinc-500 hover:text-white">
            Back to app
          </Link>
        </div>
      </div>
      <OnboardingClient initialIsPro={!!row?.is_pro} />
    </div>
  )
}
