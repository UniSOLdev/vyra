"use client"

import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  upsertDailyMetricsAction,
  upsertWorkoutDayCompletionAction,
} from "@/app/actions/vyra"
import {
  calculateConsistencyScore,
  calculateProteinTarget,
  calculateStepsTarget,
  calculateStreak,
  calculateWaterTargetMl,
  weeklyHabitCompletionPct,
} from "@/lib/fitness"
import { recommendProducts } from "@/lib/recommendations"
import { HABIT_IDS } from "@/lib/habits"
import type { DailyLogs, UserProfile } from "@/lib/types"
import { todayDisciplineScore } from "@/lib/discipline"
import { CTAButton } from "@/components/CTAButton"
import { PageContainer } from "@/components/PageContainer"
import { StatCard } from "@/components/StatCard"
import { DashboardCard } from "@/components/dashboard/DashboardCard"
import { HabitMiniList } from "@/components/dashboard/HabitMiniList"
import { RecommendedEssentials } from "@/components/dashboard/RecommendedEssentials"
import { Input } from "@/components/ui/input"
import { Activity, Apple, Calendar, Droplets, Footprints, Flame } from "lucide-react"

const goalLabel: Record<UserProfile["goal"], string> = {
  lose_fat: "Lose fat",
  build_muscle: "Build muscle",
  improve_cardio: "Improve cardio",
  maintain: "Maintain",
  general_wellness: "General wellness",
}

type WeeklyScore = {
  score: number
  workout_completion_pct: number
  protein_hit_pct: number
  water_hit_pct: number
  steps_hit_pct: number
  habit_week_pct?: number
}

function Ring({
  value,
  label,
  sub,
}: {
  value: number
  label: string
  sub: string
}) {
  const pct = Math.min(100, Math.max(0, Math.round(value)))
  return (
    <div className="relative grid size-36 shrink-0 place-content-center sm:size-40">
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: `conic-gradient(var(--color-vyra-lime) ${pct}%, rgba(255,255,255,0.06) 0)`,
        }}
      />
      <div className="relative z-10 grid size-[5.75rem] place-content-center rounded-full bg-zinc-950 text-center ring-1 ring-white/12 sm:size-24">
        <p className="text-[9px] font-semibold uppercase tracking-wide text-zinc-500">{label}</p>
        <p className="font-heading text-2xl font-black tracking-tighter text-white sm:text-3xl">{pct}%</p>
        <p className="text-[9px] text-zinc-600">{sub}</p>
      </div>
    </div>
  )
}

