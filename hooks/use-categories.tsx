"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"

interface Category {
  id: string
  name: string
  type: string
  created_at: string
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchCategories() {
      try {
        const { data, error } = await supabase.from("categories").select("*").order("name", { ascending: true })

        if (error) throw error

        setCategories(data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
        // Fallback data for demo
        setCategories([
          {
            id: "1",
            name: "Maintenance",
            type: "expense",
            created_at: new Date().toISOString(),
          },
          {
            id: "2",
            name: "Utilities",
            type: "expense",
            created_at: new Date().toISOString(),
          },
          {
            id: "3",
            name: "Rent",
            type: "revenue",
            created_at: new Date().toISOString(),
          },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  return { categories, loading, error }
}
