"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import type { Database } from "@/types/database"

type Payment = Database["public"]["Tables"]["payments"]["Row"]

export function usePayments() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchPayments()
  }, [])

  const fetchPayments = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("payments")
        .select(`
          *,
          tenants(name),
          properties(name)
        `)
        .order("due_date", { ascending: false })

      if (error) throw error
      setPayments(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return {
    payments,
    loading,
    error,
    refetch: fetchPayments,
  }
}
