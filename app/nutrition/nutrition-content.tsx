"use client"

import { useEffect, useState } from "react"
import {
  calculateProteinTarget,
  calculateWaterTargetMl,
} from "@/lib/fitness"
import { getUserProfile } from "@/lib/storage"
import type { UserProfile } from "@/lib/types"
import { MealTargetCard } from "@/components/nutrition/MealTargetCard"

const disclaimer =
  "VYRA provides general fitness and wellness information. It is not medical advice. Always consult a qualified professional before starting a new diet, supplement, or exercise program."

export function NutritionContent() {
  const [profile, setProfile] = useState<UserProfile | null>(null)

  useEffect(() => {
    const t = window.setTimeout(() => setProfile(getUserProfile()), 0)
    return () => window.clearTimeout(t)
  }, [])

  const protein = profile ? calculateProteinTarget(profile) : 155
  const waterMl = profile ? calculateWaterTargetMl(profile) : 2950

  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-8 sm:px-6 sm:py-10">
      <div>
        <h1 className="font-heading text-3xl text-white sm:text-4xl">
          Nutrition targets
        </h1>
        <p className="mt-2 text-zinc-400">
          General wellness anchors — adjust with a qualified professional if you
          have specific needs.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <MealTargetCard heading="Protein anchor">
          <p>
            Daily target around <span className="text-white">{protein} g</span>{" "}
            protein to support your training week and recovery rhythm.
          </p>
        </MealTargetCard>
        <MealTargetCard heading="Hydration">
          <p>
            Aim near{" "}
            <span className="text-white">
              {(waterMl / 1000).toFixed(1)} L
            </span>{" "}
            water across the day — sip steadily, especially around training.
          </p>
        </MealTargetCard>
      </div>

      <MealTargetCard heading="Simple meal structure">
        <ul className="list-disc space-y-2 pl-5">
          <li>Protein + produce + smart carbs at each main meal.</li>
          <li>One planned snack to avoid random grazing.</li>
          <li>Post-training meal within your usual routine window.</li>
        </ul>
      </MealTargetCard>

      <MealTargetCard heading="Grocery staples">
        <p>
          Greek yogurt, eggs, lean poultry, frozen vegetables, oats, rice, beans,
          mixed greens, olive oil, fruit you actually enjoy.
        </p>
      </MealTargetCard>

      <MealTargetCard heading="Smoothie ideas">
        <ul className="list-disc space-y-2 pl-5">
          <li>Berry protein shake with spinach and flax.</li>
          <li>Banana, peanut butter, milk — simple post-walk fuel.</li>
          <li>Citrus greens blend for a quick morning routine.</li>
        </ul>
      </MealTargetCard>

      <MealTargetCard heading="Supplement interests (compliant copy)">
        <ul className="space-y-3">
          <li>
            <strong className="text-white">Protein:</strong> helps make it easier
            to hit daily protein targets.
          </li>
          <li>
            <strong className="text-white">Creatine:</strong> a popular
            training-support supplement used by many strength athletes.
          </li>
          <li>
            <strong className="text-white">Pre-workout:</strong> designed to
            support energy and focus before training.
          </li>
          <li>
            <strong className="text-white">Collagen:</strong> a simple wellness
            add-on for daily routines.
          </li>
          <li>
            <strong className="text-white">Smoothie powders:</strong> convenient
            mix-ins for quick nutrition routines.
          </li>
        </ul>
        <p className="mt-4 text-xs text-zinc-500">{disclaimer}</p>
      </MealTargetCard>
    </div>
  )
}
