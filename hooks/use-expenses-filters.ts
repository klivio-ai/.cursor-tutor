import { useState, useMemo, useCallback } from 'react'

interface Expense {
  id: string
  description: string
  amount: number
  vendor: string
  status: string
  property_id?: string
  date: string
  due_date?: string
  notes?: string
  category?: string
}

interface Filters {
  search: string
  property: string
  status: string
  category: string
  dateFrom: string
  dateTo: string
  amountMin: string
  amountMax: string
}

export function useExpensesFilters(expenses: Expense[]) {
  const [filters, setFilters] = useState<Filters>({
    search: '',
    property: 'all',
    status: 'all',
    category: 'all',
    dateFrom: '',
    dateTo: '',
    amountMin: '',
    amountMax: ''
  })

  const filteredExpenses = useMemo(() => {
    return expenses.filter(expense => {
      // Filtre de recherche
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        const matchesSearch = 
          expense.description.toLowerCase().includes(searchLower) ||
          expense.vendor.toLowerCase().includes(searchLower) ||
          (expense.notes && expense.notes.toLowerCase().includes(searchLower))
        
        if (!matchesSearch) return false
      }

      // Filtre par propriété
      if (filters.property !== 'all' && expense.property_id !== filters.property) {
        return false
      }

      // Filtre par statut
      if (filters.status !== 'all' && expense.status !== filters.status) {
        return false
      }

      // Filtre par catégorie
      if (filters.category !== 'all' && expense.category !== filters.category) {
        return false
      }

      // Filtre par date de début
      if (filters.dateFrom) {
        const expenseDate = new Date(expense.date)
        const fromDate = new Date(filters.dateFrom)
        if (expenseDate < fromDate) return false
      }

      // Filtre par date de fin
      if (filters.dateTo) {
        const expenseDate = new Date(expense.date)
        const toDate = new Date(filters.dateTo)
        if (expenseDate > toDate) return false
      }

      // Filtre par montant minimum
      if (filters.amountMin) {
        const minAmount = parseFloat(filters.amountMin)
        if (expense.amount < minAmount) return false
      }

      // Filtre par montant maximum
      if (filters.amountMax) {
        const maxAmount = parseFloat(filters.amountMax)
        if (expense.amount > maxAmount) return false
      }

      return true
    })
  }, [expenses, filters])

  const updateFilters = useCallback((newFilters: Partial<Filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }, [])

  const clearFilters = useCallback(() => {
    setFilters({
      search: '',
      property: 'all',
      status: 'all',
      category: 'all',
      dateFrom: '',
      dateTo: '',
      amountMin: '',
      amountMax: ''
    })
  }, [])

  // Statistiques calculées sur les dépenses filtrées
  const stats = useMemo(() => {
    const total = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0)
    const paid = filteredExpenses.filter(exp => exp.status === 'Paid').reduce((sum, exp) => sum + exp.amount, 0)
    const pending = filteredExpenses.filter(exp => exp.status === 'Pending').reduce((sum, exp) => sum + exp.amount, 0)
    const overdue = filteredExpenses.filter(exp => exp.status === 'Overdue').reduce((sum, exp) => sum + exp.amount, 0)
    const avg = filteredExpenses.length > 0 ? total / filteredExpenses.length : 0

    return {
      total,
      paid,
      pending,
      overdue,
      average: avg,
      count: filteredExpenses.length
    }
  }, [filteredExpenses])

  return {
    filters,
    filteredExpenses,
    updateFilters,
    clearFilters,
    stats
  }
} 