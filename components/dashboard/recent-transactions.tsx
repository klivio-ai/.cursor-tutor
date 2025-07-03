"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/utils"
import { Home, MapPin, Users, Calendar } from "lucide-react"
import type { Database } from "@/types/database"

type Property = Database["public"]["Tables"]["properties"]["Row"] & {
  tenants?: { name: string | null }[]
  revenues?: { amount: number }[]
}

interface PropertiesListProps {
  properties: Property[]
}

export function PropertiesList({ properties }: PropertiesListProps) {
  // Mock data for demonstration - in real app, this would come from the database
  const mockProperties = [
    {
      id: 1,
      name: "Apt 3P - 15e Arr.",
      address: "Paris 15e",
      size: 75,
      rent: 1850,
      status: "occupied" as const,
      tenant: "M. Dubois",
      lastPayment: "2024-01-15"
    },
    {
      id: 2,
      name: "Studio - 11e Arr.",
      address: "Paris 11e",
      size: 35,
      rent: 1200,
      status: "occupied" as const,
      tenant: "Mme Martin",
      lastPayment: "2024-01-10"
    },
    {
      id: 3,
      name: "Apt 2P - 20e Arr.",
      address: "Paris 20e",
      size: 55,
      rent: 1450,
      status: "vacant" as const,
      tenant: null,
      lastPayment: null
    },
    {
      id: 4,
      name: "Apt 4P - 12e Arr.",
      address: "Paris 12e",
      size: 95,
      rent: 2100,
      status: "occupied" as const,
      tenant: "Famille Leroy",
      lastPayment: "2024-01-12"
    },
    {
      id: 5,
      name: "Studio - 18e Arr.",
      address: "Paris 18e",
      size: 30,
      rent: 1100,
      status: "occupied" as const,
      tenant: "M. Chen",
      lastPayment: "2024-01-08"
    },
    {
      id: 6,
      name: "Apt 3P - 19e Arr.",
      address: "Paris 19e",
      size: 70,
      rent: 1650,
      status: "occupied" as const,
      tenant: "Mme Rousseau",
      lastPayment: "2024-01-14"
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "occupied":
        return "bg-green-100 text-green-800 border-green-200"
      case "vacant":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "maintenance":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "occupied":
        return "Occupé"
      case "vacant":
        return "Vacant"
      case "maintenance":
        return "Maintenance"
      default:
        return "Inconnu"
    }
  }

  return (
    <Card className="border-2 border-green-100 hover:border-green-200 transition-all duration-300">
      <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
        <CardTitle className="text-xl font-bold text-gray-800 flex items-center">
          🏠 Propriétés ({mockProperties.length})
        </CardTitle>
        <CardDescription>État de votre portefeuille immobilier</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="max-h-[400px] overflow-y-auto">
          {mockProperties.map((property) => (
            <div 
              key={property.id} 
              className="flex items-center justify-between p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200 last:border-b-0"
            >
              <div className="flex items-center space-x-3 flex-1">
                <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                  <Home className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1">{property.name}</h4>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-3 w-3" />
                      <span>{property.address}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span>•</span>
                      <span>{property.size} m²</span>
                    </div>
                    {property.tenant && (
                      <div className="flex items-center space-x-1">
                        <Users className="h-3 w-3" />
                        <span>{property.tenant}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <div className="font-bold text-lg text-green-600">
                    {formatCurrency(property.rent)}
                  </div>
                  {property.lastPayment && (
                    <div className="text-xs text-gray-500 flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>Payé le {new Date(property.lastPayment).toLocaleDateString("fr-FR")}</span>
                    </div>
                  )}
                </div>
                <Badge 
                  variant="outline" 
                  className={`border-2 ${getStatusColor(property.status)}`}
                >
                  {getStatusText(property.status)}
                </Badge>
              </div>
            </div>
          ))}
        </div>
        
        {/* Statistiques de synthèse */}
        <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-t border-blue-100">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {mockProperties.filter(p => p.status === "occupied").length}
              </div>
              <div className="text-xs text-gray-600">Occupées</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-600">
                {mockProperties.filter(p => p.status === "vacant").length}
              </div>
              <div className="text-xs text-gray-600">Vacantes</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {((mockProperties.filter(p => p.status === "occupied").length / mockProperties.length) * 100).toFixed(1)}%
              </div>
              <div className="text-xs text-gray-600">Taux d'occupation</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
