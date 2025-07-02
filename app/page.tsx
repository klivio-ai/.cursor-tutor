import { createClient } from "@/lib/supabase-server"
import { redirect } from "next/navigation"
import { MainLayout } from "@/components/layout/main-layout"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { RecentTransactions } from "@/components/dashboard/recent-transactions"
import { FinancialChart } from "@/components/dashboard/financial-chart"

export default async function HomePage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth")
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's an overview of your property portfolio.</p>
        </div>

        <StatsCards />

        <div className="grid gap-6 md:grid-cols-2">
          <FinancialChart />
          <RecentTransactions />
        </div>
      </div>
    </MainLayout>
  )
}
