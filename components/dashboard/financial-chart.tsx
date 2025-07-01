"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { useRevenues } from "@/hooks/use-revenues"
import { useExpenses } from "@/hooks/use-expenses"

export function FinancialChart() {
  const { revenues } = useRevenues()
  const { expenses } = useExpenses()

  // Group data by month
  const monthlyData = revenues.reduce(
    (acc, revenue) => {
      const month = new Date(revenue.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
      })

      if (!acc[month]) {
        acc[month] = { month, revenue: 0, expenses: 0 }
      }

      acc[month].revenue += Number(revenue.amount)
      return acc
    },
    {} as Record<string, { month: string; revenue: number; expenses: number }>,
  )

  expenses.forEach((expense) => {
    const month = new Date(expense.date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    })

    if (!monthlyData[month]) {
      monthlyData[month] = { month, revenue: 0, expenses: 0 }
    }

    monthlyData[month].expenses += Number(expense.amount)
  })

  const chartData = Object.values(monthlyData).sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime())

  const chartConfig = {
    revenue: {
      label: "Revenue",
      color: "hsl(var(--chart-1))",
    },
    expenses: {
      label: "Expenses",
      color: "hsl(var(--chart-2))",
    },
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Financial Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line type="monotone" dataKey="revenue" stroke="var(--color-revenue)" strokeWidth={2} />
              <Line type="monotone" dataKey="expenses" stroke="var(--color-expenses)" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
