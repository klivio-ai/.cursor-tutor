import React, { useState, useMemo, Suspense } from 'react'
import { useProperties } from '../hooks/use-properties'
import { useRevenus } from '../hooks/use-revenus'
import { useDepenses } from '../hooks/use-depenses'
import { useCategories } from '../hooks/use-categories'
import { StatCard } from './dashboard/StatCard'
import { RecentTransactions } from './dashboard/RecentTransactions'
import { DataManagement } from './DataManagement'
import { LoadingCard } from './ui/loading'
import { formatCurrency } from '../lib/utils'

// Lazy load the chart components
const CashflowChart = React.lazy(() => 
  import('./charts/CashflowChart').then(module => ({ default: module.CashflowChart }))
)
const ExpensesPieChart = React.lazy(() => 
  import('./charts/ExpensesPieChart').then(module => ({ default: module.ExpensesPieChart }))
)
const PropertyPerfChart = React.lazy(() => 
  import('./charts/PropertyPerfChart').then(module => ({ default: module.PropertyPerfChart }))
)

// Chart fallback component
const ChartFallback = () => (
  <LoadingCard rows={3} className="h-[350px] flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
      <p className="text-sm text-gray-500">Chargement du graphique...</p>
    </div>
  </LoadingCard>
)

export function Dashboard() {
  const { 
    data: properties, 
    isLoading: isLoadingProperties, 
    error: errorProperties,
    refetch: refetchProperties
  } = useProperties()
  
  const { 
    data: revenus, 
    isLoading: isLoadingRevenus, 
    error: errorRevenus,
    refetch: refetchRevenus
  } = useRevenus()
  
  const { 
    data: expenses, 
    isLoading: isLoadingExpenses, 
    error: errorExpenses,
    refetch: refetchExpenses
  } = useDepenses()

  const {
    categories,
    loading: isLoadingCategories,
    error: errorCategories,
    fetchCategories: refetchCategories
  } = useCategories()

  // Function to refresh all data
  const handleDataAdded = () => {
    refetchProperties()
    refetchRevenus()
    refetchExpenses()
    refetchCategories()
  }

  // Force bypass loading state for testing
  const isLoading = false // isLoadingProperties || isLoadingRevenus || isLoadingExpenses || isLoadingCategories
  const error = errorProperties || errorRevenus || errorExpenses || errorCategories
  
  // Debug logging
  console.log('Debug - Loading states:', { 
    isLoadingProperties, 
    isLoadingRevenus, 
    isLoadingExpenses, 
    isLoadingCategories 
  })
  console.log('Debug - Error states:', { 
    errorProperties, 
    errorRevenus, 
    errorExpenses, 
    errorCategories 
  })
  console.log('Debug - Data:', { 
    propertiesCount: properties?.length || 0, 
    revenusCount: revenus?.length || 0, 
    expensesCount: expenses?.length || 0, 
    categoriesCount: categories?.length || 0 
  })

  // Financial metrics calculation
  const financialMetrics = useMemo(() => {
    const totalRevenue = revenus.reduce((acc, r) => acc + (Number(r.amount) || 0), 0)
    const totalExpenses = expenses.reduce((acc, e) => acc + (Number(e.amount) || 0), 0)
    const netProfit = totalRevenue - totalExpenses
    
    return {
      totalRevenue,
      totalExpenses,
      netProfit,
      propertyCount: properties.length
    }
  }, [revenus, expenses, properties.length])

  // Recent transactions
  const recentTransactions = useMemo(() => {
    if (!revenus || !expenses) return []

    const typedRevenus = revenus.map(r => ({ ...r, type: 'revenue' }))
    const typedExpenses = expenses.map(e => ({ ...e, type: 'expense' }))

    return [...typedRevenus, ...typedExpenses]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5)
  }, [revenus, expenses])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du tableau de bord...</p>
        </div>
      </div>
    )
  }

  if (error) {
    console.error('Dashboard error:', error)
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-red-800 mb-2">Erreur de chargement</h3>
          <p className="text-red-600">
            {typeof error === 'string' ? error : error.message || 'Une erreur est survenue'}
          </p>
          <div className="mt-4 text-sm text-red-500">
            <p>Détails des erreurs:</p>
            <ul className="list-disc pl-5 mt-2">
              {errorProperties && <li>Propriétés: {errorProperties.toString()}</li>}
              {errorRevenus && <li>Revenus: {errorRevenus.toString()}</li>}
              {errorExpenses && <li>Dépenses: {errorExpenses.toString()}</li>}
              {errorCategories && <li>Catégories: {errorCategories.toString()}</li>}
            </ul>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Tableau de Bord Immobilier</h1>
        <p className="text-gray-600 mt-2">Suivi financier de vos propriétés</p>
      </div>

      {/* Data Management Section */}
      <DataManagement onDataAdded={handleDataAdded} />

      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Revenus Totaux"
          value={formatCurrency(financialMetrics.totalRevenue)}
          icon={<DollarSignIcon className="h-4 w-4 text-gray-600" />}
          description={`${revenus.length} transactions`}
        />
        <StatCard
          title="Dépenses Totales"
          value={formatCurrency(financialMetrics.totalExpenses)}
          icon={<TrendingDownIcon className="h-4 w-4 text-gray-600" />}
          description={`${expenses.length} transactions`}
        />
        <StatCard
          title="Profit Net"
          value={formatCurrency(financialMetrics.netProfit)}
          icon={<TrendingUpIcon className="h-4 w-4 text-gray-600" />}
          trendDirection={financialMetrics.netProfit >= 0 ? "up" : "down"}
          description={`${financialMetrics.netProfit >= 0 ? 'Bénéfice' : 'Perte'}`}
        />
        <StatCard
          title="Propriétés"
          value={financialMetrics.propertyCount.toString()}
          icon={<HomeIcon className="h-4 w-4 text-gray-600" />}
          description="Propriétés gérées"
        />
      </div>

      {/* Main Charts Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <div className="lg:col-span-4 border rounded-lg p-4 bg-white shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Flux de trésorerie</h3>
          <Suspense fallback={<ChartFallback />}>
            <CashflowChart revenus={revenus} expenses={expenses} />
          </Suspense>
        </div>
        
        <div className="lg:col-span-3 border rounded-lg p-4 bg-white shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Transactions Récentes</h3>
          <RecentTransactions 
            transactions={recentTransactions} 
            properties={properties} 
            categories={categories} 
          />
        </div>
      </div>

      {/* Additional Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="border rounded-lg p-4 bg-white shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Répartition des dépenses</h3>
          <Suspense fallback={<ChartFallback />}>
            <ExpensesPieChart expenses={expenses} categories={categories} />
          </Suspense>
        </div>
        
        <div className="border rounded-lg p-4 bg-white shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Performance par propriété</h3>
          <Suspense fallback={<ChartFallback />}>
            <PropertyPerfChart properties={properties} revenus={revenus} expenses={expenses} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

// Simple icon components (using basic SVG since we don't have lucide-react setup in the main component)
const DollarSignIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
  </svg>
)

const TrendingUpIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
)

const TrendingDownIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
  </svg>
)

const HomeIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
)