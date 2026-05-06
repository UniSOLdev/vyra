"use client"

import { motion } from "framer-motion"
import { CommandCenterMock } from "@/components/landing/CommandCenterMock"
import { FeatureGrid } from "@/components/landing/FeatureGrid"
import { DURATION, EASE_OUT } from "@/lib/motion"

const lines = [
  "Sessions, fuel, and habits on one disciplined surface.",
  "Execute the week without living inside menus.",
  "Glance, adjust, move on.",
]

export function CommandCenterSection() {
  return (
    <section className="section-y border-t border-white/10 bg-gradient-to-b from-zinc-950 via-zinc-950 to-black">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: DURATION.slow, ease: EASE_OUT }}
            className="space-y-8 lg:sticky lg:top-28"
          >
            <div>
              <p className="text-caption text-vyra-lime/85">Command center</p>
              <h2 className="mt-5 text-section-title">One surface. Full week.</h2>
            </div>
            <div className="max-w-md space-y-5">
              {lines.map((line) => (
                <p
                  key={line}
                  className="text-base font-medium leading-relaxed text-zinc-400 sm:text-lg"
                >
                  {line}
                </p>
              ))}
            </div>
          </motion.div>
          <CommandCenterMock />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: DURATION.slow, ease: EASE_OUT }}
          className="mt-20 border-t border-white/[0.06] pt-16 lg:mt-24 lg:pt-20"
        >
          <p className="text-caption text-zinc-500">Modules</p>
          <div className="mt-6">
            <FeatureGrid compact />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
