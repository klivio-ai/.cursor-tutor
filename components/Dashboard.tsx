"use client"

import { useData } from "@/hooks/use-data"
import { StatsCards } from "./dashboard/stats-cards"
import { RecentTransactions } from "./dashboard/recent-transactions"
import { FinancialChart } from "./dashboard/financial-chart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Building2, Plus, TrendingUp, TrendingDown, DollarSign } from "lucide-react"

export default function Dashboard() {
  const { 
    properties, 
    revenues, 
    expenses, 
    loading, 
    error 
  } = useData()

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <p className="text-red-600">Erreur: {error}</p>
        </div>
      </div>
    )
  }

  // Calculs des statistiques
  const totalRevenue = revenues.reduce((sum, rev) => sum + rev.amount, 0)
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0)
  const netIncome = totalRevenue - totalExpenses
  const totalProperties = properties.length
  const totalValue = properties.reduce((sum, prop) => sum + (prop.current_value || 0), 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tableau de Bord Immobilier</h1>
          <p className="text-gray-600">Bienvenue ! Voici un aperçu de votre portefeuille immobilier.</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Ajouter une Propriété
        </Button>
      </div>

      {/* Stats Cards */}
      <StatsCards 
        totalProperties={totalProperties}
        totalRevenue={totalRevenue}
        totalExpenses={totalExpenses}
        netIncome={netIncome}
        totalValue={totalValue}
      />

      {/* Charts and Transactions */}
      <div className="grid gap-6 md:grid-cols-2">
        <FinancialChart revenues={revenues} expenses={expenses} />
        <RecentTransactions revenues={revenues} expenses={expenses} />
      </div>

      {/* Properties Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Building2 className="h-5 w-5 mr-2" />
            Aperçu des Propriétés
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {properties.slice(0, 5).map((property) => (
              <div key={property.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-sm">{property.name}</p>
                  <p className="text-xs text-gray-500">{property.address}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{property.current_value?.toLocaleString("fr-FR")} €</p>
                  <p className="text-xs text-gray-500 capitalize">{property.type}</p>
                </div>
              </div>
            ))}
            {properties.length === 0 && (
              <p className="text-center text-gray-500 py-4">Aucune propriété trouvée</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
