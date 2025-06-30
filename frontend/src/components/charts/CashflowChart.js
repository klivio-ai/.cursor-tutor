import React, { useMemo } from "react"
import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { formatCurrency } from "../../lib/utils"

export function CashflowChart({ revenus = [], expenses = [] }) {
  const data = useMemo(() => {
    const monthlyData = {}
    const monthFormatter = new Intl.DateTimeFormat('fr-FR', { year: 'numeric', month: 'short' })

    const processTransactions = (transactions, type) => {
      transactions.forEach(item => {
        try {
          const date = new Date(item.date)
          if (isNaN(date.getTime())) return // Skip invalid dates
          
          const monthKey = monthFormatter.format(date)

          if (!monthlyData[monthKey]) {
            monthlyData[monthKey] = { month: monthKey, revenus: 0, expenses: 0, sortDate: date }
          }
          monthlyData[monthKey][type] += Number(item.amount) || 0
        } catch (error) {
          console.warn('Error processing transaction:', error, item)
        }
      })
    }

    processTransactions(revenus, 'revenus')
    processTransactions(expenses, 'expenses')

    // Fix: Better sorting using actual date objects
    const sortedData = Object.values(monthlyData)
      .sort((a, b) => a.sortDate.getTime() - b.sortDate.getTime())
      .map(({ sortDate, ...rest }) => rest) // Remove sortDate from final data

    return sortedData
  }, [revenus, expenses])

  if (!data || data.length === 0) {
    return (
      <div className="flex h-[300px] w-full items-center justify-center">
        <p className="text-sm text-gray-500">Aucune donnée de revenu ou dépense disponible pour ce graphique.</p>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <AreaChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorRevenus" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis tickFormatter={(value) => formatCurrency(value).replace(/\s/g, '')} />
        <Tooltip formatter={(value) => formatCurrency(value)} />
        <Legend />
        <Area type="monotone" dataKey="revenus" stroke="#10b981" fillOpacity={1} fill="url(#colorRevenus)" name="Revenus" />
        <Area type="monotone" dataKey="expenses" stroke="#ef4444" fillOpacity={1} fill="url(#colorExpenses)" name="Dépenses" />
      </AreaChart>
    </ResponsiveContainer>
  )
}
