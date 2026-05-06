"use client"

import { useEffect, useState } from "react"
import { buildCoachFeedback, type CoachInsight } from "@/lib/coach"
import { getDailyLogs, getUserProfile, getWorkoutPlan } from "@/lib/storage"
import { CoachFeedback } from "@/components/coach/CoachFeedback"
import { PageContainer } from "@/components/PageContainer"

const loadingInsight: CoachInsight = {
  title: "Syncing your week…",
  bullets: ["Pulling your latest check-ins from this device."],
  tone: "steady",
  whyNote:
    "Placeholder state before your local profile and logs load in the client.",
}

export function CoachClient() {
  const [insight, setInsight] = useState<CoachInsight>(loadingInsight)

  useEffect(() => {
    const refresh = () => {
      window.setTimeout(() => {
        setInsight(
          buildCoachFeedback({
            profile: getUserProfile(),
            logs: getDailyLogs(),
            plan: getWorkoutPlan(),
          })
        )
      }, 0)
    }
    refresh()
    window.addEventListener("vyra-storage", refresh)
    return () => window.removeEventListener("vyra-storage", refresh)
  }, [])

  return (
    <PageContainer narrow className="space-y-8 pb-16 pt-8 md:pb-24 md:pt-12 lg:pb-28">
      <div>
        <h1 className="font-heading text-3xl font-extrabold tracking-tighter text-white sm:text-4xl">
          Coach
        </h1>
        <p className="mt-3 max-w-prose text-sm leading-relaxed text-zinc-500 sm:text-base">
          Direct read from what you log here. No hype. No medical claims.
        </p>
      </div>
      <CoachFeedback insight={insight} />
    </PageContainer>
  )
}
