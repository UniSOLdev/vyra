"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { saveOnboardingAction } from "@/app/actions/vyra"
import type {
  EquipmentKind,
  Experience,
  Goal,
  MainStruggle,
  NutritionPreference,
  UserProfile,
} from "@/lib/types"
import { generateWorkoutPlan } from "@/lib/fitness"
import { EQUIPMENT_KIND_OPTIONS } from "@/lib/equipment"
import { weekStartMondayISO } from "@/lib/week"
import { CTAButton } from "@/components/CTAButton"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

const steps = [
  "Goal",
  "Experience",
  "Training",
  "Nutrition",
  "Shopping",
  "Struggle",
  "Username",
] as const

const goals: { id: Goal; label: string }[] = [
  { id: "lose_fat", label: "Lose fat" },
  { id: "build_muscle", label: "Build muscle" },
  { id: "improve_cardio", label: "Improve cardio" },
  { id: "maintain", label: "Maintain" },
  { id: "general_wellness", label: "General wellness" },
]

const experiences: { id: Experience; label: string }[] = [
  { id: "beginner", label: "Beginner" },
  { id: "intermediate", label: "Intermediate" },
  { id: "advanced", label: "Advanced" },
]

const nutrition: { id: NutritionPreference; label: string }[] = [
  { id: "no_preference", label: "No preference" },
  { id: "high_protein", label: "High protein" },
  { id: "balanced", label: "Balanced" },
  { id: "low_carb", label: "Low carb" },
  { id: "vegetarian", label: "Vegetarian" },
]

const shopping = [
  "Apparel",
  "Bottles",
  "Gear",
  "Protein",
  "Creatine",
  "Pre-workout",
  "Smoothies",
  "Wellness",
] as const

const struggles: { id: MainStruggle; label: string }[] = [
  { id: "consistency", label: "Consistency" },
  { id: "meal_planning", label: "Meal planning" },
  { id: "workouts", label: "Workouts" },
  { id: "motivation", label: "Motivation" },
  { id: "time", label: "Time" },
]

function SelectCard({
  selected,
  onClick,
  children,
}: {
  selected: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "min-h-14 rounded-2xl border px-4 py-4 text-left text-base font-medium transition-[border-color,background-color,box-shadow] duration-200 [transition-timing-function:var(--ease-vy-out)] active:scale-[0.99] sm:min-h-[3.75rem] sm:px-5",
        selected
          ? "border-vyra-lime bg-vyra-lime/10 text-white shadow-vyra-glow"
          : "border-white/10 bg-zinc-900/50 text-zinc-300 hover:border-white/18 hover:bg-zinc-900/70"
      )}
    >
      {children}
    </button>
  )
}

