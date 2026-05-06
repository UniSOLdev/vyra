import Link from "next/link"
import { PageContainer } from "@/components/PageContainer"

const linkClass =
  "text-sm text-zinc-500 transition-colors duration-200 hover:text-zinc-300 min-h-10 inline-flex items-center"

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-white/10 bg-zinc-950 py-10">
      <PageContainer className="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-600">
          VYRA
        </p>
        <nav
          className="flex flex-wrap gap-x-8 gap-y-3"
          aria-label="Legal and company"
        >
          <Link href="/about" className={linkClass}>
            About
          </Link>
          <Link href="/terms" className={linkClass}>
            Terms
          </Link>
          <Link href="/privacy" className={linkClass}>
            Privacy
          </Link>
          <Link href="/contact" className={linkClass}>
            Contact
          </Link>
        </nav>
      </PageContainer>
    </footer>
  )
}
