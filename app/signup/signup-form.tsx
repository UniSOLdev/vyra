"use client"

import { useState } from "react"
import Link from "next/link"
import { signUpAction } from "@/app/actions/vyra"
import { CTAButton } from "@/components/CTAButton"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function SignupForm() {
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)
  const [sent, setSent] = useState(false)

  return (
    <form
      className="mx-auto max-w-md space-y-6"
      action={async (fd) => {
        setPending(true)
        setError(null)
        try {
          const res = await signUpAction(fd)
          if (res && "error" in res && res.error) setError(res.error)
          else if (res && "needsConfirmation" in res && res.needsConfirmation) {
            setSent(true)
          }
        } catch {
          /* redirect to onboarding */
        }
        setPending(false)
      }}
    >
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
          autoComplete="new-password"
          required
          minLength={8}
          className="min-h-12 border-white/10 bg-zinc-950 text-white"
        />
      </div>
      {error ? <p className="text-sm text-red-400">{error}</p> : null}
      {sent ? (
        <p className="text-sm text-zinc-400">
          If your project requires email confirmation, check your inbox before signing in.
        </p>
      ) : null}
      <CTAButton type="submit" variant="primary" size="lg" className="w-full justify-center" disabled={pending}>
        {pending ? "Creating…" : "Create account"}
      </CTAButton>
      <p className="text-center text-sm text-zinc-500">
        Already have an account?{" "}
        <Link href="/login" className="text-vyra-lime hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  )
}
