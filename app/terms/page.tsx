import type { Metadata } from "next"
import { AppShell } from "@/components/AppShell"
import { PageContainer } from "@/components/PageContainer"

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms governing use of the VYRA application and services.",
  openGraph: {
    title: "Terms of Service · VYRA",
    description: "Terms governing use of the VYRA application and services.",
  },
}

export default function TermsPage() {
  return (
    <AppShell>
      <PageContainer className="py-14 sm:py-20">
        <h1 className="font-heading text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Terms of Service
        </h1>
        <div className="mt-8 max-w-2xl space-y-4 text-sm leading-relaxed text-zinc-400">
          <p>
            By accessing or using VYRA, you agree to these terms. VYRA provides fitness
            and wellness tools for personal use. You are responsible for how you use the
            product and for consulting professionals where appropriate.
          </p>
          <p>
            Subscriptions and purchases are processed by third-party providers. Billing,
            refunds, and cancellations follow the policies presented at checkout and in
            your account communications.
          </p>
          <p>
            We may update these terms. Continued use after changes constitutes acceptance
            of the revised terms.
          </p>
        </div>
      </PageContainer>
    </AppShell>
  )
}
