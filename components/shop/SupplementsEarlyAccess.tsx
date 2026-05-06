"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { CTAButton } from "@/components/CTAButton"

export function SupplementsEarlyAccess() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">(
    "idle"
  )

  const submit = async () => {
    if (status === "loading") return
    setStatus("loading")
    try {
      const res = await fetch("/api/early-access", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email }),
      })
      if (!res.ok) {
        setStatus("error")
        return
      }
      setStatus("done")
      setEmail("")
    } catch {
      setStatus("error")
    }
  }

  return (
    <section
      className="rounded-2xl border border-white/10 bg-zinc-950/80 p-6 sm:p-8"
      aria-labelledby="early-access-heading"
    >
      <h2
        id="early-access-heading"
        className="font-heading text-lg font-semibold tracking-tight text-white sm:text-xl"
      >
        Supplements launching soon.
      </h2>
      <p className="mt-2 max-w-xl text-sm text-zinc-500">
        Built to support the disciplined week.
      </p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            if (status !== "idle") setStatus("idle")
          }}
          placeholder="Email"
          autoComplete="email"
          aria-label="Email for early access"
          className="h-11 min-h-11 flex-1 rounded-full border-white/10 bg-white/[0.04] text-white placeholder:text-zinc-600"
        />
        <CTAButton
          type="button"
          variant="primary"
          size="default"
          className="min-h-11 shrink-0 rounded-full px-6"
          disabled={status === "loading" || status === "done"}
          onClick={submit}
        >
          {status === "loading"
            ? "Sending…"
            : status === "done"
              ? "On the list"
              : "Get early access"}
        </CTAButton>
      </div>
      {status === "error" ? (
        <p className="mt-3 text-xs text-zinc-500">
          Could not save right now. Try again shortly.
        </p>
      ) : null}
    </section>
  )
}
