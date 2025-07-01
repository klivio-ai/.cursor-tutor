"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"

export interface Expense {
  id: string
  property_id?: string
  category_id?: string
  amount: number
  description?: string
  date: string
  created_at: string
  updated_at: string
  property?: {
    name: string
  }
  category?: {
    name: string
    color: string
  }
}

export function useDepenses() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDepenses = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error: supabaseError } = await supabase
        .from("expenses")
        .select(`
          *,
          property:properties(name),
          category:categories(name, color)
        `)
        .order("date", { ascending: false })

      if (supabaseError) {
        throw supabaseError
      }

      setExpenses(data || [])
    } catch (err) {
      console.error("Error fetching expenses:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch expenses")

      // Fallback demo data
      setExpenses([
        {
          id: "1",
          property_id: "1",
          category_id: "4",
          amount: 350,
          description: "Réparation plomberie",
          date: new Date().toISOString().split("T")[0],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          property: { name: "Appartement Centre-Ville" },
          category: { name: "Réparations", color: "#EF4444" },
        },
        {
          id: "2",
          property_id: "2",
          category_id: "6",
          amount: 120,
          description: "Assurance habitation",
          date: new Date().toISOString().split("T")[0],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          property: { name: "Maison Banlieue" },
          category: { name: "Assurance", color: "#B91C1C" },
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDepenses()
  }, [])

  const addExpense = async (expense: Omit<Expense, "id" | "created_at" | "updated_at" | "property" | "category">) => {
    try {
      const { data, error } = await supabase
        .from("expenses")
        .insert([expense])
        .select(`
          *,
          property:properties(name),
          category:categories(name, color)
        `)
        .single()

      if (error) throw error

      setExpenses((prev) => [data, ...prev])
      return data
    } catch (err) {
      console.error("Error adding expense:", err)
      throw err
    }
  }

  const updateExpense = async (id: string, updates: Partial<Expense>) => {
    try {
      const { data, error } = await supabase
        .from("expenses")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select(`
          *,
          property:properties(name),
          category:categories(name, color)
        `)
        .single()

      if (error) throw error

      setExpenses((prev) => prev.map((e) => (e.id === id ? data : e)))
      return data
    } catch (err) {
      console.error("Error updating expense:", err)
      throw err
    }
  }

  const deleteExpense = async (id: string) => {
    try {
      const { error } = await supabase.from("expenses").delete().eq("id", id)

      if (error) throw error

      setExpenses((prev) => prev.filter((e) => e.id !== id))
    } catch (err) {
      console.error("Error deleting expense:", err)
      throw err
    }
  }

  return {
    expenses,
    loading,
    error,
    fetchDepenses,
    addExpense,
    updateExpense,
    deleteExpense,
  }
}
