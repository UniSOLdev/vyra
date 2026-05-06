export type Goal =
  | "lose_fat"
  | "build_muscle"
  | "improve_cardio"
  | "maintain"
  | "general_wellness"

export type Experience = "beginner" | "intermediate" | "advanced"

export type Equipment = "none" | "dumbbells" | "full_gym" | "home_gym"

/** Multi-select equipment for programming and profile storage. */
export type EquipmentKind =
  | "full_gym"
  | "dumbbells"
  | "barbell"
  | "machines"
  | "bodyweight_only"

export type NutritionPreference =
  | "no_preference"
  | "high_protein"
  | "balanced"
  | "low_carb"
  | "vegetarian"

export type MainStruggle =
  | "consistency"
  | "meal_planning"
  | "workouts"
  | "motivation"
  | "time"

export interface UserProfile {
  goal: Goal
  experience: Experience
  daysPerWeek: number
  /** Legacy single-select; superseded by equipmentKinds when set. */
  equipment: Equipment
  /** Preferred multi-select for workout generation. */
  equipmentKinds?: EquipmentKind[]
  nutritionPreference: NutritionPreference
  shoppingInterests: string[]
  mainStruggle: MainStruggle
  createdAt: string
  username?: string
  displayName?: string
  isPro?: boolean
  targetProteinG?: number
  targetWaterL?: number
  targetSteps?: number
  planWeekStart?: string
}

export interface Exercise {
  id: string
  name: string
  sets: number
  reps: string
  rest: string
  notes?: string
  completed?: boolean
  /** When set, gates exercise in generator; otherwise name heuristics apply. */
  equipmentTags?: EquipmentKind[]
}

export interface WorkoutDay {
  id: string
  name: string
  exercises: Exercise[]
  dayCompleted?: boolean
}

export interface WorkoutPlan {
  days: WorkoutDay[]
  updatedAt: string
}

export interface DailyLogs {
  /** YYYY-MM-DD -> habitId -> done */
  [date: string]: Record<string, boolean>
}

export interface ProgressEntry {
  id: string
  date: string
  weightLb?: number
  waistIn?: number
  chestIn?: number
  armsIn?: number
  legsIn?: number
  notes?: string
}

export type ProductCategory = "Apparel" | "Bottles" | "Gear" | "Supplements"

export interface Product {
  slug: string
  name: string
  category: ProductCategory
  /** Public path under /public, e.g. /products/collagen.png */
  image: string
  copy: string
  price: number
  badge: string
}
