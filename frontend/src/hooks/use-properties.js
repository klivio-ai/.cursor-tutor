import { useState, useEffect, useCallback } from "react"
import { getProperties } from "../lib/data-service.js"

export function useProperties() {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchProperties = useCallback(async () => {
    try {
      setLoading(true)
      const data = await getProperties()
      setProperties(data)
    } catch (error) {
      setError(error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProperties()
  }, [fetchProperties])

  return {
    data: properties,
    isLoading: loading,
    error: error?.message || null,
    refetch: fetchProperties,
  }
}