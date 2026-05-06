"use client"

import { useCallback, useState } from "react"
import Link from "next/link"
import type { WorkoutDay, WorkoutPlan } from "@/lib/types"
import { saveWorkoutPlanRemoteAction } from "@/app/actions/vyra"
import { WorkoutCard } from "@/components/workouts/WorkoutCard"
import { CTAButton } from "@/components/CTAButton"

export function WorkoutsClient({
  initialPlan,
  hasProfile,
  sessionDate,
}: {
  initialPlan: WorkoutPlan | null
  hasProfile: boolean
  sessionDate: string
}) {
  const [plan, setPlan] = useState<WorkoutPlan | null>(initialPlan)

  const persist = useCallback(async (next: WorkoutPlan) => {
    setPlan(next)
    const res = await saveWorkoutPlanRemoteAction(next)
    if (res?.error) {
      console.error(res.error)
    }
  }, [])

  const updateDay = (index: number, next: WorkoutDay) => {
    if (!plan) return
    const days = [...plan.days]
    days[index] = next
    const updated: WorkoutPlan = { ...plan, days, updatedAt: new Date().toISOString() }
    void persist(updated)
  }

  if (!hasProfile || !plan) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center sm:px-6">
        <h1 className="font-heading text-2xl text-white sm:text-3xl">Build your plan first.</h1>
        <p className="mt-3 text-zinc-400">
          Onboarding creates a starter split based on your experience and weekly availability.
        </p>
        <CTAButton href="/onboarding" className="mt-6" variant="primary" size="lg">
          Start onboarding
        </CTAButton>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-8 sm:px-6 sm:py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl text-white">Workout planner</h1>
          <p className="mt-2 text-sm text-zinc-400">
            Edit sessions, log sets and RPE, and save automatically to your account.
          </p>
        </div>
        <Link href="/dashboard" className="text-sm text-vyra-lime hover:underline">
          Back to dashboard
        </Link>
      </div>
      <div className="space-y-6">
        {plan.days.map((day, idx) => (
          <WorkoutCard
            key={day.id}
            day={day}
            sessionDate={sessionDate}
            onChange={(d) => updateDay(idx, d)}
          />
        ))}
      </div>
    </div>
  )
}
