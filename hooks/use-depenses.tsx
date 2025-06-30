"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"

interface Expense {
  id: string
  description: string
  montant: number
  date: string
  categorie: string
  propriete_id: string
  created_at: string
}

export function useDepenses() {
  const [depenses, setDepenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchDepenses()
  }, [])

  const fetchDepenses = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase.from("depenses").select("*").order("date", { ascending: false })

      if (error) throw error
      setDepenses(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return { depenses, loading, error, refetch: fetchDepenses }
}
