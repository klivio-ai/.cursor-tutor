"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import type { Database } from "@/types/database"

type Revenue = Database["public"]["Tables"]["revenues"]["Row"] & {
  property?: Database["public"]["Tables"]["properties"]["Row"]
  category?: Database["public"]["Tables"]["categories"]["Row"]
}
type RevenueInsert = Database["public"]["Tables"]["revenues"]["Insert"]
type RevenueUpdate = Database["public"]["Tables"]["revenues"]["Update"]

export function useRevenues() {
  const [revenues, setRevenues] = useState<Revenue[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchRevenues = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("revenues")
        .select(`
          *,
          property:properties(*),
          category:categories(*)
        `)
        .order("date", { ascending: false })

      if (error) throw error
      setRevenues(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      console.error("Error fetching revenues:", err)
    } finally {
      setLoading(false)
    }
  }

  const addRevenue = async (revenue: RevenueInsert) => {
    try {
      const { data, error } = await supabase
        .from("revenues")
        .insert([revenue])
        .select(`
          *,
          property:properties(*),
          category:categories(*)
        `)
        .single()

      if (error) throw error
      setRevenues((prev) => [data, ...prev])
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      throw err
    }
  }

  const updateRevenue = async (id: string, updates: RevenueUpdate) => {
    try {
      const { data, error } = await supabase
        .from("revenues")
        .update(updates)
        .eq("id", id)
        .select(`
          *,
          property:properties(*),
          category:categories(*)
        `)
        .single()

      if (error) throw error
      setRevenues((prev) => prev.map((rev) => (rev.id === id ? data : rev)))
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      throw err
    }
  }

  const deleteRevenue = async (id: string) => {
    try {
      const { error } = await supabase.from("revenues").delete().eq("id", id)

      if (error) throw error
      setRevenues((prev) => prev.filter((rev) => rev.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      throw err
    }
  }

  useEffect(() => {
    fetchRevenues()
  }, [])

  return {
    revenues,
    loading,
    error,
    addRevenue,
    updateRevenue,
    deleteRevenue,
    refetch: fetchRevenues,
  }
}
