"use client"

import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Building2 } from "lucide-react"

interface PropertiesMapProps {
  properties: any[]
  tenants?: any[]
  onEdit?: (property: any) => void
  onDelete?: (property: any) => void
  getTenantName?: (tenantId: string) => string
}

export function PropertiesMap({ properties, onEdit, onDelete, getTenantName }: PropertiesMapProps) {
  if (properties.length === 0) {
    return (
      <div className="text-center py-8">
        <MapPin className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-sm font-medium text-gray-900 mb-2">Aucune propriété</h3>
        <p className="text-sm text-gray-500">Ajoutez des propriétés pour voir la carte.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Répartition géographique</h3>
        <div className="flex items-center text-sm text-gray-500">
          <MapPin className="h-4 w-4 mr-1" />
          {properties.length} propriétés
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {properties.map((property) => (
          <Card key={property.id} className="hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-5 h-5 text-purple-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm text-gray-900 truncate">
                    {property.name || 'Propriété sans nom'}
                  </h4>
                  <div className="flex items-center text-xs text-gray-500 mt-1">
                    <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
                    <span className="truncate">{property.address}</span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-600">
                      {property.monthly_rent.toLocaleString('fr-FR')} €/mois
                    </span>
                    <span className="text-xs text-gray-600">
                      {property.current_value?.toLocaleString('fr-FR') || '-'} €
                    </span>
                  </div>
                  <div className="text-xs text-gray-700 mt-2">
                    Locataire : {getTenantName ? getTenantName(property.tenant_id || '') : 'Vacant'}
                  </div>
                  <div className="flex gap-2 mt-2">
                    {onEdit && (
                      <button
                        className="p-1 rounded hover:bg-gray-100"
                        title="Modifier"
                        onClick={() => onEdit(property)}
                      >
                        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-edit"><path d="M11 4L13 6L6 13H4V11L11 4Z"></path></svg>
                      </button>
                    )}
                    {onDelete && (
                      <button
                        className="p-1 rounded hover:bg-gray-100"
                        title="Supprimer"
                        onClick={() => onDelete(property)}
                      >
                        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash-2"><circle cx="6" cy="6" r="1"></circle><circle cx="12" cy="6" r="1"></circle><path d="M3 6V19A2 2 0 0 0 5 21H19A2 2 0 0 0 21 19V6"></path><path d="M8 6V4A2 2 0 0 1 10 2H14A2 2 0 0 1 16 4V6"></path></svg>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="text-center text-sm text-gray-500 mt-4">
        <p>Note: Cette carte affiche une vue simplifiée de vos propriétés.</p>
        <p>Pour une carte interactive, intégrez un service comme Google Maps ou Mapbox.</p>
      </div>
    </div>
  )
} 