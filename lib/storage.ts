import type {
  DailyLogs,
  ProgressEntry,
  UserProfile,
  WorkoutPlan,
} from "@/lib/types"

export const STORAGE_KEYS = {
  userProfile: "vyra_user_profile",
  workoutPlan: "vyra_workout_plan",
  dailyLogs: "vyra_daily_logs",
  progressLogs: "vyra_progress_logs",
  savedProducts: "vyra_saved_products",
} as const

export function getJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function setJSON(key: string, value: unknown) {
  if (typeof window === "undefined") return
  localStorage.setItem(key, JSON.stringify(value))
}

export function removeKey(key: string) {
  if (typeof window === "undefined") return
  localStorage.removeItem(key)
}

export function saveUserProfile(profile: UserProfile) {
  setJSON(STORAGE_KEYS.userProfile, profile)
}

export function getUserProfile(): UserProfile | null {
  return getJSON<UserProfile | null>(STORAGE_KEYS.userProfile, null)
}

export function saveWorkoutPlan(plan: WorkoutPlan) {
  setJSON(STORAGE_KEYS.workoutPlan, {
    ...plan,
    updatedAt: new Date().toISOString(),
  })
}

export function getWorkoutPlan(): WorkoutPlan | null {
  return getJSON<WorkoutPlan | null>(STORAGE_KEYS.workoutPlan, null)
}

export function saveDailyLogs(logs: DailyLogs) {
  setJSON(STORAGE_KEYS.dailyLogs, logs)
}

export function getDailyLogs(): DailyLogs {
  return getJSON<DailyLogs>(STORAGE_KEYS.dailyLogs, {})
}

/** Merge habits for a single date */
export function saveDailyLog(date: string, habits: Record<string, boolean>) {
  const logs = getDailyLogs()
  logs[date] = { ...(logs[date] ?? {}), ...habits }
  saveDailyLogs(logs)
}

export function saveProgressLog(entry: ProgressEntry) {
  const all = getProgressLogs()
  const idx = all.findIndex((e) => e.id === entry.id)
  if (idx >= 0) all[idx] = entry
  else all.push(entry)
  all.sort((a, b) => a.date.localeCompare(b.date))
  setJSON(STORAGE_KEYS.progressLogs, all)
}

export function getProgressLogs(): ProgressEntry[] {
  return getJSON<ProgressEntry[]>(STORAGE_KEYS.progressLogs, [])
}

export function deleteProgressLog(id: string) {
  setJSON(
    STORAGE_KEYS.progressLogs,
    getProgressLogs().filter((e) => e.id !== id)
  )
}

export function getSavedProducts(): string[] {
  return getJSON<string[]>(STORAGE_KEYS.savedProducts, [])
}

export function saveProduct(slug: string) {
  const s = new Set(getSavedProducts())
  s.add(slug)
  setJSON(STORAGE_KEYS.savedProducts, [...s])
}

export function removeSavedProduct(slug: string) {
  setJSON(
    STORAGE_KEYS.savedProducts,
    getSavedProducts().filter((s) => s !== slug)
  )
}

export function isProductSaved(slug: string) {
  return getSavedProducts().includes(slug)
}
