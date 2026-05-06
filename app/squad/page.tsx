import { Suspense } from "react"
import { AppShell } from "@/components/AppShell"
import { SquadClient } from "@/components/squad/SquadClient"

function SquadFallback() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center text-zinc-500 sm:px-6">
      Loading…
    </div>
  )
}

export default function SquadPage() {
  return (
    <AppShell>
      <Suspense fallback={<SquadFallback />}>
        <SquadClient />
      </Suspense>
    </AppShell>
  )
}
