"use client"

import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp } from "lucide-react"

interface RevenueChartProps {
  revenues: any[]
}

export function RevenueChart({ revenues }: RevenueChartProps) {
  // Grouper les revenus par mois pour le graphique
  const monthlyData = revenues.reduce((acc, revenue) => {
    const date = new Date(revenue.date)
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    
    if (!acc[monthKey]) {
      acc[monthKey] = {
        month: monthKey,
        total: 0,
        count: 0
      }
    }
    
    acc[monthKey].total += revenue.amount
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

  return (
    <div className="space-y-4">
      {sortedMonths.length > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Évolution mensuelle</h3>
            <div className="flex items-center text-sm text-gray-500">
              <TrendingUp className="h-4 w-4 mr-1" />
              {sortedMonths.length} mois
            </div>
          </div>
          
          <div className="space-y-3">
            {sortedMonths.map((monthData) => {
              const data = monthData as { month: string; total: number; count: number }
              return (
                <div key={data.month} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{formatMonth(data.month)}</span>
                    <span className="text-gray-600">
                      {data.total.toLocaleString('fr-FR')} € ({data.count} revenus)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(data.total / maxAmount) * 100}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <TrendingUp className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-sm font-medium text-gray-900 mb-2">Aucune donnée</h3>
          <p className="text-sm text-gray-500">Ajoutez des revenus pour voir l'évolution.</p>
        </div>
      )}
    </div>
  )
} 