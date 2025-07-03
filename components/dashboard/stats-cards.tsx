"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, TrendingUp, TrendingDown, DollarSign, Euro } from "lucide-react"

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
      trend: { value: 0, isPositive: true }
    },
    {
      title: "Valeur Totale",
      value: `${totalValue.toLocaleString("fr-FR")} €`,
      icon: Euro,
      description: "Valeur du portefeuille",
      trend: { value: 5, isPositive: true }
    },
    {
      title: "Revenus Totaux",
      value: `${totalRevenue.toLocaleString("fr-FR")} €`,
      icon: TrendingUp,
      description: "Revenus générés",
      trend: { value: 12, isPositive: true }
    },
    {
      title: "Dépenses Totales",
      value: `${totalExpenses.toLocaleString("fr-FR")} €`,
      icon: TrendingDown,
      description: "Coûts engagés",
      trend: { value: 8, isPositive: false }
    },
    {
      title: "Bénéfice Net",
      value: `${netIncome.toLocaleString("fr-FR")} €`,
      icon: DollarSign,
      description: "Résultat net",
      trend: { value: 15, isPositive: netIncome > 0 }
    }
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
              <div className="flex items-center text-xs text-muted-foreground mt-1">
                <span className={stat.trend.isPositive ? "text-green-600" : "text-red-600"}>
                  {stat.trend.isPositive ? "+" : "-"}{stat.trend.value}%
                </span>
                <span className="ml-1">vs mois dernier</span>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
