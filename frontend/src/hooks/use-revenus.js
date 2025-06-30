"use client"

import { useState, useEffect } from "react"
import { supabase } from "../lib/supabase"

export function useRevenus() {
  const [revenus, setRevenus] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchRevenus = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase.from("revenus").select("*").order("date", { ascending: false })

      if (error) throw error
      setRevenus(data || [])
    } catch (err) {
      setError(err.message)
      console.error("Error fetching revenus:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRevenus()
  }, [])

  const addRevenu = async (revenu) => {
    try {
      const { data, error } = await supabase.from("revenus").insert([revenu]).select()

      if (error) throw error
      setRevenus((prev) => [data[0], ...prev])
      return data[0]
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  return {
    revenus,
    loading,
    error,
    addRevenu,
    refetch: fetchRevenus,
  }
}
