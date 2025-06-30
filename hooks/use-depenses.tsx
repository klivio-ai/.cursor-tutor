"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"

interface Expense {
  id: string
  property_id: string
  amount: number
  date: string
  description: string
  category: string
  created_at: string
}

export function useDepenses() {
  const [depenses, setDepenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchDepenses() {
      try {
        const { data, error } = await supabase.from("depenses").select("*").order("date", { ascending: false })

        if (error) throw error

        setDepenses(data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
        // Fallback data for demo
        setDepenses([
          {
            id: "1",
            property_id: "1",
            amount: 150,
            date: "2024-01-12",
            description: "Plumbing Repair",
            category: "Maintenance",
            created_at: new Date().toISOString(),
          },
          {
            id: "2",
            property_id: "2",
            amount: 80,
            date: "2024-01-08",
            description: "Cleaning Service",
            category: "Maintenance",
            created_at: new Date().toISOString(),
          },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchDepenses()
  }, [])

  return { depenses, loading, error }
}
