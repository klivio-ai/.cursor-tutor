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
      const { data, error } = await supabase.from("categories").select("*").order("created_at", { ascending: false })

      if (error) throw error
      setCategories(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const createCategory = async (category: CategoryInsert) => {
    try {
      const { data, error } = await supabase.from("categories").insert(category).select().single()

      if (error) throw error
      setCategories((prev) => [data, ...prev])
      return { data, error: null }
    } catch (err) {
      const error = err instanceof Error ? err.message : "An error occurred"
      return { data: null, error }
    }
  }

  const updateCategory = async (id: string, updates: CategoryUpdate) => {
    try {
      const { data, error } = await supabase.from("categories").update(updates).eq("id", id).select().single()

      if (error) throw error
      setCategories((prev) => prev.map((cat) => (cat.id === id ? data : cat)))
      return { data, error: null }
    } catch (err) {
      const error = err instanceof Error ? err.message : "An error occurred"
      return { data: null, error }
    }
  }

  const deleteCategory = async (id: string) => {
    try {
      const { error } = await supabase.from("categories").delete().eq("id", id)

      if (error) throw error
      setCategories((prev) => prev.filter((cat) => cat.id !== id))
      return { error: null }
    } catch (err) {
      const error = err instanceof Error ? err.message : "An error occurred"
      return { error }
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  return {
    categories,
    loading,
    error,
    createCategory,
    updateCategory,
    deleteCategory,
    refetch: fetchCategories,
  }
}
