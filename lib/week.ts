/** Week boundaries for scoring and rotation (Monday start, local calendar). */

export function startOfWeekMonday(d: Date): Date {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  const day = x.getDay() // 0 Sun .. 6 Sat
  const diff = (day + 6) % 7 // Mon=0
  x.setDate(x.getDate() - diff)
  return x
}

export function toISODate(d: Date): string {
  const y = d.getFullYear()
  const m = `${d.getMonth() + 1}`.padStart(2, "0")
  const day = `${d.getDate()}`.padStart(2, "0")
  return `${y}-${m}-${day}`
}

export function weekStartMondayISO(d = new Date()): string {
  return toISODate(startOfWeekMonday(d))
}

export function todayISO(d = new Date()): string {
  return toISODate(d)
}

export function addDaysToISO(iso: string, days: number): string {
  const d = new Date(`${iso}T12:00:00`)
  d.setDate(d.getDate() + days)
  return toISODate(d)
}

/** Index into rotating plan (0..n-1) from week start anchor. */
export function rotatingDayIndex(weekStartISO: string, numDays: number, d = new Date()): number {
  if (numDays <= 0) return 0
  const start = new Date(`${weekStartISO}T12:00:00`)
  const cur = new Date(d)
  start.setHours(0, 0, 0, 0)
  cur.setHours(0, 0, 0, 0)
  const diff = Math.round((cur.getTime() - start.getTime()) / 86400000)
  const idx = ((diff % numDays) + numDays) % numDays
  return idx
}
