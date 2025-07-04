"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, CheckCircle, Clock, AlertTriangle } from "lucide-react"

interface ExpensesStatsProps {
  expenses: any[]
  properties: any[]
  filteredStats?: {
    total: number
    paid: number
    pending: number
    overdue: number
    average: number
    count: number
  }
}

export function ExpensesStats({ expenses, properties, filteredStats }: ExpensesStatsProps) {
  // Utiliser les stats filtrées si disponibles, sinon calculer à partir de toutes les dépenses
  const stats = filteredStats || (() => {
    const total = expenses.reduce((sum, exp) => sum + exp.amount, 0)
    const paid = expenses.filter(exp => exp.status === 'Paid').reduce((sum, exp) => sum + exp.amount, 0)
    const pending = expenses.filter(exp => exp.status === 'Pending').reduce((sum, exp) => sum + exp.amount, 0)
    const overdue = expenses.filter(exp => exp.status === 'Overdue').reduce((sum, exp) => sum + exp.amount, 0)
    const avg = expenses.length > 0 ? total / expenses.length : 0

    return { total, paid, pending, overdue, average: avg, count: expenses.length }
  })()

  const statsCards = [
    {
      title: "Dépenses Totales",
      value: `${stats.total.toLocaleString('fr-FR')} €`,
      description: `${stats.count} dépense${stats.count > 1 ? 's' : ''}`,
      icon: DollarSign,
      color: "text-red-600",
      bgColor: "bg-red-100",
      trend: filteredStats ? "Filtrées" : "Toutes"
    },
    {
      title: "Dépenses Payées",
      value: `${stats.paid.toLocaleString('fr-FR')} €`,
      description: `${((stats.paid / stats.total) * 100).toFixed(1)}% du total`,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100",
      trend: "Réglées"
    },
    {
      title: "Dépenses en Attente",
      value: `${stats.pending.toLocaleString('fr-FR')} €`,
      description: `${((stats.pending / stats.total) * 100).toFixed(1)}% du total`,
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
      trend: "À régler"
    },
    {
      title: "Dépenses en Retard",
      value: `${stats.overdue.toLocaleString('fr-FR')} €`,
      description: `${((stats.overdue / stats.total) * 100).toFixed(1)}% du total`,
      icon: AlertTriangle,
      color: "text-red-600",
      bgColor: "bg-red-100",
      trend: "Urgent"
    }
  ]

  return (
    <div className="grid gap-3 sm:gap-4 lg:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {statsCards.map((stat, index) => (
        <Card 
          key={index} 
          className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-red-500 bg-white group cursor-pointer"
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 sm:pb-3">
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-600 truncate">
              {stat.title}
            </CardTitle>
            <div className={`p-2 sm:p-3 rounded-lg ${stat.bgColor} group-hover:scale-110 transition-transform duration-200`}>
              <stat.icon className={`h-3 w-3 sm:h-4 sm:w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent className="space-y-1 sm:space-y-2">
            <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 truncate" title={stat.value}>
              {stat.value}
            </div>
            <p className="text-xs sm:text-sm text-gray-500 leading-tight">
              {stat.description}
            </p>
            {stat.trend && (
              <div className="pt-1">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 transition-colors group-hover:bg-gray-200">
                  {stat.trend}
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
} 