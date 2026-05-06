"use client"

import { motion } from "framer-motion"

export function HeroAnimatedBg() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute -left-1/4 top-0 h-[120%] w-[70%] rounded-full bg-[radial-gradient(ellipse_at_center,oklch(0.9_0.24_128/0.16),transparent_68%)] blur-3xl"
        animate={{ opacity: [0.4, 0.72, 0.4], scale: [1, 1.07, 1] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -right-1/4 bottom-0 h-[90%] w-[60%] rounded-full bg-[radial-gradient(ellipse_at_center,oklch(0.85_0.08_260/0.12),transparent_65%)] blur-3xl"
        animate={{ opacity: [0.32, 0.58, 0.32], x: [0, 12, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute left-1/2 top-[10%] h-[55%] w-[85%] max-w-3xl -translate-x-1/2 rounded-[100%] bg-[radial-gradient(ellipse_at_center,oklch(0.9_0.24_128/0.12),transparent_70%)] blur-3xl"
        animate={{
          opacity: [0.25, 0.5, 0.25],
          scaleX: [1, 1.05, 1],
        }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(255,255,255,0.06),transparent)]" />
    </div>
  )
}
