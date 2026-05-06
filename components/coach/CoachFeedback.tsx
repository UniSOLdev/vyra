"use client"

import type { CoachInsight } from "@/lib/coach"
import { CTAButton } from "@/components/CTAButton"

export function CoachFeedback({ insight }: { insight: CoachInsight }) {
  return (
    <div className="glass-panel space-y-0 rounded-3xl shadow-vyra-lg ring-1 ring-white/[0.06]">
      <div className="border-b border-white/[0.08] p-6 sm:p-8">
        <p className="text-caption text-zinc-500">Coach read</p>
        <h2 className="mt-4 text-section-title">{insight.title}</h2>
      </div>
      <div className="border-b border-white/[0.08] px-6 py-6 sm:px-8 sm:py-7">
        <ul className="space-y-4 text-base leading-relaxed text-zinc-400">
          {insight.bullets.map((b, i) => (
            <li key={i} className="flex gap-3">
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-vyra-lime shadow-[0_0_10px_var(--color-vyra-lime)]" />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="px-6 py-5 sm:px-8">
        <details className="group rounded-2xl border border-white/[0.08] bg-black/35 px-4 py-3 text-sm transition-[border-color] duration-200 [transition-timing-function:var(--ease-vy-out)] open:border-white/15 open:bg-black/45">
          <summary className="cursor-pointer list-none font-medium text-zinc-300 outline-none [&::-webkit-details-marker]:hidden">
            <span className="flex items-center justify-between gap-2">
              Why this note
              <span className="text-xs font-normal text-zinc-500 transition-colors group-open:text-zinc-400">
                {/** indicator */}
                <span className="inline group-open:hidden">Show</span>
                <span className="hidden group-open:inline">Hide</span>
              </span>
            </span>
          </summary>
          <p className="mt-3 border-t border-white/[0.06] pt-3 text-sm leading-relaxed text-zinc-500">
            {insight.whyNote}
          </p>
        </details>
      </div>
      <div className="border-t border-white/[0.08] p-6 sm:p-8">
        <p className="text-xs leading-relaxed text-zinc-500">
          Mock read for MVP — not medical guidance. A human coach layer ships
          with Pro.
        </p>
        <CTAButton
          href="/onboarding"
          variant="outline"
          size="lg"
          className="mt-6 w-full justify-center sm:w-auto"
        >
          VYRA Pro — waitlist
        </CTAButton>
      </div>
    </div>
  )
}
