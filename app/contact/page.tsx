import type { Metadata } from "next"
import Link from "next/link"
import { AppShell } from "@/components/AppShell"
import { PageContainer } from "@/components/PageContainer"

export const metadata: Metadata = {
  title: "Contact",
  description: "Reach the VYRA team for support and partnerships.",
  openGraph: {
    title: "Contact · VYRA",
    description: "Reach the VYRA team for support and partnerships.",
  },
}

export default function ContactPage() {
  return (
    <AppShell>
      <PageContainer className="py-14 sm:py-20">
        <h1 className="font-heading text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Contact
        </h1>
        <p className="mt-6 max-w-xl text-sm leading-relaxed text-zinc-400">
          For product support or partnerships, use the channel below. We respond in order
          of priority.
        </p>
        <p className="mt-8 text-sm text-zinc-300">
          <a
            href="mailto:support@vyra.com"
            className="font-medium text-white underline-offset-4 hover:underline"
          >
            support@vyra.com
          </a>
        </p>
        <p className="mt-10 text-xs text-zinc-600">
          <Link href="/" className="text-zinc-500 hover:text-zinc-300">
            Back to home
          </Link>
        </p>
      </PageContainer>
    </AppShell>
  )
}
