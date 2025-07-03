"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, DollarSign, Building2, Calendar } from "lucide-react"

interface RevenueStatsProps {
  revenues: any[]
  properties: any[]
}

export function RevenueStats({ revenues, properties }: RevenueStatsProps) {
  const totalRevenue = revenues.reduce((sum, rev) => sum + rev.amount, 0)
  const paidRevenue = revenues.filter(rev => rev.status === 'Paid').reduce((sum, rev) => sum + rev.amount, 0)
  const pendingRevenue = revenues.filter(rev => rev.status === 'Pending').reduce((sum, rev) => sum + rev.amount, 0)
  const avgRevenuePerProperty = properties.length > 0 ? totalRevenue / properties.length : 0

  const stats = [
    {
      title: "Revenus Totaux",
      value: `${totalRevenue.toLocaleString('fr-FR')} €`,
      description: "Tous les revenus confondus",
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      title: "Revenus Payés",
      value: `${paidRevenue.toLocaleString('fr-FR')} €`,
      description: "Revenus déjà encaissés",
      icon: TrendingUp,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      title: "Revenus en Attente",
      value: `${pendingRevenue.toLocaleString('fr-FR')} €`,
      description: "Revenus à encaisser",
      icon: Calendar,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100"
    },
    {
      title: "Moyenne par Propriété",
      value: `${avgRevenuePerProperty.toLocaleString('fr-FR')} €`,
      description: "Revenu moyen par propriété",
      icon: Building2,
      color: "text-purple-600",
      bgColor: "bg-purple-100"
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