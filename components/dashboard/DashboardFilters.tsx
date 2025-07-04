"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Filter, RefreshCw } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Calendar as CalendarIcon } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"

interface Property {
  id: string
  name: string | null
  address: string
}

interface DashboardFiltersProps {
  properties: Property[]
  onFiltersChange: (filters: {
    propertyId: string | null
    startDate: Date | null
    endDate: Date | null
    period: string
  }) => void
}

const PERIOD_OPTIONS = [
  { value: "current_month", label: "Mois en cours" },
  { value: "last_month", label: "Mois dernier" },
  { value: "last_3_months", label: "3 derniers mois" },
  { value: "last_6_months", label: "6 derniers mois" },
  { value: "last_year", label: "12 derniers mois" },
  { value: "custom", label: "Période personnalisée" },
]

export function DashboardFilters({ properties, onFiltersChange }: DashboardFiltersProps) {
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null)
  const [selectedPeriod, setSelectedPeriod] = useState("current_month")
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)

  // Calculer les dates par défaut pour le mois en cours
  useEffect(() => {
    const now = new Date()
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    
    if (selectedPeriod === "current_month") {
      setStartDate(currentMonthStart)
      setEndDate(currentMonthEnd)
    } else if (selectedPeriod === "last_month") {
      const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0)
      setStartDate(lastMonthStart)
      setEndDate(lastMonthEnd)
    } else if (selectedPeriod === "last_3_months") {
      const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, 1)
      setStartDate(threeMonthsAgo)
      setEndDate(now)
    } else if (selectedPeriod === "last_6_months") {
      const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, 1)
      setStartDate(sixMonthsAgo)
      setEndDate(now)
    } else if (selectedPeriod === "last_year") {
      const oneYearAgo = new Date(now.getFullYear(), now.getMonth() - 12, 1)
      setStartDate(oneYearAgo)
      setEndDate(now)
    }
  }, [selectedPeriod])

  // Appliquer les filtres quand ils changent
  useEffect(() => {
    onFiltersChange({
      propertyId: selectedProperty,
      startDate,
      endDate,
      period: selectedPeriod,
    })
  }, [selectedProperty, startDate, endDate, selectedPeriod, onFiltersChange])

  const resetFilters = () => {
    setSelectedProperty(null)
    setSelectedPeriod("current_month")
    setStartDate(null)
    setEndDate(null)
  }

  return (
    <Card className="border-2 border-gray-100 hover:border-gray-200 transition-all duration-300">
      <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-100 pb-4">
        <CardTitle className="text-lg font-bold text-gray-800 flex items-center">
          <Filter className="h-5 w-5 mr-2 text-blue-600" />
          Filtres Dashboard
        </CardTitle>
        <p className="text-gray-600 text-sm">Filtrez les données par propriété et période</p>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Filtre par propriété */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Propriété</label>
            <Select value={selectedProperty || "all"} onValueChange={(value) => setSelectedProperty(value === "all" ? null : value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Toutes les propriétés" />
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

          {/* Filtre par période */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Période</label>
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PERIOD_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date de début (si période personnalisée) */}
          {selectedPeriod === "custom" && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Date de début</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP", { locale: fr }) : "Sélectionner une date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={startDate || undefined}
                    onSelect={(date) => setStartDate(date || null)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}

          {/* Date de fin (si période personnalisée) */}
          {selectedPeriod === "custom" && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Date de fin</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP", { locale: fr }) : "Sélectionner une date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={endDate || undefined}
                    onSelect={(date) => setEndDate(date || null)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}

          {/* Bouton de réinitialisation */}
          <div className="flex items-end">
            <Button
              variant="outline"
              onClick={resetFilters}
              className="w-full"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Réinitialiser
            </Button>
          </div>
        </div>

        {/* Affichage de la période sélectionnée */}
        {selectedPeriod !== "custom" && startDate && endDate && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800">
              <strong>Période sélectionnée :</strong>{" "}
              {format(startDate, "dd/MM/yyyy", { locale: fr })} - {format(endDate, "dd/MM/yyyy", { locale: fr })}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 