"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import type { WorkoutDay, WorkoutPlan } from "@/lib/types"
import { getUserProfile, getWorkoutPlan, saveWorkoutPlan } from "@/lib/storage"
import { WorkoutCard } from "@/components/workouts/WorkoutCard"
import { CTAButton } from "@/components/CTAButton"

export function WorkoutsClient() {
  const [plan, setPlan] = useState<WorkoutPlan | null>(null)
  const [hasProfile, setHasProfile] = useState(false)

  const load = () => {
    setPlan(getWorkoutPlan())
    setHasProfile(!!getUserProfile())
  }

  useEffect(() => {
    const fn = () => queueMicrotask(() => load())
    queueMicrotask(() => load())
    window.addEventListener("vyra-storage", fn)
    return () => window.removeEventListener("vyra-storage", fn)
  }, [])

  const updateDay = (index: number, next: WorkoutDay) => {
    if (!plan) return
    const days = [...plan.days]
    days[index] = next
    const updated: WorkoutPlan = { ...plan, days, updatedAt: new Date().toISOString() }
    saveWorkoutPlan(updated)
    window.dispatchEvent(new Event("vyra-storage"))
    setPlan(updated)
  }

  if (!hasProfile || !plan) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center sm:px-6">
        <h1 className="font-heading text-2xl text-white sm:text-3xl">
          Build your plan first.
        </h1>
        <p className="mt-3 text-zinc-400">
          Onboarding creates a starter split based on your experience and weekly
          availability.
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
            Edit sessions, check sets complete, and save automatically.
          </p>
        </div>
        <Link href="/dashboard" className="text-sm text-vyra-lime hover:underline">
          Back to dashboard
        </Link>
      </div>
      <div className="space-y-6">
        {plan.days.map((day, idx) => (
          <WorkoutCard key={day.id} day={day} onChange={(d) => updateDay(idx, d)} />
        ))}
      </div>
    </div>
  )
}
