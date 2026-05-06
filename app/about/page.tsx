import type { Metadata } from "next"
import { AppShell } from "@/components/AppShell"
import { PageContainer } from "@/components/PageContainer"

export const metadata: Metadata = {
  title: "About",
  description: "VYRA is a performance operating system for training, fuel, and habits.",
  openGraph: {
    title: "About · VYRA",
    description: "VYRA is a performance operating system for training, fuel, and habits.",
  },
}

export default function AboutPage() {
  return (
    <AppShell>
      <PageContainer className="py-14 sm:py-20">
        <h1 className="font-heading text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          About
        </h1>
        <p className="mt-6 max-w-2xl text-sm leading-relaxed text-zinc-400 sm:text-base">
          VYRA is built for athletes who want structure without noise: one surface for
          training, fuel, habits, and accountability. Execute the week. Stay sharp.
        </p>
      </PageContainer>
    </AppShell>
  )
}
