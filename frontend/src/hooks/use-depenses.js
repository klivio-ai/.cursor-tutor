import { useState, useEffect, useCallback } from "react"
import { getDepenses } from "../lib/data-service.js"

export function useDepenses() {
  const [depenses, setDepenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchDepenses = useCallback(async () => {
    try {
      setLoading(true)
      const data = await getDepenses()
      setDepenses(data)
    } catch (error) {
      setError(error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchDepenses()
  }, [fetchDepenses])

  return {
    data: depenses,
    isLoading: loading,
    error: error?.message || null,
    refetch: fetchDepenses,
  }
}