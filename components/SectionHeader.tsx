import { cn } from "@/lib/utils"

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
  className,
  variant = "dark",
}: {
  eyebrow?: string
  title: string
  description?: string
  align?: "left" | "center"
  className?: string
  /** `light` for pale section backgrounds */
  variant?: "dark" | "light"
}) {
  const light = variant === "light"
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {eyebrow ? (
        <p
          className={cn(
            "text-xs font-semibold uppercase tracking-[0.22em]",
            light ? "text-zinc-500" : "text-vyra-lime/85"
          )}
        >
          {eyebrow}
        </p>
      ) : null}
      <h2
        className={cn(
          "mt-4 font-heading font-extrabold tracking-tighter text-pretty",
          light ? "text-zinc-950" : "text-white",
          "text-[clamp(1.875rem,2.75vw+0.85rem,3.25rem)] leading-[1.08]"
        )}
      >
        {title}
      </h2>
      {description ? (
        <p
          className={cn(
            "mt-5 max-w-prose text-pretty sm:mt-6",
            light
              ? "text-base leading-relaxed text-zinc-600 sm:text-lg"
              : "text-base leading-relaxed text-zinc-500 sm:text-lg"
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  )
}
