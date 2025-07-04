"use client"

import { useData } from "@/hooks/use-data"
import { StatsCards } from "./dashboard/stats-cards"
import { FinancialChart } from "./dashboard/financial-chart"
import { DashboardFilters } from "./dashboard/DashboardFilters"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown } from "lucide-react"
import { DashboardSkeleton } from "@/components/ui/loading"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts"
import { formatCurrency } from "@/lib/utils"
import { useState } from "react"

export default function Dashboard() {
  const { 
    properties, 
    revenues, 
    expenses, 
    categories,
    tenants,
    payments,
    loading, 
    error 
  } = useData()

  // État des filtres
  const [filters, setFilters] = useState({
    propertyId: null as string | null,
    startDate: null as Date | null,
    endDate: null as Date | null,
    period: "current_month" as string
  })

  // Fonction pour filtrer les données
  const filterData = (data: any[], dateField: string) => {
    return data.filter(item => {
      const itemDate = new Date(item[dateField])
      
      // Filtre par propriété si sélectionné
      if (filters.propertyId && item.property_id && item.property_id !== filters.propertyId) {
        return false
      }
      
      // Filtre par date si définie
      if (filters.startDate && itemDate < filters.startDate) {
        return false
      }
      if (filters.endDate && itemDate > filters.endDate) {
        return false
      }
      
      return true
    })
  }

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

  // Calculs avancés avec données filtrées
  const filteredRevenues = filterData(revenues, 'date')
  const filteredExpenses = filterData(expenses, 'date')
  
  // Revenus et dépenses filtrés
  const totalRevenue = filteredRevenues.reduce((sum, rev) => sum + rev.amount, 0)
  const totalExpenses = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0)
  const netIncome = totalRevenue - totalExpenses
  
  // Calculs des propriétés
  const totalProperties = properties.length
  const totalValue = properties.reduce((sum, prop) => sum + (prop.current_value || 0), 0)
  
  // Calcul du taux d'occupation basé sur les locataires
  const occupiedProperties = properties.filter(prop => prop.tenant_id !== null).length
  const occupancyRate = totalProperties > 0 ? ((occupiedProperties / totalProperties) * 100).toFixed(1) : '0.0'
  
  // Calcul du loyer moyen
  const totalRent = filteredRevenues.reduce((sum, rev) => sum + rev.amount, 0)
  const averageRent = occupiedProperties > 0 ? (totalRent / occupiedProperties).toFixed(0) : '0'
  
  // Calcul de la rentabilité nette
  const netYield = totalValue > 0 ? ((netIncome / totalValue) * 100).toFixed(1) : '0.0'
  
  // Cash flow annuel (moyenne mensuelle * 12)
  const monthlyAverage = (totalRevenue - totalExpenses) / 12
  const annualCashFlow = monthlyAverage * 12
  
  // Calcul du ratio d'endettement (simulation basée sur les paiements)
  const totalPayments = payments.reduce((sum, pay) => sum + pay.amount, 0)
  const debtRatio = totalValue > 0 ? Math.min(((totalPayments / totalValue) * 100), 100).toFixed(0) : '0'

  // Répartition des dépenses par catégorie (V2 moderne)
  const expenseCategories = categories.filter(cat => cat.type === 'expense')
  const expensesByCategory = expenseCategories.map(cat => {
    const sum = filteredExpenses.filter(exp => exp.category_id === cat.id).reduce((acc, exp) => acc + exp.amount, 0)
    return {
      id: cat.id,
      name: cat.name,
      color: cat.color || undefined,
      total: sum,
      percentage: totalExpenses > 0 ? ((sum / totalExpenses) * 100).toFixed(1) : '0'
    }
  }).filter(cat => cat.total > 0).sort((a, b) => b.total - a.total)

  // Données pour le graphique en barres des dépenses par catégorie
  const expensesBarData = expensesByCategory.map(cat => ({
    name: cat.name,
    montant: cat.total,
    pourcentage: parseFloat(cat.percentage)
  }))

  return (
    <div className="space-y-8">
      {/* Header moderne */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Dashboard Immobilier
          </h1>
          <p className="text-gray-600 mt-1">Gestion de Portefeuille Locatif • Mise à jour en temps réel</p>
        </div>

      </div>

      {/* Filtres Dashboard */}
      <DashboardFilters 
        properties={properties}
        onFiltersChange={setFilters}
      />

      {/* KPI Cards modernisées */}
      <StatsCards 
        totalProperties={totalProperties}
        totalRevenue={totalRevenue}
        totalExpenses={totalExpenses}
        netIncome={netIncome}
        totalValue={totalValue}
        occupancyRate={parseFloat(occupancyRate)}
        averageRent={parseFloat(averageRent)}
        debtRatio={parseInt(debtRatio)}
      />

      {/* Graphique Cash Flow en vedette */}
      <Card className="border-2 border-blue-100 hover:border-blue-200 transition-all duration-300 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
          <CardTitle className="text-2xl font-bold text-gray-800 flex items-center">
            📈 Évolution Cash Flow (12 mois)
          </CardTitle>
          <p className="text-gray-600 mt-1">Analyse détaillée de votre performance financière</p>
        </CardHeader>
        <CardContent className="p-6">
          <FinancialChart revenues={filteredRevenues} expenses={filteredExpenses} />
        </CardContent>
      </Card>

      {/* Section Dépenses V2 Moderne */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Camembert moderne */}
        <Card className="border-2 border-red-100 hover:border-red-200 transition-all duration-300">
          <CardHeader className="bg-gradient-to-r from-red-50 to-orange-50 border-b border-red-100">
            <CardTitle className="text-xl font-bold text-gray-800 flex items-center">
              💸 Répartition des Dépenses
            </CardTitle>
            <p className="text-gray-600 mt-1">Répartition par catégorie - Mois en cours</p>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-[300px] w-full flex items-center justify-center">
              {expensesByCategory.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={expensesByCategory}
                      dataKey="total"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      innerRadius={60}
                      paddingAngle={3}
                      label={({ name, percentage }) => `${name} (${percentage}%)`}
                    >
                      {expensesByCategory.map((entry, idx) => (
                        <Cell 
                          key={`cell-${entry.id}`} 
                          fill={entry.color || `hsl(${(idx * 137.5) % 360}, 70%, 60%)`} 
                        />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number) => [`${value.toLocaleString('fr-FR')} €`, 'Montant']}
                      labelFormatter={(label) => `${label}`}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <TrendingDown className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Aucune dépense</h3>
                  <p className="text-sm text-gray-500">Aucune dépense enregistrée ce mois-ci.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Graphique en barres moderne */}
        <Card className="border-2 border-purple-100 hover:border-purple-200 transition-all duration-300">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-purple-100">
            <CardTitle className="text-xl font-bold text-gray-800 flex items-center">
              📊 Dépenses par Catégorie
            </CardTitle>
            <p className="text-gray-600 mt-1">Comparaison visuelle des montants</p>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-[300px] w-full">
              {expensesBarData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={expensesBarData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis 
                      dataKey="name" 
                      stroke="#6B7280"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis 
                      stroke="#6B7280"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `${value.toLocaleString()} €`}
                    />
                    <Tooltip 
                      formatter={(value: number) => [`${value.toLocaleString('fr-FR')} €`, 'Montant']}
                      labelFormatter={(label) => `${label}`}
                    />
                    <Bar 
                      dataKey="montant" 
                      fill="#8B5CF6"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <TrendingDown className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Aucune donnée</h3>
                  <p className="text-sm text-gray-500">Ajoutez des dépenses pour voir les graphiques.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
