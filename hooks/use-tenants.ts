"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import type { Database } from "@/types/database"

type Tenant = Database["public"]["Tables"]["tenants"]["Row"]
type TenantInsert = Database["public"]["Tables"]["tenants"]["Insert"]
type TenantUpdate = Database["public"]["Tables"]["tenants"]["Update"]

export function useTenants() {
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTenants = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase.from("tenants").select("*").order("created_at", { ascending: false })

      if (error) throw error
      setTenants(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const createTenant = async (tenant: TenantInsert) => {
    try {
      const { data, error } = await supabase.from("tenants").insert(tenant).select().single()

      if (error) throw error
      setTenants((prev) => [data, ...prev])
      return { data, error: null }
    } catch (err) {
      const error = err instanceof Error ? err.message : "An error occurred"
      return { data: null, error }
    }
  }

  const updateTenant = async (id: string, updates: TenantUpdate) => {
    try {
      const { data, error } = await supabase.from("tenants").update(updates).eq("id", id).select().single()

      if (error) throw error
      setTenants((prev) => prev.map((tenant) => (tenant.id === id ? data : tenant)))
      return { data, error: null }
    } catch (err) {
      const error = err instanceof Error ? err.message : "An error occurred"
      return { data: null, error }
    }
  }

  const deleteTenant = async (id: string) => {
    try {
      const { error } = await supabase.from("tenants").delete().eq("id", id)

      if (error) throw error
      setTenants((prev) => prev.filter((tenant) => tenant.id !== id))
      return { error: null }
    } catch (err) {
      const error = err instanceof Error ? err.message : "An error occurred"
      return { error }
    }
  }

  useEffect(() => {
    fetchTenants()
  }, [])

  return {
    tenants,
    loading,
    error,
    createTenant,
    updateTenant,
    deleteTenant,
    refetch: fetchTenants,
  }
}
