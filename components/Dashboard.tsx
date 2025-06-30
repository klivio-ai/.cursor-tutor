"use client"

import { useState, useEffect } from "react"
import { StatCard } from "./dashboard/StatCard"
import { RecentTransactions } from "./dashboard/RecentTransactions"
import { Card } from "./ui/card"
import { Loading } from "./ui/loading"
import { useProperties } from "@/hooks/use-properties"
import { useRevenus } from "@/hooks/use-revenus"
import { useDepenses } from "@/hooks/use-depenses"
import { TrendingUp, TrendingDown, DollarSign, Home, Calendar, Plus } from "lucide-react"

export function Dashboard() {
  const { properties, loading: propertiesLoading } = useProperties()
  const { revenus, loading: revenusLoading } = useRevenus()
  const { depenses, loading: depensesLoading } = useDepenses()
  const [greeting, setGreeting] = useState("")

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setGreeting("Good morning")
    else if (hour < 18) setGreeting("Good afternoon")
    else setGreeting("Good evening")
  }, [])

  if (propertiesLoading || revenusLoading || depensesLoading) {
    return <Loading />
  }

  const totalRevenue = revenus?.reduce((sum, rev) => sum + (rev.montant || 0), 0) || 0
  const totalExpenses = depenses?.reduce((sum, exp) => sum + (exp.montant || 0), 0) || 0
  const netIncome = totalRevenue - totalExpenses
  const occupancyRate =
    properties?.length > 0 ? (properties.filter((p) => p.statut === "occupied").length / properties.length) * 100 : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Home className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Klivio
                </h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl">
                <Plus className="w-4 h-4 mr-2" />
                Add Property
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">{greeting}! 👋</h2>
          <p className="text-slate-600">Here's what's happening with your properties today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Revenue"
            value={`$${totalRevenue.toLocaleString()}`}
            change="+12.5%"
            trend="up"
            icon={<DollarSign className="w-5 h-5" />}
            color="green"
          />
          <StatCard
            title="Total Expenses"
            value={`$${totalExpenses.toLocaleString()}`}
            change="-3.2%"
            trend="down"
            icon={<TrendingDown className="w-5 h-5" />}
            color="red"
          />
          <StatCard
            title="Net Income"
            value={`$${netIncome.toLocaleString()}`}
            change="+8.1%"
            trend="up"
            icon={<TrendingUp className="w-5 h-5" />}
            color="blue"
          />
          <StatCard
            title="Occupancy Rate"
            value={`${occupancyRate.toFixed(1)}%`}
            change="+2.4%"
            trend="up"
            icon={<Home className="w-5 h-5" />}
            color="purple"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Transactions */}
          <div className="lg:col-span-2">
            <RecentTransactions transactions={[...revenus, ...depenses].slice(0, 10)} />
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full text-left p-3 rounded-lg hover:bg-slate-50 transition-colors duration-200 border border-slate-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Plus className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="font-medium text-slate-900">Add Revenue</span>
                  </div>
                </button>
                <button className="w-full text-left p-3 rounded-lg hover:bg-slate-50 transition-colors duration-200 border border-slate-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                      <Plus className="w-4 h-4 text-red-600" />
                    </div>
                    <span className="font-medium text-slate-900">Add Expense</span>
                  </div>
                </button>
                <button className="w-full text-left p-3 rounded-lg hover:bg-slate-50 transition-colors duration-200 border border-slate-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="font-medium text-slate-900">Schedule Maintenance</span>
                  </div>
                </button>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Property Overview</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Total Properties</span>
                  <span className="font-semibold text-slate-900">{properties?.length || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Occupied</span>
                  <span className="font-semibold text-green-600">
                    {properties?.filter((p) => p.statut === "occupied").length || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Vacant</span>
                  <span className="font-semibold text-orange-600">
                    {properties?.filter((p) => p.statut === "vacant").length || 0}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
