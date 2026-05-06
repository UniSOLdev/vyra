import { AppShell } from "@/components/AppShell"
import { HabitChecklist } from "@/components/habits/HabitChecklist"

export default function HabitsPage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-10">
        <h1 className="font-heading text-3xl text-white sm:text-4xl">
          Habit tracker
        </h1>
        <p className="mt-2 text-zinc-400">
          Stack small wins — data saves on this device via localStorage.
        </p>
        <div className="mt-8">
          <HabitChecklist />
        </div>
      </div>
    </AppShell>
  )
}
