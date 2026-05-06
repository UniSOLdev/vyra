"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import {
  calculateConsistencyScore,
  calculateProteinTarget,
  calculateStepsTarget,
  calculateStreak,
  calculateWaterTargetMl,
  weeklyHabitCompletionPct,
} from "@/lib/fitness"
import { HABIT_IDS } from "@/lib/habits"
import { recommendProducts } from "@/lib/recommendations"
import {
  getDailyLogs,
  getUserProfile,
  getWorkoutPlan,
} from "@/lib/storage"
import type { DailyLogs, UserProfile, WorkoutPlan } from "@/lib/types"
import { CTAButton } from "@/components/CTAButton"
import { PageContainer } from "@/components/PageContainer"
import { StatCard } from "@/components/StatCard"
import { DashboardCard } from "@/components/dashboard/DashboardCard"
import { HabitMiniList } from "@/components/dashboard/HabitMiniList"
import { RecommendedEssentials } from "@/components/dashboard/RecommendedEssentials"
import { Activity, Apple, Calendar, Droplets, Footprints, Flame } from "lucide-react"

const goalLabel: Record<UserProfile["goal"], string> = {
  lose_fat: "Lose fat",
  build_muscle: "Build muscle",
  improve_cardio: "Improve cardio",
  maintain: "Maintain",
  general_wellness: "General wellness",
}

