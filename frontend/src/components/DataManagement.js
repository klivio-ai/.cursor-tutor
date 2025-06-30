"use client"

import { useState } from "react"
import { Card } from "./ui/card"
import { Loading } from "./ui/loading"
import { useProperties } from "../hooks/use-properties"
import { useRevenus } from "../hooks/use-revenus"
import { useDepenses } from "../hooks/use-depenses"
import { useCategories } from "../hooks/use-categories"

const DataManagement = () => {
  const [activeTab, setActiveTab] = useState("properties")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  const { properties, loading: propertiesLoading } = useProperties()
  const { revenus, loading: revenusLoading } = useRevenus()
  const { depenses, loading: depensesLoading } = useDepenses()
  const { categories } = useCategories()

  const tabs = [
    { id: "properties", label: "Properties", icon: "🏠", count: properties?.length || 0 },
    { id: "revenues", label: "Revenues", icon: "💰", count: revenus?.length || 0 },
    { id: "expenses", label: "Expenses", icon: "📊", count: depenses?.length || 0 },
    { id: "categories", label: "Categories", icon: "📋", count: categories?.length || 0 },
  ]

  const isLoading = propertiesLoading || revenusLoading || depensesLoading

  const renderTabContent = () => {
    if (isLoading) {
      return <Loading />
    }

    switch (activeTab) {
      case "properties":
        return renderPropertiesTable()
      case "revenues":
        return renderRevenuesTable()
      case "expenses":
        return renderExpensesTable()
      case "categories":
        return renderCategoriesTable()
      default:
        return null
    }
  }

  const renderPropertiesTable = () => {
    const filteredProperties =
      properties?.filter(
        (property) =>
          property.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          property.adresse?.toLowerCase().includes(searchTerm.toLowerCase()),
      ) || []

    return (
      <div className="space-y-4">
        {filteredProperties.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🏠</span>
            </div>
            <p className="text-slate-500">No properties found</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredProperties.map((property) => (
              <Card key={property.id} className="p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                      <span className="text-white text-lg">🏠</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">{property.nom}</h3>
                      <p className="text-slate-600">{property.adresse}</p>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-sm text-slate-500">Type: {property.type}</span>
                        {property.prix && (
                          <span className="text-sm font-medium text-green-600">€{property.prix.toLocaleString()}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="px-3 py-1.5 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors">
                      Edit
                    </button>
                    <button className="px-3 py-1.5 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors">
                      Delete
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    )
  }

  const renderRevenuesTable = () => {
    const filteredRevenues =
      revenus?.filter(
        (revenue) =>
          revenue.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          revenue.categorie?.toLowerCase().includes(searchTerm.toLowerCase()),
      ) || []

    return (
      <div className="space-y-4">
        {filteredRevenues.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">💰</span>
            </div>
            <p className="text-slate-500">No revenues found</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredRevenues.map((revenue) => (
              <Card key={revenue.id} className="p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                      <span className="text-white text-lg">💰</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">{revenue.description}</h3>
                      <p className="text-slate-600">{revenue.categorie}</p>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-sm text-slate-500">{new Date(revenue.date).toLocaleDateString()}</span>
                        <span className="text-sm font-medium text-green-600">€{revenue.montant?.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="px-3 py-1.5 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors">
                      Edit
                    </button>
                    <button className="px-3 py-1.5 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors">
                      Delete
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    )
  }

  const renderExpensesTable = () => {
    const filteredExpenses =
      depenses?.filter(
        (expense) =>
          expense.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          expense.categorie?.toLowerCase().includes(searchTerm.toLowerCase()),
      ) || []

    return (
      <div className="space-y-4">
        {filteredExpenses.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📊</span>
            </div>
            <p className="text-slate-500">No expenses found</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredExpenses.map((expense) => (
              <Card key={expense.id} className="p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                      <span className="text-white text-lg">📊</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">{expense.description}</h3>
                      <p className="text-slate-600">{expense.categorie}</p>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-sm text-slate-500">{new Date(expense.date).toLocaleDateString()}</span>
                        <span className="text-sm font-medium text-red-600">€{expense.montant?.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="px-3 py-1.5 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors">
                      Edit
                    </button>
                    <button className="px-3 py-1.5 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors">
                      Delete
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    )
  }

  const renderCategoriesTable = () => {
    const filteredCategories =
      categories?.filter((category) => category.nom?.toLowerCase().includes(searchTerm.toLowerCase())) || []

    return (
      <div className="space-y-4">
        {filteredCategories.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📋</span>
            </div>
            <p className="text-slate-500">No categories found</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredCategories.map((category) => (
              <Card key={category.id} className="p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <span className="text-white text-lg">📋</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">{category.nom}</h3>
                      <p className="text-slate-600">{category.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="px-3 py-1.5 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors">
                      Edit
                    </button>
                    <button className="px-3 py-1.5 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors">
                      Delete
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    )
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
                <h1 className="text-xl font-bold text-slate-900">Data Management</h1>
              </div>
            </div>
            <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium">
              Add New
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-slate-100 rounded-lg p-1 max-w-fit">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.id ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs ${
                    activeTab === tab.id ? "bg-slate-100 text-slate-600" : "bg-slate-200 text-slate-500"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Search and Filters */}
        <Card className="p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex space-x-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <button className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors">
                Filter
              </button>
            </div>
          </div>
        </Card>

        {/* Content */}
        {renderTabContent()}
      </div>
    </div>
  )
}

export default DataManagement
