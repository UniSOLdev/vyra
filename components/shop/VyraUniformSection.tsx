import Link from "next/link"

export function VyraUniformSection() {
  return (
    <section className="rounded-2xl border border-white/10 bg-zinc-950/80 p-6 sm:p-8">
      <p className="text-caption text-zinc-500">VYRA Uniform</p>
      <h2 className="mt-2 font-heading text-xl font-semibold tracking-tight text-white sm:text-2xl">
        Minimal staples built for repeat training weeks.
      </h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Link
          href="/shop/vyra-performance-tee"
          className="group flex flex-col rounded-xl border border-white/10 bg-black/30 p-4 transition-colors hover:border-white/20"
        >
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            Featured
          </p>
          <p className="mt-2 font-heading text-base font-semibold text-white">
            VYRA Performance Tee
          </p>
          <p className="mt-1 text-xs text-zinc-500">Built to repeat.</p>
          <span className="mt-3 text-xs font-medium text-zinc-400 group-hover:text-zinc-200">
            View →
          </span>
        </Link>
        <Link
          href="/shop/vyra-steel-water-bottle"
          className="group flex flex-col rounded-xl border border-white/10 bg-black/30 p-4 transition-colors hover:border-white/20"
        >
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            Featured
          </p>
          <p className="mt-2 font-heading text-base font-semibold text-white">
            VYRA Steel Water Bottle
          </p>
          <p className="mt-1 text-xs text-zinc-500">Stay sharp.</p>
          <span className="mt-3 text-xs font-medium text-zinc-400 group-hover:text-zinc-200">
            View →
          </span>
        </Link>
      </div>
    </section>
  )
}
