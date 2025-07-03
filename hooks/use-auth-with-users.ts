import { useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

interface UserProfile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export function useAuthWithUsers() {
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Récupérer l'utilisateur actuel
    const getCurrentUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)

        if (user) {
          // Récupérer le profil utilisateur depuis la table users
          const { data: profile, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .single()

          if (error) {
            console.error('Erreur lors de la récupération du profil:', error)
            // Si le profil n'existe pas, le créer
            if (error.code === 'PGRST116') {
              await createUserProfile(user)
            }
          } else {
            setUserProfile(profile)
          }
        }
      } catch (error) {
        console.error('Erreur lors de la récupération de l\'utilisateur:', error)
      } finally {
        setLoading(false)
      }
    }

    getCurrentUser()

    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)

        if (session?.user) {
          // Récupérer ou créer le profil utilisateur
          const { data: profile, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single()

          if (error && error.code === 'PGRST116') {
            await createUserProfile(session.user)
          } else if (profile) {
            setUserProfile(profile)
          }
        } else {
          setUserProfile(null)
        }

        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const createUserProfile = async (user: User) => {
    try {
      const { data: profile, error } = await supabase
        .from('users')
        .insert({
          id: user.id,
          email: user.email!,
          full_name: user.user_metadata?.full_name || null,
          avatar_url: user.user_metadata?.avatar_url || null,
        })
        .select()
        .single()

      if (error) {
        console.error('Erreur lors de la création du profil:', error)
      } else {
        setUserProfile(profile)
      }
    } catch (error) {
      console.error('Erreur lors de la création du profil:', error)
    }
  }

  const updateUserProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return

    try {
      const { data: profile, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single()

      if (error) {
        console.error('Erreur lors de la mise à jour du profil:', error)
        throw error
      } else {
        setUserProfile(profile)
        return profile
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error)
      throw error
    }
  }

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
      setUserProfile(null)
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error)
    }
  }

  return {
    user,
    userProfile,
    loading,
    updateUserProfile,
    signOut,
    isAuthenticated: !!user,
  }
}
