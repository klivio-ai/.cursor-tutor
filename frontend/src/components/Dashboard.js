import { useProperties } from "../hooks/use-properties"
import { useRevenus } from "../hooks/use-revenus"
import { useDepenses } from "../hooks/use-depenses"
import { useCategories } from "../hooks/use-categories"
import { StatCard } from "./dashboard/StatCard"
import { RecentTransactions } from "./dashboard/RecentTransactions"
import { CashflowChart } from "./charts/CashflowChart"
import { ExpensesPieChart } from "./charts/ExpensesPieChart"
import { PropertyPerfChart } from "./charts/PropertyPerfChart"

function Dashboard() {
  const { properties, loading: propertiesLoading } = useProperties()
  const { revenus, loading: revenusLoading } = useRevenus()
  const { depenses, loading: depensesLoading } = useDepenses()
  const { categories, loading: categoriesLoading } = useCategories()

  const loading = propertiesLoading || revenusLoading || depensesLoading || categoriesLoading

  // Calculate totals
  const totalRevenue = revenus.reduce((sum, rev) => sum + Number.parseFloat(rev.amount || 0), 0)
  const totalExpenses = depenses.reduce((sum, exp) => sum + Number.parseFloat(exp.amount || 0), 0)
  const netIncome = totalRevenue - totalExpenses
  const totalProperties = properties.length

  // Recent transactions (combine revenues and expenses)
  const recentTransactions = [
    ...revenus.map((rev) => ({
      id: rev.id,
      type: "revenue",
      amount: Number.parseFloat(rev.amount || 0),
      description: rev.description || "Revenu",
      date: rev.date,
      property: properties.find((p) => p.id === rev.property_id)?.name || "N/A",
      category: categories.find((c) => c.id === rev.category_id)?.name || "N/A",
      status: rev.status,
      paid: rev.paid,
    })),
    ...depenses.map((exp) => ({
      id: exp.id,
      type: "expense",
      amount: Number.parseFloat(exp.amount || 0),
      description: exp.description || "Dépense",
      date: exp.date,
      property: properties.find((p) => p.id === exp.property_id)?.name || "N/A",
      category: categories.find((c) => c.id === exp.category_id)?.name || "N/A",
      status: exp.status,
      paid: exp.paid,
    })),
  ]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
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
              <div className="h-8 w-8 bg-blue-600 rounded flex items-center justify-center">
                <span className="text-white font-bold">🏠</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Tableau de Bord Immobilier</h1>
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
              <span>+</span>
              <span>Ajouter une Propriété</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Propriétés"
            value={totalProperties.toString()}
            icon="🏠"
            trend={{ value: 0, isPositive: true }}
          />
          <StatCard
            title="Revenus Totaux"
            value={`${totalRevenue.toLocaleString("fr-FR")} €`}
            icon="📈"
            trend={{ value: 12, isPositive: true }}
          />
          <StatCard
            title="Dépenses Totales"
            value={`${totalExpenses.toLocaleString("fr-FR")} €`}
            icon="📉"
            trend={{ value: 8, isPositive: false }}
          />
          <StatCard
            title="Bénéfice Net"
            value={`${netIncome.toLocaleString("fr-FR")} €`}
            icon="💰"
            trend={{ value: 15, isPositive: netIncome > 0 }}
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Flux de Trésorerie</h3>
            <CashflowChart revenus={revenus} expenses={depenses} />
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Répartition des Dépenses</h3>
            <ExpensesPieChart expenses={depenses} categories={categories} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Performance by Property */}
          <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Performance par Propriété</h3>
            <PropertyPerfChart properties={properties} revenus={revenus} expenses={depenses} />
          </div>

          {/* Recent Transactions */}
          <div className="bg-white p-6 rounded-lg shadow">
            <RecentTransactions transactions={recentTransactions} />
          </div>
        </div>

        {/* Properties Overview */}
        <div className="mt-6 bg-white p-6 rounded-lg shadow">
          <div className="flex items-center mb-4">
            <span className="text-lg font-semibold">Aperçu des Propriétés</span>
          </div>
          <div className="space-y-4">
            {properties.slice(0, 5).map((property) => (
              <div key={property.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-sm">{property.name || "Sans nom"}</p>
                  <p className="text-xs text-gray-500">{property.address}</p>
                  <p className="text-xs text-gray-500 capitalize">{property.type || "N/A"}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">
                    {Number.parseFloat(property.monthly_rent || 0).toLocaleString("fr-FR")} €/mois
                  </p>
                  <p className="text-xs text-gray-500 capitalize">{property.payment_status}</p>
                  {property.next_due_date && (
                    <p className="text-xs text-gray-500">
                      Échéance: {new Date(property.next_due_date).toLocaleDateString("fr-FR")}
                    </p>
                  )}
                </div>
              </div>
            ))}
            {properties.length === 0 && <p className="text-center text-gray-500 py-4">Aucune propriété trouvée</p>}
          </div>
        </div>
      </main>
    </div>
  )
}

export default Dashboard
