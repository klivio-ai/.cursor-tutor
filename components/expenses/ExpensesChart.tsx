"use client"

import { Card, CardContent } from "@/components/ui/card"
import { TrendingDown, BarChart3 } from "lucide-react"

interface ExpensesChartProps {
  expenses: any[]
}

export function ExpensesChart({ expenses }: ExpensesChartProps) {
  // Grouper les dépenses par mois pour le graphique
  const monthlyData = expenses.reduce((acc, expense) => {
    const date = new Date(expense.date)
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    
    if (!acc[monthKey]) {
      acc[monthKey] = {
        month: monthKey,
        total: 0,
        count: 0
      }
    }
    
    acc[monthKey].total += expense.amount
    acc[monthKey].count += 1
    
    return acc
  }, {} as Record<string, { month: string; total: number; count: number }>)

  const sortedMonths = Object.values(monthlyData)
    .sort((a, b) => (a as { month: string }).month.localeCompare((b as { month: string }).month))
    .slice(-6) // Derniers 6 mois

  const maxAmount = Math.max(...sortedMonths.map(m => (m as { total: number }).total), 1)

  const formatMonth = (monthKey: string) => {
    const [year, month] = monthKey.split('-')
    const date = new Date(parseInt(year), parseInt(month) - 1)
    return date.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })
  }

  const getBarHeight = (amount: number) => {
    return Math.max((amount / maxAmount) * 100, 5) // Minimum 5% de hauteur
  }

  const getBarColor = (amount: number) => {
    const percentage = (amount / maxAmount) * 100
    if (percentage > 80) return 'bg-red-600'
    if (percentage > 60) return 'bg-orange-500'
    if (percentage > 40) return 'bg-yellow-500'
    return 'bg-blue-500'
  }

  return (
    <div className="space-y-6">
      {sortedMonths.length > 0 ? (
        <>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-red-600" />
              <h3 className="text-lg font-semibold">Évolution des Dépenses</h3>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <TrendingDown className="h-4 w-4 mr-1" />
              {sortedMonths.length} mois
            </div>
          </div>
          
          {/* Bar Chart */}
          <div className="relative">
            <div className="grid grid-cols-6 gap-4 h-64 items-end">
              {sortedMonths.map((monthData) => {
                const data = monthData as { month: string; total: number; count: number }
                const height = getBarHeight(data.total)
                const color = getBarColor(data.total)
                
                return (
                  <div key={data.month} className="flex flex-col items-center space-y-2">
                    {/* Bar */}
                    <div className="relative w-full max-w-16">
                      <div
                        className={`${color} rounded-t-lg transition-all duration-300 hover:opacity-80 cursor-pointer relative group`}
                        style={{ height: `${height}%` }}
                      >
                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                          {data.total.toLocaleString('fr-FR')} €
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Month label */}
                    <div className="text-xs text-gray-600 text-center leading-tight">
                      {formatMonth(data.month)}
                    </div>
                    
                    {/* Amount label */}
                    <div className="text-xs font-medium text-gray-900 text-center">
                      {data.total.toLocaleString('fr-FR')} €
                    </div>
                    
                    {/* Count label */}
                    <div className="text-xs text-gray-500 text-center">
                      {data.count} dépense{data.count > 1 ? 's' : ''}
                    </div>
                  </div>
                )
              })}
            </div>
            
            {/* Y-axis labels */}
            <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500 -ml-8">
              <span>{maxAmount.toLocaleString('fr-FR')} €</span>
              <span>{(maxAmount * 0.75).toLocaleString('fr-FR')} €</span>
              <span>{(maxAmount * 0.5).toLocaleString('fr-FR')} €</span>
              <span>{(maxAmount * 0.25).toLocaleString('fr-FR')} €</span>
              <span>0 €</span>
            </div>
          </div>
          
          {/* Legend */}
          <div className="flex items-center justify-center space-x-6 text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span>Faible</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded"></div>
              <span>Modéré</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-orange-500 rounded"></div>
              <span>Élevé</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-600 rounded"></div>
              <span>Très élevé</span>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <BarChart3 className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune donnée</h3>
          <p className="text-sm text-gray-500">Ajoutez des dépenses pour voir l'évolution.</p>
        </div>
      )}
    </div>
  )
} 