"use client"

import Link from "next/link"
import { useRef, useState } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Menu, X } from "lucide-react"
import { DURATION, EASE_OUT, staggerContainer, staggerItem } from "@/lib/motion"
import { Logo } from "@/components/Logo"
import { CTAButton } from "@/components/CTAButton"
import { PageContainer } from "@/components/PageContainer"
import { cn } from "@/lib/utils"
import { HeroAnimatedBg } from "@/components/landing/HeroAnimatedBg"
import { HeroPhoneMock } from "@/components/landing/HeroPhoneMock"
import { CommandCenterSection } from "@/components/landing/CommandCenterSection"
import { ProductShowcase } from "@/components/landing/ProductShowcase"
import { ProComingSoon } from "@/components/landing/ProComingSoon"
import { TrustRow } from "@/components/landing/TrustRow"
import { LandingFooter } from "@/components/landing/LandingFooter"

const nav = [
  { href: "/dashboard", label: "App" },
  { href: "/coach", label: "Coach" },
  { href: "/shop", label: "Shop" },
  { href: "/shop?category=Supplements", label: "Supplements" },
  { href: "/about", label: "About" },
]

const aboutBullets = [
  "Daily anchors you can repeat without thinking.",
  "Habits sized to a real calendar.",
  "Training with intent — not volume for its own sake.",
]

function SilhouettePanel() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: DURATION.slow, ease: EASE_OUT }}
      className="relative min-h-[240px] overflow-hidden rounded-3xl bg-gradient-to-br from-zinc-900 via-black to-zinc-950 shadow-vyra-md ring-1 ring-white/[0.08] sm:min-h-[280px]"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_100%,rgba(190,242,100,0.12),transparent_55%)]" />
      <div className="absolute bottom-0 left-1/2 h-[90%] w-40 -translate-x-1/2 rounded-t-full bg-gradient-to-t from-zinc-800/80 to-transparent blur-sm" />
      <div className="glass-panel absolute bottom-8 left-6 rounded-2xl px-4 py-3 shadow-vyra-sm ring-1 ring-white/[0.06] sm:left-8">
        <p className="text-caption">VYRA</p>
        <p className="mt-2 font-heading text-sm text-white">Tank</p>
      </div>
      <div className="glass-panel absolute right-6 top-8 w-24 rounded-2xl p-3 shadow-vyra-sm ring-1 ring-white/[0.06] sm:right-8">
        <div className="aspect-square rounded-xl bg-gradient-to-b from-zinc-800 to-black" />
        <p className="mt-2 text-center text-[10px] text-zinc-500">Shaker</p>
      </div>
    </motion.div>
  )
}

