import Link from "next/link"
import { cn } from "@/lib/utils"

export function Logo({
  className,
  href = "/",
}: {
  className?: string
  href?: string
}) {
  return (
    <Link
      href={href}
      className={cn(
        "font-heading tracking-[0.35em] text-sm font-semibold text-white sm:text-base",
        className
      )}
    >
      VYRA
    </Link>
  )
}
