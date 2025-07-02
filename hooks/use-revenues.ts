"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import type { Database } from "@/types/database"

type Revenue = Database["public"]["Tables"]["revenues"]["Row"]

export function useRevenues() {
  const [revenues, setRevenues] = useState<Revenue[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchRevenues()
  }, [])

  const fetchRevenues = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("revenues")
        .select(`
          *,
          properties(name),
          categories(name),
          tenants(name)
        `)
        .order("date", { ascending: false })

      if (error) throw error
      setRevenues(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return {
    revenues,
    loading,
    error,
    refetch: fetchRevenues,
  }
}
