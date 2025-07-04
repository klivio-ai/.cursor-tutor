// Types pour les dépenses compatibles avec le schéma Supabase

export interface Expense {
  id: string
  reference?: string
  description: string
  amount: number
  vendor: string
  status: 'Pending' | 'Paid' | 'Overdue'
  paid?: boolean
  notes?: string
  property_id?: string | null
  category_id?: string | null
  category_name?: string
  due_date?: string | null
  date: string
  file_url?: string | null
  created_at: string
  updated_at: string
  user_id: string
  // Champs calculés depuis les relations
  property_name?: string
  category_display_name?: string
  category_color?: string
}

export interface ExpenseFormData {
  description: string
  amount: string
  vendor: string
  status: 'Pending' | 'Paid' | 'Overdue'
  property_id: string
  category: string
  due_date: string
  date: string
  notes: string
  file?: File | null
}

export interface ExpenseFilters {
  search: string
  property: string
  status: string
  category: string
  dateFrom: string
  dateTo: string
  amountMin: string
  amountMax: string
}

export interface ExpenseStats {
  total: number
  paid: number
  pending: number
  overdue: number
  average: number
  count: number
}

export interface Category {
  id: string
  name: string
  type: 'revenue' | 'expense'
  color?: string
  description?: string
  created_at: string
  updated_at: string
  user_id?: string
}

// Constantes pour les catégories par défaut
export const DEFAULT_EXPENSE_CATEGORIES = [
  'Maintenance',
  'Réparation',
  'Assurance',
  'Taxes',
  'Services',
  'Fournitures',
  'Autre'
] as const

export type ExpenseCategory = typeof DEFAULT_EXPENSE_CATEGORIES[number]

// Constantes pour les statuts
export const EXPENSE_STATUSES = ['Pending', 'Paid', 'Overdue'] as const
export type ExpenseStatus = typeof EXPENSE_STATUSES[number]

// Fonctions utilitaires pour la conversion des données
export const convertFormDataToExpense = (formData: ExpenseFormData): Partial<Expense> => {
  return {
    description: formData.description,
    amount: parseFloat(formData.amount),
    vendor: formData.vendor,
    status: formData.status,
    property_id: formData.property_id === 'none' ? undefined : formData.property_id,
    category_name: formData.category === 'none' ? undefined : formData.category,
    due_date: formData.due_date || undefined,
    date: formData.date,
    notes: formData.notes || undefined
  }
}

export const convertExpenseToFormData = (expense: Expense): ExpenseFormData => {
  return {
    description: expense.description,
    amount: expense.amount.toString(),
    vendor: expense.vendor,
    status: expense.status,
    property_id: expense.property_id || 'none',
    category: expense.category_name || 'none',
    due_date: expense.due_date || '',
    date: expense.date,
    notes: expense.notes || ''
  }
} 