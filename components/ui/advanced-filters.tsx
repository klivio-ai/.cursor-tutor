"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, X, Calendar, Euro, Building2 } from "lucide-react"
import { DatePicker } from "@/components/ui/date-picker"

interface FilterOption {
  label: string
  value: string
}

interface AdvancedFiltersProps {
  filters: {
    search: string
    status: string
    category: string
    property: string
    dateFrom: string
    dateTo: string
    amountMin: string
    amountMax: string
  }
  onFiltersChange: (filters: any) => void
  onReset: () => void
  statusOptions?: FilterOption[]
  categoryOptions?: FilterOption[]
  propertyOptions?: FilterOption[]
  showAmountFilter?: boolean
  showDateFilter?: boolean
  showPropertyFilter?: boolean
  showCategoryFilter?: boolean
  showStatusFilter?: boolean
}

export function AdvancedFilters({
  filters,
  onFiltersChange,
  onReset,
  statusOptions = [],
  categoryOptions = [],
  propertyOptions = [],
  showAmountFilter = true,
  showDateFilter = true,
  showPropertyFilter = true,
  showCategoryFilter = true,
  showStatusFilter = true
}: AdvancedFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleFilterChange = (key: string, value: string) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const activeFiltersCount = Object.values(filters).filter(value => value !== "").length

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filtres et Recherche</span>
            {activeFiltersCount > 0 && (
              <Badge variant="secondary">{activeFiltersCount}</Badge>
            )}
          </CardTitle>
          <div className="flex items-center space-x-2">
            {activeFiltersCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onReset}
                className="text-red-600 hover:text-red-700"
              >
                <X className="h-4 w-4 mr-1" />
                Réinitialiser
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? "Masquer" : "Afficher"} les filtres
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Recherche principale */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Rechercher par description, référence, fournisseur..."
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filtres avancés */}
        {isExpanded && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t">
            {/* Filtre par statut */}
            {showStatusFilter && statusOptions.length > 0 && (
              <div className="space-y-2">
                <Label>Statut</Label>
                <Select value={filters.status} onValueChange={(value) => handleFilterChange("status", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tous les statuts" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Tous les statuts</SelectItem>
                    {statusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Filtre par catégorie */}
            {showCategoryFilter && categoryOptions.length > 0 && (
              <div className="space-y-2">
                <Label>Catégorie</Label>
                <Select value={filters.category} onValueChange={(value) => handleFilterChange("category", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Toutes les catégories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Toutes les catégories</SelectItem>
                    {categoryOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Filtre par propriété */}
            {showPropertyFilter && propertyOptions.length > 0 && (
              <div className="space-y-2">
                <Label>Propriété</Label>
                <Select value={filters.property} onValueChange={(value) => handleFilterChange("property", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Toutes les propriétés" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Toutes les propriétés</SelectItem>
                    {propertyOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Filtre par montant */}
            {showAmountFilter && (
              <div className="space-y-2">
                <Label className="flex items-center space-x-1">
                  <Euro className="h-4 w-4" />
                  <span>Montant</span>
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    placeholder="Min"
                    type="number"
                    value={filters.amountMin}
                    onChange={(e) => handleFilterChange("amountMin", e.target.value)}
                  />
                  <Input
                    placeholder="Max"
                    type="number"
                    value={filters.amountMax}
                    onChange={(e) => handleFilterChange("amountMax", e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Filtre par date */}
            {showDateFilter && (
              <div className="space-y-2">
                <Label className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>Période</span>
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) => handleFilterChange("dateFrom", e.target.value)}
                  />
                  <Input
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) => handleFilterChange("dateTo", e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Filtres actifs */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap gap-2 pt-2 border-t">
            {filters.search && (
              <Badge variant="outline" className="flex items-center space-x-1">
                <span>Recherche: {filters.search}</span>
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => handleFilterChange("search", "")}
                />
              </Badge>
            )}
            {filters.status && (
              <Badge variant="outline" className="flex items-center space-x-1">
                <span>Statut: {filters.status}</span>
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => handleFilterChange("status", "")}
                />
              </Badge>
            )}
            {filters.category && (
              <Badge variant="outline" className="flex items-center space-x-1">
                <span>Catégorie: {filters.category}</span>
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => handleFilterChange("category", "")}
                />
              </Badge>
            )}
            {filters.property && (
              <Badge variant="outline" className="flex items-center space-x-1">
                <span>Propriété: {filters.property}</span>
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => handleFilterChange("property", "")}
                />
              </Badge>
            )}
            {(filters.amountMin || filters.amountMax) && (
              <Badge variant="outline" className="flex items-center space-x-1">
                <span>
                  Montant: {filters.amountMin || "0"} - {filters.amountMax || "∞"} €
                </span>
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => {
                    handleFilterChange("amountMin", "")
                    handleFilterChange("amountMax", "")
                  }}
                />
              </Badge>
            )}
            {(filters.dateFrom || filters.dateTo) && (
              <Badge variant="outline" className="flex items-center space-x-1">
                <span>
                  Période: {filters.dateFrom || "∞"} - {filters.dateTo || "∞"}
                </span>
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => {
                    handleFilterChange("dateFrom", "")
                    handleFilterChange("dateTo", "")
                  }}
                />
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
} 