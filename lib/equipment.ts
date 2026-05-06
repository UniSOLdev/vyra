import type { Equipment, EquipmentKind, UserProfile } from "@/lib/types"

export const EQUIPMENT_KIND_OPTIONS: { id: EquipmentKind; label: string }[] = [
  { id: "full_gym", label: "Full gym" },
  { id: "dumbbells", label: "Dumbbells" },
  { id: "barbell", label: "Barbell" },
  { id: "machines", label: "Machines" },
  { id: "bodyweight_only", label: "Bodyweight" },
]

export function legacyEquipmentToKinds(equipment: Equipment): EquipmentKind[] {
  switch (equipment) {
    case "none":
      return ["bodyweight_only"]
    case "dumbbells":
      return ["dumbbells", "bodyweight_only"]
    case "home_gym":
      return ["dumbbells", "barbell", "bodyweight_only"]
    case "full_gym":
      return ["full_gym", "machines", "barbell", "dumbbells", "bodyweight_only"]
    default:
      return ["bodyweight_only"]
  }
}

export function expandEquipmentKinds(kinds: EquipmentKind[]): Set<EquipmentKind> {
  const s = new Set<EquipmentKind>(kinds)
  if (s.has("full_gym")) {
    s.add("machines")
    s.add("barbell")
    s.add("dumbbells")
    s.add("bodyweight_only")
  }
  return s
}

/** Heuristic tags from movement name when explicit tags are absent. */
export function inferEquipmentTags(exerciseName: string): EquipmentKind[] {
  const n = exerciseName.toLowerCase()
  if (
    /pulldown|pushdown|leg press|leg curl|leg extension|hack squat|machine|cable|row machine|triceps dip/.test(
      n
    )
  ) {
    return ["machines", "full_gym"]
  }
  if (
    /deadlift|back squat|squat pattern|bench|barbell|ohp|overhead press|incline press/.test(n) &&
    !/dumbbell|db /.test(n)
  ) {
    return ["barbell", "full_gym", "machines"]
  }
  if (/dumbbell|db |single-arm|1-arm|farmer|goblet|floor press/.test(n)) {
    return ["dumbbells", "full_gym", "bodyweight_only"]
  }
  if (/pull-up|chin|push-up|plank|bridge|dead bug|lunge|bear crawl|walk|bike|interval|med ball|spin|conditioning|finisher|easy spin/.test(n)) {
    return ["bodyweight_only", "full_gym", "dumbbells"]
  }
  return ["bodyweight_only", "dumbbells", "barbell", "machines", "full_gym"]
}

export function exerciseAllowedForKinds(
  exerciseName: string,
  explicitTags: EquipmentKind[] | undefined,
  userKinds: EquipmentKind[]
): boolean {
  const tags = explicitTags?.length ? explicitTags : inferEquipmentTags(exerciseName)
  const expanded = expandEquipmentKinds(userKinds)
  return tags.some((t) => expanded.has(t))
}

export function resolveProfileEquipmentKinds(profile: UserProfile): EquipmentKind[] {
  if (profile.equipmentKinds?.length) return profile.equipmentKinds
  return legacyEquipmentToKinds(profile.equipment)
}
