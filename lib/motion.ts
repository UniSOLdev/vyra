/** Cinematic motion — short, ease-out, no bouncy overshoot. */
export const EASE_OUT = [0.22, 1, 0.36, 1] as const

export const DURATION = {
  fast: 0.15,
  base: 0.22,
  slow: 0.28,
} as const

export const fadeUp = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: DURATION.slow, ease: EASE_OUT },
}

export const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.04 },
  },
}

export const staggerItem = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: DURATION.base,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
}
