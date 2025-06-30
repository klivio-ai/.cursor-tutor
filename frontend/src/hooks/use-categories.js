import { useState, useEffect, useCallback } from "react"
import { getCategories } from "../lib/data-service.js"

export function useCategories(type) {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const allCategories = await getCategories()
      if (type) {
        setCategories(allCategories.filter(c => c.type === type))
      } else {
        setCategories(allCategories)
      }
    } catch (err) {
      console.error(`Error fetching categories:`, err)
      setError(err instanceof Error ? err : new Error(`Failed to fetch categories`))
    } finally {
      setLoading(false)
    }
  }, [type])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  return {
    categories,
    loading,
    error,
    fetchCategories,
  }
}