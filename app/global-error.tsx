"use client"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  void error
  return (
    <html lang="en" className="dark">
      <body className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 px-6 text-center text-white">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-vyra-lime">
          VYRA
        </p>
        <h1 className="mt-4 font-sans text-2xl font-semibold">Critical error</h1>
        <p className="mt-2 max-w-sm text-sm text-zinc-400">
          Reload the app. If this repeats after a refresh, check your connection
          and try again.
        </p>
        <button
          type="button"
          onClick={() => reset()}
          className="mt-8 min-h-11 rounded-full bg-vyra-lime px-8 text-sm font-semibold text-zinc-950 transition-opacity hover:opacity-90"
        >
          Retry
        </button>
      </body>
    </html>
  )
}
