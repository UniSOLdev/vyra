"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Menu, X } from "lucide-react"
import { Logo } from "@/components/Logo"
import { CTAButton } from "@/components/CTAButton"
import { PageContainer } from "@/components/PageContainer"
import { cn } from "@/lib/utils"

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/workouts", label: "Workouts" },
  { href: "/nutrition", label: "Nutrition" },
  { href: "/habits", label: "Habits" },
  { href: "/progress", label: "Progress" },
  { href: "/coach", label: "Coach" },
  { href: "/gym", label: "Gym" },
  { href: "/squad", label: "Squad" },
  { href: "/shop", label: "Shop" },
]

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <div className="flex min-h-screen flex-col bg-zinc-950 text-zinc-50">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-zinc-950/85 backdrop-blur-xl supports-[backdrop-filter]:bg-zinc-950/75">
        <PageContainer className="flex items-center justify-between gap-3 py-3 sm:py-4">
          <div className="flex min-w-0 items-center gap-4 lg:gap-8">
            <Logo />
            <nav className="hidden items-center gap-0.5 text-sm text-zinc-400 lg:flex">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className={cn(
                    "min-h-11 rounded-full px-3.5 py-2.5 tracking-wide transition-colors duration-200 [transition-timing-function:var(--ease-vy-out)] hover:text-white",
                    pathname === l.href && "bg-white/[0.07] text-white"
                  )}
                >
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="hidden items-center gap-2 sm:flex sm:gap-3">
            <Link
              href="/onboarding"
              className="inline-flex min-h-11 items-center rounded-full px-3 text-sm text-zinc-400 transition-colors duration-200 hover:text-white"
            >
              Update plan
            </Link>
            <CTAButton href="/onboarding" size="default" variant="primary">
              Quick setup
            </CTAButton>
          </div>
          <button
            type="button"
            className="inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-white transition-colors duration-200 hover:bg-white/10 lg:hidden"
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </PageContainer>
        {open ? (
          <div className="border-t border-white/10 bg-zinc-950/98 backdrop-blur-xl lg:hidden">
            <PageContainer className="flex flex-col gap-1 py-3">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "min-h-12 rounded-xl px-4 py-3 text-sm transition-colors",
                    pathname === l.href
                      ? "bg-white/10 text-white"
                      : "text-zinc-400 hover:bg-white/5 hover:text-white"
                  )}
                >
                  {l.label}
                </Link>
              ))}
              <CTAButton
                href="/onboarding"
                className="mt-2 w-full justify-center"
                variant="primary"
                onClick={() => setOpen(false)}
              >
                Quick setup
              </CTAButton>
            </PageContainer>
          </div>
        ) : null}
      </header>
      <main className="flex-1">{children}</main>
    </div>
  )
}
