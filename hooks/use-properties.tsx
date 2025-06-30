"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"

interface Property {
  id: string
  name: string
  address: string
  type: string
  value: number
  created_at: string
}

export function useProperties() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProperties() {
      try {
        const { data, error } = await supabase.from("properties").select("*").order("created_at", { ascending: false })

        if (error) throw error

        setProperties(data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
        // Fallback data for demo
        setProperties([
          {
            id: "1",
            name: "Sunset Apartment",
            address: "123 Main St, Paris",
            type: "Apartment",
            value: 250000,
            created_at: new Date().toISOString(),
          },
          {
            id: "2",
            name: "Downtown Loft",
            address: "456 Oak Ave, Lyon",
            type: "Loft",
            value: 180000,
            created_at: new Date().toISOString(),
          },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchProperties()
  }, [])

  return { properties, loading, error }
}
