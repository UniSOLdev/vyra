"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { startTransition, useEffect, useState } from "react"
import { Menu, X } from "lucide-react"
import { Logo } from "@/components/Logo"
import { HeaderAuthCluster } from "@/components/HeaderAuthCluster"
import { SiteFooter } from "@/components/SiteFooter"
import { cn } from "@/lib/utils"

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/workouts", label: "Workouts" },
  { href: "/nutrition", label: "Nutrition" },
  { href: "/habits", label: "Habits" },
  { href: "/progress", label: "Progress" },
  { href: "/friends", label: "Friends" },
  { href: "/insights", label: "Insights" },
  { href: "/coach", label: "Coach" },
  { href: "/gym", label: "Gym" },
  { href: "/squad", label: "Squad" },
  { href: "/shop", label: "Shop" },
]

function NavLink({
  href,
  label,
  active,
  onNavigate,
}: {
  href: string
  label: string
  active: boolean
  onNavigate?: () => void
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={cn(
        "shrink-0 whitespace-nowrap rounded-full px-3 py-2 text-sm font-medium tracking-wide text-zinc-600 transition-colors duration-200 hover:bg-neutral-100 hover:text-zinc-900",
        active && "bg-neutral-100 text-zinc-900"
      )}
    >
      {label}
    </Link>
  )
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    startTransition(() => setMobileOpen(false))
  }, [pathname])

  useEffect(() => {
    if (!mobileOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = prev
    }
  }, [mobileOpen])

  return (
    <div className="flex min-h-screen flex-col bg-zinc-950 text-zinc-50">
      <header className="sticky top-0 z-40 h-16 shrink-0 border-b border-neutral-200 bg-white">
        <div className="mx-auto flex h-full max-w-6xl items-center justify-between gap-3 px-6">
          <div className="flex min-h-0 min-w-0 flex-1 items-center gap-4 lg:gap-6">
            <Logo variant="light" href="/" className="shrink-0" />
            <nav
              className="hidden min-w-0 flex-1 items-center gap-0.5 overflow-x-auto lg:flex"
              aria-label="Primary"
            >
              {links.map((l) => (
                <NavLink
                  key={l.href}
                  href={l.href}
                  label={l.label}
                  active={pathname === l.href || pathname.startsWith(`${l.href}/`)}
                />
              ))}
            </nav>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <HeaderAuthCluster />
            <button
              type="button"
              className="inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-neutral-200 bg-white text-zinc-800 transition-colors hover:bg-neutral-50 lg:hidden"
              aria-expanded={mobileOpen}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              onClick={() => setMobileOpen((v) => !v)}
            >
              {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>
      </header>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
          <button
            type="button"
            className="absolute inset-0 bg-black/50"
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute right-0 top-0 flex h-full w-[min(100%,20rem)] flex-col border-l border-neutral-200 bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-3">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                Menu
              </span>
              <button
                type="button"
                className="inline-flex size-9 items-center justify-center rounded-full text-zinc-600 hover:bg-neutral-100"
                onClick={() => setMobileOpen(false)}
                aria-label="Close"
              >
                <X className="size-5" />
              </button>
            </div>
            <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto p-3" aria-label="Mobile primary">
              {links.map((l) => (
                <NavLink
                  key={l.href}
                  href={l.href}
                  label={l.label}
                  active={pathname === l.href || pathname.startsWith(`${l.href}/`)}
                  onNavigate={() => setMobileOpen(false)}
                />
              ))}
            </nav>
            <div className="border-t border-neutral-200 p-3">
              <Link
                href="/login"
                className="block rounded-xl px-3 py-3 text-sm font-medium text-zinc-600 hover:bg-neutral-50 hover:text-zinc-900"
                onClick={() => setMobileOpen(false)}
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      ) : null}

      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  )
}
