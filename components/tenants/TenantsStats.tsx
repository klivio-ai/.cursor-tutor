"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Building2, Mail, Phone } from "lucide-react"

interface TenantsStatsProps {
  tenants: any[]
  properties: any[]
}

export function TenantsStats({ tenants, properties }: TenantsStatsProps) {
  const totalTenants = tenants.length
  const activeTenants = tenants.filter(tenant => 
    properties.some(prop => prop.tenant_id === tenant.id)
  ).length
  const inactiveTenants = totalTenants - activeTenants
  const tenantsWithEmail = tenants.filter(tenant => tenant.email).length
  const tenantsWithPhone = tenants.filter(tenant => tenant.phone_number).length
  const avgPropertiesPerTenant = totalTenants > 0 ? 
    properties.filter(prop => prop.tenant_id).length / totalTenants : 0

  const stats = [
    {
      title: "Total Locataires",
      value: totalTenants.toString(),
      description: "Nombre total de locataires",
      icon: Users,
      color: "text-orange-600",
      bgColor: "bg-orange-100"
    },
    {
      title: "Locataires Actifs",
      value: activeTenants.toString(),
      description: `${inactiveTenants} inactifs`,
      icon: Building2,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      title: "Avec Email",
      value: tenantsWithEmail.toString(),
      description: `${((tenantsWithEmail / totalTenants) * 100).toFixed(0)}% des locataires`,
      icon: Mail,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      title: "Avec Téléphone",
      value: tenantsWithPhone.toString(),
      description: `${((tenantsWithPhone / totalTenants) * 100).toFixed(0)}% des locataires`,
      icon: Phone,
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