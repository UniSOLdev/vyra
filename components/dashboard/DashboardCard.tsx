import { cn } from "@/lib/utils"

export function DashboardCard({
  title,
  action,
  children,
  className,
}: {
  title: string
  action?: React.ReactNode
  children: React.ReactNode
  className?: string
}) {
  return (
    <section
      className={cn(
        "rounded-3xl border border-white/10 bg-zinc-900/45 p-5 shadow-vyra-sm backdrop-blur-sm transition-[border-color,box-shadow,transform] duration-200 [transition-timing-function:var(--ease-vy-out)] hover:scale-[1.01] hover:border-white/12 sm:p-6",
        className
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h2 className="font-heading text-base font-medium tracking-tight text-white">
          {title}
        </h2>
        {action}
      </div>
      <div className="mt-4">{children}</div>
    </section>
  )
}
