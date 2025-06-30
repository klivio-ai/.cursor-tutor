"use client"

import { useState } from "react"
import { StatCard } from "./dashboard/StatCard"
import { RecentTransactions } from "./dashboard/RecentTransactions"
import { Card } from "./ui/card"
import { Loading } from "./ui/loading"
import { useProperties } from "@/hooks/use-properties"
import { useRevenus } from "@/hooks/use-revenus"
import { useDepenses } from "@/hooks/use-depenses"
import { Building2, TrendingUp, TrendingDown, DollarSign, Plus, Filter, Search } from "lucide-react"

export function Dashboard() {
  const { properties, loading: propertiesLoading } = useProperties()
  const { revenus, loading: revenusLoading } = useRevenus()
  const { depenses, loading: depensesLoading } = useDepenses()
  const [searchTerm, setSearchTerm] = useState("")

  const loading = propertiesLoading || revenusLoading || depensesLoading

  if (loading) {
    return <Loading />
  }

  // Safe calculations with null checks
  const totalRevenue = revenus?.reduce((sum, revenue) => sum + (revenue?.amount || 0), 0) || 0
  const totalExpenses = depenses?.reduce((sum, expense) => sum + (expense?.amount || 0), 0) || 0
  const netIncome = totalRevenue - totalExpenses
  const totalProperties = properties?.length || 0

  const recentTransactions = [
    ...(revenus?.map((r) => ({ ...r, type: "revenue" as const })) || []),
    ...(depenses?.map((d) => ({ ...d, type: "expense" as const })) || []),
  ]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Building2 className="h-8 w-8 text-blue-600" />
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Klivio
                </h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Plus className="h-4 w-4 mr-2" />
                Add Property
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Welcome back!</h2>
          <p className="text-slate-600">Here's what's happening with your properties today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Properties"
            value={totalProperties.toString()}
            icon={Building2}
            trend={{ value: 12, isPositive: true }}
            color="blue"
          />
          <StatCard
            title="Total Revenue"
            value={`€${totalRevenue.toLocaleString()}`}
            icon={TrendingUp}
            trend={{ value: 8.2, isPositive: true }}
            color="green"
          />
          <StatCard
            title="Total Expenses"
            value={`€${totalExpenses.toLocaleString()}`}
            icon={TrendingDown}
            trend={{ value: 3.1, isPositive: false }}
            color="red"
          />
          <StatCard
            title="Net Income"
            value={`€${netIncome.toLocaleString()}`}
            icon={DollarSign}
            trend={{ value: 15.3, isPositive: netIncome > 0 }}
            color={netIncome > 0 ? "green" : "red"}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Transactions */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-slate-900">Recent Transactions</h3>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search transactions..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <button className="inline-flex items-center px-3 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </button>
                </div>
              </div>
              <RecentTransactions transactions={recentTransactions} />
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-xl font-semibold text-slate-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full text-left p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Plus className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">Add Revenue</p>
                      <p className="text-sm text-slate-500">Record new income</p>
                    </div>
                  </div>
                </button>
                <button className="w-full text-left p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                      <Plus className="h-4 w-4 text-red-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">Add Expense</p>
                      <p className="text-sm text-slate-500">Record new expense</p>
                    </div>
                  </div>
                </button>
                <button className="w-full text-left p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <Building2 className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">Add Property</p>
                      <p className="text-sm text-slate-500">Add new property</p>
                    </div>
                  </div>
                </button>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-semibold text-slate-900 mb-4">Property Overview</h3>
              <div className="space-y-3">
                {properties && properties.length > 0 ? (
                  <>
                    {properties.slice(0, 3).map((property) => (
                      <div key={property.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div>
                          <p className="font-medium text-slate-900">{property.name || "Unnamed Property"}</p>
                          <p className="text-sm text-slate-500">{property.type || "Property"}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-slate-900">€{(property.value || 0).toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                    {properties.length > 3 && (
                      <button className="w-full text-center py-2 text-blue-600 hover:text-blue-700 font-medium">
                        View all {properties.length} properties
                      </button>
                    )}
                  </>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-slate-500">No properties yet</p>
                    <p className="text-sm text-slate-400">Add your first property to get started</p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