export function LandingPage() {
  const [menu, setMenu] = useState(false)
  const heroVisualRef = useRef<HTMLDivElement | null>(null)
  const { scrollYProgress } = useScroll({
    target: heroVisualRef,
    offset: ["start end", "end start"],
  })
  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, -40])

  return (
    <div className="bg-zinc-950 text-zinc-50">
      <div className="relative overflow-hidden">
        <HeroAnimatedBg />
        <header className="relative z-20 border-b border-white/[0.06] bg-zinc-950/75 backdrop-blur-xl">
          <PageContainer className="flex items-center justify-between gap-4 py-4 sm:py-5">
            <Logo />
            <nav className="hidden items-center gap-1 text-sm tracking-wide text-zinc-400 xl:flex">
              {nav.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  className="min-h-11 rounded-full px-4 py-2.5 transition-colors duration-200 [transition-timing-function:var(--ease-vy-out)] hover:text-white"
                >
                  {n.label}
                </Link>
              ))}
            </nav>
            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                href="/login"
                className="hidden min-h-11 items-center px-3 text-sm tracking-wide text-zinc-400 transition-colors duration-200 hover:text-white md:inline-flex"
              >
                Sign in
              </Link>
              <CTAButton href="/onboarding" variant="primary" size="default">
                Start your plan
              </CTAButton>
              <button
                type="button"
                className="inline-flex size-11 min-h-11 min-w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-white transition-colors duration-200 hover:bg-white/10 xl:hidden"
                aria-expanded={menu}
                aria-label={menu ? "Close menu" : "Open menu"}
                onClick={() => setMenu((m) => !m)}
              >
                {menu ? <X className="size-5" /> : <Menu className="size-5" />}
              </button>
            </div>
          </PageContainer>
          {menu ? (
            <div className="border-t border-white/10 bg-zinc-950/95 backdrop-blur-xl xl:hidden">
              <PageContainer className="flex flex-col gap-1 py-4">
                {nav.map((n) => (
                  <Link
                    key={n.href}
                    href={n.href}
                    onClick={() => setMenu(false)}
                    className="min-h-12 rounded-xl px-4 py-3 text-sm tracking-wide text-zinc-300 transition-colors hover:bg-white/5 hover:text-white"
                  >
                    {n.label}
                  </Link>
                ))}
                <Link
                  href="/login"
                  onClick={() => setMenu(false)}
                  className="min-h-12 rounded-xl px-4 py-3 text-sm text-zinc-500 hover:text-white"
                >
                  Sign in
                </Link>
              </PageContainer>
            </div>
          ) : null}
        </header>

        <section className="relative z-10 pb-24 pt-10 sm:pb-28 sm:pt-12 md:pb-32 md:pt-14">
          <PageContainer>
            <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
              <motion.div
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: DURATION.slow + 0.04, ease: EASE_OUT }}
              >
                <p className="text-caption text-vyra-lime/85">VYRA</p>
                <div className="relative mt-6">
                  <motion.div
                    aria-hidden
                    className="pointer-events-none absolute -inset-x-4 -inset-y-6 sm:-inset-x-6 sm:-inset-y-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.12, duration: 0.8, ease: EASE_OUT }}
                  >
                    <motion.div
                      className="absolute left-1/2 top-1/2 h-[108%] w-[108%] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-[3.5rem] bg-[radial-gradient(ellipse_at_center,oklch(0.9_0.24_128/0.2),transparent_68%)] blur-2xl"
                      animate={{ opacity: [0.35, 0.6, 0.35], scale: [1, 1.04, 1] }}
                      transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    />
                  </motion.div>
                  <h1 className="text-hero-xl relative text-white">
                    The performance operating system.
                  </h1>
                </div>
                <p className="text-body-lg mt-8 max-w-lg sm:mt-10">
                  Training. Fuel. Habits. One disciplined surface.
                </p>
                <div className="mt-10 flex flex-col gap-3 sm:mt-12 sm:flex-row sm:flex-wrap sm:gap-4">
                  <CTAButton href="/signup" variant="primary" size="lg">
                    Create account
                  </CTAButton>
                  <CTAButton href="/login" variant="outline" size="lg">
                    Sign in
                  </CTAButton>
                  <CTAButton href="/shop" variant="ghost" size="lg">
                    Shop essentials
                  </CTAButton>
                </div>
                <div className="mt-14 sm:mt-16">
                  <TrustRow />
                </div>
              </motion.div>

              <motion.div
                ref={heroVisualRef}
                style={{ y: parallaxY }}
                className="relative flex flex-col gap-10 will-change-transform"
              >
                <HeroPhoneMock />
                <SilhouettePanel />
              </motion.div>
            </div>
          </PageContainer>
        </section>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: DURATION.slow, ease: EASE_OUT }}
      >
        <CommandCenterSection />
      </motion.div>

      <ProductShowcase />

      <section
        id="about"
        className="section-y border-t border-white/10 bg-zinc-950"
      >
        <PageContainer>
          <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
            <motion.div
              initial={{ opacity: 0, scale: 0.985 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: DURATION.slow, ease: EASE_OUT }}
              className="relative min-h-[320px] overflow-hidden rounded-3xl bg-gradient-to-br from-zinc-900 to-black shadow-vyra-lg ring-1 ring-white/[0.07] sm:min-h-[380px]"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(190,242,100,0.12),transparent_50%)]" />
              <div className="absolute inset-x-10 bottom-0 h-4/5 rounded-t-[3rem] bg-gradient-to-t from-zinc-800/90 to-transparent" />
              <div className="glass-panel absolute left-6 top-6 rounded-2xl px-4 py-3 shadow-vyra-sm ring-1 ring-white/[0.06] sm:left-8 sm:top-8">
                <p className="text-caption text-zinc-500">Session</p>
                <p className="mt-1 text-sm text-zinc-400">Evening pull · RPE 7</p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: DURATION.slow, ease: EASE_OUT }}
            >
              <p className="text-caption">Standard</p>
              <h2
                className={cn(
                  "mt-5 font-heading text-[clamp(2rem,4vw+1rem,3.75rem)] font-black leading-[1.05] tracking-tighter text-white"
                )}
              >
                BUILT FOR PEOPLE
                <br />
                WHO SHOW UP.
              </h2>
              <motion.ul
                variants={staggerContainer}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-40px" }}
                className="mt-10 list-none space-y-6 sm:mt-12"
              >
                {aboutBullets.map((line) => (
                  <motion.li
                    key={line}
                    variants={staggerItem}
                    className="flex gap-3 text-lg leading-snug text-zinc-400 sm:text-xl"
                  >
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-vyra-lime shadow-[0_0_12px_var(--color-vyra-lime)]" />
                    <span>{line}</span>
                  </motion.li>
                ))}
              </motion.ul>
              <p className="text-body mt-10 max-w-md text-sm sm:mt-12 sm:text-base">
                Energy and focus from repetition you own.
              </p>
            </motion.div>
          </div>
        </PageContainer>
      </section>

      <section className="section-y border-t border-white/10 bg-black">
        <PageContainer>
          <ProComingSoon />
        </PageContainer>
      </section>

      <LandingFooter />
    </div>
  )
}
