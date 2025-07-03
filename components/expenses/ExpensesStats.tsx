"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingDown, DollarSign, Building2, Calendar } from "lucide-react"

interface ExpensesStatsProps {
  expenses: any[]
  properties: any[]
}

export function ExpensesStats({ expenses, properties }: ExpensesStatsProps) {
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0)
  const paidExpenses = expenses.filter(exp => exp.status === 'Paid').reduce((sum, exp) => sum + exp.amount, 0)
  const pendingExpenses = expenses.filter(exp => exp.status === 'Pending').reduce((sum, exp) => sum + exp.amount, 0)
  const overdueExpenses = expenses.filter(exp => exp.status === 'Overdue').reduce((sum, exp) => sum + exp.amount, 0)
  const avgExpensePerProperty = properties.length > 0 ? totalExpenses / properties.length : 0

  const stats = [
    {
      title: "Dépenses Totales",
      value: `${totalExpenses.toLocaleString('fr-FR')} €`,
      description: "Toutes les dépenses confondues",
      icon: DollarSign,
      color: "text-red-600",
      bgColor: "bg-red-100"
    },
    {
      title: "Dépenses Payées",
      value: `${paidExpenses.toLocaleString('fr-FR')} €`,
      description: "Dépenses déjà réglées",
      icon: TrendingDown,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      title: "Dépenses en Attente",
      value: `${pendingExpenses.toLocaleString('fr-FR')} €`,
      description: "Dépenses à régler",
      icon: Calendar,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100"
    },
    {
      title: "Dépenses en Retard",
      value: `${overdueExpenses.toLocaleString('fr-FR')} €`,
      description: "Dépenses en retard de paiement",
      icon: Building2,
      color: "text-red-600",
      bgColor: "bg-red-100"
    }
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {stat.title}
            </CardTitle>
            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
} 