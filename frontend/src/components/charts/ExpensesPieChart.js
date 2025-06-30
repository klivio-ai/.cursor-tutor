import React, { useMemo } from "react"
import { Pie, PieChart, ResponsiveContainer, Tooltip, Cell, Legend } from "recharts"
import { formatCurrency } from "../../lib/utils"

const COLORS = [
    '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', 
    '#FF4560', '#775DD0', '#546E7A', '#26a69a', '#D10CE8'
];

export function ExpensesPieChart({ expenses, categories }) {
  const data = useMemo(() => {
    if (!expenses || !categories) return []
    
    const categoryMap = new Map(categories.map(c => [c.id, c.name]))
    const expenseByCategory = {}

    expenses.forEach(expense => {
      const categoryName = categoryMap.get(expense.category_id) || "Autre"
      if (!expenseByCategory[categoryName]) {
        expenseByCategory[categoryName] = 0
      }
      expenseByCategory[categoryName] += Number(expense.amount) || 0
    })

    return Object.entries(expenseByCategory)
      .map(([name, value]) => ({ name, value }))
      .filter(item => item.value > 0) // Filter out zero values
  }, [expenses, categories])

  const tooltipFormatter = useMemo(() => 
    (value) => [formatCurrency(value), "Montant"], 
    []
  )

  if (!data || data.length === 0) {
    return (
      <div className="flex h-[300px] w-full items-center justify-center">
        <p className="text-sm text-gray-500">Aucune dépense à afficher.</p>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <PieChart>
        <Tooltip formatter={tooltipFormatter} />
        <Legend />
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={110}
          fill="#8884d8"
          dataKey="value"
          nameKey="name"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  )
}
