"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import type { Database } from "@/types/database"

type Expense = Database["public"]["Tables"]["expenses"]["Row"]

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchExpenses()
  }, [])

  const fetchExpenses = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("expenses")
        .select(`
          *,
          properties(name),
          categories(name)
        `)
        .order("date", { ascending: false })

      if (error) throw error
      setExpenses(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return {
    expenses,
    loading,
    error,
    refetch: fetchExpenses,
  }
}
