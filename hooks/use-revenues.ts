"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import type { Database } from "@/types/database"

type Revenue = Database["public"]["Tables"]["revenues"]["Row"]
type RevenueInsert = Database["public"]["Tables"]["revenues"]["Insert"]
type RevenueUpdate = Database["public"]["Tables"]["revenues"]["Update"]

export function useRevenues() {
  const [revenues, setRevenues] = useState<Revenue[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchRevenues = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase.from("revenues").select("*").order("created_at", { ascending: false })

      if (error) throw error
      setRevenues(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const createRevenue = async (revenue: RevenueInsert) => {
    try {
      const { data, error } = await supabase.from("revenues").insert(revenue).select().single()

      if (error) throw error
      setRevenues((prev) => [data, ...prev])
      return { data, error: null }
    } catch (err) {
      const error = err instanceof Error ? err.message : "An error occurred"
      return { data: null, error }
    }
  }

  const updateRevenue = async (id: string, updates: RevenueUpdate) => {
    try {
      const { data, error } = await supabase.from("revenues").update(updates).eq("id", id).select().single()

      if (error) throw error
      setRevenues((prev) => prev.map((rev) => (rev.id === id ? data : rev)))
      return { data, error: null }
    } catch (err) {
      const error = err instanceof Error ? err.message : "An error occurred"
      return { data: null, error }
    }
  }

  const deleteRevenue = async (id: string) => {
    try {
      const { error } = await supabase.from("revenues").delete().eq("id", id)

      if (error) throw error
      setRevenues((prev) => prev.filter((rev) => rev.id !== id))
      return { error: null }
    } catch (err) {
      const error = err instanceof Error ? err.message : "An error occurred"
      return { error }
    }
  }

  useEffect(() => {
    fetchRevenues()
  }, [])

  return {
    revenues,
    loading,
    error,
    createRevenue,
    updateRevenue,
    deleteRevenue,
    refetch: fetchRevenues,
  }
}
