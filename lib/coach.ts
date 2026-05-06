import type { DailyLogs, UserProfile, WorkoutPlan } from "@/lib/types"
import { HABIT_IDS } from "@/lib/habits"
import { calculateConsistencyScore, todayKey } from "@/lib/fitness"

export interface CoachInsight {
  title: string
  bullets: string[]
  tone: "steady" | "push" | "recover"
  whyNote: string
}

function goalLabel(goal: UserProfile["goal"]): string {
  const m: Record<UserProfile["goal"], string> = {
    lose_fat: "fat loss",
    build_muscle: "muscle",
    improve_cardio: "cardio",
    maintain: "maintenance",
    general_wellness: "wellness",
  }
  return m[goal]
}

function buildWhyNote(input: {
  profile: UserProfile | null
  consistency: number
  tone: CoachInsight["tone"]
  flags: string[]
}): string {
  const { profile, consistency, tone, flags } = input
  const bits: string[] = []
  if (profile) {
    bits.push(`Goal set to ${goalLabel(profile.goal)}.`)
    bits.push(`Rolling consistency is ${consistency}%.`)
  } else {
    bits.push("Profile not completed on this device.")
  }
  if (flags.length) bits.push(flags.join(" "))
  bits.push(
    tone === "push"
      ? "Bias: add a small layer without breaking rhythm."
      : tone === "recover"
        ? "Bias: reduce scope and protect repeatability."
        : "Bias: keep the week executable."
  )
  return bits.join(" ")
}

export function buildCoachFeedback(input: {
  profile: UserProfile | null
  logs: DailyLogs
  plan: WorkoutPlan | null
}): CoachInsight {
  const { profile, logs, plan } = input
  const today = todayKey()
  const todayLog = logs[today] ?? {}
  const consistency = calculateConsistencyScore(logs, HABIT_IDS)

  const bullets: string[] = []
  const flags: string[] = []
  let tone: CoachInsight["tone"] = "steady"

  if (!profile) {
    const whyNote = buildWhyNote({
      profile: null,
      consistency,
      tone: "steady",
      flags: ["No saved profile yet."],
    })
    return {
      title: "Start with one clean week.",
      bullets: [
        "Run setup so targets match your real schedule.",
        "Pick three habits you can repeat for seven days.",
        "Keep loads honest. Consistency beats spikes.",
      ],
      tone: "steady",
      whyNote,
    }
  }

  const todayWorkout = plan?.days?.[0]
  const workoutDone = todayLog.workout

  if (profile.mainStruggle === "consistency" && profile.daysPerWeek > 5) {
    bullets.push(
      "Five-plus days is a lot. Three strong sessions beat six partial ones."
    )
    flags.push("High weekly frequency with a consistency struggle flagged.")
    tone = "recover"
  }

  if (consistency < 45) {
    bullets.push(
      "Forget perfect weeks. Log training, protein, and water for seven days — then adjust."
    )
    flags.push("Consistency under 45%.")
    tone = "recover"
  } else if (consistency > 78) {
    bullets.push(
      "Rhythm is stable. Add ten minutes of mobility or one extra walk."
    )
    flags.push("Consistency above 78%.")
    tone = "push"
  }

  if (!workoutDone && plan) {
    bullets.push(
      `Today targets ${todayWorkout?.name ?? "training"}. Partial work still counts if you log it.`
    )
    flags.push("Training not logged for today.")
  }

  if (!todayLog.protein) {
    bullets.push("Anchor protein at breakfast. It simplifies the rest of the day.")
    flags.push("Protein habit open today.")
  }

  if (!todayLog.water) {
    bullets.push("Keep the bottle visible. Sip through calls and transitions.")
    flags.push("Water habit open today.")
  }

  if (profile.goal === "improve_cardio") {
    bullets.push("Short walks across the day beat one long session you skip.")
  }

  if (profile.goal === "build_muscle") {
    bullets.push("Hard training needs sleep. Guard both.")
  }

  if (bullets.length < 3) {
    bullets.push("Log basics before optimizing anything advanced.")
  }

  const title =
    tone === "push"
      ? "Pressure stays useful."
      : tone === "recover"
        ? "Narrow the week. Protect the streak."
        : "Stay direct. Stay consistent."

  const whyNote = buildWhyNote({ profile, consistency, tone, flags })

  return {
    title,
    bullets: bullets.slice(0, 4),
    tone,
    whyNote,
  }
}
