import { useState, useRef } from 'react'
import { useUser } from '../context/UserContext'
import {
  Plus, Trash2, UserPlus, X, ChevronRight,
  MapPin, Users, Crown, Shield, Eye, Check, Upload, ImageIcon,
} from 'lucide-react'
import Card, { CardHeader } from '../components/ui/Card'
import Modal from '../components/ui/Modal'
import Button from '../components/ui/Button'
import PageHeader from '../components/ui/PageHeader'
import FarmLogo from '../components/ui/FarmLogo'

const ROLE_META = {
  owner:  { label: 'Owner',  icon: Crown,  color: 'bg-amber-100 text-amber-700'  },
  admin:  { label: 'Admin',  icon: Shield, color: 'bg-blue-100 text-blue-700'    },
  viewer: { label: 'Viewer', icon: Eye,    color: 'bg-stone-100 text-stone-500'  },
}

function Avatar({ initials, size = 'md', color = 'bg-farm-400' }) {
  const sz = size === 'sm' ? 'w-8 h-8 text-xs' : size === 'lg' ? 'w-12 h-12 text-base' : 'w-9 h-9 text-sm'
  return (
    <div className={`${sz} ${color} rounded-full flex items-center justify-center text-white font-bold flex-shrink-0`}>
      {initials}
    </div>
  )
}

function RoleBadge({ role }) {
  const m = ROLE_META[role] || ROLE_META.viewer
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${m.color}`}>
      <m.icon size={11} />
      {m.label}
    </span>
  )
}

/* ── Create Farm modal ─────────────────────────────────────────── */
function CreateFarmModal({ open, onClose }) {
  const { createFarm } = useUser()
  const [form, setForm] = useState({ name: '', location: '', season: 'Season 2025' })
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  function submit(e) {
    e.preventDefault()
    if (!form.name.trim()) return
    createFarm(form)
    setForm({ name: '', location: '', season: 'Season 2025' })
    onClose()
  }

  const field = 'w-full px-3 py-2.5 text-sm border border-cream-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-farm-400 bg-white'
  const label = 'block text-sm font-medium text-stone-700 mb-1.5'

  return (
    <Modal open={open} onClose={onClose} title="Create New Farm" size="sm">
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className={label}>Farm Name *</label>
          <input required className={field} placeholder="e.g. Groenplaas" value={form.name} onChange={e => set('name', e.target.value)} />
        </div>
        <div>
          <label className={label}>Location</label>
          <input className={field} placeholder="e.g. North Cape, South Africa" value={form.location} onChange={e => set('location', e.target.value)} />
        </div>
        <div>
          <label className={label}>Season</label>
          <input className={field} placeholder="e.g. Season 2025" value={form.season} onChange={e => set('season', e.target.value)} />
        </div>
        <div className="flex gap-3 pt-1">
          <Button variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
          <Button type="submit" className="flex-1">Create Farm</Button>
        </div>
      </form>
    </Modal>
  )
}

/* ── Invite User modal ─────────────────────────────────────────── */
function InviteModal({ open, onClose, farmId }) {
  const { addMember } = useUser()
  const [email, setEmail] = useState('')
  const [role, setRole]   = useState('viewer')
  const [done, setDone]   = useState(false)

  function submit(e) {
    e.preventDefault()
    if (!email.trim()) return
    addMember(farmId, email.trim(), role)
    setDone(true)
    setTimeout(() => { setDone(false); setEmail(''); setRole('viewer'); onClose() }, 1200)
  }

  const field = 'w-full px-3 py-2.5 text-sm border border-cream-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-farm-400 bg-white'
  const label = 'block text-sm font-medium text-stone-700 mb-1.5'

  return (
    <Modal open={open} onClose={onClose} title="Add User to Farm" size="sm">
      {done ? (
        <div className="flex flex-col items-center py-6 gap-3">
          <div className="w-12 h-12 bg-farm-100 rounded-full flex items-center justify-center">
            <Check size={22} className="text-farm-600" />
          </div>
          <p className="text-sm font-medium text-stone-700">User added!</p>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className={label}>Email Address *</label>
            <input required type="email" className={field} placeholder="user@example.com" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div>
            <label className={label}>Role</label>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(ROLE_META).map(([key, m]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setRole(key)}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border-2 transition-colors ${
                    role === key ? 'border-farm-400 bg-farm-50' : 'border-cream-200 hover:border-cream-300'
                  }`}
                >
                  <m.icon size={16} className={role === key ? 'text-farm-600' : 'text-stone-400'} />
                  <span className={`text-xs font-medium ${role === key ? 'text-farm-700' : 'text-stone-500'}`}>{m.label}</span>
                </button>
              ))}
            </div>
            <div className="mt-2 text-xs text-stone-400 space-y-0.5">
              <p><strong>Owner</strong> — full control, can delete farm</p>
              <p><strong>Admin</strong> — manage sheep, areas, records</p>
              <p><strong>Viewer</strong> — read-only access</p>
            </div>
          </div>
          <div className="flex gap-3 pt-1">
            <Button variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
            <Button type="submit" className="flex-1">Add User</Button>
          </div>
        </form>
      )}
    </Modal>
  )
}

