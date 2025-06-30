import { useState, useEffect, useCallback } from "react"
import { getRevenus } from "../lib/data-service.js"

export function useRevenus() {
  const [revenus, setRevenus] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchRevenus = useCallback(async () => {
    try {
      setLoading(true)
      const data = await getRevenus()
      setRevenus(data)
    } catch (error) {
      setError(error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchRevenus()
  }, [fetchRevenus])

  return {
    data: revenus,
    isLoading: loading,
    error: error?.message || null,
    refetch: fetchRevenus,
  }
}