"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { DURATION, EASE_OUT } from "@/lib/motion"
import { CTAButton } from "@/components/CTAButton"
import { SectionHeader } from "@/components/SectionHeader"

function Shaker() {
  return (
    <div className="relative mx-auto flex aspect-[4/5] max-h-44 w-full max-w-[7rem] flex-col items-center justify-end overflow-hidden rounded-b-3xl rounded-t-lg bg-gradient-to-b from-zinc-100 to-white shadow-inner ring-1 ring-zinc-200/80">
      <div className="absolute inset-x-3 top-3 h-8 rounded-md bg-zinc-300/90" />
      <div className="mb-4 h-[42%] w-[3.25rem] rounded-b-2xl bg-gradient-to-b from-zinc-200 to-zinc-400/90" />
      <div className="absolute -top-2 h-4 w-14 rounded-full border border-zinc-300/80 bg-zinc-400" />
    </div>
  )
}

function ProteinTub() {
  return (
    <div className="relative mx-auto flex aspect-[4/5] max-h-44 w-full max-w-[7.75rem] flex-col overflow-hidden rounded-2xl bg-gradient-to-b from-zinc-100 to-white p-2 shadow-inner ring-1 ring-zinc-200/80">
      <div className="h-6 rounded-md bg-zinc-300/90" />
      <div className="mt-2 min-h-0 flex-1 rounded-xl border border-zinc-200/60 bg-gradient-to-br from-zinc-50 to-zinc-200/80" />
      <p className="mt-2 text-center text-[10px] font-semibold tracking-wide text-zinc-500">
        PROTEIN
      </p>
    </div>
  )
}

function Pouch() {
  return (
    <div className="relative mx-auto flex aspect-[4/5] max-h-44 w-full max-w-[8.25rem] flex-col overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-100 to-white p-3 shadow-inner ring-1 ring-zinc-200/80">
      <div className="h-2 w-10 rounded-full bg-vyra-lime/90" />
      <div className="mt-3 flex-1 space-y-2">
        <div className="h-2 rounded bg-zinc-300/90" />
        <div className="h-2 rounded bg-zinc-300/70" />
        <div className="h-2 w-2/3 rounded bg-zinc-300/50" />
      </div>
      <p className="mt-auto text-right text-[9px] text-zinc-500">CREATINE</p>
    </div>
  )
}

function Tee() {
  return (
    <div className="relative mx-auto flex aspect-[4/5] max-h-44 w-full max-w-[9rem] items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-100 to-white shadow-inner ring-1 ring-zinc-200/80">
      <div className="absolute inset-4 rounded-lg bg-gradient-to-b from-zinc-200 to-zinc-400/80" />
      <span className="relative z-10 font-heading text-xs tracking-[0.4em] text-zinc-500">
        VYRA
      </span>
    </div>
  )
}

const items: {
  key: string
  label: string
  tag?: string
  node: ReactNode
}[] = [
  { key: "shaker", label: "Shaker", tag: "Ships soon", node: <Shaker /> },
  {
    key: "protein",
    label: "Protein",
    tag: "Limited batch",
    node: <ProteinTub />,
  },
  { key: "pouch", label: "Creatine", node: <Pouch /> },
  { key: "tee", label: "Tee", node: <Tee /> },
]

export function ProductShowcase() {
  return (
    <section className="section-y relative overflow-hidden border-y border-zinc-200/70 bg-gradient-to-b from-zinc-50 via-white to-zinc-100 text-zinc-900">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(190,242,100,0.24),transparent_44%),radial-gradient(circle_at_92%_0%,rgba(0,0,0,0.035),transparent_40%)]" />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          variant="light"
          align="center"
          eyebrow="VYRA Supply"
          title="Curated drops for the training week."
          description="Fewer SKUs. Better defaults. Built to repeat."
        />
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: DURATION.slow, ease: EASE_OUT }}
          className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {items.map((it, i) => (
            <motion.div
              key={it.key}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: DURATION.base, ease: EASE_OUT }}
              className="group flex flex-col rounded-3xl bg-white/80 p-6 shadow-vyra-md ring-1 ring-zinc-200/80 transition-[box-shadow,transform] duration-200 [transition-timing-function:var(--ease-vy-out)] hover:-translate-y-1 hover:shadow-vyra-lg"
            >
              <div className="relative flex min-h-[11rem] flex-1 items-center justify-center overflow-hidden rounded-2xl bg-zinc-50/80 ring-1 ring-zinc-200/60">
                <div className="transition-transform duration-200 [transition-timing-function:var(--ease-vy-out)] group-hover:scale-[1.06]">
                  {it.node}
                </div>
                {it.tag ? (
                  <span className="absolute left-3 top-3 rounded-full border border-zinc-900/10 bg-white/95 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-zinc-800 shadow-vyra-sm">
                    {it.tag}
                  </span>
                ) : null}
              </div>
              <div className="mt-5 space-y-1 text-center">
                <p className="text-sm font-semibold tracking-tight text-zinc-900">
                  {it.label}
                </p>
                <Link
                  href="/shop"
                  className="inline-flex min-h-11 items-center justify-center text-xs font-medium text-zinc-500 underline-offset-4 transition-colors duration-200 [transition-timing-function:var(--ease-vy-out)] hover:text-zinc-900 hover:underline"
                >
                  View details
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
        <p className="mx-auto mt-10 max-w-xl text-center text-sm text-zinc-500">
          Apparel, bottles, gear, and supplements — staged as one supply lane.
        </p>
        <div className="mt-10 flex justify-center">
          <CTAButton href="/shop" variant="primary" size="lg">
            Shop all
          </CTAButton>
        </div>
      </div>
    </section>
  )
}
