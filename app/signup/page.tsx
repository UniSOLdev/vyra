import type { Metadata } from "next"
import Link from "next/link"
import { SignupForm } from "./signup-form"
import { Logo } from "@/components/Logo"
import { PageContainer } from "@/components/PageContainer"

export const metadata: Metadata = {
  title: "Create account",
}

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-zinc-950 py-16 text-zinc-50">
      <PageContainer narrow>
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-white">
          <Logo />
        </Link>
        <h1 className="mt-10 font-heading text-3xl text-white">Create account</h1>
        <p className="mt-2 text-sm text-zinc-500">Start onboarding right after signup.</p>
        <div className="mt-10 rounded-3xl border border-white/10 bg-zinc-900/40 p-8 ring-1 ring-white/[0.06]">
          <SignupForm />
        </div>
      </PageContainer>
    </div>
  )
}
