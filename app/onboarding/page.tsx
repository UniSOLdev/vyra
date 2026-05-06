import Link from "next/link"
import { Logo } from "@/components/Logo"
import { OnboardingClient } from "./onboarding-client"

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="border-b border-white/10 px-4 py-4 sm:px-6">
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <Link href="/">
            <Logo />
          </Link>
          <Link href="/dashboard" className="text-sm text-zinc-500 hover:text-white">
            Skip for now
          </Link>
        </div>
      </div>
      <OnboardingClient />
    </div>
  )
}
