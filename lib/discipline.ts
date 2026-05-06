/**
 * Discipline score (weekly, 0–100):
 * (workout_completion_pct * 0.5) + (protein_hit_pct * 0.2) + (water_hit_pct * 0.15) + (steps_hit_pct * 0.15)
 *
 * Targets default from profile targets (protein_g, water_l, steps) or DISCIPLINE_DEFAULT_TARGETS.
 * A "hit" is logged value >= target for that day (cap at 100% contribution per pillar).
 */

export const DISCIPLINE_WEIGHTS = {
  workout: 0.5,
  protein: 0.2,
  water: 0.15,
  steps: 0.15,
} as const

export const DISCIPLINE_DEFAULT_TARGETS = {
  proteinG: 155,
  waterL: 2.8,
  steps: 9000,
} as const

export type WeekInputs = {
  /** 0–100 */
  workoutCompletionPct: number
  /** 0–100 */
  proteinHitPct: number
  /** 0–100 */
  waterHitPct: number
  /** 0–100 */
  stepsHitPct: number
}

export function computeDisciplineScore(input: WeekInputs): number {
  const raw =
    input.workoutCompletionPct * DISCIPLINE_WEIGHTS.workout +
    input.proteinHitPct * DISCIPLINE_WEIGHTS.protein +
    input.waterHitPct * DISCIPLINE_WEIGHTS.water +
    input.stepsHitPct * DISCIPLINE_WEIGHTS.steps
  return Math.round(Math.min(100, Math.max(0, raw)) * 1000) / 1000
}

export function dayHitRatio(actual: number, target: number): number {
  if (target <= 0) return 100
  return Math.min(100, Math.round((actual / target) * 100))
}

/** Single-day approximation using the same pillar weights as the weekly score. */
export function todayDisciplineScore(input: {
  workoutDone: boolean
  proteinHit: boolean
  waterHit: boolean
  stepsHit: boolean
}): number {
  return computeDisciplineScore({
    workoutCompletionPct: input.workoutDone ? 100 : 0,
    proteinHitPct: input.proteinHit ? 100 : 0,
    waterHitPct: input.waterHit ? 100 : 0,
    stepsHitPct: input.stepsHit ? 100 : 0,
  })
}
