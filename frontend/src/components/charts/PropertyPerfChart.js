import React, { useMemo } from "react"
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { formatCurrency } from "../../lib/utils"

export function PropertyPerfChart({ properties, revenus, expenses }) {
  const data = useMemo(() => {
    if (!properties || !revenus || !expenses) return []
    
    const propertyMap = new Map(properties.map(p => [p.id, { 
      ...p, 
      totalRevenu: 0, 
      totalExpense: 0, 
      netProfit: 0 
    }]))

    // Calculate revenues per property
    revenus.forEach(revenu => {
      if (revenu.property_id && propertyMap.has(revenu.property_id)) {
        const prop = propertyMap.get(revenu.property_id)
        prop.totalRevenu += Number(revenu.amount) || 0
      }
    })

    // Calculate expenses per property
    expenses.forEach(expense => {
      if (expense.property_id && propertyMap.has(expense.property_id)) {
        const prop = propertyMap.get(expense.property_id)
        prop.totalExpense += Number(expense.amount) || 0
      }
    })

    // Calculate net profit and prepare chart data
    return Array.from(propertyMap.values())
      .map(p => {
        const netProfit = p.totalRevenu - p.totalExpense
        return {
          name: p.name,
          Revenus: p.totalRevenu,
          Dépenses: p.totalExpense,
          "Profit Net": netProfit,
        }
      })
      .filter(p => p.Revenus > 0 || p.Dépenses > 0) // Only show properties with data
  }, [properties, revenus, expenses])

  const yAxisFormatter = useMemo(() => 
    (value) => formatCurrency(value).replace(/\s/g, ''), 
    []
  )

  const tooltipFormatter = useMemo(() => 
    (value) => formatCurrency(value), 
    []
  )

  if (!data || data.length === 0) {
    return (
      <div className="flex h-[300px] w-full items-center justify-center">
        <p className="text-sm text-gray-500">Aucune donnée de propriété à afficher.</p>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis tickFormatter={yAxisFormatter} />
        <Tooltip formatter={tooltipFormatter} />
        <Legend />
        <Bar dataKey="Revenus" fill="#10b981" />
        <Bar dataKey="Dépenses" fill="#ef4444" />
        <Bar dataKey="Profit Net" fill="#3b82f6" />
      </BarChart>
    </ResponsiveContainer>
  )
}
