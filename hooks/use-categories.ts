"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import type { Database } from "@/types/database"

type Category = Database["public"]["Tables"]["categories"]["Row"]
type CategoryInsert = Database["public"]["Tables"]["categories"]["Insert"]
type CategoryUpdate = Database["public"]["Tables"]["categories"]["Update"]

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase.from("categories").select("*").order("name", { ascending: true })

      if (error) throw error
      setCategories(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      console.error("Error fetching categories:", err)
    } finally {
      setLoading(false)
    }
  }

  const addCategory = async (category: CategoryInsert) => {
    try {
      const { data, error } = await supabase.from("categories").insert([category]).select().single()

      if (error) throw error
      setCategories((prev) => [...prev, data])
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      throw err
    }
  }

  const updateCategory = async (id: string, updates: CategoryUpdate) => {
    try {
      const { data, error } = await supabase.from("categories").update(updates).eq("id", id).select().single()

      if (error) throw error
      setCategories((prev) => prev.map((cat) => (cat.id === id ? data : cat)))
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      throw err
    }
  }

  const deleteCategory = async (id: string) => {
    try {
      const { error } = await supabase.from("categories").delete().eq("id", id)

      if (error) throw error
      setCategories((prev) => prev.filter((cat) => cat.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      throw err
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  return {
    categories,
    loading,
    error,
    addCategory,
    updateCategory,
    deleteCategory,
    refetch: fetchCategories,
  }
}
