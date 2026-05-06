"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { userProfileToRowPatch as buildProfilePatch } from "@/lib/profile-map"
import { recomputeWeeklyScore } from "@/lib/recompute-week-score"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import type { UserProfile, WorkoutPlan } from "@/lib/types"
import { weekStartMondayISO } from "@/lib/week"

const FREE_FRIEND_CAP = 3

function siteOrigin() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")
  )
}

export async function signInAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim()
  const password = String(formData.get("password") ?? "")
  const next = String(formData.get("next") ?? "/dashboard")
  const supabase = await createSupabaseServerClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return { error: error.message }
  redirect(next.startsWith("/") ? next : "/dashboard")
}

export async function signUpAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim()
  const password = String(formData.get("password") ?? "")
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${siteOrigin()}/auth/callback`,
    },
  })
  if (error) return { error: error.message }
  if (!data.session) {
    return { error: null as string | null, ok: true as const, needsConfirmation: true as const }
  }
  redirect("/onboarding")
}

export async function signOutAction() {
  const supabase = await createSupabaseServerClient()
  await supabase.auth.signOut()
  redirect("/")
}

export async function saveOnboardingAction(input: {
  profile: UserProfile
  username: string
  plan: WorkoutPlan
}) {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: "Not signed in" }

  const u = input.username.trim().toLowerCase()
  if (!/^[a-z0-9_]{3,20}$/.test(u)) {
    return { error: "Username must be 3–20 characters: lowercase letters, numbers, underscore." }
  }

  const weekStart = weekStartMondayISO()
  const patch = {
    ...buildProfilePatch(input.profile),
    username: u,
    plan_week_start: input.profile.planWeekStart ?? weekStart,
  }

  const payload: Record<string, unknown> = {
    id: user.id,
    ...patch,
  }
  if (user.email) payload.email = user.email

  const { error: profileError } = await supabase.from("profiles").upsert(payload, {
    onConflict: "id",
  })
  if (profileError) {
    if (profileError.code === "23505") {
      return { error: "That username is already taken." }
    }
    return { error: profileError.message }
  }

  const { error: planError } = await supabase.from("user_workout_plans").upsert(
    {
      user_id: user.id,
      plan: input.plan as never,
      equipment_kinds: input.profile.equipmentKinds?.length
        ? input.profile.equipmentKinds
        : patch.equipment_kinds,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" }
  )
  if (planError) return { error: planError.message }

  await recomputeWeeklyScore(supabase, user.id, weekStart)
  revalidatePath("/dashboard")
  revalidatePath("/workouts")
  return { error: null as string | null }
}

export async function upsertDailyMetricsAction(input: {
  metricDate: string
  proteinG: number
  waterL: number
  steps: number
}) {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: "Not signed in" }

  const { error } = await supabase.from("daily_metrics").upsert(
    {
      user_id: user.id,
      metric_date: input.metricDate,
      protein_g: Math.max(0, Math.round(input.proteinG)),
      water_l: Math.max(0, input.waterL),
      steps: Math.max(0, Math.round(input.steps)),
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,metric_date" }
  )
  if (error) return { error: error.message }

  await recomputeWeeklyScore(supabase, user.id, weekStartMondayISO())
  revalidatePath("/dashboard")
  return { error: null as string | null }
}

export async function saveWorkoutPlanRemoteAction(plan: WorkoutPlan) {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: "Not signed in" }

  const { data: profileRow } = await supabase
    .from("profiles")
    .select("equipment_kinds")
    .eq("id", user.id)
    .single()
  const { error } = await supabase.from("user_workout_plans").upsert(
    {
      user_id: user.id,
      plan: plan as never,
      equipment_kinds: (profileRow?.equipment_kinds as string[]) ?? [],
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" }
  )
  if (error) return { error: error.message }
  await recomputeWeeklyScore(supabase, user.id, weekStartMondayISO())
  revalidatePath("/workouts")
  revalidatePath("/dashboard")
  return { error: null as string | null }
}

export async function upsertWorkoutDayCompletionAction(input: {
  completionDate: string
  dayId: string
  completed: boolean
}) {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: "Not signed in" }

  const { error } = await supabase.from("workout_day_completions").upsert(
    {
      user_id: user.id,
      completion_date: input.completionDate,
      day_id: input.dayId,
      completed: input.completed,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,completion_date,day_id" }
  )
  if (error) return { error: error.message }
  await recomputeWeeklyScore(supabase, user.id, weekStartMondayISO())
  revalidatePath("/dashboard")
  revalidatePath("/workouts")
  return { error: null as string | null }
}

export async function syncHabitDayAction(input: { logDate: string; habitId: string; done: boolean }) {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: "Not signed in" }

  const { error } = await supabase.from("habit_daily_logs").upsert(
    {
      user_id: user.id,
      log_date: input.logDate,
      habit_id: input.habitId,
      done: input.done,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,log_date,habit_id" }
  )
  if (error) return { error: error.message }
  await recomputeWeeklyScore(supabase, user.id, weekStartMondayISO())
  revalidatePath("/habits")
  revalidatePath("/dashboard")
  return { error: null as string | null }
}

export async function addFriendByUsernameAction(username: string) {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: "Not signed in" }

  const { data: me } = await supabase.from("profiles").select("is_pro").eq("id", user.id).single()
  const { count } = await supabase
    .from("friendships")
    .select("*", { count: "exact", head: true })
    .or(`user_id.eq.${user.id},friend_user_id.eq.${user.id}`)

  if (!me?.is_pro && (count ?? 0) >= FREE_FRIEND_CAP) {
    return {
      error: `Free accounts support ${FREE_FRIEND_CAP} friends. Upgrade to Pro for unlimited.`,
    }
  }

  const { data: rows, error: rpcError } = await supabase.rpc("find_profile_by_username", {
    p_username: username.trim(),
  })
  if (rpcError) return { error: rpcError.message }
  const target = (rows as { id: string; username: string }[] | null)?.[0]
  if (!target) return { error: "No user with that username." }
  if (target.id === user.id) return { error: "You cannot add yourself." }

  const { error } = await supabase.from("friendships").insert({
    user_id: user.id,
    friend_user_id: target.id,
  })
  if (error) {
    if (error.code === "23505") return { error: "Already connected." }
    return { error: error.message }
  }
  revalidatePath("/friends")
  return { error: null as string | null }
}

export async function removeFriendshipAction(friendUserId: string) {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: "Not signed in" }

  await supabase
    .from("friendships")
    .delete()
    .match({ user_id: user.id, friend_user_id: friendUserId })
  await supabase
    .from("friendships")
    .delete()
    .match({ user_id: friendUserId, friend_user_id: user.id })
  revalidatePath("/friends")
  return { error: null as string | null }
}

export async function recomputeScoreAction() {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: "Not signed in" }
  await recomputeWeeklyScore(supabase, user.id, weekStartMondayISO())
  revalidatePath("/dashboard")
  return { error: null as string | null }
}
