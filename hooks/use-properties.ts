"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import type { Database } from "@/types/database"

type Property = Database["public"]["Tables"]["properties"]["Row"] & {
  tenant?: Database["public"]["Tables"]["tenants"]["Row"]
}
type PropertyInsert = Database["public"]["Tables"]["properties"]["Insert"]
type PropertyUpdate = Database["public"]["Tables"]["properties"]["Update"]

export function useProperties() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProperties = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("properties")
        .select(`
          *,
          tenant:tenants(*)
        `)
        .order("created_at", { ascending: false })

      if (error) throw error
      setProperties(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const createProperty = async (property: PropertyInsert) => {
    try {
      const { data, error } = await supabase.from("properties").insert(property).select().single()

      if (error) throw error
      setProperties((prev) => [data, ...prev])
      return { data, error: null }
    } catch (err) {
      const error = err instanceof Error ? err.message : "An error occurred"
      return { data: null, error }
    }
  }

  const updateProperty = async (id: string, updates: PropertyUpdate) => {
    try {
      const { data, error } = await supabase.from("properties").update(updates).eq("id", id).select().single()

      if (error) throw error
      setProperties((prev) => prev.map((prop) => (prop.id === id ? data : prop)))
      return { data, error: null }
    } catch (err) {
      const error = err instanceof Error ? err.message : "An error occurred"
      return { data: null, error }
    }
  }

  const deleteProperty = async (id: string) => {
    try {
      const { error } = await supabase.from("properties").delete().eq("id", id)

      if (error) throw error
      setProperties((prev) => prev.filter((prop) => prop.id !== id))
      return { error: null }
    } catch (err) {
      const error = err instanceof Error ? err.message : "An error occurred"
      return { error }
    }
  }

  useEffect(() => {
    fetchProperties()
  }, [])

  return {
    properties,
    loading,
    error,
    createProperty,
    updateProperty,
    deleteProperty,
    refetch: fetchProperties,
  }
}
