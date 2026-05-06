"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Plus, Trash2 } from "lucide-react"
import type { Exercise, WorkoutDay } from "@/lib/types"
import { createSupabaseBrowserClient } from "@/lib/supabase/browser"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"

function uid() {
  return `ex-${Math.random().toString(36).slice(2, 9)}`
}

type SetRow = {
  reps: number | null
  rpe: number | null
  completed: boolean
}

export function WorkoutCard({
  day,
  onChange,
  sessionDate,
}: {
  day: WorkoutDay
  onChange: (next: WorkoutDay) => void
  sessionDate: string
}) {
  const [draftName, setDraftName] = useState("")
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [setRows, setSetRows] = useState<Record<string, Record<number, SetRow>>>({})
  const saveTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({})

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

  useEffect(() => {
    let cancelled = false
    const run = async () => {
      const supabase = createSupabaseBrowserClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user || cancelled) return

      const { data: session, error } = await supabase
        .from("workout_sessions")
        .upsert(
          {
            user_id: user.id,
            session_date: sessionDate,
            day_id: day.id,
            day_name: day.name,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id,session_date,day_id" }
        )
        .select("id")
        .single()

      if (error || !session?.id || cancelled) return
      setSessionId(session.id)

      const { data: logs } = await supabase
        .from("workout_set_logs")
        .select("exercise_id, set_index, reps, rpe, completed")
        .eq("session_id", session.id)

      const next: Record<string, Record<number, SetRow>> = {}
      for (const row of logs ?? []) {
        if (!row.exercise_id) continue
        next[row.exercise_id] = next[row.exercise_id] ?? {}
        next[row.exercise_id][row.set_index] = {
          reps: row.reps ?? null,
          rpe: row.rpe ?? null,
          completed: !!row.completed,
        }
      }
      setSetRows(next)
    }
    void run()
    return () => {
      cancelled = true
    }
  }, [day.id, day.name, sessionDate])

  const scheduleSave = useCallback(
    (exerciseId: string, setIndex: number, row: SetRow, exerciseName: string) => {
      if (!sessionId) return
      const key = `${exerciseId}:${setIndex}`
      if (saveTimers.current[key]) clearTimeout(saveTimers.current[key])
      saveTimers.current[key] = setTimeout(async () => {
        const supabase = createSupabaseBrowserClient()
        await supabase.from("workout_set_logs").upsert(
          {
            session_id: sessionId,
            exercise_id: exerciseId,
            exercise_name: exerciseName,
            set_index: setIndex,
            reps: row.reps ?? null,
            rpe: row.rpe,
            completed: row.completed,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "session_id,exercise_id,set_index" }
        )
      }, 350)
    },
    [sessionId]
  )

  const patchSetRow = (exerciseId: string, exerciseName: string, setIndex: number, patch: Partial<SetRow>) => {
    setSetRows((prev) => {
      const exMap = { ...(prev[exerciseId] ?? {}) }
      const cur: SetRow = {
        reps: exMap[setIndex]?.reps ?? null,
        rpe: exMap[setIndex]?.rpe ?? null,
        completed: exMap[setIndex]?.completed ?? false,
        ...patch,
      }
      exMap[setIndex] = cur
      scheduleSave(exerciseId, setIndex, cur, exerciseName)
      return { ...prev, [exerciseId]: exMap }
    })
  }

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
                <div className="mt-3 space-y-2 rounded-lg border border-white/10 bg-zinc-950/60 p-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
                    Logged sets ({sessionDate})
                  </p>
                  <div className="space-y-2">
                    {Array.from({ length: Math.max(1, ex.sets) }).map((_, i) => {
                      const setIndex = i + 1
                      const row = setRows[ex.id]?.[setIndex] ?? {
                        reps: null,
                        rpe: null,
                        completed: false,
                      }
                      return (
                        <div
                          key={setIndex}
                          className="grid gap-2 sm:grid-cols-[1fr_1fr_1fr_auto] sm:items-end"
                        >
                          <label className="text-[11px] text-zinc-500">
                            Set {setIndex} reps
                            <Input
                              type="number"
                              min={0}
                              value={row.reps ?? ""}
                              placeholder="—"
                              onChange={(e) =>
                                patchSetRow(ex.id, ex.name, setIndex, {
                                  reps: e.target.value === "" ? null : Number(e.target.value),
                                })
                              }
                              className="mt-1 border-white/10 bg-zinc-950 text-white"
                            />
                          </label>
                          <label className="text-[11px] text-zinc-500">
                            RPE 1–10
                            <Input
                              type="number"
                              min={1}
                              max={10}
                              value={row.rpe ?? ""}
                              placeholder="—"
                              onChange={(e) =>
                                patchSetRow(ex.id, ex.name, setIndex, {
                                  rpe:
                                    e.target.value === ""
                                      ? null
                                      : Math.min(10, Math.max(1, Number(e.target.value))),
                                })
                              }
                              className="mt-1 border-white/10 bg-zinc-950 text-white"
                            />
                          </label>
                          <label className="flex items-center gap-2 text-[11px] text-zinc-400 sm:pb-2">
                            <Checkbox
                              checked={row.completed}
                              onCheckedChange={(c) =>
                                patchSetRow(ex.id, ex.name, setIndex, { completed: !!c })
                              }
                            />
                            Done
                          </label>
                        </div>
                      )
                    })}
                  </div>
                </div>
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
