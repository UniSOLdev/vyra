import Link from "next/link"
import { cn } from "@/lib/utils"

export type CTVariant = "primary" | "secondary" | "ghost" | "outline"

type Props = {
  children: React.ReactNode
  className?: string
  href?: string
  variant?: CTVariant | "lime"
  size?: "default" | "lg"
  type?: "button" | "submit"
  onClick?: () => void
  disabled?: boolean
  title?: string
}

const base =
  "inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-full font-semibold outline-none will-change-transform transition-[transform,box-shadow,background-color,border-color,color,opacity] duration-200 [transition-timing-function:var(--ease-vy-out)] hover:scale-[1.02] active:scale-[0.99] active:translate-y-px disabled:pointer-events-none disabled:opacity-45 disabled:hover:scale-100 focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"

/** Dark surfaces: crisp white primary, ghost secondary */
const ghostStyle =
  "border border-transparent bg-transparent text-zinc-300 hover:bg-white/[0.06] hover:text-white"

const variants: Record<CTVariant, string> = {
  primary:
    "border border-white/10 bg-white text-zinc-950 shadow-vyra-md hover:bg-zinc-100 hover:shadow-vyra-lg",
  secondary: ghostStyle,
  ghost: ghostStyle,
  outline:
    "border border-white/18 bg-transparent text-white shadow-none hover:border-white/30 hover:bg-white/[0.04]",
}

const sizes = {
  default: "px-5 text-sm sm:min-h-11",
  lg: "min-h-12 px-7 text-sm sm:min-h-[3.25rem] sm:px-9 sm:text-base",
}

export function CTAButton({
  children,
  className,
  href,
  variant = "primary",
  size = "default",
  type = "button",
  onClick,
  disabled,
  title,
}: Props) {
  const v = variant === "lime" ? "primary" : variant
  const merged = cn(base, variants[v], sizes[size], className)

  if (href && !disabled) {
    return (
      <Link href={href} className={merged} onClick={onClick} title={title}>
        {children}
      </Link>
    )
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={merged}
      disabled={disabled}
      title={title}
    >
      {children}
    </button>
  )
}
