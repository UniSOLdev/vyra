"use client"

import { useEffect, useState, startTransition } from "react"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import { Logo } from "@/components/Logo"
import { AppSidebarNav } from "@/components/AppSidebarNav"
import { TopBarAuth } from "@/components/TopBarAuth"
import { SiteFooter } from "@/components/SiteFooter"

export function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    startTransition(() => setSidebarOpen(false))
  }, [pathname])

  useEffect(() => {
    if (!sidebarOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = prev
    }
  }, [sidebarOpen])

  return (
    <div className="flex min-h-screen bg-zinc-950 text-zinc-50">
      <aside
        className="fixed inset-y-0 left-0 z-30 hidden w-56 flex-col border-r border-neutral-200 bg-white lg:flex"
        aria-label="Sidebar"
      >
        <AppSidebarNav />
      </aside>

      {sidebarOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
          <button
            type="button"
            className="absolute inset-0 bg-black/50"
            aria-label="Close navigation"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="absolute left-0 top-0 flex h-full w-[min(100%,18rem)] flex-col border-r border-neutral-200 bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-neutral-200 px-3 py-3">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                Navigate
              </span>
              <button
                type="button"
                className="inline-flex size-9 items-center justify-center rounded-full text-zinc-600 hover:bg-neutral-100"
                onClick={() => setSidebarOpen(false)}
                aria-label="Close"
              >
                <X className="size-5" />
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-hidden">
              <AppSidebarNav onNavigate={() => setSidebarOpen(false)} />
            </div>
          </div>
        </div>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col lg:pl-56">
        <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-3 border-b border-neutral-200 bg-white px-4 lg:px-6">
          <button
            type="button"
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-neutral-200 text-zinc-800 transition-colors hover:bg-neutral-50 lg:hidden"
            aria-label="Open navigation"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="size-5" />
          </button>
          <Logo variant="light" href="/dashboard" className="shrink-0 text-sm sm:text-base" />
          <div className="min-w-0 flex-1" aria-hidden />
          <TopBarAuth />
        </header>

        <main className="min-w-0 flex-1">{children}</main>
        <SiteFooter />
      </div>
    </div>
  )
}
