import { createClient } from "@/lib/supabase-server"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { RecentTransactions } from "@/components/dashboard/recent-transactions"
import { FinancialChart } from "@/components/dashboard/financial-chart"

export default async function DashboardPage() {
  const supabase = createClient()

  // Fetch dashboard data
  const [{ data: properties }, { data: tenants }, { data: revenues }, { data: expenses }] = await Promise.all([
    supabase.from("properties").select("*"),
    supabase.from("tenants").select("*"),
    supabase.from("revenues").select("*, property:properties(*), category:categories(*)"),
    supabase.from("expenses").select("*, property:properties(*), category:categories(*)"),
  ])

  const totalProperties = properties?.length || 0
  const totalTenants = tenants?.length || 0
  const totalRevenue = revenues?.reduce((sum, rev) => sum + Number(rev.amount), 0) || 0
  const totalExpenses = expenses?.reduce((sum, exp) => sum + Number(exp.amount), 0) || 0

  // Combine transactions for recent activity
  const transactions = [
    ...(revenues?.map((rev) => ({
      id: rev.id,
      type: "revenue" as const,
      description: rev.description,
      amount: Number(rev.amount),
      date: rev.date,
      property: rev.property,
      category: rev.category,
    })) || []),
    ...(expenses?.map((exp) => ({
      id: exp.id,
      type: "expense" as const,
      description: exp.description,
      amount: Number(exp.amount),
      date: exp.date,
      property: exp.property,
      category: exp.category,
    })) || []),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  // Generate chart data (last 6 months)
  const chartData = Array.from({ length: 6 }, (_, i) => {
    const date = new Date()
    date.setMonth(date.getMonth() - i)
    const month = date.toLocaleDateString("en-US", { month: "short" })

    const monthRevenues =
      revenues?.filter(
        (rev) =>
          new Date(rev.date).getMonth() === date.getMonth() && new Date(rev.date).getFullYear() === date.getFullYear(),
      ) || []

    const monthExpenses =
      expenses?.filter(
        (exp) =>
          new Date(exp.date).getMonth() === date.getMonth() && new Date(exp.date).getFullYear() === date.getFullYear(),
      ) || []

    return {
      month,
      revenue: monthRevenues.reduce((sum, rev) => sum + Number(rev.amount), 0),
      expenses: monthExpenses.reduce((sum, exp) => sum + Number(exp.amount), 0),
    }
  }).reverse()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your property management business</p>
      </div>

      <StatsCards
        totalProperties={totalProperties}
        totalTenants={totalTenants}
        totalRevenue={totalRevenue}
        totalExpenses={totalExpenses}
      />

      <div className="grid gap-8 md:grid-cols-2">
        <FinancialChart data={chartData} />
        <RecentTransactions transactions={transactions} />
      </div>
    </div>
  )
}