/* ── Farm detail panel ─────────────────────────────────────────── */
function FarmPanel({ farm, onInvite, onDelete }) {
  const { currentUser, getUser, removeMember, updateMemberRole, setFarmLogo } = useUser()
  const [confirmDelete, setConfirmDelete] = useState(false)
  const fileRef = useRef(null)

  const canManage = farm.members.find(m => m.userId === currentUser.id)?.role !== 'viewer'

  function handleLogoChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => setFarmLogo(farm.id, ev.target.result)
    reader.readAsDataURL(file)
    e.target.value = ''           // reset so same file can be re-selected
  }

  return (
    <div className="space-y-5">
      {/* Farm info + logo */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          {/* Logo with upload overlay */}
          <div className="relative group flex-shrink-0">
            <FarmLogo farm={farm} size="xl" />
            {canManage && (
              <>
                <button
                  onClick={() => fileRef.current?.click()}
                  className="absolute inset-0 rounded-2xl bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1"
                  title="Change logo"
                >
                  <Upload size={16} className="text-white" />
                  <span className="text-white text-[10px] font-semibold">Change</span>
                </button>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/png,image/jpeg,image/svg+xml,image/webp"
                  className="hidden"
                  onChange={handleLogoChange}
                />
              </>
            )}
          </div>
          <div>
            <h2 className="text-xl font-bold text-stone-900">{farm.name}</h2>
            {farm.location && (
              <p className="flex items-center gap-1 text-sm text-stone-400 mt-1">
                <MapPin size={13} /> {farm.location}
              </p>
            )}
            {farm.season && <p className="text-xs text-stone-400 mt-0.5">{farm.season}</p>}
            {canManage && (
              <button
                onClick={() => fileRef.current?.click()}
                className="flex items-center gap-1.5 text-xs text-farm-600 font-medium mt-2 hover:text-farm-700"
              >
                <ImageIcon size={12} /> {farm.logo ? 'Change logo' : 'Upload logo'} (PNG)
              </button>
            )}
          </div>
        </div>
        {canManage && (
          <button
            onClick={() => setConfirmDelete(true)}
            className="p-2 rounded-xl text-stone-400 hover:bg-red-50 hover:text-red-500 transition-colors flex-shrink-0"
            title="Delete farm"
          >
            <Trash2 size={17} />
          </button>
        )}
      </div>

      {/* Delete confirm */}
      {confirmDelete && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-3">
          <p className="text-sm text-red-700 flex-1">Delete <strong>{farm.name}</strong>? This cannot be undone.</p>
          <button onClick={() => { onDelete(farm.id); setConfirmDelete(false) }} className="text-xs font-semibold text-red-600 hover:text-red-800 px-3 py-1.5 bg-red-100 rounded-xl">Delete</button>
          <button onClick={() => setConfirmDelete(false)} className="text-stone-400 hover:text-stone-600"><X size={16} /></button>
        </div>
      )}

      {/* Members */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Users size={15} className="text-stone-400" />
            <p className="text-sm font-semibold text-stone-700">{farm.members.length} Member{farm.members.length !== 1 ? 's' : ''}</p>
          </div>
          {canManage && (
            <button
              onClick={onInvite}
              className="flex items-center gap-1.5 text-xs font-semibold text-farm-600 hover:text-farm-700 bg-farm-50 hover:bg-farm-100 px-3 py-1.5 rounded-xl transition-colors"
            >
              <UserPlus size={13} /> Add User
            </button>
          )}
        </div>

        <div className="space-y-2">
          {farm.members.map(({ userId, role }) => {
            const user  = getUser(userId)
            const isMe  = userId === currentUser.id
            const isOwner = role === 'owner'
            const colors = ['bg-farm-400','bg-blue-400','bg-purple-400','bg-amber-400','bg-pink-400']
            const color  = colors[parseInt(userId.replace(/\D/g,'')) % colors.length]

            return (
              <div key={userId} className="flex items-center gap-3 p-3 bg-cream-50 rounded-2xl">
                <Avatar initials={user.initials} color={color} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-stone-900 truncate">
                    {user.name} {isMe && <span className="text-xs text-stone-400 font-normal">(you)</span>}
                  </p>
                  <p className="text-xs text-stone-400 truncate">{user.email}</p>
                </div>
                {canManage && !isOwner && !isMe ? (
                  <div className="flex items-center gap-2">
                    <select
                      value={role}
                      onChange={e => updateMemberRole(farm.id, userId, e.target.value)}
                      className="text-xs border border-cream-300 rounded-lg px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-farm-400"
                    >
                      <option value="admin">Admin</option>
                      <option value="viewer">Viewer</option>
                    </select>
                    <button
                      onClick={() => removeMember(farm.id, userId)}
                      className="p-1.5 rounded-lg text-stone-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <RoleBadge role={role} />
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

/* ── Main page ─────────────────────────────────────────────────── */
export default function Farms() {
  const { myFarms, activeFarmId, setActiveFarmId, deleteFarm } = useUser()
  const [createOpen, setCreateOpen] = useState(false)
  const [inviteOpen, setInviteOpen] = useState(false)
  const [selectedId, setSelectedId] = useState(activeFarmId || myFarms[0]?.id)

  const selectedFarm = myFarms.find(f => f.id === selectedId) || myFarms[0]

  function handleDelete(farmId) {
    deleteFarm(farmId)
    const next = myFarms.find(f => f.id !== farmId)
    setSelectedId(next?.id || null)
  }

  return (
    <div className="max-w-5xl mx-auto">
      <PageHeader
        title="Farms & Groups"
        subtitle="Manage your farms and control who has access"
        action={
          <Button onClick={() => setCreateOpen(true)} icon={<Plus size={16} />}>
            New Farm
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

        {/* ── Farm list ── */}
        <div className="space-y-3">
          {myFarms.map(farm => {
            const isActive = farm.id === selectedId
            return (
              <button
                key={farm.id}
                onClick={() => setSelectedId(farm.id)}
                className={[
                  'w-full flex items-center gap-3 p-4 rounded-3xl text-left transition-all border',
                  isActive
                    ? 'bg-farm-50 border-farm-200 shadow-card'
                    : 'bg-white border-cream-200 hover:border-cream-300 shadow-card',
                ].join(' ')}
              >
                <FarmLogo farm={farm} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold truncate ${isActive ? 'text-farm-700' : 'text-stone-900'}`}>{farm.name}</p>
                  <p className="text-xs text-stone-400 truncate">{farm.members.length} member{farm.members.length !== 1 ? 's' : ''}</p>
                </div>
                {farm.id === activeFarmId && (
                  <span className="text-[10px] font-semibold text-farm-600 bg-farm-100 px-2 py-0.5 rounded-full flex-shrink-0">Active</span>
                )}
                <ChevronRight size={14} className={isActive ? 'text-farm-400' : 'text-stone-300'} />
              </button>
            )
          })}

          {myFarms.length === 0 && (
            <div className="text-center py-10 text-stone-400">
              <p className="text-sm">No farms yet.</p>
              <button onClick={() => setCreateOpen(true)} className="text-farm-500 text-sm font-medium mt-1 hover:underline">
                Create your first farm
              </button>
            </div>
          )}
        </div>

        {/* ── Farm detail ── */}
        <div className="md:col-span-2">
          {selectedFarm ? (
            <Card>
              {/* Switch active farm */}
              {selectedFarm.id !== activeFarmId && (
                <div className="mb-4 pb-4 border-b border-cream-100 flex items-center justify-between">
                  <p className="text-sm text-stone-500">This is not your active farm.</p>
                  <button
                    onClick={() => setActiveFarmId(selectedFarm.id)}
                    className="text-xs font-semibold text-farm-600 bg-farm-50 hover:bg-farm-100 px-3 py-1.5 rounded-xl transition-colors"
                  >
                    Switch to this farm
                  </button>
                </div>
              )}
              <FarmPanel
                farm={selectedFarm}
                onInvite={() => setInviteOpen(true)}
                onDelete={handleDelete}
              />
            </Card>
          ) : (
            <Card className="flex items-center justify-center py-16">
              <p className="text-stone-400 text-sm">Select a farm to view details</p>
            </Card>
          )}
        </div>
      </div>

      <CreateFarmModal open={createOpen} onClose={() => setCreateOpen(false)} />
      {selectedFarm && (
        <InviteModal open={inviteOpen} onClose={() => setInviteOpen(false)} farmId={selectedFarm.id} />
      )}
    </div>
  )
}
