"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"

export interface Revenue {
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

export function useRevenus() {
  const [revenues, setRevenues] = useState<Revenue[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchRevenus = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error: supabaseError } = await supabase
        .from("revenues")
        .select(`
          *,
          property:properties(name),
          category:categories(name, color)
        `)
        .order("date", { ascending: false })

      if (supabaseError) {
        throw supabaseError
      }

      setRevenues(data || [])
    } catch (err) {
      console.error("Error fetching revenues:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch revenues")

      // Fallback demo data
      setRevenues([
        {
          id: "1",
          property_id: "1",
          category_id: "1",
          amount: 1200,
          description: "Loyer mensuel",
          date: new Date().toISOString().split("T")[0],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          property: { name: "Appartement Centre-Ville" },
          category: { name: "Loyer", color: "#10B981" },
        },
        {
          id: "2",
          property_id: "2",
          category_id: "1",
          amount: 1800,
          description: "Loyer mensuel",
          date: new Date().toISOString().split("T")[0],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          property: { name: "Maison Banlieue" },
          category: { name: "Loyer", color: "#10B981" },
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRevenus()
  }, [])

  const addRevenue = async (revenue: Omit<Revenue, "id" | "created_at" | "updated_at" | "property" | "category">) => {
    try {
      const { data, error } = await supabase
        .from("revenues")
        .insert([revenue])
        .select(`
          *,
          property:properties(name),
          category:categories(name, color)
        `)
        .single()

      if (error) throw error

      setRevenues((prev) => [data, ...prev])
      return data
    } catch (err) {
      console.error("Error adding revenue:", err)
      throw err
    }
  }

  const updateRevenue = async (id: string, updates: Partial<Revenue>) => {
    try {
      const { data, error } = await supabase
        .from("revenues")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select(`
          *,
          property:properties(name),
          category:categories(name, color)
        `)
        .single()

      if (error) throw error

      setRevenues((prev) => prev.map((r) => (r.id === id ? data : r)))
      return data
    } catch (err) {
      console.error("Error updating revenue:", err)
      throw err
    }
  }

  const deleteRevenue = async (id: string) => {
    try {
      const { error } = await supabase.from("revenues").delete().eq("id", id)

      if (error) throw error

      setRevenues((prev) => prev.filter((r) => r.id !== id))
    } catch (err) {
      console.error("Error deleting revenue:", err)
      throw err
    }
  }

  return {
    revenues,
    loading,
    error,
    fetchRevenus,
    addRevenue,
    updateRevenue,
    deleteRevenue,
  }
}
