"use client"

import { useSearchParams } from "next/navigation"
import { useState } from "react"
import Link from "next/link"
import { signInAction } from "@/app/actions/vyra"
import { CTAButton } from "@/components/CTAButton"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function LoginForm() {
  const sp = useSearchParams()
  const next = sp.get("next") ?? "/dashboard"
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  return (
    <form
      className="mx-auto max-w-md space-y-6"
      action={async (fd) => {
        setPending(true)
        setError(null)
        fd.set("next", next)
        try {
          const res = await signInAction(fd)
          if (res && "error" in res && res.error) setError(res.error)
        } catch {
          /* redirect */
        }
        setPending(false)
      }}
    >
      <input type="hidden" name="next" value={next} readOnly />
      <div className="space-y-2">
        <Label htmlFor="email" className="text-zinc-300">
          Email
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="min-h-12 border-white/10 bg-zinc-950 text-white"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password" className="text-zinc-300">
          Password
        </Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="min-h-12 border-white/10 bg-zinc-950 text-white"
        />
      </div>
      {error ? <p className="text-sm text-red-400">{error}</p> : null}
      <CTAButton type="submit" variant="primary" size="lg" className="w-full justify-center" disabled={pending}>
        {pending ? "Signing in…" : "Sign in"}
      </CTAButton>
      <p className="text-center text-sm text-zinc-500">
        No account?{" "}
        <Link href="/signup" className="text-vyra-lime hover:underline">
          Create one
        </Link>
      </p>
    </form>
  )
}
