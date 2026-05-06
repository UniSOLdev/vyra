"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import { VYRA_OWNER_HEADER } from "@/lib/vyra-owner"
import { VYRA_PRO_HEADER } from "@/lib/vyra-pro"
import { getOrCreateOwnerId } from "@/lib/vyra-owner-client"
import { isProSubscriber } from "@/lib/vyra-pro-client"
import { getDisciplineMetrics, mondayDateString } from "@/lib/squad-discipline"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { CTAButton } from "@/components/CTAButton"

type Squad = {
  id: string
  name: string
  owner_id: string
  invite_token: string
  created_at: string
}

type ScoreRow = {
  user_id: string
  sessions_completed: number
  consistency_pct: number
  streak_days: number
}

function authHeaders() {
  const id = getOrCreateOwnerId()
  const h: Record<string, string> = { [VYRA_OWNER_HEADER]: id }
  if (isProSubscriber()) h[VYRA_PRO_HEADER] = "1"
  return h
}

export function SquadClient() {
  const search = useSearchParams()
  const joinToken = search.get("join")?.trim() ?? ""

  const [squads, setSquads] = useState<Squad[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [name, setName] = useState("")
  const [board, setBoard] = useState<ScoreRow[]>([])
  const [invite, setInvite] = useState<string | null>(null)
  const [msg, setMsg] = useState<string | null>(null)

  const weekStart = useMemo(() => mondayDateString(), [])

  const loadSquads = useCallback(async () => {
    if (!isProSubscriber()) {
      setSquads([])
      return
    }
    const res = await fetch("/api/squads", { headers: authHeaders() })
    const data = (await res.json()) as { squads?: Squad[] }
    const list = data.squads ?? []
    setSquads(list)
    setActiveId((prev) => prev ?? list[0]?.id ?? null)
  }, [])

  const pushScore = useCallback(
    async (squadId: string) => {
      if (!isProSubscriber()) return
      const m = getDisciplineMetrics()
      await fetch("/api/squads/score", {
        method: "POST",
        headers: { ...authHeaders(), "content-type": "application/json" },
        body: JSON.stringify({
          squadId,
          weekStart,
          sessions_completed: m.sessions_completed,
          consistency_pct: m.consistency_pct,
          streak_days: m.streak_days,
        }),
      })
    },
    [weekStart]
  )

  const loadBoard = useCallback(
    async (squadId: string) => {
      if (!isProSubscriber()) return
      await pushScore(squadId)
      const res = await fetch(
        `/api/squads/leaderboard?squadId=${encodeURIComponent(squadId)}&weekStart=${encodeURIComponent(weekStart)}`,
        { headers: authHeaders() }
      )
      const data = (await res.json()) as { rows?: ScoreRow[] }
      setBoard(data.rows ?? [])
    },
    [pushScore, weekStart]
  )

  useEffect(() => {
    queueMicrotask(() => {
      void loadSquads()
    })
  }, [loadSquads])

  useEffect(() => {
    if (!joinToken || !isProSubscriber()) return
    let cancelled = false
    void (async () => {
      const res = await fetch("/api/squads/join", {
        method: "POST",
        headers: { ...authHeaders(), "content-type": "application/json" },
        body: JSON.stringify({ token: joinToken }),
      })
      if (cancelled) return
      if (res.ok) {
        setMsg("Joined. Hold the line.")
        await loadSquads()
      } else {
        setMsg("Invite invalid or expired.")
      }
    })()
    return () => {
      cancelled = true
    }
  }, [joinToken, loadSquads])

  useEffect(() => {
    if (!activeId || !isProSubscriber()) return
    queueMicrotask(() => {
      void loadBoard(activeId)
    })
  }, [activeId, loadBoard])

  const createSquad = async () => {
    if (!isProSubscriber()) return
    const n = name.trim()
    if (!n) return
    const res = await fetch("/api/squads", {
      method: "POST",
      headers: { ...authHeaders(), "content-type": "application/json" },
      body: JSON.stringify({ name: n }),
    })
    if (!res.ok) return
    const data = (await res.json()) as { squad?: Squad }
    if (data.squad) {
      setName("")
      await loadSquads()
      setActiveId(data.squad.id)
      const origin = typeof window !== "undefined" ? window.location.origin : ""
      setInvite(`${origin}/squad?join=${data.squad.invite_token}`)
    }
  }

  const ownerId = getOrCreateOwnerId()

  if (!isProSubscriber()) {
    return (
      <div className="mx-auto max-w-lg space-y-8 px-4 py-10 sm:px-6">
        <div>
          <h1 className="font-heading text-3xl text-white sm:text-4xl">Squad</h1>
          <p className="mt-2 text-sm text-zinc-500">
            Discipline-first competition. No ego metrics.
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            VYRA Pro
          </p>
          <p className="mt-3 font-heading text-lg text-white">Squad mode is Pro.</p>
          <p className="mt-2 text-sm text-zinc-500">
            Weekly leaderboard, invites, and accountability — locked until Pro
            ships on your account.
          </p>
          <CTAButton
            type="button"
            variant="primary"
            disabled
            className="mt-6 w-full min-h-12 rounded-full opacity-70"
          >
            Upgrade (soon)
          </CTAButton>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl space-y-10 px-4 py-8 sm:px-6 sm:py-10">
      <div>
        <h1 className="font-heading text-3xl text-white sm:text-4xl">Squad</h1>
        <p className="mt-2 text-sm text-zinc-500">
          Sessions completed · Consistency · Streak days. Execute weekly.
        </p>
      </div>

      {msg ? <p className="text-sm text-zinc-400">{msg}</p> : null}

      <section className="space-y-4 rounded-2xl border border-white/10 bg-zinc-900/50 p-5 sm:p-6">
        <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
          Create squad
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Squad name"
            className="h-11 flex-1 rounded-xl border-white/10 bg-black/30 text-white placeholder:text-zinc-600"
          />
          <Button
            type="button"
            variant="outline"
            className="h-11 shrink-0 rounded-full border-white/15"
            onClick={() => void createSquad()}
          >
            Create
          </Button>
        </div>
        {invite ? (
          <p className="break-all text-xs text-zinc-500">
            Invite link: <span className="text-zinc-300">{invite}</span>
          </p>
        ) : null}
      </section>

      <section className="space-y-3 rounded-2xl border border-white/10 bg-black/30 p-5 sm:p-6">
        <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
          Your squads
        </p>
        {squads.length === 0 ? (
          <p className="text-sm text-zinc-500">None yet. Build one.</p>
        ) : (
          <ul className="space-y-2">
            {squads.map((s) => (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => setActiveId(s.id)}
                  className={`w-full rounded-xl border px-4 py-3 text-left text-sm transition-colors ${
                    activeId === s.id
                      ? "border-white/20 bg-white/[0.06] text-white"
                      : "border-white/10 text-zinc-400 hover:border-white/15 hover:text-zinc-200"
                  }`}
                >
                  {s.name}
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {activeId ? (
        <section className="rounded-2xl border border-white/10 bg-zinc-900/50 p-5 sm:p-6">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            This week
          </p>
          <p className="mt-1 text-xs text-zinc-600">Week of {weekStart}</p>
          <ul className="mt-4 space-y-3">
            {board.map((r, i) => (
              <li
                key={`${r.user_id}-${i}`}
                className="flex flex-wrap items-baseline justify-between gap-2 border-b border-white/[0.06] pb-3 text-sm last:border-0 last:pb-0"
              >
                <span className="text-zinc-300">
                  {r.user_id === ownerId ? "You" : `Member ${r.user_id.slice(0, 4)}`}
                </span>
                <span className="text-xs text-zinc-500">
                  Sessions {r.sessions_completed} · Consistency {r.consistency_pct}% ·
                  Streak {r.streak_days}d
                </span>
              </li>
            ))}
          </ul>
          {board.length === 0 ? (
            <p className="mt-3 text-sm text-zinc-500">No scores yet. Train. Sync.</p>
          ) : null}
        </section>
      ) : null}
    </div>
  )
}