export function DashboardClient(props: {
  today: string
  initialProfile: UserProfile | null
  initialMetrics: { protein_g: number; water_l: number; steps: number }
  initialPlan: import("@/lib/types").WorkoutPlan | null
  planWeekStart: string
  todayPlanDayId: string | null
  todayPlanDayName: string | null
  todayPlanExerciseCount: number
  todayWorkoutDone: boolean
  initialWeeklyScore: WeeklyScore | null
  habitLogs: DailyLogs
}) {
  const router = useRouter()
  const [profile] = useState<UserProfile | null>(props.initialProfile)
  const [metrics, setMetrics] = useState(props.initialMetrics)
  const [workoutDone, setWorkoutDone] = useState(props.todayWorkoutDone)
  const [, startTransition] = useTransition()
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const consistency = useMemo(
    () => calculateConsistencyScore(props.habitLogs, [...HABIT_IDS]),
    [props.habitLogs]
  )
  const streak = useMemo(() => calculateStreak(props.habitLogs), [props.habitLogs])
  const weekPct = useMemo(
    () => weeklyHabitCompletionPct(props.habitLogs, [...HABIT_IDS]),
    [props.habitLogs]
  )

  const proteinTarget = profile
    ? profile.targetProteinG ?? calculateProteinTarget(profile)
    : 155
  const waterLTarget = profile
    ? profile.targetWaterL ?? calculateWaterTargetMl(profile) / 1000
    : 2.95
  const stepsTarget = profile ? profile.targetSteps ?? calculateStepsTarget(profile) : 9000

  const essentials = useMemo(() => recommendProducts(profile, 4), [profile])
  const todayDiscipline = useMemo(() => {
    const proteinHit = metrics.protein_g >= proteinTarget
    const waterHit = metrics.water_l >= waterLTarget
    const stepsHit = metrics.steps >= stepsTarget
    return todayDisciplineScore({
      workoutDone,
      proteinHit,
      waterHit,
      stepsHit,
    })
  }, [metrics, proteinTarget, waterLTarget, stepsTarget, workoutDone])

  const scheduleMetricSave = useCallback(
    (next: { protein_g: number; water_l: number; steps: number }) => {
      if (saveTimer.current) clearTimeout(saveTimer.current)
      saveTimer.current = setTimeout(() => {
        startTransition(async () => {
          const res = await upsertDailyMetricsAction({
            metricDate: props.today,
            proteinG: next.protein_g,
            waterL: next.water_l,
            steps: next.steps,
          })
          if (!res?.error) router.refresh()
        })
      }, 450)
    },
    [props.today, router, startTransition]
  )

  useEffect(() => {
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current)
    }
  }, [])

  const updateMetric = (patch: Partial<typeof metrics>) => {
    setMetrics((m) => {
      const next = { ...m, ...patch }
      scheduleMetricSave(next)
      return next
    })
  }

  const toggleWorkout = async () => {
    if (!props.todayPlanDayId) return
    const next = !workoutDone
    setWorkoutDone(next)
    const res = await upsertWorkoutDayCompletionAction({
      completionDate: props.today,
      dayId: props.todayPlanDayId,
      completed: next,
    })
    if (res?.error) setWorkoutDone(!next)
    router.refresh()
  }

  if (!profile) {
    return (
      <PageContainer narrow className="flex flex-col items-center py-20 text-center sm:py-28">
        <div className="glass-panel max-w-md rounded-3xl p-10 shadow-vyra-lg ring-1 ring-white/[0.07]">
          <p className="text-caption">VYRA</p>
          <h1 className="mt-4 text-section-title">Dial in your profile.</h1>
          <p className="text-body mt-4">
            Sign in, choose a username, and run onboarding once. Your data syncs to your account.
          </p>
          <CTAButton href="/onboarding" className="mt-8 w-full justify-center" variant="primary" size="lg">
            Start onboarding
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
        <div className="grid gap-10 p-7 sm:p-9 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-center lg:gap-12">
          <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-center sm:gap-12">
            <div className="flex flex-wrap items-center justify-center gap-6">
              <Ring value={todayDiscipline} label="Today" sub="Discipline" />
              <Ring
                value={props.initialWeeklyScore?.score ?? 0}
                label="Week"
                sub="Discipline"
              />
            </div>
            <div className="min-w-0 flex-1 space-y-2 text-center sm:text-left">
              <p className="text-caption">Session</p>
              <p className="font-heading text-xl font-bold text-white sm:text-2xl">
                {props.todayPlanDayName ?? "No session"}
              </p>
              <p className="text-sm text-zinc-500">
                {props.todayPlanDayName
                  ? `${props.todayPlanExerciseCount} movements · rotating plan`
                  : "Finish onboarding to generate your split."}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={toggleWorkout}
                  disabled={!props.todayPlanDayId}
                  className="inline-flex min-h-11 items-center rounded-full border border-white/15 px-4 text-sm font-semibold text-white transition-colors hover:bg-white/[0.06] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {workoutDone ? "Mark incomplete" : "Mark workout done"}
                </button>
                <Link
                  href="/workouts"
                  className="inline-flex min-h-11 items-center text-sm font-semibold text-vyra-lime transition-opacity duration-200 hover:opacity-90"
                >
                  Open planner →
                </Link>
              </div>
            </div>
          </div>
          <div className="grid gap-4 rounded-3xl border border-white/10 bg-black/45 p-5 ring-1 ring-white/[0.05]">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-zinc-500">
                <Apple className="size-3.5 text-vyra-lime" />
                Protein (g)
              </label>
              <Input
                type="number"
                inputMode="decimal"
                value={metrics.protein_g}
                onChange={(e) => updateMetric({ protein_g: Number(e.target.value) || 0 })}
                className="min-h-11 border-white/10 bg-zinc-950 text-white"
              />
              <p className="text-[11px] text-zinc-600">Target {proteinTarget} g</p>
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-zinc-500">
                <Droplets className="size-3.5 text-vyra-lime" />
                Water (L)
              </label>
              <Input
                type="number"
                inputMode="decimal"
                step="0.1"
                value={metrics.water_l}
                onChange={(e) => updateMetric({ water_l: Number(e.target.value) || 0 })}
                className="min-h-11 border-white/10 bg-zinc-950 text-white"
              />
              <p className="text-[11px] text-zinc-600">Target {waterLTarget.toFixed(1)} L</p>
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-zinc-500">
                <Footprints className="size-3.5 text-vyra-lime" />
                Steps
              </label>
              <Input
                type="number"
                inputMode="numeric"
                value={metrics.steps}
                onChange={(e) => updateMetric({ steps: Number(e.target.value) || 0 })}
                className="min-h-11 border-white/10 bg-zinc-950 text-white"
              />
              <p className="text-[11px] text-zinc-600">Target {stepsTarget.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Streak" value={`${streak}d`} hint="Training logged." icon={Activity} />
        <StatCard label="Habits (week)" value={`${weekPct}%`} hint="From synced logs." icon={Flame} />
        <StatCard
          label="Training (week)"
          value={`${Math.round(props.initialWeeklyScore?.workout_completion_pct ?? 0)}%`}
          hint="Completed vs plan cadence."
          icon={Calendar}
        />
        <StatCard
          label="Consistency"
          value={`${consistency}%`}
          hint="14-day habit mix."
          icon={Apple}
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <DashboardCard
          title="Today’s training"
          action={
            <Link href="/workouts" className="inline-flex min-h-10 items-center text-xs font-medium text-vyra-lime hover:underline">
              Planner
            </Link>
          }
        >
          {props.todayPlanDayName ? (
            <div>
              <p className="text-lg font-medium text-white">{props.todayPlanDayName}</p>
              <p className="mt-1 text-sm text-zinc-500">
                {props.todayPlanExerciseCount} movements · {workoutDone ? "Logged complete" : "Not logged"}
              </p>
            </div>
          ) : (
            <p className="text-sm text-zinc-500">No plan saved.</p>
          )}
        </DashboardCard>

        <DashboardCard
          title="Habits"
          action={
            <Link href="/habits" className="inline-flex min-h-10 items-center text-xs font-medium text-vyra-lime hover:underline">
              All
            </Link>
          }
        >
          <HabitMiniList logs={props.habitLogs} />
        </DashboardCard>

        <DashboardCard
          title="Progress"
          action={
            <Link href="/progress" className="inline-flex min-h-10 items-center text-xs font-medium text-vyra-lime hover:underline">
              Log
            </Link>
          }
        >
          <p className="text-sm text-zinc-400">Numbers optional. Trend beats snapshots.</p>
        </DashboardCard>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <DashboardCard
          title="Coach"
          action={
            <Link href="/coach" className="inline-flex min-h-10 items-center text-xs font-medium text-vyra-lime hover:underline">
              Open
            </Link>
          }
        >
          <p className="text-sm text-zinc-400">Read for the week — consistency, fuel, hydration.</p>
        </DashboardCard>
        <DashboardCard
          title="VYRA Supply"
          action={
            <Link href="/shop" className="inline-flex min-h-10 items-center text-xs font-medium text-vyra-lime hover:underline">
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
