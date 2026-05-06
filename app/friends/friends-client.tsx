"use client"

import { useCallback, useEffect, useState } from "react"
import { addFriendByUsernameAction, removeFriendshipAction } from "@/app/actions/vyra"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { CTAButton } from "@/components/CTAButton"

type Row = {
  userId: string
  username: string
  score: number
  workoutPct: number
  isSelf: boolean
}

export function FriendsClient({ initialRows }: { initialRows: Row[] }) {
  const [rows, setRows] = useState(initialRows)
  const [handle, setHandle] = useState("")
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    const res = await fetch("/api/friends/leaderboard", { cache: "no-store" })
    if (!res.ok) return
    const json = (await res.json()) as { rows: Row[] }
    setRows(json.rows)
  }, [])

  useEffect(() => {
    const boot = window.setTimeout(() => void refresh(), 0)
    const id = window.setInterval(() => void refresh(), 25000)
    return () => {
      window.clearTimeout(boot)
      window.clearInterval(id)
    }
  }, [refresh])

  const addFriend = async () => {
    setError(null)
    const res = await addFriendByUsernameAction(handle)
    if (res?.error) setError(res.error)
    setHandle("")
    await refresh()
  }

  return (
    <div className="mx-auto max-w-3xl space-y-10 px-4 py-10 sm:px-6 sm:py-14">
      <header className="space-y-2">
        <p className="text-caption text-vyra-lime">Competition</p>
        <h1 className="text-section-title">Friends</h1>
        <p className="text-body max-w-xl text-sm text-zinc-400">
          Weekly discipline leaderboard with your connections. Refreshes automatically.
        </p>
      </header>

      <section className="rounded-3xl border border-white/10 bg-zinc-900/40 p-6 ring-1 ring-white/[0.06]">
        <p className="text-sm font-medium text-white">Add by username</p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Input
            value={handle}
            onChange={(e) => setHandle(e.target.value)}
            placeholder="friend_handle"
            className="min-h-11 border-white/10 bg-zinc-950 text-white sm:max-w-xs"
          />
          <Button type="button" variant="outline" className="min-h-11 rounded-full border-white/15" onClick={() => void addFriend()}>
            Add friend
          </Button>
        </div>
        {error ? <p className="mt-3 text-sm text-red-400">{error}</p> : null}
      </section>

      <section className="overflow-hidden rounded-3xl border border-white/10 bg-black/30 ring-1 ring-white/[0.05]">
        <div className="grid grid-cols-[1fr_1fr_1fr_auto] gap-3 border-b border-white/10 px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-zinc-500 sm:px-6">
          <span>Username</span>
          <span className="text-right">Discipline</span>
          <span className="text-right">Training</span>
          <span />
        </div>
        <ul>
          {rows.map((r, idx) => (
            <li
              key={r.userId}
              className="grid grid-cols-[1fr_1fr_1fr_auto] items-center gap-3 border-b border-white/[0.06] px-4 py-4 text-sm sm:px-6"
            >
              <span className="font-medium text-white">
                {idx + 1}. {r.username}
                {r.isSelf ? <span className="ml-2 text-[10px] uppercase text-zinc-500">You</span> : null}
              </span>
              <span className="text-right font-heading text-lg text-vyra-lime">{Math.round(r.score)}</span>
              <span className="text-right text-zinc-400">{Math.round(r.workoutPct)}%</span>
              <span className="text-right">
                {!r.isSelf ? (
                  <button
                    type="button"
                    className="text-xs text-zinc-500 hover:text-red-400"
                    onClick={() => void removeFriendshipAction(r.userId).then(() => refresh())}
                  >
                    Remove
                  </button>
                ) : null}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <div className="rounded-2xl border border-white/10 bg-zinc-900/30 p-5 text-sm text-zinc-500">
        Free accounts include up to three friends. Pro unlocks unlimited connections and deeper insights.
        <div className="mt-4">
          <CTAButton href="/insights" variant="ghost" size="default">
            Pro insights
          </CTAButton>
        </div>
      </div>
    </div>
  )
}
