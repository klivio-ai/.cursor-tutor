"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useProperties } from "@/hooks/use-properties"
import { useRevenues } from "@/hooks/use-revenues"
import { useExpenses } from "@/hooks/use-expenses"
import { useTenants } from "@/hooks/use-tenants"
import { Building2, Users, TrendingUp, TrendingDown } from "lucide-react"

export function StatsCards() {
  const { properties } = useProperties()
  const { revenues } = useRevenues()
  const { expenses } = useExpenses()
  const { tenants } = useTenants()

  const totalRevenue = revenues.reduce((sum, revenue) => sum + Number(revenue.amount), 0)
  const totalExpenses = expenses.reduce((sum, expense) => sum + Number(expense.amount), 0)
  const netIncome = totalRevenue - totalExpenses

  const stats = [
    {
      title: "Total Properties",
      value: properties.length,
      icon: Building2,
      color: "text-blue-600",
    },
    {
      title: "Total Tenants",
      value: tenants.length,
      icon: Users,
      color: "text-green-600",
    },
    {
      title: "Total Revenue",
      value: `$${totalRevenue.toLocaleString()}`,
      icon: TrendingUp,
      color: "text-emerald-600",
    },
    {
      title: "Total Expenses",
      value: `$${totalExpenses.toLocaleString()}`,
      icon: TrendingDown,
      color: "text-red-600",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
