"use client"

import { motion } from "framer-motion"
import {
  Activity,
  Apple,
  Brain,
  LineChart,
  ShoppingBag,
  Sparkles,
} from "lucide-react"
import { DURATION, EASE_OUT, staggerContainer, staggerItem } from "@/lib/motion"
import { cn } from "@/lib/utils"

const features = [
  {
    title: "Workouts",
    copy: "Sessions sized to your equipment and calendar.",
    icon: Activity,
  },
  {
    title: "Nutrition",
    copy: "Targets that anchor the day without noise.",
    icon: Apple,
  },
  {
    title: "Habits",
    copy: "Training, fuel, hydration — logged fast.",
    icon: Sparkles,
  },
  {
    title: "Progress",
    copy: "Trends you can trust. No vanity metrics.",
    icon: LineChart,
  },
  {
    title: "Coach",
    copy: "Clear notes. No cheerleader theater.",
    icon: Brain,
  },
  {
    title: "Supply",
    copy: "Gear that fits the routine you’re building.",
    icon: ShoppingBag,
  },
]

export function FeatureGrid({ compact }: { compact?: boolean }) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      className={cn(
        "grid gap-3",
        compact ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3"
      )}
    >
      {features.map((f) => (
        <motion.article
          key={f.title}
          variants={staggerItem}
          whileHover={{
            y: -3,
            scale: 1.02,
            transition: { duration: DURATION.fast, ease: EASE_OUT },
          }}
          className={cn(
            "group relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/45 shadow-vyra-sm transition-[border-color,box-shadow,transform] duration-200 [transition-timing-function:var(--ease-vy-out)]",
            "hover:border-vyra-lime/45 hover:shadow-vyra-glow",
            compact ? "p-4" : "p-6"
          )}
        >
          <div
            className={cn(
              "flex items-center justify-center rounded-xl border border-white/10 bg-black/50 text-vyra-lime transition-colors duration-200 group-hover:border-vyra-lime/35",
              compact ? "size-9" : "size-11"
            )}
          >
            <f.icon className={compact ? "size-4" : "size-5"} />
          </div>
          <h3
            className={cn(
              "mt-3 font-heading text-white",
              compact ? "text-base" : "text-lg"
            )}
          >
            {f.title}
          </h3>
          <p
            className={cn(
              "mt-1.5 leading-relaxed text-zinc-500",
              compact ? "text-xs sm:text-sm" : "text-sm"
            )}
          >
            {f.copy}
          </p>
        </motion.article>
      ))}
    </motion.div>
  )
}
