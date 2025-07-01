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
      const { data, error } = await supabase.from("categories").select("*").order("name", { ascending: true })

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

  const addCategory = async (category) => {
    try {
      const { data, error } = await supabase.from("categories").insert([category]).select()

      if (error) throw error
      setCategories((prev) => [...prev, data[0]])
      return data[0]
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  return {
    categories,
    loading,
    error,
    addCategory,
    refetch: fetchCategories,
  }
}
