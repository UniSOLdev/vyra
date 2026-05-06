export const DEFAULT_HABITS = [
  { id: "workout", label: "Workout complete" },
  { id: "protein", label: "Protein target hit" },
  { id: "water", label: "Water goal hit" },
  { id: "steps", label: "7k+ steps" },
  { id: "sleep", label: "Sleep 7+ hours" },
  { id: "stretch", label: "Stretch / mobility" },
  { id: "morning", label: "Morning routine" },
  { id: "prep", label: "Prep tomorrow" },
] as const

export const HABIT_IDS = DEFAULT_HABITS.map((h) => h.id)
