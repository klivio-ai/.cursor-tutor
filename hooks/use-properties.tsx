"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"

interface Property {
  id: string
  nom: string
  adresse: string
  type: string
  statut: string
  prix_achat: number
  created_at: string
}

export function useProperties() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchProperties()
  }, [])

  const fetchProperties = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase.from("proprietes").select("*").order("created_at", { ascending: false })

      if (error) throw error
      setProperties(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return { properties, loading, error, refetch: fetchProperties }
}
