"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"

interface Revenue {
  id: string
  description: string
  montant: number
  date: string
  categorie: string
  propriete_id: string
  created_at: string
}

export function useRevenus() {
  const [revenus, setRevenus] = useState<Revenue[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchRevenus()
  }, [])

  const fetchRevenus = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase.from("revenus").select("*").order("date", { ascending: false })

      if (error) throw error
      setRevenus(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return { revenus, loading, error, refetch: fetchRevenus }
}
