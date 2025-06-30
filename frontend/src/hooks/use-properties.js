import { useState, useEffect, useCallback } from "react"
import { getProperties } from "../lib/data-service.js"

export function useProperties() {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchProperties = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('🔍 Fetching properties...')
      
      const data = await getProperties()
      console.log('✅ Properties fetched:', data.length)
      
      setProperties(data)
    } catch (error) {
      console.error('❌ Error fetching properties:', error)
      console.error('Error details:', error.message, error.stack)
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