export function DashboardClient() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [plan, setPlan] = useState<WorkoutPlan | null>(null)
  const [logs, setLogs] = useState<DailyLogs>({})

  const sync = () => {
    setProfile(getUserProfile())
    setPlan(getWorkoutPlan())
    setLogs(getDailyLogs())
  }

  useEffect(() => {
    const run = () => {
      window.setTimeout(() => sync(), 0)
    }
    run()
    const fn = () => window.setTimeout(() => sync(), 0)
    window.addEventListener("vyra-storage", fn)
    return () => {
      window.removeEventListener("vyra-storage", fn)
    }
  }, [])

  const consistency = useMemo(
    () => calculateConsistencyScore(logs, [...HABIT_IDS]),
    [logs]
  )
  const streak = useMemo(() => calculateStreak(logs), [logs])
  const weekPct = useMemo(
    () => weeklyHabitCompletionPct(logs, [...HABIT_IDS]),
    [logs]
  )
  const essentials = useMemo(() => recommendProducts(profile, 4), [profile])

  const protein = profile ? calculateProteinTarget(profile) : 155
  const waterMl = profile ? calculateWaterTargetMl(profile) : 2950
  const steps = profile ? calculateStepsTarget(profile) : 9000
  const today = plan?.days?.[0]
  const planDays = plan?.days?.length ?? 0

  if (!profile) {
    return (
      <PageContainer narrow className="flex flex-col items-center py-20 text-center sm:py-28">
        <div className="glass-panel max-w-md rounded-3xl p-10 shadow-vyra-lg ring-1 ring-white/[0.07]">
          <p className="text-caption">VYRA</p>
          <h1 className="mt-4 text-section-title">Your week starts with setup.</h1>
          <p className="text-body mt-4">
            Four minutes. Honest inputs. Targets and a starter plan on this
            device.
          </p>
          <CTAButton
            href="/onboarding"
            className="mt-8 w-full justify-center"
            variant="primary"
            size="lg"
          >
            Start your plan
          </CTAButton>
        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer className="space-y-10 py-10 sm:space-y-12 sm:py-14 md:space-y-14 md:py-16">
      <header className="space-y-2">
        <p className="text-sm font-medium text-zinc-500">Welcome back.</p>
        <h1 className="text-section-title">{goalLabel[profile.goal]}</h1>
        <p className="text-body max-w-xl text-sm sm:text-base">
          Train clean. Live sharp. Hold the line on basics this week.
        </p>
      </header>

      <section className="glass-panel overflow-hidden rounded-3xl shadow-vyra-lg ring-1 ring-white/[0.07]">
        <div className="grid gap-10 p-7 sm:p-9 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-center lg:gap-12">
          <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-center sm:gap-12">
            <div className="relative grid size-44 shrink-0 place-content-center sm:size-48">
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background: `conic-gradient(var(--color-vyra-lime) ${consistency}%, rgba(255,255,255,0.06) 0)`,
                }}
              />
              <div className="relative z-10 grid size-[7.25rem] place-content-center rounded-full bg-zinc-950 text-center ring-1 ring-white/12 sm:size-32">
                <div className="mb-1 flex flex-wrap items-center justify-center gap-2">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-zinc-500">
                    Today
                  </p>
                  <span className="rounded-full border border-white/10 bg-white/[0.06] px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-zinc-400">
                    {streak}d streak
                  </span>
                </div>
                <p className="font-heading text-4xl font-black tracking-tighter text-white sm:text-5xl">
                  {consistency}%
                </p>
                <p className="text-[10px] text-zinc-600">Consistency</p>
              </div>
            </div>
            <div className="min-w-0 flex-1 space-y-2 text-center sm:text-left">
              <p className="text-caption">Session</p>
              <p className="font-heading text-xl font-bold text-white sm:text-2xl">
                {today?.name ?? "No session"}
              </p>
              <p className="text-sm text-zinc-500">
                {today
                  ? `${today.exercises.length} movements in plan`
                  : "Open planner to add work."}
              </p>
              <Link
                href="/workouts"
                className="mt-2 inline-flex min-h-11 items-center text-sm font-semibold text-vyra-lime transition-opacity duration-200 hover:opacity-90"
              >
                Open planner →
              </Link>
            </div>
          </div>
          <div className="grid gap-3 rounded-3xl border border-white/10 bg-black/45 p-5 ring-1 ring-white/[0.05]">
            {[
              { label: "Protein", value: `${protein} g`, icon: Apple },
              {
                label: "Water",
                value: `${(Math.round(waterMl / 100) / 10).toFixed(1)} L`,
                icon: Droplets,
              },
              {
                label: "Steps",
                value: steps.toLocaleString(),
                icon: Footprints,
              },
            ].map((row) => (
              <div
                key={row.label}
                className="flex min-h-12 items-center justify-between gap-3 rounded-2xl px-3 py-2"
              >
                <span className="flex items-center gap-2 text-sm font-medium text-zinc-400">
                  <row.icon className="size-4 text-vyra-lime" />
                  {row.label}
                </span>
                <span className="font-heading text-base font-bold tracking-tight text-white sm:text-lg">
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Streak"
          value={`${streak}d`}
          hint="Training logged."
          icon={Activity}
        />
        <StatCard
          label="This week"
          value={`${weekPct}%`}
          hint="Habit completion mix."
          icon={Flame}
        />
        <StatCard
          label="Plan days"
          value={`${planDays}`}
          hint="Per your onboarding split."
          icon={Calendar}
        />
        <StatCard
          label="Protein target"
          value={`${protein}g`}
          hint="Daily anchor."
          icon={Apple}
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <DashboardCard
          title="Today’s training"
          action={
            <Link
              href="/workouts"
              className="inline-flex min-h-10 items-center text-xs font-medium text-vyra-lime hover:underline"
            >
              Planner
            </Link>
          }
        >
          {today ? (
            <div>
              <p className="text-lg font-medium text-white">{today.name}</p>
              <p className="mt-1 text-sm text-zinc-500">
                {today.exercises.length} movements in queue.
              </p>
            </div>
          ) : (
            <p className="text-sm text-zinc-500">No plan saved.</p>
          )}
        </DashboardCard>

        <DashboardCard
          title="Habits"
          action={
            <Link
              href="/habits"
              className="inline-flex min-h-10 items-center text-xs font-medium text-vyra-lime hover:underline"
            >
              All
            </Link>
          }
        >
          <HabitMiniList logs={logs} />
        </DashboardCard>

        <DashboardCard
          title="Progress"
          action={
            <Link
              href="/progress"
              className="inline-flex min-h-10 items-center text-xs font-medium text-vyra-lime hover:underline"
            >
              Log
            </Link>
          }
        >
          <p className="text-sm text-zinc-400">
            Numbers optional. Trend beats snapshots.
          </p>
        </DashboardCard>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <DashboardCard
          title="Coach"
          action={
            <Link
              href="/coach"
              className="inline-flex min-h-10 items-center text-xs font-medium text-vyra-lime hover:underline"
            >
              Open
            </Link>
          }
        >
          <p className="text-sm text-zinc-400">
            Read for the week — consistency, fuel, hydration.
          </p>
        </DashboardCard>
        <DashboardCard
          title="VYRA Supply"
          action={
            <Link
              href="/shop"
              className="inline-flex min-h-10 items-center text-xs font-medium text-vyra-lime hover:underline"
            >
              Shop
            </Link>
          }
        >
          <RecommendedEssentials products={essentials} />
        </DashboardCard>
      </div>
    </PageContainer>
  )
}
