"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Users, Building2, Mail, Phone } from "lucide-react"

interface TenantsOverviewProps {
  tenants: any[]
  properties: any[]
}

export function TenantsOverview({ tenants, properties }: TenantsOverviewProps) {
  const getTenantProperties = (tenantId: string) => {
    return properties.filter(prop => prop.tenant_id === tenantId)
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  const getTenantStatus = (tenant: any) => {
    const tenantProperties = getTenantProperties(tenant.id)
    return tenantProperties.length > 0 ? 'Actif' : 'Inactif'
  }

  if (tenants.length === 0) {
    return (
      <div className="text-center py-8">
        <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-sm font-medium text-gray-900 mb-2">Aucun locataire</h3>
        <p className="text-sm text-gray-500">Ajoutez des locataires pour voir l'aperçu.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Aperçu des locataires</h3>
        <div className="flex items-center text-sm text-gray-500">
          <Users className="h-4 w-4 mr-1" />
          {tenants.length} locataires
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tenants.map((tenant) => {
          const tenantProperties = getTenantProperties(tenant.id)
          const totalRent = tenantProperties.reduce((sum, prop) => sum + prop.monthly_rent, 0)
          const status = getTenantStatus(tenant)
          
          return (
            <Card key={tenant.id} className="hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-orange-100 text-orange-600">
                      {getInitials(tenant.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm text-gray-900 truncate">
                        {tenant.name}
                      </h4>
                      <Badge variant={status === 'Actif' ? "default" : "secondary"} className="text-xs">
                        {status}
                      </Badge>
                    </div>
                    
                    <div className="space-y-1 mb-3">
                      {tenant.email && (
                        <div className="flex items-center text-xs text-gray-600">
                          <Mail className="h-3 w-3 mr-1 flex-shrink-0" />
                          <span className="truncate">{tenant.email}</span>
                        </div>
                      )}
                      {tenant.phone_number && (
                        <div className="flex items-center text-xs text-gray-600">
                          <Phone className="h-3 w-3 mr-1 flex-shrink-0" />
                          <span className="truncate">{tenant.phone_number}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center text-gray-600">
                        <Building2 className="h-3 w-3 mr-1" />
                        <span>{tenantProperties.length} propriété{tenantProperties.length > 1 ? 's' : ''}</span>
                      </div>
                      <div className="font-medium text-gray-900">
                        {totalRent.toLocaleString('fr-FR')} €/mois
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
} 