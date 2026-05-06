import { cn } from "@/lib/utils"

/** Standard horizontal padding + max width (design system container). */
export function PageContainer({
  children,
  className,
  narrow,
}: {
  children: React.ReactNode
  className?: string
  /** max-w-3xl for forms / focused flows */
  narrow?: boolean
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8",
        narrow && "max-w-3xl",
        className
      )}
    >
      {children}
    </div>
  )
}
