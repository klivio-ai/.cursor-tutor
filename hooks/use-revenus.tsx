"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"

interface Revenue {
  id: string
  property_id: string
  amount: number
  date: string
  description: string
  created_at: string
}

export function useRevenus() {
  const [revenus, setRevenus] = useState<Revenue[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchRevenus() {
      try {
        const { data, error } = await supabase.from("revenus").select("*").order("date", { ascending: false })

        if (error) throw error

        setRevenus(data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
        // Fallback data for demo
        setRevenus([
          {
            id: "1",
            property_id: "1",
            amount: 1200,
            date: "2024-01-15",
            description: "Monthly Rent - Sunset Apartment",
            created_at: new Date().toISOString(),
          },
          {
            id: "2",
            property_id: "2",
            amount: 950,
            date: "2024-01-10",
            description: "Monthly Rent - Downtown Loft",
            created_at: new Date().toISOString(),
          },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchRevenus()
  }, [])

  return { revenus, loading, error }
}
