export type Goal =
  | "lose_fat"
  | "build_muscle"
  | "improve_cardio"
  | "maintain"
  | "general_wellness"

export type Experience = "beginner" | "intermediate" | "advanced"

export type Equipment = "none" | "dumbbells" | "full_gym" | "home_gym"

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
  equipment: Equipment
  nutritionPreference: NutritionPreference
  shoppingInterests: string[]
  mainStruggle: MainStruggle
  createdAt: string
}

export interface Exercise {
  id: string
  name: string
  sets: number
  reps: string
  rest: string
  notes?: string
  completed?: boolean
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
