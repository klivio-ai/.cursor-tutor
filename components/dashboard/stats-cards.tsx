"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, TrendingUp, TrendingDown, DollarSign, Euro, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatsCardsProps {
  totalProperties: number
  totalRevenue: number
  totalExpenses: number
  netIncome: number
  totalValue: number
}

export function StatsCards({ 
  totalProperties, 
  totalRevenue, 
  totalExpenses, 
  netIncome, 
  totalValue 
}: StatsCardsProps) {
  const stats = [
    {
      title: "Propriétés",
      value: totalProperties.toString(),
      icon: Building2,
      description: "Total des biens",
      trend: { value: 2, isPositive: true },
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Valeur Totale",
      value: `${totalValue.toLocaleString("fr-FR")} €`,
      icon: Euro,
      description: "Valeur du portefeuille",
      trend: { value: 5.2, isPositive: true },
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Revenus Totaux",
      value: `${totalRevenue.toLocaleString("fr-FR")} €`,
      icon: TrendingUp,
      description: "Revenus générés",
      trend: { value: 12.5, isPositive: true },
      color: "text-emerald-600",
      bgColor: "bg-emerald-50"
    },
    {
      title: "Dépenses Totales",
      value: `${totalExpenses.toLocaleString("fr-FR")} €`,
      icon: TrendingDown,
      description: "Coûts engagés",
      trend: { value: 8.1, isPositive: false },
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    },
    {
      title: "Bénéfice Net",
      value: `${netIncome.toLocaleString("fr-FR")} €`,
      icon: DollarSign,
      description: "Résultat net",
      trend: { value: 15.3, isPositive: netIncome > 0 },
      color: netIncome > 0 ? "text-green-600" : "text-red-600",
      bgColor: netIncome > 0 ? "bg-green-50" : "bg-red-50"
    }
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title} className="group hover:shadow-md transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
              <div className={cn("p-2 rounded-lg", stat.bgColor)}>
                <Icon className={cn("h-4 w-4", stat.color)} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <p className="text-xs text-gray-500 mb-2">{stat.description}</p>
              <div className="flex items-center text-xs">
                {stat.trend.isPositive ? (
                  <ArrowUpRight className="h-3 w-3 text-green-600 mr-1" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 text-red-600 mr-1" />
                )}
                <span className={cn(
                  "font-medium",
                  stat.trend.isPositive ? "text-green-600" : "text-red-600"
                )}>
                  {stat.trend.isPositive ? "+" : "-"}{stat.trend.value}%
                </span>
                <span className="text-gray-500 ml-1">vs mois dernier</span>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
