"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import type { Database } from "@/types/database"

type Tenant = Database["public"]["Tables"]["tenants"]["Row"]

export function useTenants() {
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchTenants()
  }, [])

  const fetchTenants = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("tenants")
        .select(`
          *,
          properties(name, address)
        `)
        .order("name")

      if (error) throw error
      setTenants(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return {
    tenants,
    loading,
    error,
    refetch: fetchTenants,
  }
}
