"use client"

import { useState, useEffect } from "react"
import { supabase } from "../lib/supabase"

export function useDepenses() {
  const [depenses, setDepenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchDepenses = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase.from("depenses").select("*").order("date", { ascending: false })

      if (error) throw error
      setDepenses(data || [])
    } catch (err) {
      setError(err.message)
      console.error("Error fetching depenses:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDepenses()
  }, [])

  const addDepense = async (depense) => {
    try {
      const { data, error } = await supabase.from("depenses").insert([depense]).select()

      if (error) throw error
      setDepenses((prev) => [data[0], ...prev])
      return data[0]
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  return {
    depenses,
    loading,
    error,
    addDepense,
    refetch: fetchDepenses,
  }
}
