"use client"

import { useMemo, useState } from "react"
import type { ProgressEntry } from "@/lib/types"
import {
  deleteProgressLog,
  getProgressLogs,
  saveProgressLog,
} from "@/lib/storage"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

function uid() {
  return `prog-${Math.random().toString(36).slice(2, 10)}`
}

export function ProgressLog() {
  const [entries, setEntries] = useState<ProgressEntry[]>(() =>
    getProgressLogs()
  )
  const [form, setForm] = useState<ProgressEntry>({
    id: uid(),
    date: new Date().toISOString().slice(0, 10),
  })

  const refresh = () => setEntries(getProgressLogs())

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    saveProgressLog(form)
    window.dispatchEvent(new Event("vyra-storage"))
    setForm({ id: uid(), date: form.date })
    refresh()
  }

  const trend = useMemo(() => {
    const ws = entries
      .map((e) => e.weightLb)
      .filter((w): w is number => typeof w === "number" && !Number.isNaN(w))
    if (ws.length < 2) return null
    const last = ws[ws.length - 1]
    const prev = ws[ws.length - 2]
    return last - prev
  }, [entries])

  return (
    <div className="space-y-8">
      <form
        onSubmit={submit}
        className="grid gap-4 rounded-2xl border border-white/10 bg-zinc-900/40 p-4 sm:grid-cols-2 sm:p-5"
      >
        <div className="sm:col-span-2">
          <Label className="text-zinc-400">Date</Label>
          <Input
            type="date"
            required
            value={form.date}
            onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
            className="mt-1 border-white/10 bg-zinc-950 text-white"
          />
        </div>
        <div>
          <Label className="text-zinc-400">Weight (lb)</Label>
          <Input
            type="number"
            step="0.1"
            value={form.weightLb ?? ""}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                weightLb: e.target.value
                  ? Number(e.target.value)
                  : undefined,
              }))
            }
            className="mt-1 border-white/10 bg-zinc-950 text-white"
          />
        </div>
        <div>
          <Label className="text-zinc-400">Weekly notes</Label>
          <Input
            value={form.notes ?? ""}
            onChange={(e) =>
              setForm((f) => ({ ...f, notes: e.target.value || undefined }))
            }
            className="mt-1 border-white/10 bg-zinc-950 text-white"
          />
        </div>
        <div>
          <Label className="text-zinc-400">Waist (in)</Label>
          <Input
            type="number"
            step="0.1"
            value={form.waistIn ?? ""}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                waistIn: e.target.value ? Number(e.target.value) : undefined,
              }))
            }
            className="mt-1 border-white/10 bg-zinc-950 text-white"
          />
        </div>
        <div>
          <Label className="text-zinc-400">Chest (in)</Label>
          <Input
            type="number"
            step="0.1"
            value={form.chestIn ?? ""}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                chestIn: e.target.value ? Number(e.target.value) : undefined,
              }))
            }
            className="mt-1 border-white/10 bg-zinc-950 text-white"
          />
        </div>
        <div>
          <Label className="text-zinc-400">Arms (in)</Label>
          <Input
            type="number"
            step="0.1"
            value={form.armsIn ?? ""}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                armsIn: e.target.value ? Number(e.target.value) : undefined,
              }))
            }
            className="mt-1 border-white/10 bg-zinc-950 text-white"
          />
        </div>
        <div>
          <Label className="text-zinc-400">Legs (in)</Label>
          <Input
            type="number"
            step="0.1"
            value={form.legsIn ?? ""}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                legsIn: e.target.value ? Number(e.target.value) : undefined,
              }))
            }
            className="mt-1 border-white/10 bg-zinc-950 text-white"
          />
        </div>
        <div className="sm:col-span-2">
          <Button type="submit" className="rounded-full bg-vyra-lime text-zinc-950">
            Save entry
          </Button>
        </div>
      </form>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
          <p className="text-xs uppercase text-zinc-500">Entries</p>
          <p className="mt-2 font-heading text-2xl text-white">{entries.length}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
          <p className="text-xs uppercase text-zinc-500">Weight trend</p>
          <p className="mt-2 font-heading text-2xl text-vyra-lime">
            {trend == null ? "—" : `${trend > 0 ? "+" : ""}${trend.toFixed(1)} lb`}
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
          <p className="text-xs uppercase text-zinc-500">Photos</p>
          <p className="mt-2 text-sm text-zinc-400">
            Placeholder — attach progress photos in a future update.
          </p>
        </div>
      </div>

      <ul className="space-y-3">
        {[...entries]
          .sort((a, b) => b.date.localeCompare(a.date))
          .map((e) => (
            <li
              key={e.id}
              className="flex flex-col gap-2 rounded-xl border border-white/10 bg-zinc-900/50 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="text-sm font-medium text-white">{e.date}</p>
                <p className="text-xs text-zinc-500">
                  {e.weightLb != null ? `${e.weightLb} lb` : "—"}
                  {e.waistIn != null ? ` · waist ${e.waistIn}"` : ""}
                </p>
                {e.notes ? (
                  <p className="mt-1 text-sm text-zinc-400">{e.notes}</p>
                ) : null}
              </div>
              <Button
                type="button"
                variant="ghost"
                className="self-start text-zinc-500 hover:text-red-400"
                onClick={() => {
                  deleteProgressLog(e.id)
                  window.dispatchEvent(new Event("vyra-storage"))
                  refresh()
                }}
              >
                Delete
              </Button>
            </li>
          ))}
      </ul>
    </div>
  )
}
