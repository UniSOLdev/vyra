"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { signOutAction } from "@/app/actions/vyra"
import { createSupabaseBrowserClient } from "@/lib/supabase/browser"
import { Button } from "@/components/ui/button"

export function SessionControls() {
  const [email, setEmail] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createSupabaseBrowserClient()
    void supabase.auth.getSession().then(({ data }) => {
      setEmail(data.session?.user.email ?? null)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setEmail(session?.user.email ?? null)
    })
    return () => {
      sub.subscription.unsubscribe()
    }
  }, [])

  if (!email) {
    return (
      <div className="flex items-center gap-2">
        <Link
          href="/login"
          className="hidden min-h-11 items-center px-3 text-sm tracking-wide text-zinc-400 transition-colors duration-200 hover:text-white sm:inline-flex"
        >
          Sign in
        </Link>
        <Link
          href="/signup"
          className="inline-flex min-h-11 items-center rounded-full border border-white/15 px-4 text-sm font-semibold text-white transition-colors hover:bg-white/[0.06]"
        >
          Join
        </Link>
      </div>
    )
  }

  return (
    <div className="hidden items-center gap-2 sm:flex sm:gap-3">
      <span className="max-w-[160px] truncate text-xs text-zinc-500">{email}</span>
      <form action={signOutAction}>
        <Button type="submit" variant="ghost" className="min-h-11 rounded-full px-3 text-sm text-zinc-400 hover:text-white">
          Sign out
        </Button>
      </form>
    </div>
  )
}
