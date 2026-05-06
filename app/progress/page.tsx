import { AppShell } from "@/components/AppShell"
import { ProgressLog } from "@/components/progress/ProgressLog"

export default function ProgressPage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10">
        <h1 className="font-heading text-3xl text-white sm:text-4xl">
          Progress
        </h1>
        <p className="mt-2 text-zinc-400">
          Track what matters to you — positive, performance-focused, no
          body-shaming.
        </p>
        <div className="mt-8">
          <ProgressLog />
        </div>
      </div>
    </AppShell>
  )
}