export function OnboardingClient({ initialIsPro }: { initialIsPro: boolean }) {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [goal, setGoal] = useState<Goal>("general_wellness")
  const [experience, setExperience] = useState<Experience>("beginner")
  const [daysPerWeek, setDaysPerWeek] = useState(4)
  const [equipKinds, setEquipKinds] = useState<EquipmentKind[]>(["dumbbells", "bodyweight_only"])
  const [nutritionPref, setNutritionPref] =
    useState<NutritionPreference>("balanced")
  const [interests, setInterests] = useState<string[]>([])
  const [struggle, setStruggle] = useState<MainStruggle>("consistency")
  const [username, setUsername] = useState("")
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  const progress = useMemo(
    () => Math.round(((step + 1) / steps.length) * 100),
    [step]
  )

  const toggleInterest = (label: string) => {
    setInterests((prev) =>
      prev.includes(label) ? prev.filter((x) => x !== label) : [...prev, label]
    )
  }

  const toggleEquip = (k: EquipmentKind) => {
    setEquipKinds((prev) => {
      const has = prev.includes(k)
      const next = has ? prev.filter((x) => x !== k) : [...prev, k]
      return next.length ? next : ["bodyweight_only"]
    })
  }

  const next = () => setStep((s) => Math.min(s + 1, steps.length - 1))
  const back = () => setStep((s) => Math.max(s - 1, 0))

  const legacyEquipment = (): UserProfile["equipment"] => {
    if (equipKinds.includes("full_gym")) return "full_gym"
    if (equipKinds.includes("dumbbells")) return "dumbbells"
    if (equipKinds.includes("barbell")) return "home_gym"
    return "none"
  }

  const submit = async () => {
    setSubmitError(null)
    setPending(true)
    const profile: UserProfile = {
      goal,
      experience,
      daysPerWeek,
      equipment: legacyEquipment(),
      equipmentKinds: equipKinds,
      nutritionPreference: nutritionPref,
      shoppingInterests: interests.length ? interests : ["Gear"],
      mainStruggle: struggle,
      createdAt: new Date().toISOString(),
      isPro: initialIsPro,
      planWeekStart: weekStartMondayISO(),
    }
    const plan = generateWorkoutPlan(profile)
    const res = await saveOnboardingAction({
      profile,
      username: username.trim().toLowerCase(),
      plan,
    })
    if (res?.error) {
      setSubmitError(res.error)
      setPending(false)
      return
    }
    router.push("/dashboard")
    router.refresh()
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-14">
      <p className="text-caption text-vyra-lime">Onboarding</p>
      <h1 className="mt-4 text-section-title">Dial in the week.</h1>
      <p className="text-body mt-3 text-sm sm:text-base">
        Honest inputs. Better defaults. Four minutes.
      </p>

      <div className="mt-8 rounded-2xl border border-white/10 bg-zinc-900/40 p-4 shadow-vyra-sm sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-500">
          <span className="font-medium text-zinc-400">
            Step {step + 1} of {steps.length}
          </span>
          <span className="tabular-nums">{progress}%</span>
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5" aria-label="Onboarding steps">
          {steps.map((s, i) => (
            <span
              key={s}
              className={cn(
                "rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide",
                i === step
                  ? "bg-vyra-lime/15 text-vyra-lime ring-1 ring-vyra-lime/30"
                  : i < step
                    ? "bg-white/5 text-zinc-500"
                    : "text-zinc-600"
              )}
            >
              {s}
            </span>
          ))}
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-zinc-800">
          <div
            className="h-full rounded-full bg-vyra-lime transition-[width] duration-300 [transition-timing-function:var(--ease-vy-out)]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="mt-10 space-y-6">
        {step === 0 && (
          <div className="grid gap-3 sm:grid-cols-2">
            {goals.map((g) => (
              <SelectCard
                key={g.id}
                selected={goal === g.id}
                onClick={() => setGoal(g.id)}
              >
                {g.label}
              </SelectCard>
            ))}
          </div>
        )}

        {step === 1 && (
          <div className="grid gap-3 sm:grid-cols-3">
            {experiences.map((e) => (
              <SelectCard
                key={e.id}
                selected={experience === e.id}
                onClick={() => setExperience(e.id)}
              >
                {e.label}
              </SelectCard>
            ))}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div>
              <p className="text-sm text-zinc-400">Days per week available</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {Array.from({ length: 7 }).map((_, i) => {
                  const n = i + 1
                  return (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setDaysPerWeek(n)}
                      className={cn(
                        "size-11 rounded-full border text-sm font-semibold",
                        daysPerWeek === n
                          ? "border-vyra-lime bg-vyra-lime/15 text-vyra-lime"
                          : "border-white/10 text-zinc-400 hover:border-white/20"
                      )}
                    >
                      {n}
                    </button>
                  )
                })}
              </div>
            </div>
            <div>
              <p className="text-sm text-zinc-400">Equipment access (multi-select)</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {EQUIPMENT_KIND_OPTIONS.map((e) => (
                  <SelectCard
                    key={e.id}
                    selected={equipKinds.includes(e.id)}
                    onClick={() => toggleEquip(e.id)}
                  >
                    {e.label}
                  </SelectCard>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="grid gap-3 sm:grid-cols-2">
            {nutrition.map((n) => (
              <SelectCard
                key={n.id}
                selected={nutritionPref === n.id}
                onClick={() => setNutritionPref(n.id)}
              >
                {n.label}
              </SelectCard>
            ))}
          </div>
        )}

        {step === 4 && (
          <div className="grid gap-3 sm:grid-cols-2">
            {shopping.map((s) => (
              <SelectCard
                key={s}
                selected={interests.includes(s)}
                onClick={() => toggleInterest(s)}
              >
                {s}
              </SelectCard>
            ))}
          </div>
        )}

        {step === 5 && (
          <div className="grid gap-3 sm:grid-cols-2">
            {struggles.map((s) => (
              <SelectCard
                key={s.id}
                selected={struggle === s.id}
                onClick={() => setStruggle(s.id)}
              >
                {s.label}
              </SelectCard>
            ))}
          </div>
        )}

        {step === 6 && (
          <div className="space-y-3">
            <p className="text-sm text-zinc-400">
              Public handle for friend lookup. Lowercase letters, numbers, underscore. 3–20 chars.
            </p>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="your_handle"
              autoCapitalize="none"
              className="min-h-12 border-white/10 bg-zinc-950 text-white"
            />
            {submitError ? <p className="text-sm text-red-400">{submitError}</p> : null}
          </div>
        )}
      </div>

      <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
        <Button
          type="button"
          variant="ghost"
          className="min-h-11 gap-1 px-4 text-zinc-400 hover:text-white"
          onClick={back}
          disabled={step === 0}
        >
          <ChevronLeft className="size-4" />
          Back
        </Button>
        {step < steps.length - 1 ? (
          <CTAButton type="button" variant="primary" size="lg" onClick={next}>
            <span className="inline-flex items-center gap-1.5">
              Continue
              <ChevronRight className="size-4" />
            </span>
          </CTAButton>
        ) : (
          <CTAButton
            type="button"
            variant="primary"
            size="lg"
            onClick={submit}
            disabled={pending}
          >
            {pending ? "Saving…" : "Finish → dashboard"}
          </CTAButton>
        )}
      </div>
    </div>
  )
}
