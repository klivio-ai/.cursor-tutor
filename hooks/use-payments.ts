"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import type { Database } from "@/types/database"

type Payment = Database["public"]["Tables"]["payments"]["Row"] & {
  property?: Database["public"]["Tables"]["properties"]["Row"]
  tenant?: Database["public"]["Tables"]["tenants"]["Row"]
}
type PaymentInsert = Database["public"]["Tables"]["payments"]["Insert"]
type PaymentUpdate = Database["public"]["Tables"]["payments"]["Update"]

export function usePayments() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPayments = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("payments")
        .select(`
          *,
          property:properties(*),
          tenant:tenants(*)
        `)
        .order("payment_date", { ascending: false })

      if (error) throw error
      setPayments(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      console.error("Error fetching payments:", err)
    } finally {
      setLoading(false)
    }
  }

  const addPayment = async (payment: PaymentInsert) => {
    try {
      const { data, error } = await supabase
        .from("payments")
        .insert([payment])
        .select(`
          *,
          property:properties(*),
          tenant:tenants(*)
        `)
        .single()

      if (error) throw error
      setPayments((prev) => [data, ...prev])
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      throw err
    }
  }

  const updatePayment = async (id: string, updates: PaymentUpdate) => {
    try {
      const { data, error } = await supabase
        .from("payments")
        .update(updates)
        .eq("id", id)
        .select(`
          *,
          property:properties(*),
          tenant:tenants(*)
        `)
        .single()

      if (error) throw error
      setPayments((prev) => prev.map((payment) => (payment.id === id ? data : payment)))
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      throw err
    }
  }

  const deletePayment = async (id: string) => {
    try {
      const { error } = await supabase.from("payments").delete().eq("id", id)

      if (error) throw error
      setPayments((prev) => prev.filter((payment) => payment.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      throw err
    }
  }

  useEffect(() => {
    fetchPayments()
  }, [])

  return {
    payments,
    loading,
    error,
    addPayment,
    updatePayment,
    deletePayment,
    refetch: fetchPayments,
  }
}
