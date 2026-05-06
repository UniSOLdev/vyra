import Link from "next/link"
import { Logo } from "@/components/Logo"
import { CTAButton } from "@/components/CTAButton"
import { PageContainer } from "@/components/PageContainer"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-950 text-zinc-50">
      <header className="border-b border-white/10 py-5">
        <PageContainer className="flex justify-between gap-4">
          <Logo />
          <Link
            href="/dashboard"
            className="inline-flex min-h-11 items-center text-sm text-zinc-400 transition-colors hover:text-white"
          >
            App
          </Link>
        </PageContainer>
      </header>
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-20">
        <div className="glass-panel max-w-md rounded-3xl border border-white/10 p-10 text-center shadow-vyra-lg">
          <p className="text-caption">404</p>
          <h1 className="mt-4 text-section-title">Nothing here.</h1>
          <p className="text-body mt-3 text-sm">
            Route missing or moved. Head home or open the app.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <CTAButton href="/" variant="primary" size="lg">
              Home
            </CTAButton>
            <CTAButton href="/dashboard" variant="outline" size="lg">
              Dashboard
            </CTAButton>
          </div>
        </div>
      </main>
    </div>
  )
}
