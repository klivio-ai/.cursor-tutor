"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { useRevenues } from "@/hooks/use-revenues"
import { useExpenses } from "@/hooks/use-expenses"

export function FinancialChart() {
  const { revenues } = useRevenues()
  const { expenses } = useExpenses()

  // Group data by month
  const monthlyData = new Map()

  revenues.forEach((revenue) => {
    const month = new Date(revenue.date).toISOString().slice(0, 7) // YYYY-MM
    if (!monthlyData.has(month)) {
      monthlyData.set(month, { month, revenue: 0, expenses: 0 })
    }
    monthlyData.get(month).revenue += revenue.amount
  })

  expenses.forEach((expense) => {
    const month = new Date(expense.date).toISOString().slice(0, 7) // YYYY-MM
    if (!monthlyData.has(month)) {
      monthlyData.set(month, { month, revenue: 0, expenses: 0 })
    }
    monthlyData.get(month).expenses += expense.amount
  })

  const chartData = Array.from(monthlyData.values())
    .sort((a, b) => a.month.localeCompare(b.month))
    .map((data) => ({
      ...data,
      netIncome: data.revenue - data.expenses,
      monthName: new Date(data.month + "-01").toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      }),
    }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Financial Overview</CardTitle>
        <CardDescription>Monthly revenue, expenses, and net income</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            revenue: {
              label: "Revenue",
              color: "hsl(var(--chart-1))",
            },
            expenses: {
              label: "Expenses",
              color: "hsl(var(--chart-2))",
            },
            netIncome: {
              label: "Net Income",
              color: "hsl(var(--chart-3))",
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="monthName" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
              <YAxis
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value.toLocaleString()}`}
              />
              <ChartTooltip
                content={<ChartTooltipContent />}
                formatter={(value: number) => [`$${value.toLocaleString()}`, ""]}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="var(--color-revenue)"
                strokeWidth={2}
                dot={{ fill: "var(--color-revenue)", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="expenses"
                stroke="var(--color-expenses)"
                strokeWidth={2}
                dot={{ fill: "var(--color-expenses)", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="netIncome"
                stroke="var(--color-netIncome)"
                strokeWidth={2}
                dot={{ fill: "var(--color-netIncome)", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
