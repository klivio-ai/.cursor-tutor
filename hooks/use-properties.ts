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
      console.error("Error fetching properties:", err)
    } finally {
      setLoading(false)
    }
  }

  const addProperty = async (property: PropertyInsert) => {
    try {
      const { data, error } = await supabase.from("properties").insert([property]).select().single()

      if (error) throw error
      setProperties((prev) => [data, ...prev])
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      throw err
    }
  }

  const updateProperty = async (id: string, updates: PropertyUpdate) => {
    try {
      const { data, error } = await supabase.from("properties").update(updates).eq("id", id).select().single()

      if (error) throw error
      setProperties((prev) => prev.map((prop) => (prop.id === id ? data : prop)))
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      throw err
    }
  }

  const deleteProperty = async (id: string) => {
    try {
      const { error } = await supabase.from("properties").delete().eq("id", id)

      if (error) throw error
      setProperties((prev) => prev.filter((prop) => prop.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      throw err
    }
  }

  useEffect(() => {
    fetchProperties()
  }, [])

  return {
    properties,
    loading,
    error,
    addProperty,
    updateProperty,
    deleteProperty,
    refetch: fetchProperties,
  }
}
