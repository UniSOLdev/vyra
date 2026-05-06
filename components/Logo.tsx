import Link from "next/link"
import { cn } from "@/lib/utils"

export function Logo({
  className,
  href = "/",
  variant = "dark",
}: {
  className?: string
  href?: string
  /** dark: light-on-dark surfaces; light: dark-on-light (e.g. app header). */
  variant?: "dark" | "light"
}) {
  return (
    <Link
      href={href}
      className={cn(
        "font-heading shrink-0 tracking-[0.35em] text-sm font-semibold sm:text-base",
        variant === "dark" && "text-white",
        variant === "light" && "text-zinc-900",
        className
      )}
    >
      VYRA
    </Link>
  )
}
