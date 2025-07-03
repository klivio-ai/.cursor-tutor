"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { formatCurrency } from "@/lib/utils"
import type { Database } from "@/types/database"

type Revenue = Database["public"]["Tables"]["revenues"]["Row"]
type Expense = Database["public"]["Tables"]["expenses"]["Row"]

interface FinancialChartProps {
  revenues: Revenue[]
  expenses: Expense[]
}

export function FinancialChart({ revenues, expenses }: FinancialChartProps) {
  // Group data by month for the last 6 months
  const getLast6Months = () => {
    const months = []
    const now = new Date()
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      months.push({
        month: date.toLocaleDateString("fr-FR", { month: "short" }),
        revenue: 0,
        expense: 0,
        net: 0,
      })
    }
    return months
  }

  const chartData = getLast6Months()

  // Populate data
  revenues.forEach((revenue) => {
    const date = new Date(revenue.date)
    const monthIndex = chartData.findIndex(
      (item) => item.month === date.toLocaleDateString("fr-FR", { month: "short" })
    )
    if (monthIndex !== -1) {
      chartData[monthIndex].revenue += revenue.amount
      chartData[monthIndex].net = chartData[monthIndex].revenue - chartData[monthIndex].expense
    }
  })

  expenses.forEach((expense) => {
    const date = new Date(expense.date)
    const monthIndex = chartData.findIndex(
      (item) => item.month === date.toLocaleDateString("fr-FR", { month: "short" })
    )
    if (monthIndex !== -1) {
      chartData[monthIndex].expense += expense.amount
      chartData[monthIndex].net = chartData[monthIndex].revenue - chartData[monthIndex].expense
    }
  })

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{label}</p>
          <p className="text-green-600">Revenus: {formatCurrency(payload[0].value)}</p>
          <p className="text-red-600">Dépenses: {formatCurrency(payload[1].value)}</p>
          <p className={`font-bold ${payload[2].value >= 0 ? "text-green-600" : "text-red-600"}`}>
            Net: {formatCurrency(payload[2].value)}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Évolution Financière</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#10B981"
                strokeWidth={2}
                name="Revenus"
              />
              <Line
                type="monotone"
                dataKey="expense"
                stroke="#EF4444"
                strokeWidth={2}
                name="Dépenses"
              />
              <Line
                type="monotone"
                dataKey="net"
                stroke="#3B82F6"
                strokeWidth={3}
                name="Net"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
