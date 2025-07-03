"use client"

import { useData } from "@/hooks/use-data"
import { StatsCards } from "./dashboard/stats-cards"
import { RecentTransactions } from "./dashboard/recent-transactions"
import { FinancialChart } from "./dashboard/financial-chart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Building2, Plus, TrendingUp, TrendingDown, DollarSign, Calendar, MapPin } from "lucide-react"
import { DashboardSkeleton } from "@/components/ui/loading"

export default function Dashboard() {
  const { 
    properties, 
    revenues, 
    expenses, 
    loading, 
    error 
  } = useData()

  if (loading) {
    return <DashboardSkeleton />
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <TrendingDown className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Erreur de chargement</h3>
          <p className="text-red-600">{error}</p>
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
    <div className="space-y-8">
      {/* Header avec actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Tableau de Bord Immobilier</h1>
          <p className="text-gray-600 mt-1">Bienvenue ! Voici un aperçu de votre portefeuille immobilier.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="hidden sm:flex">
            <Calendar className="h-4 w-4 mr-2" />
            Rapport
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Ajouter une Propriété
          </Button>
        </div>
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
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="hover:shadow-md transition-shadow duration-200">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
              Évolution Financière
            </CardTitle>
          </CardHeader>
          <CardContent>
            <FinancialChart revenues={revenues} expenses={expenses} />
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow duration-200">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <DollarSign className="h-5 w-5 mr-2 text-blue-600" />
              Transactions Récentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RecentTransactions revenues={revenues} expenses={expenses} />
          </CardContent>
        </Card>
      </div>

      {/* Properties Overview */}
      <Card className="hover:shadow-md transition-shadow duration-200">
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <Building2 className="h-5 w-5 mr-2 text-purple-600" />
            Aperçu des Propriétés
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {properties.slice(0, 5).map((property) => (
              <div key={property.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-gray-900">{property.name}</p>
                    <div className="flex items-center text-xs text-gray-500 mt-1">
                      <MapPin className="w-3 h-3 mr-1" />
                      {property.address}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">
                    {property.current_value?.toLocaleString("fr-FR")} €
                  </p>
                  <p className="text-xs text-gray-500 capitalize">{property.type}</p>
                </div>
              </div>
            ))}
            {properties.length === 0 && (
              <div className="text-center py-8">
                <Building2 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-sm font-medium text-gray-900 mb-2">Aucune propriété</h3>
                <p className="text-sm text-gray-500">Commencez par ajouter votre première propriété.</p>
              </div>
            )}
            {properties.length > 5 && (
              <div className="text-center pt-4">
                <Button variant="outline" size="sm">
                  Voir toutes les propriétés ({properties.length})
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
