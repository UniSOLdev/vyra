"use client"

import { useMemo, useState } from "react"
import { Plus, Trash2 } from "lucide-react"
import type { Exercise, WorkoutDay } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
function uid() {
  return `ex-${Math.random().toString(36).slice(2, 9)}`
}

export function WorkoutCard({
  day,
  onChange,
}: {
  day: WorkoutDay
  onChange: (next: WorkoutDay) => void
}) {
  const [draftName, setDraftName] = useState("")

  const updateExercise = (id: string, patch: Partial<Exercise>) => {
    onChange({
      ...day,
      exercises: day.exercises.map((e) => (e.id === id ? { ...e, ...patch } : e)),
    })
  }

  const removeExercise = (id: string) => {
    onChange({
      ...day,
      exercises: day.exercises.filter((e) => e.id !== id),
    })
  }

  const addExercise = () => {
    const name = draftName.trim() || "New movement"
    onChange({
      ...day,
      exercises: [
        ...day.exercises,
        {
          id: uid(),
          name,
          sets: 3,
          reps: "8–12",
          rest: "90s",
          notes: "Adjust load to keep clean reps.",
          completed: false,
        },
      ],
    })
    setDraftName("")
  }

  const allDone = useMemo(
    () => day.exercises.length > 0 && day.exercises.every((e) => e.completed),
    [day.exercises]
  )

  return (
    <article className="rounded-2xl border border-white/10 bg-zinc-900/50 p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-zinc-500">Session</p>
          <h3 className="font-heading text-xl text-white">{day.name}</h3>
        </div>
        <label className="flex items-center gap-2 text-sm text-zinc-300">
          <Checkbox
            checked={!!day.dayCompleted || allDone}
            onCheckedChange={(c) =>
              onChange({
                ...day,
                dayCompleted: !!c,
                exercises: day.exercises.map((e) => ({
                  ...e,
                  completed: !!c ? true : e.completed,
                })),
              })
            }
          />
          Workout complete
        </label>
      </div>
      <div className="mt-4 space-y-4">
        {day.exercises.map((ex) => (
          <div
            key={ex.id}
            className="rounded-xl border border-white/10 bg-black/30 p-3 sm:p-4"
          >
            <div className="flex flex-wrap items-start gap-3">
              <Checkbox
                checked={!!ex.completed}
                onCheckedChange={(checked) =>
                  updateExercise(ex.id, { completed: !!checked })
                }
              />
              <div className="min-w-0 flex-1 space-y-2">
                <Input
                  value={ex.name}
                  onChange={(e) => updateExercise(ex.id, { name: e.target.value })}
                  className="border-white/10 bg-zinc-950 text-white"
                />
                <div className="grid gap-2 sm:grid-cols-3">
                  <label className="text-xs text-zinc-500">
                    Sets
                    <Input
                      type="number"
                      min={1}
                      value={ex.sets}
                      onChange={(e) =>
                        updateExercise(ex.id, {
                          sets: Number(e.target.value) || 1,
                        })
                      }
                      className="mt-1 border-white/10 bg-zinc-950 text-white"
                    />
                  </label>
                  <label className="text-xs text-zinc-500">
                    Reps
                    <Input
                      value={ex.reps}
                      onChange={(e) =>
                        updateExercise(ex.id, { reps: e.target.value })
                      }
                      className="mt-1 border-white/10 bg-zinc-950 text-white"
                    />
                  </label>
                  <label className="text-xs text-zinc-500">
                    Rest
                    <Input
                      value={ex.rest}
                      onChange={(e) =>
                        updateExercise(ex.id, { rest: e.target.value })
                      }
                      className="mt-1 border-white/10 bg-zinc-950 text-white"
                    />
                  </label>
                </div>
                <Input
                  value={ex.notes ?? ""}
                  placeholder="Notes"
                  onChange={(e) =>
                    updateExercise(ex.id, { notes: e.target.value })
                  }
                  className="border-white/10 bg-zinc-950 text-sm text-white"
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="shrink-0 text-zinc-500 hover:text-red-400"
                onClick={() => removeExercise(ex.id)}
                aria-label="Remove exercise"
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
        <Input
          placeholder="Exercise name to add"
          value={draftName}
          onChange={(e) => setDraftName(e.target.value)}
          className="border-white/10 bg-zinc-950 text-white sm:max-w-xs"
        />
        <Button
          type="button"
          variant="outline"
          className="rounded-full border-white/15"
          onClick={addExercise}
        >
          <Plus className="size-4" />
          Add exercise
        </Button>
      </div>
    </article>
  )
}
