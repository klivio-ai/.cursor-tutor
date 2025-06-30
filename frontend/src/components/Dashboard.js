"use client"

import { useState } from "react"
import { Card } from "./ui/card"
import { Loading } from "./ui/loading"
import StatCard from "./dashboard/StatCard"
import RecentTransactions from "./dashboard/RecentTransactions"
import { useProperties } from "../hooks/use-properties"
import { useRevenus } from "../hooks/use-revenus"
import { useDepenses } from "../hooks/use-depenses"

const Dashboard = () => {
  const { properties, loading: propertiesLoading } = useProperties()
  const { revenus, loading: revenusLoading } = useRevenus()
  const { depenses, loading: depensesLoading } = useDepenses()
  const [activeTab, setActiveTab] = useState("overview")

  const loading = propertiesLoading || revenusLoading || depensesLoading

  // Calculate metrics
  const totalProperties = properties?.length || 0
  const totalRevenue = revenus?.reduce((sum, rev) => sum + (rev.montant || 0), 0) || 0
  const totalExpenses = depenses?.reduce((sum, exp) => sum + (exp.montant || 0), 0) || 0
  const netIncome = totalRevenue - totalExpenses

  // Get recent transactions
  const recentTransactions = [
    ...(revenus?.slice(0, 5).map((rev) => ({ ...rev, type: "revenue" })) || []),
    ...(depenses?.slice(0, 5).map((exp) => ({ ...exp, type: "expense" })) || []),
  ]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 10)

  if (loading) {
    return <Loading />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">K</span>
                </div>
                <h1 className="text-xl font-bold text-slate-900">Klivio</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex space-x-1 bg-slate-100 rounded-lg p-1">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    activeTab === "overview"
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab("analytics")}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    activeTab === "analytics"
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Analytics
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Welcome back! 👋</h2>
          <p className="text-slate-600">Here's what's happening with your properties today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard title="Total Properties" value={totalProperties} change="+2.5%" trend="up" icon="🏠" color="blue" />
          <StatCard
            title="Total Revenue"
            value={`€${totalRevenue.toLocaleString()}`}
            change="+12.3%"
            trend="up"
            icon="💰"
            color="green"
          />
          <StatCard
            title="Total Expenses"
            value={`€${totalExpenses.toLocaleString()}`}
            change="-5.2%"
            trend="down"
            icon="📊"
            color="red"
          />
          <StatCard
            title="Net Income"
            value={`€${netIncome.toLocaleString()}`}
            change="+18.7%"
            trend="up"
            icon="📈"
            color="purple"
          />
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Transactions */}
          <div className="lg:col-span-2">
            <RecentTransactions transactions={recentTransactions} />
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 rounded-lg transition-all duration-200 group">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                      <span className="text-white text-sm">+</span>
                    </div>
                    <span className="font-medium text-slate-900">Add Property</span>
                  </div>
                  <svg
                    className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                <button className="w-full flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 rounded-lg transition-all duration-200 group">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                      <span className="text-white text-sm">€</span>
                    </div>
                    <span className="font-medium text-slate-900">Add Revenue</span>
                  </div>
                  <svg
                    className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                <button className="w-full flex items-center justify-between p-3 bg-gradient-to-r from-red-50 to-red-100 hover:from-red-100 hover:to-red-200 rounded-lg transition-all duration-200 group">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                      <span className="text-white text-sm">-</span>
                    </div>
                    <span className="font-medium text-slate-900">Add Expense</span>
                  </div>
                  <svg
                    className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </Card>

            {/* Performance Summary */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">This Month</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Occupancy Rate</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div className="w-4/5 h-full bg-gradient-to-r from-green-500 to-green-600"></div>
                    </div>
                    <span className="text-sm font-medium text-slate-900">85%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Collection Rate</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div className="w-11/12 h-full bg-gradient-to-r from-blue-500 to-blue-600"></div>
                    </div>
                    <span className="text-sm font-medium text-slate-900">92%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Maintenance</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div className="w-1/3 h-full bg-gradient-to-r from-yellow-500 to-yellow-600"></div>
                    </div>
                    <span className="text-sm font-medium text-slate-900">3 pending</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
