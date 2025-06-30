"use client"

import { useState, useEffect } from "react"
import { supabase } from "../lib/supabase"

export function useProperties() {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchProperties = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase.from("properties").select("*").order("created_at", { ascending: false })

      if (error) throw error
      setProperties(data || [])
    } catch (err) {
      setError(err.message)
      console.error("Error fetching properties:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProperties()
  }, [])

  const addProperty = async (property) => {
    try {
      const { data, error } = await supabase.from("properties").insert([property]).select()

      if (error) throw error
      setProperties((prev) => [data[0], ...prev])
      return data[0]
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  return {
    properties,
    loading,
    error,
    addProperty,
    refetch: fetchProperties,
  }
}
