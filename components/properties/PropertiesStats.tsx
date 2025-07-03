"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, DollarSign, Users, MapPin } from "lucide-react"

interface PropertiesStatsProps {
  properties: any[]
  tenants: any[]
}

export function PropertiesStats({ properties, tenants }: PropertiesStatsProps) {
  const totalProperties = properties.length
  const totalValue = properties.reduce((sum, prop) => sum + (prop.current_value || 0), 0)
  const totalRent = properties.reduce((sum, prop) => sum + prop.monthly_rent, 0)
  const occupiedProperties = properties.filter(prop => prop.tenant_id).length
  const vacantProperties = totalProperties - occupiedProperties
  const occupancyRate = totalProperties > 0 ? (occupiedProperties / totalProperties) * 100 : 0

  const stats = [
    {
      title: "Total Propriétés",
      value: totalProperties.toString(),
      description: "Nombre total de propriétés",
      icon: Building2,
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    },
    {
      title: "Valeur Totale",
      value: `${totalValue.toLocaleString('fr-FR')} €`,
      description: "Valeur totale du portefeuille",
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      title: "Loyer Mensuel",
      value: `${totalRent.toLocaleString('fr-FR')} €`,
      description: "Revenus locatifs mensuels",
      icon: DollarSign,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      title: "Taux d'Occupation",
      value: `${occupancyRate.toFixed(1)}%`,
      description: `${occupiedProperties} occupées / ${vacantProperties} vacantes`,
      icon: Users,
      color: "text-orange-600",
      bgColor: "bg-orange-100"
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