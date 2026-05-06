"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { ChevronDown } from "lucide-react"
import { signOutAction } from "@/app/actions/vyra"
import { createSupabaseBrowserClient } from "@/lib/supabase/browser"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

function initialsFromEmail(email: string) {
  const part = email.split("@")[0] ?? "V"
  return part.slice(0, 1).toUpperCase()
}

export function TopBarAuth() {
  const [user, setUser] = useState<{ email: string } | null>(null)
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const supabase = createSupabaseBrowserClient()
    void supabase.auth.getUser().then(({ data }) => {
      const u = data.user
      setUser(u?.email ? { email: u.email } : null)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      const u = session?.user
      setUser(u?.email ? { email: u.email } : null)
    })
    return () => {
      sub.subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (!open) return
    const close = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", close)
    return () => document.removeEventListener("mousedown", close)
  }, [open])

  return (
    <div ref={rootRef} className="flex shrink-0 items-center gap-2">
      {user ? (
        <div className="relative">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className={cn(
              "flex h-9 items-center gap-1.5 rounded-full border border-neutral-200 bg-white pl-1 pr-2 text-left transition-colors hover:bg-neutral-50",
              "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
            )}
            aria-expanded={open}
            aria-haspopup="menu"
            aria-label="Account menu"
          >
            <span className="grid size-7 place-content-center rounded-full bg-zinc-900 text-xs font-semibold text-white">
              {initialsFromEmail(user.email)}
            </span>
            <ChevronDown className="size-4 text-zinc-500" aria-hidden />
          </button>
          {open ? (
            <div
              role="menu"
              className="absolute right-0 z-[70] mt-2 w-48 rounded-xl border border-neutral-200 bg-white py-1 shadow-lg ring-1 ring-black/5"
            >
              <Link
                role="menuitem"
                href="/dashboard"
                className="block px-4 py-2.5 text-sm font-medium text-zinc-800 hover:bg-neutral-50"
                onClick={() => setOpen(false)}
              >
                Account
              </Link>
              <Link
                role="menuitem"
                href="/insights"
                className="block px-4 py-2.5 text-sm font-medium text-zinc-800 hover:bg-neutral-50"
                onClick={() => setOpen(false)}
              >
                Plan
              </Link>
              <form action={signOutAction} className="border-t border-neutral-100 pt-1">
                <Button
                  type="submit"
                  variant="ghost"
                  className="h-auto w-full justify-start rounded-none px-4 py-2.5 text-sm font-medium text-zinc-800 hover:bg-neutral-50"
                >
                  Sign out
                </Button>
              </form>
            </div>
          ) : null}
        </div>
      ) : (
        <div className="flex max-w-[calc(100vw-8rem)] items-center gap-1.5 sm:gap-2">
          <Link
            href="/login"
            className="inline-flex min-h-9 shrink-0 items-center rounded-full px-2.5 text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 sm:px-3"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="inline-flex h-9 items-center rounded-full border border-neutral-300 bg-white px-4 text-sm font-semibold text-zinc-900 transition-colors hover:bg-neutral-50"
          >
            Join
          </Link>
        </div>
      )}
    </div>
  )
}
