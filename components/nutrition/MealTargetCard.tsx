import { cn } from "@/lib/utils"

export function MealTargetCard({
  heading,
  children,
  className,
}: {
  heading: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-white/10 bg-zinc-900/40 p-4 sm:p-5",
        className
      )}
    >
      <h3 className="font-heading text-lg text-white">{heading}</h3>
      <div className="mt-3 text-sm text-zinc-400">{children}</div>
    </section>
  )
}
