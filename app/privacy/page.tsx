import type { Metadata } from "next"
import { AppShell } from "@/components/AppShell"
import { PageContainer } from "@/components/PageContainer"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How VYRA collects, uses, and protects your information.",
  openGraph: {
    title: "Privacy Policy · VYRA",
    description: "How VYRA collects, uses, and protects your information.",
  },
}

export default function PrivacyPage() {
  return (
    <AppShell>
      <PageContainer className="py-14 sm:py-20">
        <h1 className="font-heading text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Privacy Policy
        </h1>
        <div className="mt-8 max-w-2xl space-y-4 text-sm leading-relaxed text-zinc-400">
          <p>
            VYRA processes account and usage data to operate the service, including
            authentication, analytics required for product quality, and communications
            you opt into.
          </p>
          <p>
            We use industry-standard providers for hosting, payments, and infrastructure.
            Data may be processed in the United States and other regions where those
            providers operate.
          </p>
          <p>
            You may request access or deletion of personal data where applicable law
            applies, subject to legitimate business and legal retention requirements.
          </p>
        </div>
      </PageContainer>
    </AppShell>
  )
}
