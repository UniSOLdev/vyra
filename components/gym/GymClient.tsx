"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { VYRA_OWNER_HEADER } from "@/lib/vyra-owner"
import { getOrCreateOwnerId } from "@/lib/vyra-owner-client"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { CTAButton } from "@/components/CTAButton"
import { cn } from "@/lib/utils"

const PRESETS = [
  "Plate-loaded",
  "Cable",
  "Dumbbell",
  "Barbell",
  "Cardio",
  "Bodyweight",
] as const

type MachineRow = { machine_name: string; machine_type: string }

function isPresetRow(m: MachineRow) {
  return (PRESETS as readonly string[]).includes(m.machine_type) && m.machine_name === m.machine_type
}

export function GymClient() {
  const ownerHeaders = useMemo(() => {
    const id = getOrCreateOwnerId()
    return { [VYRA_OWNER_HEADER]: id }
  }, [])

  const [gymName, setGymName] = useState("")
  const [machines, setMachines] = useState<MachineRow[]>([])
  const [customName, setCustomName] = useState("")
  const [customType, setCustomType] = useState<string>("Plate-loaded")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [savedAt, setSavedAt] = useState<number | null>(null)

  const selectedPresets = useMemo(() => {
    const s = new Set<string>()
    for (const m of machines) {
      if (isPresetRow(m)) s.add(m.machine_type)
    }
    return s
  }, [machines])

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/gyms", { headers: ownerHeaders })
      const data = (await res.json()) as {
        gym?: { gym_name: string } | null
        machines?: MachineRow[]
      }
      if (data.gym?.gym_name) setGymName(data.gym.gym_name)
      setMachines(data.machines ?? [])
    } finally {
      setLoading(false)
    }
  }, [ownerHeaders])

  useEffect(() => {
    queueMicrotask(() => {
      void load()
    })
  }, [load])

  const togglePreset = (p: string) => {
    setMachines((prev) => {
      const has = prev.some((m) => isPresetRow(m) && m.machine_type === p)
      if (has) {
        return prev.filter((m) => !(isPresetRow(m) && m.machine_type === p))
      }
      return [...prev, { machine_name: p, machine_type: p }]
    })
  }

  const addCustom = () => {
    const name = customName.trim()
    if (!name) return
    setMachines((prev) => [
      ...prev,
      { machine_name: name, machine_type: customType },
    ])
    setCustomName("")
  }

  const removeRow = (idx: number) => {
    setMachines((prev) => prev.filter((_, i) => i !== idx))
  }

  const save = async () => {
    const name = gymName.trim() || "My gym"
    setSaving(true)
    setSavedAt(null)
    try {
      const res = await fetch("/api/gyms", {
        method: "POST",
        headers: { ...ownerHeaders, "content-type": "application/json" },
        body: JSON.stringify({ gymName: name, machines }),
      })
      if (res.ok) {
        setSavedAt(Date.now())
        await load()
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-10 px-4 py-8 sm:px-6 sm:py-10">
      <div>
        <h1 className="font-heading text-3xl text-white sm:text-4xl">Gym</h1>
        <p className="mt-2 text-sm text-zinc-500">
          Name your space. Lock in the equipment you actually touch. Built to
          repeat.
        </p>
      </div>

      <section className="space-y-4 rounded-2xl border border-white/10 bg-zinc-900/50 p-5 sm:p-6">
        <label className="block space-y-2">
          <span className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            Gym name
          </span>
          <Input
            value={gymName}
            onChange={(e) => setGymName(e.target.value)}
            placeholder="Home base"
            className="h-11 rounded-xl border-white/10 bg-black/30 text-white placeholder:text-zinc-600"
          />
        </label>
      </section>

      <section className="space-y-4 rounded-2xl border border-white/10 bg-zinc-900/50 p-5 sm:p-6">
        <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
          Preset equipment
        </p>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => togglePreset(p)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                selectedPresets.has(p)
                  ? "border-white/25 bg-white/[0.08] text-white"
                  : "border-white/10 text-zinc-400 hover:border-white/20 hover:text-zinc-200"
              )}
            >
              {p}
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border border-white/10 bg-zinc-900/50 p-5 sm:p-6">
        <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
          Custom machine
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <Input
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            placeholder="Machine name"
            className="h-11 flex-1 rounded-xl border-white/10 bg-black/30 text-white placeholder:text-zinc-600"
          />
          <select
            value={customType}
            onChange={(e) => setCustomType(e.target.value)}
            className="h-11 min-h-11 rounded-xl border border-white/10 bg-black/30 px-3 text-sm text-white outline-none"
          >
            {PRESETS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          <Button
            type="button"
            variant="outline"
            className="h-11 rounded-full border-white/15"
            onClick={addCustom}
          >
            Add
          </Button>
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-black/30 p-5 sm:p-6">
        <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
          Current list
        </p>
        {loading ? (
          <p className="mt-3 text-sm text-zinc-500">Loading…</p>
        ) : machines.length === 0 ? (
          <p className="mt-3 text-sm text-zinc-500">Nothing yet. Hold the line.</p>
        ) : (
          <ul className="mt-4 space-y-2 text-sm text-zinc-300">
            {machines.map((m, i) => (
              <li
                key={`${m.machine_name}-${m.machine_type}-${i}`}
                className="flex items-center justify-between gap-2 border-b border-white/[0.06] py-2 last:border-0"
              >
                <span>
                  <span className="text-white">{m.machine_name}</span>
                  <span className="text-zinc-600"> · {m.machine_type}</span>
                </span>
                <button
                  type="button"
                  className="text-xs text-zinc-500 hover:text-white"
                  onClick={() => removeRow(i)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="flex flex-wrap items-center gap-3">
        <CTAButton
          type="button"
          variant="primary"
          size="lg"
          className="min-h-12 rounded-full px-8"
          disabled={saving}
          onClick={() => void save()}
        >
          {saving ? "Saving…" : "Save gym"}
        </CTAButton>
        {savedAt ? (
          <span className="text-xs text-zinc-500">Saved. Stay sharp.</span>
        ) : null}
      </div>
    </div>
  )
}
