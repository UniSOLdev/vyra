import { AppShell } from "@/components/AppShell"
import { WorkoutsClient } from "./workouts-client"

export default function WorkoutsPage() {
  return (
    <AppShell>
      <WorkoutsClient />
    </AppShell>
  )
}
