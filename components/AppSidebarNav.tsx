"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { APP_NAV_GROUPS, isAppNavActive } from "@/lib/app-nav"
import { cn } from "@/lib/utils"

export function AppSidebarNav({
  onNavigate,
  className,
}: {
  onNavigate?: () => void
  className?: string
}) {
  const pathname = usePathname()

  return (
    <div className={cn("flex h-full min-h-0 flex-col", className)}>
      <nav
        className="min-h-0 flex-1 space-y-6 overflow-y-auto px-3 py-6"
        aria-label="App"
      >
        {APP_NAV_GROUPS.map((group) => (
          <div key={group.title}>
            <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-400">
              {group.title}
            </p>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const active = isAppNavActive(pathname, item.href)
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onNavigate}
                      className={cn(
                        "block rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-neutral-100 hover:text-zinc-950",
                        active && "bg-neutral-100 text-zinc-950"
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>
    </div>
  )
}
