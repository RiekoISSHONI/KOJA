import { useState, useEffect, useCallback } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

// Local storage keys
const STORAGE_KEYS = {
  lastPeriod: 'cycleLastPeriod',
  cycleLength: 'cycleLengthDays',
  periodLength: 'periodLengthDays',
  notes: 'cycleNotes',
  shareCode: 'cycleShareCode',
}

export function useCycleData() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [lastSynced, setLastSynced] = useState(null)
  const [shareCode, setShareCode] = useState(null)
  const [sharedWith, setSharedWith] = useState([])
  const [isSharedView, setIsSharedView] = useState(false)
  const [sharedFromUser, setSharedFromUser] = useState(null)

  // Cycle data state
  const [lastPeriodStart, setLastPeriodStart] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.lastPeriod) || ''
  })
  const [cycleLength, setCycleLength] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.cycleLength)
    return saved ? parseInt(saved) : 28
  })
  const [periodLength, setPeriodLength] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.periodLength)
    return saved ? parseInt(saved) : 5
  })
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.notes)
    return saved ? JSON.parse(saved) : {}
  })

  // Save to localStorage whenever data changes
  useEffect(() => {
    if (lastPeriodStart) localStorage.setItem(STORAGE_KEYS.lastPeriod, lastPeriodStart)
  }, [lastPeriodStart])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.cycleLength, cycleLength.toString())
  }, [cycleLength])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.periodLength, periodLength.toString())
  }, [periodLength])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.notes, JSON.stringify(notes))
  }, [notes])

  // Load data from Supabase when user logs in
  useEffect(() => {
    if (!user || !isSupabaseConfigured()) {
      setLoading(false)
      return
    }

    loadCloudData()
  }, [user])

  const loadCloudData = async () => {
    if (!user || !isSupabaseConfigured()) return

    setLoading(true)
    try {
      // Load cycle settings
      const { data: cycleData } = await supabase
        .from('cycle_settings')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (cycleData) {
        setLastPeriodStart(cycleData.last_period_start || '')
        setCycleLength(cycleData.cycle_length || 28)
        setPeriodLength(cycleData.period_length || 5)
        setShareCode(cycleData.share_code)
      }

      // Load notes
      const { data: notesData } = await supabase
        .from('cycle_notes')
        .select('*')
        .eq('user_id', user.id)

      if (notesData) {
        const notesObj = {}
        notesData.forEach(note => {
          notesObj[note.date] = note.content
        })
        setNotes(notesObj)
      }

      // Load shares
      const { data: sharesData } = await supabase
        .from('cycle_shares')
        .select('*, shared_with_user:profiles!cycle_shares_shared_with_fkey(email)')
        .eq('owner_id', user.id)

      if (sharesData) {
        setSharedWith(sharesData)
      }

      // Check if viewing someone else's shared data
      const { data: sharedToMe } = await supabase
        .from('cycle_shares')
        .select('*, owner:profiles!cycle_shares_owner_id_fkey(email)')
        .eq('shared_with', user.id)
        .eq('status', 'accepted')
        .single()

      if (sharedToMe) {
        setSharedFromUser(sharedToMe.owner)
      }

      setLastSynced(new Date())
    } catch (err) {
      console.error('Error loading cloud data:', err)
    }
    setLoading(false)
  }

  // Sync data to cloud
  const syncToCloud = useCallback(async () => {
    if (!user || !isSupabaseConfigured()) return

    setSyncing(true)
    try {
      // Upsert cycle settings
      await supabase
        .from('cycle_settings')
        .upsert({
          user_id: user.id,
          last_period_start: lastPeriodStart || null,
          cycle_length: cycleLength,
          period_length: periodLength,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id' })

      // Sync notes - delete existing and insert new
      await supabase
        .from('cycle_notes')
        .delete()
        .eq('user_id', user.id)

      const notesArray = Object.entries(notes).map(([date, content]) => ({
        user_id: user.id,
        date,
        content,
      }))

      if (notesArray.length > 0) {
        await supabase
          .from('cycle_notes')
          .insert(notesArray)
      }

      setLastSynced(new Date())
    } catch (err) {
      console.error('Error syncing to cloud:', err)
    }
    setSyncing(false)
  }, [user, lastPeriodStart, cycleLength, periodLength, notes])

  // Auto-sync when data changes (debounced)
  useEffect(() => {
    if (!user || !isSupabaseConfigured()) return

    const timeoutId = setTimeout(() => {
      syncToCloud()
    }, 2000) // Debounce 2 seconds

    return () => clearTimeout(timeoutId)
  }, [lastPeriodStart, cycleLength, periodLength, notes, user, syncToCloud])

  // Generate share code
  const generateShareCode = async () => {
    if (!user || !isSupabaseConfigured()) return null

    const code = Math.random().toString(36).substring(2, 8).toUpperCase()

    await supabase
      .from('cycle_settings')
      .update({ share_code: code })
      .eq('user_id', user.id)

    setShareCode(code)
    return code
  }

  // Accept share invite
  const acceptShareInvite = async (code) => {
    if (!user || !isSupabaseConfigured()) return { error: 'Not logged in' }

    // Find the owner by share code
    const { data: owner } = await supabase
      .from('cycle_settings')
      .select('user_id')
      .eq('share_code', code.toUpperCase())
      .single()

    if (!owner) {
      return { error: 'Invalid share code' }
    }

    if (owner.user_id === user.id) {
      return { error: 'Cannot share with yourself' }
    }

    // Create share relationship
    const { error } = await supabase
      .from('cycle_shares')
      .upsert({
        owner_id: owner.user_id,
        shared_with: user.id,
        status: 'accepted',
      }, { onConflict: 'owner_id,shared_with' })

    if (error) {
      return { error: error.message }
    }

    await loadCloudData()
    return { success: true }
  }

  // Load shared partner's data
  const loadPartnerData = async () => {
    if (!user || !isSupabaseConfigured() || !sharedFromUser) return null

    const { data: sharedToMe } = await supabase
      .from('cycle_shares')
      .select('owner_id')
      .eq('shared_with', user.id)
      .eq('status', 'accepted')
      .single()

    if (!sharedToMe) return null

    const { data: cycleData } = await supabase
      .from('cycle_settings')
      .select('*')
      .eq('user_id', sharedToMe.owner_id)
      .single()

    const { data: notesData } = await supabase
      .from('cycle_notes')
      .select('*')
      .eq('user_id', sharedToMe.owner_id)

    const partnerNotes = {}
    if (notesData) {
      notesData.forEach(note => {
        partnerNotes[note.date] = note.content
      })
    }

    return {
      lastPeriodStart: cycleData?.last_period_start || '',
      cycleLength: cycleData?.cycle_length || 28,
      periodLength: cycleData?.period_length || 5,
      notes: partnerNotes,
    }
  }

  // Remove share
  const removeShare = async (shareId) => {
    if (!user || !isSupabaseConfigured()) return

    await supabase
      .from('cycle_shares')
      .delete()
      .eq('id', shareId)

    await loadCloudData()
  }

  return {
    // Data
    lastPeriodStart,
    setLastPeriodStart,
    cycleLength,
    setCycleLength,
    periodLength,
    setPeriodLength,
    notes,
    setNotes,

    // Sync status
    loading,
    syncing,
    lastSynced,

    // Sharing
    shareCode,
    sharedWith,
    sharedFromUser,
    isSharedView,
    setIsSharedView,
    generateShareCode,
    acceptShareInvite,
    loadPartnerData,
    removeShare,

    // Actions
    syncToCloud,
    loadCloudData,
  }
}
