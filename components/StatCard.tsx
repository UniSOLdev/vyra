import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  className,
}: {
  label: string
  value: string
  hint?: string
  icon?: LucideIcon
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex min-h-[5.5rem] flex-col justify-between rounded-3xl border border-white/10 bg-zinc-900/55 p-4 shadow-vyra-sm backdrop-blur-sm transition-[border-color,box-shadow,transform] duration-200 [transition-timing-function:var(--ease-vy-out)] hover:scale-[1.02] hover:border-white/15 sm:min-h-[6rem] sm:p-5",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-caption">{label}</p>
          <p className="mt-2 font-heading text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            {value}
          </p>
          {hint ? (
            <p className="mt-1 text-sm leading-snug text-zinc-500">{hint}</p>
          ) : null}
        </div>
        {Icon ? (
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-black/45 text-vyra-lime">
            <Icon className="size-5" />
          </div>
        ) : null}
      </div>
    </div>
  )
}
