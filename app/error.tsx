"use client"

import { Logo } from "@/components/Logo"
import { CTAButton } from "@/components/CTAButton"
import { PageContainer } from "@/components/PageContainer"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-950 text-zinc-50">
      <header className="border-b border-white/10 py-5">
        <PageContainer>
          <Logo />
        </PageContainer>
      </header>
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-20">
        <div className="glass-panel max-w-md rounded-3xl border border-white/10 p-10 text-center shadow-vyra-lg">
          <p className="text-caption text-red-400/90">Error</p>
          <h1 className="mt-4 text-section-title">Something broke.</h1>
          <p className="text-body mt-3 text-sm">
            Refresh or return home. If it persists, try again later.
          </p>
          {error.digest ? (
            <p className="mt-4 font-mono text-[10px] text-zinc-600">{error.digest}</p>
          ) : null}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <CTAButton type="button" variant="primary" size="lg" onClick={() => reset()}>
              Retry
            </CTAButton>
            <CTAButton href="/" variant="outline" size="lg">
              Home
            </CTAButton>
          </div>
        </div>
      </main>
    </div>
  )
}
