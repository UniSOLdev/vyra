import { SPLIT_TEMPLATES } from "@/data/workouts"
import {
  exerciseAllowedForKinds,
  resolveProfileEquipmentKinds,
} from "@/lib/equipment"
import type {
  DailyLogs,
  Exercise,
  Goal,
  UserProfile,
  WorkoutDay,
  WorkoutPlan,
} from "@/lib/types"
function cloneExercise(e: Exercise, dayId: string, index: number): Exercise {
  return {
    ...e,
    id: `${dayId}-ex-${index}`,
    completed: false,
  }
}

function filterExercisesForEquipment(
  exercises: Exercise[],
  kinds: ReturnType<typeof resolveProfileEquipmentKinds>
): Exercise[] {
  const filtered = exercises.filter((ex) =>
    exerciseAllowedForKinds(ex.name, ex.equipmentTags, kinds)
  )
  if (filtered.length) return filtered
  return [
    {
      id: "fallback-walk",
      name: "Brisk walk or easy bike",
      sets: 1,
      reps: "25–40 min",
      rest: "—",
      notes: "Zone 2 pace you can repeat tomorrow.",
      completed: false,
      equipmentTags: ["bodyweight_only"],
    },
  ]
}

function maybeProgressProSets(exercises: Exercise[], isPro: boolean): Exercise[] {
  if (!isPro || !exercises.length) return exercises
  return exercises.map((e, i) =>
    i === 0 ? { ...e, sets: Math.min(e.sets + 1, 6) } : e
  )
}

export function generateWorkoutPlan(profile: UserProfile): WorkoutPlan {
  const template = SPLIT_TEMPLATES[profile.experience]
  const daysCount = Math.min(Math.max(profile.daysPerWeek, 1), 7)
  const days: WorkoutDay[] = []
  const kinds = resolveProfileEquipmentKinds(profile)

  for (let i = 0; i < daysCount; i++) {
    const t = template[i % template.length]
    const dayId = `day-${i + 1}`
    const base = filterExercisesForEquipment(t.exercises, kinds)
    const progressed = maybeProgressProSets(base, !!profile.isPro)
    days.push({
      id: dayId,
      name: t.name,
      exercises: progressed.map((ex, idx) => cloneExercise(ex, dayId, idx)),
      dayCompleted: false,
    })
  }

  return { days, updatedAt: new Date().toISOString() }
}

export function calculateProteinTarget(profile: UserProfile): number {
  const base: Record<Goal, number> = {
    lose_fat: 150,
    build_muscle: 175,
    improve_cardio: 145,
    maintain: 140,
    general_wellness: 135,
  }
  let g = base[profile.goal]

  switch (profile.nutritionPreference) {
    case "high_protein":
      g += 25
      break
    case "low_carb":
      g += 10
      break
    case "vegetarian":
      g += 5
      break
    default:
      break
  }

  if (profile.experience === "advanced") g += 10
  if (profile.experience === "beginner") g -= 10

  return Math.min(Math.max(g, 120), 200)
}

export function calculateWaterTargetOz(profile: UserProfile): number {
  let oz = 100
  if (profile.goal === "improve_cardio") oz += 16
  if (profile.mainStruggle === "time") oz -= 8
  return Math.min(Math.max(oz, 80), 140)
}

export function calculateWaterTargetMl(profile: UserProfile): number {
  return Math.round(calculateWaterTargetOz(profile) * 29.5735)
}

export function calculateStepsTarget(profile: UserProfile): number {
  if (profile.goal === "improve_cardio") return 11000
  if (profile.goal === "lose_fat") return 9500
  return 9000
}

export function todayKey() {
  const d = new Date()
  const y = d.getFullYear()
  const m = `${d.getMonth() + 1}`.padStart(2, "0")
  const day = `${d.getDate()}`.padStart(2, "0")
  return `${y}-${m}-${day}`
}

export function calculateConsistencyScore(logs: DailyLogs, habitIds: string[]) {
  const keys = Object.keys(logs).sort().slice(-14)
  if (!keys.length || !habitIds.length) return 0
  let total = 0
  let count = 0
  for (const d of keys) {
    const day = logs[d]
    if (!day) continue
    const done = habitIds.filter((h) => day[h]).length
    total += done / habitIds.length
    count += 1
  }
  return Math.round((total / Math.max(count, 1)) * 100)
}

function localDateKey(offsetDays: number) {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() - offsetDays)
  const y = d.getFullYear()
  const m = `${d.getMonth() + 1}`.padStart(2, "0")
  const day = `${d.getDate()}`.padStart(2, "0")
  return `${y}-${m}-${day}`
}

export function calculateStreak(
  logs: DailyLogs,
  anchorHabitId = "workout"
): number {
  let streak = 0
  for (let i = 0; i < 120; i++) {
    const key = localDateKey(i)
    if (logs[key]?.[anchorHabitId]) streak += 1
    else break
  }
  return streak
}

export function weeklyHabitCompletionPct(
  logs: DailyLogs,
  habitIds: string[]
): number {
  const keys: string[] = []
  for (let i = 6; i >= 0; i--) {
    keys.push(localDateKey(i))
  }
  let score = 0
  let max = 0
  for (const k of keys) {
    const day = logs[k] ?? {}
    for (const h of habitIds) {
      max += 1
      if (day[h]) score += 1
    }
  }
  return max ? Math.round((score / max) * 100) : 0
}
