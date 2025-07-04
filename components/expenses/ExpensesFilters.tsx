"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { X, Filter, Search, Calendar, Building2, Tag } from "lucide-react"

interface ExpensesFiltersProps {
  properties: any[]
  categories: any[]
  onFiltersChange: (filters: any) => void
  className?: string
}

export function ExpensesFilters({ properties, categories, onFiltersChange, className = "" }: ExpensesFiltersProps) {
  const [filters, setFilters] = useState({
    search: '',
    property: 'all',
    status: 'all',
    category: 'all',
    dateFrom: '',
    dateTo: '',
    amountMin: '',
    amountMax: ''
  })

  const [isExpanded, setIsExpanded] = useState(false)

  const expenseCategories = categories.filter(cat => cat.type === 'expense')

  const statuses = [
    { value: 'Pending', label: 'En attente' },
    { value: 'Paid', label: 'Payé' },
    { value: 'Overdue', label: 'En retard' }
  ]

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const clearFilters = () => {
    const clearedFilters = {
      search: '',
      property: 'all',
      status: 'all',
      category: 'all',
      dateFrom: '',
      dateTo: '',
      amountMin: '',
      amountMax: ''
    }
    setFilters(clearedFilters)
    onFiltersChange(clearedFilters)
  }

  const activeFiltersCount = Object.values(filters).filter(value => value !== '' && value !== 'all').length

  return (
    <Card className="w-full shadow-sm border-0 bg-white">
      <CardHeader className="pb-3 sm:pb-4">
        <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <CardTitle className="text-lg sm:text-xl flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            <span className="hidden sm:inline">Filtres</span>
            <span className="sm:hidden">Filtres</span>
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-2 text-xs">
                {activeFiltersCount}
              </Badge>
            )}
          </CardTitle>
          <div className="flex gap-2">
            {activeFiltersCount > 0 && (
              <Button variant="outline" size="sm" onClick={clearFilters} className="text-xs sm:text-sm">
                <X className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Effacer</span>
                <span className="sm:hidden">Reset</span>
              </Button>
            )}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-xs sm:text-sm"
            >
              <span className="hidden sm:inline">{isExpanded ? 'Réduire' : 'Étendre'}</span>
              <span className="sm:hidden">{isExpanded ? '−' : '+'}</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4 sm:space-y-6">
        {/* Recherche rapide */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Rechercher..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="pl-10 text-sm"
          />
        </div>

        {/* Filtres de base */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="space-y-2">
            <Label htmlFor="property-filter" className="text-sm font-medium">Propriété</Label>
            <Select value={filters.property} onValueChange={(value) => handleFilterChange('property', value)}>
              <SelectTrigger className="w-full text-sm">
                <SelectValue placeholder="Toutes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les propriétés</SelectItem>
                {properties.map((property) => (
                  <SelectItem key={property.id} value={property.id}>
                    {property.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status-filter" className="text-sm font-medium">Statut</Label>
            <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
              <SelectTrigger className="w-full text-sm">
                <SelectValue placeholder="Tous" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                {statuses.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category-filter" className="text-sm font-medium">Catégorie</Label>
            <Select value={filters.category} onValueChange={(value) => handleFilterChange('category', value)}>
              <SelectTrigger className="w-full text-sm">
                <SelectValue placeholder="Toutes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les catégories</SelectItem>
                {expenseCategories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount-min" className="text-sm font-medium">Montant min (€)</Label>
            <Input
              id="amount-min"
              type="number"
              placeholder="0"
              value={filters.amountMin}
              onChange={(e) => handleFilterChange('amountMin', e.target.value)}
              className="w-full text-sm"
            />
          </div>
        </div>

        {/* Filtres avancés */}
        {isExpanded && (
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              <div className="space-y-2">
                <Label htmlFor="date-from" className="text-sm font-medium">Date de début</Label>
                <Input
                  id="date-from"
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                  className="w-full text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date-to" className="text-sm font-medium">Date de fin</Label>
                <Input
                  id="date-to"
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                  className="w-full text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount-max" className="text-sm font-medium">Montant max (€)</Label>
                <Input
                  id="amount-max"
                  type="number"
                  placeholder="∞"
                  value={filters.amountMax}
                  onChange={(e) => handleFilterChange('amountMax', e.target.value)}
                  className="w-full text-sm"
                />
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 