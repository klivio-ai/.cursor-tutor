"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import type { Database } from "@/types/database"

type Payment = Database["public"]["Tables"]["payments"]["Row"]
type PaymentInsert = Database["public"]["Tables"]["payments"]["Insert"]
type PaymentUpdate = Database["public"]["Tables"]["payments"]["Update"]

export function usePayments() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPayments = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase.from("payments").select("*").order("created_at", { ascending: false })

      if (error) throw error
      setPayments(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const createPayment = async (payment: PaymentInsert) => {
    try {
      const { data, error } = await supabase.from("payments").insert(payment).select().single()

      if (error) throw error
      setPayments((prev) => [data, ...prev])
      return { data, error: null }
    } catch (err) {
      const error = err instanceof Error ? err.message : "An error occurred"
      return { data: null, error }
    }
  }

  const updatePayment = async (id: string, updates: PaymentUpdate) => {
    try {
      const { data, error } = await supabase.from("payments").update(updates).eq("id", id).select().single()

      if (error) throw error
      setPayments((prev) => prev.map((payment) => (payment.id === id ? data : payment)))
      return { data, error: null }
    } catch (err) {
      const error = err instanceof Error ? err.message : "An error occurred"
      return { data: null, error }
    }
  }

  const deletePayment = async (id: string) => {
    try {
      const { error } = await supabase.from("payments").delete().eq("id", id)

      if (error) throw error
      setPayments((prev) => prev.filter((payment) => payment.id !== id))
      return { error: null }
    } catch (err) {
      const error = err instanceof Error ? err.message : "An error occurred"
      return { error }
    }
  }

  useEffect(() => {
    fetchPayments()
  }, [])

  return {
    payments,
    loading,
    error,
    createPayment,
    updatePayment,
    deletePayment,
    refetch: fetchPayments,
  }
}
