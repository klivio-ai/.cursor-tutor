"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import { TrendingUp, TrendingDown, Building2, Users } from "lucide-react"
import { useProperties } from "@/hooks/use-properties"
import { useRevenues } from "@/hooks/use-revenues"
import { useExpenses } from "@/hooks/use-expenses"
import { useTenants } from "@/hooks/use-tenants"

export function StatsCards() {
  const { properties } = useProperties()
  const { revenues } = useRevenues()
  const { expenses } = useExpenses()
  const { tenants } = useTenants()

  // Calculate totals
  const totalRevenue = revenues.reduce((sum, revenue) => sum + revenue.amount, 0)
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)
  const netIncome = totalRevenue - totalExpenses
  const totalProperties = properties.length
  const activeTenants = tenants.filter((tenant) => tenant.status === "active").length

  const stats = [
    {
      title: "Total Revenue",
      value: formatCurrency(totalRevenue),
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Total Expenses",
      value: formatCurrency(totalExpenses),
      icon: TrendingDown,
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
    {
      title: "Net Income",
      value: formatCurrency(netIncome),
      icon: netIncome >= 0 ? TrendingUp : TrendingDown,
      color: netIncome >= 0 ? "text-green-600" : "text-red-600",
      bgColor: netIncome >= 0 ? "bg-green-100" : "bg-red-100",
    },
    {
      title: "Properties",
      value: totalProperties.toString(),
      icon: Building2,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Active Tenants",
      value: activeTenants.toString(),
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <div className={`p-2 rounded-full ${stat.bgColor}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
