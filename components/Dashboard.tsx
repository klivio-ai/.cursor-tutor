"use client"

import { useProperties } from "@/hooks/use-properties"
import { useRevenus } from "@/hooks/use-revenus"
import { useDepenses } from "@/hooks/use-depenses"
import { StatCard } from "./dashboard/StatCard"
import { RecentTransactions } from "./dashboard/RecentTransactions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Building2, Plus, TrendingUp, TrendingDown, DollarSign } from "lucide-react"

export default function Dashboard() {
  const { properties, loading: propertiesLoading } = useProperties()
  const { revenues, loading: revenuesLoading } = useRevenus()
  const { expenses, loading: expensesLoading } = useDepenses()

  const loading = propertiesLoading || revenuesLoading || expensesLoading

  // Calculate totals
  const totalRevenue = revenues.reduce((sum, rev) => sum + rev.amount, 0)
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0)
  const netIncome = totalRevenue - totalExpenses
  const totalProperties = properties.length
  const totalValue = properties.reduce((sum, prop) => sum + (prop.current_value || 0), 0)

  // Recent transactions (combine revenues and expenses)
  const recentTransactions = [
    ...revenues.map((rev) => ({
      id: rev.id,
      type: "revenue" as const,
      amount: rev.amount,
      description: rev.description || "Revenu",
      date: rev.date,
      property: rev.property?.name,
      category: rev.category?.name,
    })),
    ...expenses.map((exp) => ({
      id: exp.id,
      type: "expense" as const,
      amount: exp.amount,
      description: exp.description || "Dépense",
      date: exp.date,
      property: exp.property?.name,
      category: exp.category?.name,
    })),
  ]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Building2 className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Tableau de Bord Immobilier</h1>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Ajouter une Propriété
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Propriétés"
            value={totalProperties.toString()}
            icon={Building2}
            trend={{ value: 0, isPositive: true }}
          />
          <StatCard
            title="Revenus Totaux"
            value={`${totalRevenue.toLocaleString("fr-FR")} €`}
            icon={TrendingUp}
            trend={{ value: 12, isPositive: true }}
          />
          <StatCard
            title="Dépenses Totales"
            value={`${totalExpenses.toLocaleString("fr-FR")} €`}
            icon={TrendingDown}
            trend={{ value: 8, isPositive: false }}
          />
          <StatCard
            title="Bénéfice Net"
            value={`${netIncome.toLocaleString("fr-FR")} €`}
            icon={DollarSign}
            trend={{ value: 15, isPositive: netIncome > 0 }}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Transactions */}
          <div className="lg:col-span-2">
            <RecentTransactions transactions={recentTransactions} />
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
                      <p className="text-sm font-medium">{property.monthly_rent?.toLocaleString("fr-FR")} €/mois</p>
                      <p className="text-xs text-gray-500 capitalize">{property.status}</p>
                    </div>
                  </div>
                ))}
                {properties.length === 0 && <p className="text-center text-gray-500 py-4">Aucune propriété trouvée</p>}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
