"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { CTAButton } from "@/components/CTAButton"

export function ProWaitlistForm() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle")

  const submit = async () => {
    if (!email.trim() || status === "sending") return
    setStatus("sending")
    try {
      const res = await fetch("/api/early-access", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      })
      if (res.ok) {
        setStatus("done")
        setEmail("")
      } else {
        setStatus("error")
      }
    } catch {
      setStatus("error")
    }
  }

  return (
    <div className="mt-6 space-y-3">
      <Input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        autoComplete="email"
        aria-label="Email for waitlist"
        className="h-11 border-white/10 bg-white/[0.04] text-white placeholder:text-zinc-600"
      />
      <CTAButton
        type="button"
        variant="primary"
        size="lg"
        className="w-full justify-center"
        disabled={status === "sending" || status === "done"}
        onClick={() => void submit()}
      >
        {status === "sending"
          ? "Submitting…"
          : status === "done"
            ? "On the list"
            : "Get early access"}
      </CTAButton>
      {status === "error" ? (
        <p className="text-xs text-zinc-500">Could not submit. Try again.</p>
      ) : null}
    </div>
  )
}
