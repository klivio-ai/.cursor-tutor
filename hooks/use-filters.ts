"use client"

import { useState, useMemo } from "react"

interface FilterState {
  search: string
  status: string
  category: string
  property: string
  dateFrom: string
  dateTo: string
  amountMin: string
  amountMax: string
}

interface UseFiltersProps<T> {
  data: T[]
  searchFields?: (keyof T)[]
  filterConfig?: {
    statusField?: keyof T
    categoryField?: keyof T
    propertyField?: keyof T
    dateField?: keyof T
    amountField?: keyof T
  }
}

export function useFilters<T>({ 
  data, 
  searchFields = [], 
  filterConfig = {} 
}: UseFiltersProps<T>) {
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    status: "",
    category: "",
    property: "",
    dateFrom: "",
    dateTo: "",
    amountMin: "",
    amountMax: ""
  })

  const filteredData = useMemo(() => {
    return data.filter(item => {
      // Filtre de recherche
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        const searchMatch = searchFields.some(field => {
          const value = item[field]
          if (value && typeof value === 'string') {
            return value.toLowerCase().includes(searchLower)
          }
          return false
        })
        if (!searchMatch) return false
      }

      // Filtre par statut
      if (filters.status && filterConfig.statusField) {
        const itemStatus = item[filterConfig.statusField]
        if (itemStatus !== filters.status) return false
      }

      // Filtre par catégorie
      if (filters.category && filterConfig.categoryField) {
        const itemCategory = item[filterConfig.categoryField]
        if (itemCategory !== filters.category) return false
      }

      // Filtre par propriété
      if (filters.property && filterConfig.propertyField) {
        const itemProperty = item[filterConfig.propertyField]
        if (itemProperty !== filters.property) return false
      }

      // Filtre par date
      if (filters.dateFrom && filterConfig.dateField) {
        const itemDate = new Date(item[filterConfig.dateField] as string)
        const fromDate = new Date(filters.dateFrom)
        if (itemDate < fromDate) return false
      }

      if (filters.dateTo && filterConfig.dateField) {
        const itemDate = new Date(item[filterConfig.dateField] as string)
        const toDate = new Date(filters.dateTo)
        toDate.setHours(23, 59, 59, 999) // Fin de journée
        if (itemDate > toDate) return false
      }

      // Filtre par montant
      if (filters.amountMin && filterConfig.amountField) {
        const itemAmount = Number(item[filterConfig.amountField])
        const minAmount = Number(filters.amountMin)
        if (itemAmount < minAmount) return false
      }

      if (filters.amountMax && filterConfig.amountField) {
        const itemAmount = Number(item[filterConfig.amountField])
        const maxAmount = Number(filters.amountMax)
        if (itemAmount > maxAmount) return false
      }

      return true
    })
  }, [data, filters, searchFields, filterConfig])

  const resetFilters = () => {
    setFilters({
      search: "",
      status: "",
      category: "",
      property: "",
      dateFrom: "",
      dateTo: "",
      amountMin: "",
      amountMax: ""
    })
  }

  const updateFilters = (newFilters: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }

  // Options pour les filtres
  const statusOptions = useMemo(() => {
    if (!filterConfig.statusField) return []
    const statuses = [...new Set(data.map(item => item[filterConfig.statusField!]))]
    return statuses
      .filter(Boolean)
      .map(status => ({ label: status as string, value: status as string }))
  }, [data, filterConfig.statusField])

  const categoryOptions = useMemo(() => {
    if (!filterConfig.categoryField) return []
    const categories = [...new Set(data.map(item => item[filterConfig.categoryField!]))]
    return categories
      .filter(Boolean)
      .map(category => ({ label: category as string, value: category as string }))
  }, [data, filterConfig.categoryField])

  const propertyOptions = useMemo(() => {
    if (!filterConfig.propertyField) return []
    const properties = [...new Set(data.map(item => item[filterConfig.propertyField!]))]
    return properties
      .filter(Boolean)
      .map(property => ({ label: property as string, value: property as string }))
  }, [data, filterConfig.propertyField])

  return {
    filters,
    filteredData,
    resetFilters,
    updateFilters,
    statusOptions,
    categoryOptions,
    propertyOptions
  }
} 