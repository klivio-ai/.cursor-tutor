"use client"

import { useState, useEffect } from "react"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

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
    } catch (err: any) {
      setError(err.message)
      console.error("Error fetching categories:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const addCategory = async (category: any) => {
    try {
      const { data, error } = await supabase.from("categories").insert([category]).select()

      if (error) throw error
      setCategories((prev) => [...prev, data[0]])
      return data[0]
    } catch (err: any) {
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
