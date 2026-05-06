import {
  calculateProteinTarget,
  calculateStepsTarget,
  calculateWaterTargetMl,
} from "@/lib/fitness"
import type { Experience, Goal, MainStruggle, NutritionPreference, UserProfile } from "@/lib/types"
import { legacyEquipmentToKinds } from "@/lib/equipment"

export type ProfileRow = {
  id: string
  username: string | null
  display_name: string | null
  full_name: string | null
  goal: string | null
  experience: string | null
  days_per_week: number | null
  equipment_kinds: string[] | null
  nutrition_preference: string | null
  shopping_interests: string[] | null
  main_struggle: string | null
  target_protein_g: number | null
  target_water_l: number | null
  target_steps: number | null
  plan_week_start: string | null
  is_pro: boolean | null
  created_at: string | null
}

export function rowToUserProfile(row: ProfileRow | null): UserProfile | null {
  if (!row?.goal || !row.experience) return null
  const kinds = (row.equipment_kinds as UserProfile["equipmentKinds"])?.filter(Boolean)
  const profile: UserProfile = {
    goal: row.goal as Goal,
    experience: row.experience as Experience,
    daysPerWeek: Math.min(7, Math.max(1, row.days_per_week ?? 4)),
    equipment: "dumbbells",
    equipmentKinds: kinds?.length ? kinds : undefined,
    targetProteinG: row.target_protein_g ?? undefined,
    targetWaterL: row.target_water_l != null ? Number(row.target_water_l) : undefined,
    targetSteps: row.target_steps ?? undefined,
    planWeekStart: row.plan_week_start ?? undefined,
    nutritionPreference: (row.nutrition_preference as NutritionPreference) ?? "balanced",
    shoppingInterests: row.shopping_interests?.length ? row.shopping_interests : ["Gear"],
    mainStruggle: (row.main_struggle as MainStruggle) ?? "consistency",
    createdAt: row.created_at ?? new Date().toISOString(),
    username: row.username ?? undefined,
    displayName: row.display_name ?? row.full_name ?? undefined,
    isPro: !!row.is_pro,
  }
  if (!profile.equipmentKinds?.length) {
    profile.equipment = "dumbbells"
  } else {
    profile.equipment =
      profile.equipmentKinds.includes("full_gym")
        ? "full_gym"
        : profile.equipmentKinds.includes("dumbbells")
          ? "dumbbells"
          : profile.equipmentKinds.includes("barbell")
            ? "home_gym"
            : "none"
  }
  return profile
}

export function userProfileToRowPatch(p: UserProfile) {
  const kinds = p.equipmentKinds?.length ? p.equipmentKinds : legacyEquipmentToKinds(p.equipment)
  const protein = p.targetProteinG ?? calculateProteinTarget(p)
  const waterL = p.targetWaterL ?? calculateWaterTargetMl(p) / 1000
  const steps = p.targetSteps ?? calculateStepsTarget(p)
  return {
    goal: p.goal,
    experience: p.experience,
    days_per_week: p.daysPerWeek,
    equipment_kinds: kinds,
    nutrition_preference: p.nutritionPreference,
    shopping_interests: p.shoppingInterests,
    main_struggle: p.mainStruggle,
    display_name: p.displayName ?? null,
    target_protein_g: protein,
    target_water_l: waterL,
    target_steps: steps,
    updated_at: new Date().toISOString(),
  }
}
