"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"

export function TestConnection() {
  const [status, setStatus] = useState<{
    supabase: 'loading' | 'success' | 'error'
    auth: 'loading' | 'success' | 'error' | 'not-authenticated'
    data: 'loading' | 'success' | 'error'
  }>({
    supabase: 'loading',
    auth: 'loading',
    data: 'loading'
  })
  const [error, setError] = useState<string>('')
  const [user, setUser] = useState<any>(null)

  const testSupabaseConnection = async () => {
    try {
      setStatus(prev => ({ ...prev, supabase: 'loading' }))
      
      // Test de connexion basique
      const { data, error } = await supabase.from('categories').select('count').limit(1)
      
      if (error) {
        throw error
      }
      
      setStatus(prev => ({ ...prev, supabase: 'success' }))
    } catch (err) {
      console.error('Erreur connexion Supabase:', err)
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
      setStatus(prev => ({ ...prev, supabase: 'error' }))
    }
  }

  const testAuth = async () => {
    try {
      setStatus(prev => ({ ...prev, auth: 'loading' }))
      
      const { data: { user }, error } = await supabase.auth.getUser()
      
      if (error) {
        throw error
      }
      
      if (user) {
        setUser(user)
        setStatus(prev => ({ ...prev, auth: 'success' }))
      } else {
        setStatus(prev => ({ ...prev, auth: 'not-authenticated' }))
      }
    } catch (err) {
      console.error('Erreur authentification:', err)
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
      setStatus(prev => ({ ...prev, auth: 'error' }))
    }
  }

  const testDataAccess = async () => {
    try {
      setStatus(prev => ({ ...prev, data: 'loading' }))
      
      const { data, error } = await supabase.from('properties').select('*').limit(5)
      
      if (error) {
        throw error
      }
      
      console.log('Données récupérées:', data)
      setStatus(prev => ({ ...prev, data: 'success' }))
    } catch (err) {
      console.error('Erreur accès données:', err)
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
      setStatus(prev => ({ ...prev, data: 'error' }))
    }
  }

  useEffect(() => {
    testSupabaseConnection()
    testAuth()
    testDataAccess()
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'loading':
        return <Loader2 className="h-4 w-4 animate-spin" />
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'not-authenticated':
        return <XCircle className="h-4 w-4 text-yellow-500" />
      default:
        return null
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'loading':
        return 'Chargement...'
      case 'success':
        return 'OK'
      case 'error':
        return 'Erreur'
      case 'not-authenticated':
        return 'Non authentifié'
      default:
        return 'Inconnu'
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Test de Connexion</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <span className="font-medium">Connexion Supabase</span>
            <div className="flex items-center gap-2">
              {getStatusIcon(status.supabase)}
              <Badge variant={status.supabase === 'success' ? 'default' : status.supabase === 'error' ? 'destructive' : 'secondary'}>
                {getStatusText(status.supabase)}
              </Badge>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <span className="font-medium">Authentification</span>
            <div className="flex items-center gap-2">
              {getStatusIcon(status.auth)}
              <Badge variant={status.auth === 'success' ? 'default' : status.auth === 'error' ? 'destructive' : 'secondary'}>
                {getStatusText(status.auth)}
              </Badge>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <span className="font-medium">Accès aux Données</span>
            <div className="flex items-center gap-2">
              {getStatusIcon(status.data)}
              <Badge variant={status.data === 'success' ? 'default' : status.data === 'error' ? 'destructive' : 'secondary'}>
                {getStatusText(status.data)}
              </Badge>
            </div>
          </div>
        </div>

        {user && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800">
              <strong>Utilisateur connecté:</strong> {user.email}
            </p>
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">
              <strong>Erreur:</strong> {error}
            </p>
          </div>
        )}

        <div className="flex gap-2">
          <Button onClick={testSupabaseConnection} variant="outline" size="sm">
            Tester Connexion
          </Button>
          <Button onClick={testAuth} variant="outline" size="sm">
            Tester Auth
          </Button>
          <Button onClick={testDataAccess} variant="outline" size="sm">
            Tester Données
          </Button>
        </div>
      </CardContent>
    </Card>
  )
} 