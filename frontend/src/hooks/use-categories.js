"use client"

import { useState, useEffect } from "react"
import { supabase } from "../lib/supabase"

export function useCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase.from("categories").select("*").order("nom", { ascending: true })

      if (error) throw error
      setCategories(data || [])
    } catch (err) {
      setError(err.message)
      console.error("Error fetching categories:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  return {
    categories,
    loading,
    error,
    fetchCategories,
  }
}
