import { createContext, useContext, useState } from 'react'

/* ─── seed data ─────────────────────────────────────────────────── */
const SEED_USERS = [
  { id: 'u1', name: 'Nathan Jonck',   email: 'nathan@groenplaas.co.za', initials: 'NJ' },
  { id: 'u2', name: 'Jan van Wyk',    email: 'jan@groenplaas.co.za',    initials: 'JV' },
  { id: 'u3', name: 'Pieter Botha',   email: 'pieter@botha.co.za',      initials: 'PB' },
  { id: 'u4', name: 'Anri du Plessis',email: 'anri@duplessis.co.za',    initials: 'AP' },
]

const SEED_FARMS = [
  {
    id: 'f1',
    name: 'Groenplaas',
    location: 'North Cape, South Africa',
    season: 'Season 2025',
    logo: '/logos/groenplaas.svg',
    members: [
      { userId: 'u1', role: 'owner' },
      { userId: 'u2', role: 'admin' },
      { userId: 'u3', role: 'viewer' },
    ],
  },
  {
    id: 'f2',
    name: 'Droëvlei',
    location: 'Western Cape, South Africa',
    season: 'Season 2025',
    logo: null,
    members: [
      { userId: 'u1', role: 'owner' },
      { userId: 'u4', role: 'admin' },
    ],
  },
]

/* ─── context ───────────────────────────────────────────────────── */
const UserContext = createContext(null)

export function UserProvider({ children }) {
  const [currentUser]    = useState(SEED_USERS[0])          // logged-in user
  const [allUsers, setAllUsers] = useState(SEED_USERS)
  const [farms, setFarms]       = useState(SEED_FARMS)
  const [activeFarmId, setActiveFarmId] = useState('f1')

  const activeFarm = farms.find(f => f.id === activeFarmId) || farms[0]

  /* my farms = farms where currentUser is a member */
  const myFarms = farms.filter(f => f.members.some(m => m.userId === currentUser.id))

  /* current user's role in the active farm */
  const myRole = activeFarm?.members.find(m => m.userId === currentUser.id)?.role || 'viewer'
  const isOwnerOrAdmin = myRole === 'owner' || myRole === 'admin'

  /* ── farm CRUD ── */
  function createFarm({ name, location, season }) {
    const newFarm = {
      id: `f${Date.now()}`,
      name, location,
      season: season || 'Season 2025',
      members: [{ userId: currentUser.id, role: 'owner' }],
    }
    setFarms(prev => [...prev, newFarm])
    setActiveFarmId(newFarm.id)
    return newFarm
  }

  function updateFarm(farmId, changes) {
    setFarms(prev => prev.map(f => f.id === farmId ? { ...f, ...changes } : f))
  }

  function setFarmLogo(farmId, logoDataUrl) {
    setFarms(prev => prev.map(f => f.id === farmId ? { ...f, logo: logoDataUrl } : f))
  }

  function deleteFarm(farmId) {
    setFarms(prev => prev.filter(f => f.id !== farmId))
    if (activeFarmId === farmId) setActiveFarmId(farms.find(f => f.id !== farmId)?.id || null)
  }

  /* ── member CRUD ── */
  function addMember(farmId, email, role = 'viewer') {
    // find existing user or create a ghost invite
    let user = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase())
    if (!user) {
      const parts = email.split('@')[0].split('.')
      const initials = parts.map(p => p[0]?.toUpperCase() || '').join('').slice(0, 2) || '??'
      user = { id: `u${Date.now()}`, name: email, email, initials, invited: true }
      setAllUsers(prev => [...prev, user])
    }
    setFarms(prev => prev.map(f => {
      if (f.id !== farmId) return f
      if (f.members.some(m => m.userId === user.id)) return f   // already member
      return { ...f, members: [...f.members, { userId: user.id, role }] }
    }))
  }

  function removeMember(farmId, userId) {
    setFarms(prev => prev.map(f => {
      if (f.id !== farmId) return f
      return { ...f, members: f.members.filter(m => m.userId !== userId) }
    }))
  }

  function updateMemberRole(farmId, userId, role) {
    setFarms(prev => prev.map(f => {
      if (f.id !== farmId) return f
      return { ...f, members: f.members.map(m => m.userId === userId ? { ...m, role } : m) }
    }))
  }

  /* ── helper: resolve user object ── */
  function getUser(userId) {
    return allUsers.find(u => u.id === userId) || { name: 'Unknown', initials: '??' }
  }

  return (
    <UserContext.Provider value={{
      currentUser, allUsers,
      farms, myFarms, activeFarm, activeFarmId, setActiveFarmId,
      myRole, isOwnerOrAdmin,
      createFarm, updateFarm, deleteFarm, setFarmLogo,
      addMember, removeMember, updateMemberRole,
      getUser,
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
