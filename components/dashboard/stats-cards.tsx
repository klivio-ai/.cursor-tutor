"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, TrendingUp, TrendingDown, DollarSign, Euro, ArrowUpRight, ArrowDownRight, Home, Users, Percent } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatsCardsProps {
  totalProperties: number
  totalRevenue: number
  totalExpenses: number
  netIncome: number
  totalValue: number
  occupancyRate?: number
  averageRent?: number
  debtRatio?: number
}

export function StatsCards({ 
  totalProperties, 
  totalRevenue, 
  totalExpenses, 
  netIncome, 
  totalValue,
  occupancyRate = 96.5,
  averageRent = 1850,
  debtRatio = 68
}: StatsCardsProps) {
  const stats = [
    {
      title: "Revenus Mensuel",
      value: `${totalRevenue.toLocaleString("fr-FR")} €`,
      icon: TrendingUp,
      description: "Revenus locatifs",
      trend: { value: 5.2, isPositive: true },
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200"
    },
    {
      title: "Charges Mensuelles",
      value: `${totalExpenses.toLocaleString("fr-FR")} €`,
      icon: TrendingDown,
      description: "Dépenses totales",
      trend: { value: 2.1, isPositive: false },
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200"
    },
    {
      title: "Cash Flow Net",
      value: `${netIncome.toLocaleString("fr-FR")} €`,
      icon: DollarSign,
      description: "Bénéfice net",
      trend: { value: 8.7, isPositive: netIncome > 0 },
      color: netIncome > 0 ? "text-green-600" : "text-red-600",
      bgColor: netIncome > 0 ? "bg-green-50" : "bg-red-50",
      borderColor: netIncome > 0 ? "border-green-200" : "border-red-200"
    },
    {
      title: "Valeur Portefeuille",
      value: `${totalValue.toLocaleString("fr-FR")} €`,
      icon: Building2,
      description: "Total des biens",
      trend: { value: 3.8, isPositive: true },
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      borderColor: "border-indigo-200"
    },
    {
      title: "Taux d'Occupation",
      value: `${occupancyRate}%`,
      icon: Home,
      description: "Propriétés louées",
      trend: { value: 1.2, isPositive: true },
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200"
    },
    {
      title: "Loyer Moyen",
      value: `${averageRent.toLocaleString("fr-FR")} €`,
      icon: Euro,
      description: "Par propriété",
      trend: { value: 3.5, isPositive: true },
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200"
    },
    {
      title: "Rentabilité Nette",
      value: `${((netIncome / totalValue) * 100).toFixed(1)}%`,
      icon: Percent,
      description: "Rendement annuel",
      trend: { value: 0.8, isPositive: true },
      color: "text-cyan-600",
      bgColor: "bg-cyan-50",
      borderColor: "border-cyan-200"
    },
    {
      title: "Ratio d'Endettement",
      value: `${debtRatio}%`,
      icon: Users,
      description: "Niveau d'endettement",
      trend: { value: -1.5, isPositive: true },
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200"
    }
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card 
            key={stat.title} 
            className={cn(
              "group hover:shadow-lg transition-all duration-300 border-2 hover:-translate-y-1",
              stat.borderColor
            )}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
              <div className={cn("p-2 rounded-lg transition-all duration-200 group-hover:scale-110", stat.bgColor)}>
                <Icon className={cn("h-4 w-4", stat.color)} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 mb-1 group-hover:text-gray-700 transition-colors">
                {stat.value}
              </div>
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
                  {stat.trend.isPositive ? "+" : ""}{stat.trend.value}%
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
