"use client"

function SparkLine({
  values,
  height = 96,
}: {
  values: { label: string; value: number }[]
  height?: number
}) {
  if (!values.length) return <p className="text-sm text-zinc-500">No history yet.</p>
  const w = 320
  const max = Math.max(1, ...values.map((v) => v.value))
  const min = 0
  const pts = values.map((v, i) => {
    const x = (i / Math.max(1, values.length - 1)) * (w - 8) + 4
    const y = height - 4 - ((v.value - min) / (max - min)) * (height - 8)
    return `${x},${y}`
  })
  const d = `M ${pts.join(" L ")}`
  return (
    <svg viewBox={`0 0 ${w} ${height}`} className="w-full max-w-full text-vyra-lime" role="img" aria-label="Trend">
      <rect x={0} y={0} width={w} height={height} fill="transparent" />
      <path d={d} fill="none" stroke="currentColor" strokeWidth="2" opacity={0.9} />
      {values.map((v, i) => {
        const x = (i / Math.max(1, values.length - 1)) * (w - 8) + 4
        const y = height - 4 - ((v.value - min) / (max - min)) * (height - 8)
        return <circle key={v.label} cx={x} cy={y} r={3} fill="currentColor" opacity={0.85} />
      })}
    </svg>
  )
}

export function TrendCharts({
  disciplineSeries,
  habitSeries,
}: {
  disciplineSeries: { label: string; value: number }[]
  habitSeries: { label: string; value: number }[]
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-3xl border border-white/10 bg-zinc-900/40 p-6 ring-1 ring-white/[0.06]">
        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Discipline (4 weeks)</p>
        <p className="mt-2 text-sm text-zinc-400">Weekly composite score.</p>
        <div className="mt-6">
          <SparkLine values={disciplineSeries} />
        </div>
      </div>
      <div className="rounded-3xl border border-white/10 bg-zinc-900/40 p-6 ring-1 ring-white/[0.06]">
        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Habit consistency (4 weeks)</p>
        <p className="mt-2 text-sm text-zinc-400">Portion of weekly habits completed.</p>
        <div className="mt-6">
          <SparkLine values={habitSeries} />
        </div>
      </div>
    </div>
  )
}
