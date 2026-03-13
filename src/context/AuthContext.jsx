import { createContext, useContext, useState, useEffect } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

const AuthContext = createContext({})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setLoading(false)
      return
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email, password) => {
    if (!isSupabaseConfigured()) {
      setError('Cloud sync not configured')
      return { error: { message: 'Cloud sync not configured' } }
    }
    setError(null)
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) setError(error.message)
    return { data, error }
  }

  const signIn = async (email, password) => {
    if (!isSupabaseConfigured()) {
      setError('Cloud sync not configured')
      return { error: { message: 'Cloud sync not configured' } }
    }
    setError(null)
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError(error.message)
    return { data, error }
  }

  const signInWithMagicLink = async (email) => {
    if (!isSupabaseConfigured()) {
      setError('Cloud sync not configured')
      return { error: { message: 'Cloud sync not configured' } }
    }
    setError(null)
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin
      }
    })
    if (error) setError(error.message)
    return { data, error }
  }

  const signOut = async () => {
    if (!isSupabaseConfigured()) return
    const { error } = await supabase.auth.signOut()
    if (error) setError(error.message)
  }

  const value = {
    user,
    loading,
    error,
    signUp,
    signIn,
    signInWithMagicLink,
    signOut,
    isConfigured: isSupabaseConfigured(),
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
