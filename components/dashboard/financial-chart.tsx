"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"
import { formatCurrency } from "@/lib/utils"
import type { Database } from "@/types/database"

type Revenue = Database["public"]["Tables"]["revenues"]["Row"]
type Expense = Database["public"]["Tables"]["expenses"]["Row"]

interface FinancialChartProps {
  revenues: Revenue[]
  expenses: Expense[]
}

export function FinancialChart({ revenues, expenses }: FinancialChartProps) {
  // Préparer les données sur 12 mois glissants
  const getLast12Months = () => {
    const months = []
    const now = new Date()
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      months.push({
        key: `${date.getFullYear()}-${date.getMonth() + 1}`,
        label: date.toLocaleDateString("fr-FR", { month: "short", year: "2-digit" }),
        cashFlow: 0,
      })
    }
    return months
  }

  const chartData = getLast12Months()

  // Remplir les revenus
  revenues.forEach((revenue) => {
    const date = new Date(revenue.date)
    const key = `${date.getFullYear()}-${date.getMonth() + 1}`
    const month = chartData.find((item) => item.key === key)
    if (month) {
      month.cashFlow += revenue.amount
    }
  })

  // Soustraction des dépenses
  expenses.forEach((expense) => {
    const date = new Date(expense.date)
    const key = `${date.getFullYear()}-${date.getMonth() + 1}`
    const month = chartData.find((item) => item.key === key)
    if (month) {
      month.cashFlow -= Math.abs(expense.amount)
    }
  })

  // Tooltip custom moderne
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const cashFlow = payload[0]?.value || 0
      const isPositive = cashFlow >= 0
      
      return (
        <div className="bg-white/95 p-4 border border-gray-200 rounded-xl shadow-xl min-w-[160px]">
          <div className="font-semibold text-gray-800 mb-2 text-base">{label}</div>
          <div className="flex items-center gap-2">
            <span className={`inline-block w-3 h-3 rounded-full ${isPositive ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className={`font-bold text-lg ${isPositive ? 'text-green-700' : 'text-red-700'}`}>
              {formatCurrency(cashFlow)}
            </span>
          </div>
          <div className="text-sm text-gray-600 mt-1">
            Cash Flow {isPositive ? 'positif' : 'négatif'}
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 30, right: 30, left: 20, bottom: 20 }}
          barCategoryGap={8}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
          <XAxis 
            dataKey="label" 
            stroke="#6B7280" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
          />
          <YAxis 
            stroke="#6B7280" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
            tickFormatter={(v) => `${v.toLocaleString()} €`}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f3f4f6", opacity: 0.3 }} />
          <Bar 
            dataKey="cashFlow" 
            radius={[4, 4, 0, 0]}
          >
            {chartData.map((entry, idx) => (
              <Cell key={`cell-${idx}`} fill={entry.cashFlow >= 0 ? "#10B981" : "#EF4444"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
