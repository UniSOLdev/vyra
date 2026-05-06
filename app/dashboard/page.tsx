import { AppShell } from "@/components/AppShell"
import { DashboardClient } from "./dashboard-client"

export default function DashboardPage() {
  return (
    <AppShell>
      <DashboardClient />
    </AppShell>
  )
}
