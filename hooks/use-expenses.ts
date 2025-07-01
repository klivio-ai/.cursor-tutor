"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import type { Database } from "@/types/database"

type Expense = Database["public"]["Tables"]["expenses"]["Row"] & {
  property?: Database["public"]["Tables"]["properties"]["Row"]
  category?: Database["public"]["Tables"]["categories"]["Row"]
}
type ExpenseInsert = Database["public"]["Tables"]["expenses"]["Insert"]
type ExpenseUpdate = Database["public"]["Tables"]["expenses"]["Update"]

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchExpenses = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("expenses")
        .select(`
          *,
          property:properties(*),
          category:categories(*)
        `)
        .order("created_at", { ascending: false })

      if (error) throw error
      setExpenses(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const createExpense = async (expense: ExpenseInsert) => {
    try {
      const { data, error } = await supabase
        .from("expenses")
        .insert(expense)
        .select(`
          *,
          property:properties(*),
          category:categories(*)
        `)
        .single()

      if (error) throw error
      setExpenses((prev) => [data, ...prev])
      return { data, error: null }
    } catch (err) {
      const error = err instanceof Error ? err.message : "An error occurred"
      return { data: null, error }
    }
  }

  const updateExpense = async (id: string, updates: ExpenseUpdate) => {
    try {
      const { data, error } = await supabase
        .from("expenses")
        .update(updates)
        .eq("id", id)
        .select(`
          *,
          property:properties(*),
          category:categories(*)
        `)
        .single()

      if (error) throw error
      setExpenses((prev) => prev.map((exp) => (exp.id === id ? data : exp)))
      return { data, error: null }
    } catch (err) {
      const error = err instanceof Error ? err.message : "An error occurred"
      return { data: null, error }
    }
  }

  const deleteExpense = async (id: string) => {
    try {
      const { error } = await supabase.from("expenses").delete().eq("id", id)

      if (error) throw error
      setExpenses((prev) => prev.filter((exp) => exp.id !== id))
      return { error: null }
    } catch (err) {
      const error = err instanceof Error ? err.message : "An error occurred"
      return { error }
    }
  }

  useEffect(() => {
    fetchExpenses()
  }, [])

  return {
    expenses,
    loading,
    error,
    createExpense,
    updateExpense,
    deleteExpense,
    refetch: fetchExpenses,
  }
}
