import type { HTMLAttributes } from "react"
import { cn } from "@/lib/utils"

export function Skeleton({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-zinc-800/80 ring-1 ring-inset ring-white/5",
        className
      )}
      {...props}
    />
  )
}
