import { createContext, useContext, useState, useEffect } from 'react'
import { supabase, mapRow, toDb } from '../lib/supabase'
import { useAuth } from './AuthContext'

const UserContext = createContext(null)

export function UserProvider({ children }) {
  const { user } = useAuth()
  const [currentUser,  setCurrentUser]  = useState(null)
  const [farms,        setFarms]        = useState([])
  const [activeFarmId, setActiveFarmId] = useState(null)
  const [loading,      setLoading]      = useState(true)

  useEffect(() => {
    if (!user) {
      // No logged-in user — clear everything and stop loading
      setCurrentUser(null)
      setFarms([])
      setActiveFarmId(null)
      setLoading(false)
      return
    }
    loadUserData()
  }, [user?.id])

  /* ── load profile + farms ─────────────────────────── */
  async function loadUserData() {
    setLoading(true)
    try {
      const { data: profile } = await supabase
        .from('profiles').select('*').eq('id', user.id).single()

      if (profile) {
        setCurrentUser(mapRow(profile))
      } else {
        // Trigger may have failed — build profile from auth metadata and upsert
        const meta     = user.user_metadata || {}
        const name     = meta.name || user.email || ''
        const parts    = name.trim().split(/\s+/)
        const initials = (parts[0]?.[0] || '').toUpperCase() +
                         (parts[1]?.[0] || '').toUpperCase()
        const fallback = { id: user.id, name, initials: initials || '?', email: user.email }
        await supabase.from('profiles').upsert(fallback, { onConflict: 'id' })
        setCurrentUser(fallback)
      }

      await refreshFarms()
    } catch (err) {
      console.error('loadUserData error:', err)
    } finally {
      setLoading(false)
    }
  }

  async function refreshFarms() {
    const { data: rows, error } = await supabase
      .from('farm_members')
      .select('role, farms(*)')
      .eq('user_id', user.id)
    if (error || !rows || rows.length === 0) { setFarms([]); return }

    const farmsWithMembers = await Promise.all(
      rows.map(async row => {
        if (!row.farms) return null
        const farm = mapRow(row.farms)
        const { data: members } = await supabase
          .from('farm_members')
          .select('user_id, role, profiles(id, name, initials, email)')
          .eq('farm_id', farm.id)
        return {
          ...farm,
          members: (members || []).map(m => ({
            userId: m.user_id,
            role:   m.role,
            user:   m.profiles ? mapRow(m.profiles) : null,
          })),
        }
      })
    )
    const validFarms = farmsWithMembers.filter(Boolean)
    setFarms(validFarms)
    setActiveFarmId(prev => prev ?? validFarms[0]?.id ?? null)
  }

  /* ── farm CRUD ────────────────────────────────────── */
  async function createFarm({ name, location, season }) {
    const { error } = await supabase.rpc('create_farm_for_user', {
      p_name:     name,
      p_location: location || '',
      p_season:   season  || 'Season 2025',
    })
    if (error) { console.error('createFarm rpc error:', error); return null }
    await refreshFarms()
    return true
  }

  async function updateFarm(farmId, changes) {
    await supabase.from('farms').update(toDb(changes)).eq('id', farmId)
    setFarms(prev => prev.map(f => f.id === farmId ? { ...f, ...changes } : f))
  }

  async function setFarmLogo(farmId, logoDataUrl) {
    await supabase.from('farms').update({ logo: logoDataUrl }).eq('id', farmId)
    setFarms(prev => prev.map(f => f.id === farmId ? { ...f, logo: logoDataUrl } : f))
  }

  async function deleteFarm(farmId) {
    await supabase.from('farms').delete().eq('id', farmId)
    const remaining = farms.filter(f => f.id !== farmId)
    setFarms(remaining)
    if (activeFarmId === farmId) setActiveFarmId(remaining[0]?.id ?? null)
  }

  /* ── member CRUD ──────────────────────────────────── */
  async function addMember(farmId, email, role = 'viewer') {
    const { data: profile } = await supabase
      .from('profiles').select('id').eq('email', email).single()
    if (!profile) return { error: 'No account found with that email. They need to sign up first.' }
    const { error } = await supabase.from('farm_members')
      .insert({ farm_id: farmId, user_id: profile.id, role })
    if (error) return { error: 'Could not add member.' }
    await refreshFarms()
    return { error: null }
  }

  async function removeMember(farmId, userId) {
    await supabase.from('farm_members')
      .delete().eq('farm_id', farmId).eq('user_id', userId)
    setFarms(prev => prev.map(f =>
      f.id !== farmId ? f : { ...f, members: f.members.filter(m => m.userId !== userId) }
    ))
  }

  async function updateMemberRole(farmId, userId, role) {
    await supabase.from('farm_members')
      .update({ role }).eq('farm_id', farmId).eq('user_id', userId)
    setFarms(prev => prev.map(f =>
      f.id !== farmId ? f : { ...f, members: f.members.map(m => m.userId === userId ? { ...m, role } : m) }
    ))
  }

  function getUser(userId) {
    for (const farm of farms) {
      const m = farm.members?.find(m => m.userId === userId)
      if (m?.user) return m.user
    }
    return { name: 'Unknown', initials: '??' }
  }

  const activeFarm      = farms.find(f => f.id === activeFarmId) ?? farms[0] ?? null
  const myFarms         = farms
  const myRole          = activeFarm?.members?.find(m => m.userId === user?.id)?.role ?? 'viewer'
  const isOwnerOrAdmin  = myRole === 'owner' || myRole === 'admin'

  if (loading) return (
    <div className="min-h-screen bg-cream-100 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-farm-400 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <UserContext.Provider value={{
      currentUser,
      farms, myFarms, activeFarm, activeFarmId, setActiveFarmId,
      myRole, isOwnerOrAdmin,
      createFarm, updateFarm, deleteFarm, setFarmLogo,
      addMember, removeMember, updateMemberRole,
      getUser, refreshFarms,
    }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const ctx = useContext(UserContext)
  if (!ctx) throw new Error('useUser must be used inside UserProvider')
  return ctx
}
