import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Layers2, Plus, ChevronRight, MapPin, Tag, Trash2,
  X, Check, Pencil, Users, ArrowRight,
} from 'lucide-react'
import { useFarm }     from '../context/FarmContext'
import { useLanguage } from '../context/LanguageContext'

const SEXES   = ['lamb', 'ewe', 'ram', 'wether']
const BREEDS  = ['Merino', 'Dorper', 'Dohne', 'Suffolk', 'Damara']
const STATUSES = ['healthy', 'sick']

function formatDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })
}

/* ── Create Group Modal ────────────────────────────────────────── */
function CreateGroupModal({ areas, onSave, onClose }) {
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    name: '', count: '',
    sex: 'lamb', breed: 'Merino', status: 'healthy',
    dateOfBirth: '', weight: '', areaId: '', notes: '',
  })

  function set(k, v) { setForm(f => ({ ...f, [k]: v })) }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.name.trim() || !form.count || parseInt(form.count) < 1) return
    setSaving(true)
    await onSave(
      { name: form.name.trim(), notes: form.notes, areaId: form.areaId || null },
      parseInt(form.count),
      {
        sex:         form.sex,
        breed:       form.breed,
        status:      form.status,
        dateOfBirth: form.dateOfBirth || null,
        weight:      form.weight      || null,
        areaId:      form.areaId      || null,
        notes:       form.notes       || null,
      }
    )
    setSaving(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-white dark:bg-[#2D2D2D] rounded-3xl shadow-card-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-cream-200 dark:border-stone-700">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-farm-100 dark:bg-stone-700 rounded-xl flex items-center justify-center">
              <Layers2 size={18} className="text-farm-600 dark:text-stone-300" />
            </div>
            <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">New Group</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-stone-400 hover:bg-cream-100 dark:hover:bg-stone-700 transition-colors">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto scrollbar-thin">
          {/* Name + count */}
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-xs font-semibold text-stone-500 dark:text-stone-400 mb-1.5">Group name *</label>
              <input
                required
                value={form.name}
                onChange={e => set('name', e.target.value)}
                placeholder="e.g. Spring Lambs 2025"
                className="w-full px-3 py-2.5 rounded-xl border border-cream-200 dark:border-stone-600 bg-white dark:bg-[#333] text-stone-900 dark:text-stone-100 text-sm focus:outline-none focus:ring-2 focus:ring-farm-400"
              />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-xs font-semibold text-stone-500 dark:text-stone-400 mb-1.5">Number of sheep *</label>
              <input
                required
                type="number" min="1" max="500"
                value={form.count}
                onChange={e => set('count', e.target.value)}
                placeholder="e.g. 25"
                className="w-full px-3 py-2.5 rounded-xl border border-cream-200 dark:border-stone-600 bg-white dark:bg-[#333] text-stone-900 dark:text-stone-100 text-sm focus:outline-none focus:ring-2 focus:ring-farm-400"
              />
            </div>
          </div>

          <div className="border-t border-cream-100 dark:border-stone-700 pt-4">
            <p className="text-xs font-semibold text-stone-400 dark:text-stone-500 uppercase tracking-wide mb-3">Shared fields — all optional</p>

            <div className="grid grid-cols-2 gap-3">
              {/* Sex */}
              <div>
                <label className="block text-xs font-semibold text-stone-500 dark:text-stone-400 mb-1.5">Sex</label>
                <select
                  value={form.sex}
                  onChange={e => set('sex', e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-cream-200 dark:border-stone-600 bg-white dark:bg-[#333] text-stone-900 dark:text-stone-100 text-sm focus:outline-none focus:ring-2 focus:ring-farm-400"
                >
                  {SEXES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                </select>
              </div>

              {/* Breed */}
              <div>
                <label className="block text-xs font-semibold text-stone-500 dark:text-stone-400 mb-1.5">Breed</label>
                <select
                  value={form.breed}
                  onChange={e => set('breed', e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-cream-200 dark:border-stone-600 bg-white dark:bg-[#333] text-stone-900 dark:text-stone-100 text-sm focus:outline-none focus:ring-2 focus:ring-farm-400"
                >
                  {BREEDS.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>

              {/* Date of birth */}
              <div>
                <label className="block text-xs font-semibold text-stone-500 dark:text-stone-400 mb-1.5">Date of birth</label>
                <input
                  type="date"
                  value={form.dateOfBirth}
                  onChange={e => set('dateOfBirth', e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-cream-200 dark:border-stone-600 bg-white dark:bg-[#333] text-stone-900 dark:text-stone-100 text-sm focus:outline-none focus:ring-2 focus:ring-farm-400"
                />
              </div>

              {/* Weight */}
              <div>
                <label className="block text-xs font-semibold text-stone-500 dark:text-stone-400 mb-1.5">Weight (kg)</label>
                <input
                  type="number" step="0.1" min="0"
                  value={form.weight}
                  onChange={e => set('weight', e.target.value)}
                  placeholder="e.g. 4.5"
                  className="w-full px-3 py-2.5 rounded-xl border border-cream-200 dark:border-stone-600 bg-white dark:bg-[#333] text-stone-900 dark:text-stone-100 text-sm focus:outline-none focus:ring-2 focus:ring-farm-400"
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-xs font-semibold text-stone-500 dark:text-stone-400 mb-1.5">Status</label>
                <select
                  value={form.status}
                  onChange={e => set('status', e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-cream-200 dark:border-stone-600 bg-white dark:bg-[#333] text-stone-900 dark:text-stone-100 text-sm focus:outline-none focus:ring-2 focus:ring-farm-400"
                >
                  {STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                </select>
              </div>

              {/* Area */}
              <div>
                <label className="block text-xs font-semibold text-stone-500 dark:text-stone-400 mb-1.5">Assign to area</label>
                <select
                  value={form.areaId}
                  onChange={e => set('areaId', e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-cream-200 dark:border-stone-600 bg-white dark:bg-[#333] text-stone-900 dark:text-stone-100 text-sm focus:outline-none focus:ring-2 focus:ring-farm-400"
                >
                  <option value="">No area</option>
                  {areas.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
              </div>
            </div>

            {/* Notes */}
            <div className="mt-3">
              <label className="block text-xs font-semibold text-stone-500 dark:text-stone-400 mb-1.5">Notes</label>
              <textarea
                value={form.notes}
                onChange={e => set('notes', e.target.value)}
                rows={2}
                placeholder="Optional notes about this group…"
                className="w-full px-3 py-2.5 rounded-xl border border-cream-200 dark:border-stone-600 bg-white dark:bg-[#333] text-stone-900 dark:text-stone-100 text-sm focus:outline-none focus:ring-2 focus:ring-farm-400 resize-none"
              />
            </div>
          </div>

          {/* Tag preview */}
          {form.name && form.count && (
            <div className="bg-cream-100 dark:bg-stone-700/50 rounded-xl px-3 py-2.5 text-xs text-stone-500 dark:text-stone-400">
              Tags will be auto-generated: <span className="font-mono font-semibold text-stone-700 dark:text-stone-200">
                {form.name.replace(/\s+/g,'').slice(0,3).toUpperCase()}-001
              </span> … <span className="font-mono font-semibold text-stone-700 dark:text-stone-200">
                {form.name.replace(/\s+/g,'').slice(0,3).toUpperCase()}-{String(parseInt(form.count)||1).padStart(3,'0')}
              </span> — edit individually later
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 border-t border-cream-200 dark:border-stone-700">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-cream-200 dark:border-stone-600 text-sm font-semibold text-stone-600 dark:text-stone-300 hover:bg-cream-100 dark:hover:bg-stone-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving || !form.name.trim() || !form.count}
            className="flex-1 py-2.5 rounded-xl bg-farm-400 hover:bg-farm-500 disabled:opacity-50 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2"
          >
            {saving ? <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <Plus size={15} />}
            {saving ? 'Creating…' : `Create Group`}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── Group Card ────────────────────────────────────────────────── */
function GroupCard({ group, sheep, areas, onSelect, selected, onDelete, onAssignArea }) {
  const groupSheep = sheep.filter(s => s.groupId === group.id)
  const area       = areas.find(a => a.id === group.areaId)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [areaOpen, setAreaOpen]           = useState(false)

  return (
    <div className={[
      'bg-white dark:bg-[#2D2D2D] rounded-3xl shadow-card transition-all',
      selected ? 'ring-2 ring-farm-400' : '',
    ].join(' ')}>
      {/* Card header */}
      <button
        className="w-full flex items-center justify-between p-5 text-left"
        onClick={() => onSelect(selected ? null : group.id)}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-farm-100 dark:bg-stone-700 rounded-2xl flex items-center justify-center flex-shrink-0">
            <Layers2 size={18} className="text-farm-600 dark:text-stone-300" />
          </div>
          <div>
            <p className="font-bold text-stone-900 dark:text-stone-100 text-sm">{group.name}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs text-stone-400 dark:text-stone-500">
                {groupSheep.length} sheep · {formatDate(group.createdAt)}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {area ? (
            <span className="flex items-center gap-1 text-xs font-medium text-stone-500 dark:text-stone-400 bg-cream-100 dark:bg-stone-700 px-2.5 py-1 rounded-full">
              <MapPin size={10} /> {area.name}
            </span>
          ) : (
            <span className="text-xs text-stone-400 dark:text-stone-500 bg-cream-100 dark:bg-stone-700 px-2.5 py-1 rounded-full">No area</span>
          )}
          <ChevronRight size={16} className={`text-stone-300 transition-transform ${selected ? 'rotate-90' : ''}`} />
        </div>
      </button>

      {/* Expanded detail */}
      {selected && (
        <div className="border-t border-cream-100 dark:border-stone-700 px-5 pb-5">

          {/* Actions */}
          <div className="flex items-center gap-2 pt-4 pb-3">
            {/* Assign area */}
            <div className="relative">
              <button
                onClick={() => setAreaOpen(o => !o)}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-cream-100 dark:bg-stone-700 text-stone-600 dark:text-stone-300 hover:bg-cream-200 dark:hover:bg-stone-600 transition-colors"
              >
                <MapPin size={12} /> Assign area
              </button>
              {areaOpen && (
                <div className="absolute top-full mt-1 left-0 z-20 bg-white dark:bg-[#2D2D2D] rounded-2xl shadow-card-lg border border-cream-200 dark:border-stone-700 min-w-[160px] overflow-hidden">
                  <button
                    onClick={() => { onAssignArea(group.id, null); setAreaOpen(false) }}
                    className="w-full flex items-center gap-2 px-3 py-2.5 text-xs text-stone-500 hover:bg-cream-100 dark:hover:bg-stone-700 transition-colors"
                  >
                    <X size={12} /> No area
                  </button>
                  {areas.map(a => (
                    <button
                      key={a.id}
                      onClick={() => { onAssignArea(group.id, a.id); setAreaOpen(false) }}
                      className="w-full flex items-center justify-between gap-2 px-3 py-2.5 text-xs text-stone-700 dark:text-stone-300 hover:bg-cream-100 dark:hover:bg-stone-700 transition-colors"
                    >
                      <span>{a.name}</span>
                      {group.areaId === a.id && <Check size={12} className="text-farm-500" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Delete */}
            <button
              onClick={() => confirmDelete ? onDelete(group.id) : setConfirmDelete(true)}
              onBlur={() => setTimeout(() => setConfirmDelete(false), 200)}
              className={[
                'flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl transition-colors ml-auto',
                confirmDelete
                  ? 'bg-red-500 text-white'
                  : 'bg-cream-100 dark:bg-stone-700 text-stone-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20',
              ].join(' ')}
            >
              <Trash2 size={12} />
              {confirmDelete ? 'Confirm delete' : 'Delete group'}
            </button>
          </div>

          {/* Sheep list */}
          {groupSheep.length === 0 ? (
            <p className="text-sm text-stone-400 dark:text-stone-500 py-4 text-center">No sheep in this group</p>
          ) : (
            <div className="space-y-1 max-h-64 overflow-y-auto scrollbar-thin">
              {groupSheep.map(s => (
                <SheepRow key={s.id} sheep={s} area={areas.find(a => a.id === s.areaId)} />
              ))}
            </div>
          )}

          {group.notes && (
            <p className="text-xs text-stone-400 dark:text-stone-500 mt-3 pt-3 border-t border-cream-100 dark:border-stone-700">
              {group.notes}
            </p>
          )}
        </div>
      )}
    </div>
  )
}

/* ── Sheep row inside group ────────────────────────────────────── */
function SheepRow({ sheep: s, area }) {
  const navigate = useNavigate()
  const SEX_COLORS = {
    ewe:    'bg-pink-100 text-pink-600',
    ram:    'bg-blue-100 text-blue-600',
    lamb:   'bg-amber-100 text-amber-700',
    wether: 'bg-stone-100 text-stone-600',
  }
  const STATUS_COLORS = {
    healthy:  'bg-green-100 text-green-700',
    sick:     'bg-red-100 text-red-600',
    pregnant: 'bg-purple-100 text-purple-700',
  }

  return (
    <button
      onClick={() => navigate(`/sheep/${s.id}`)}
      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-cream-100 dark:hover:bg-stone-700 text-left transition-colors group"
    >
      <div className="w-8 h-8 rounded-full bg-farm-100 dark:bg-stone-700 flex items-center justify-center text-xs font-bold text-farm-600 dark:text-stone-300 flex-shrink-0">
        <Tag size={13} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-stone-800 dark:text-stone-200 truncate">{s.tagNumber}</p>
        <p className="text-xs text-stone-400 dark:text-stone-500 truncate">{s.breed}{area ? ` · ${area.name}` : ''}</p>
      </div>
      <div className="flex items-center gap-1.5 flex-shrink-0">
        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${SEX_COLORS[s.sex] || 'bg-stone-100 text-stone-600'}`}>
          {s.sex}
        </span>
        {s.status !== 'healthy' && (
          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${STATUS_COLORS[s.status] || 'bg-stone-100 text-stone-600'}`}>
            {s.status}
          </span>
        )}
        {s.weight ? <span className="text-xs text-stone-400">{s.weight}kg</span> : null}
      </div>
      <ChevronRight size={14} className="text-stone-300 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
    </button>
  )
}

/* ── Groups page ───────────────────────────────────────────────── */
export default function Groups() {
  const { sheep, areas, groups, addGroup, deleteGroup, assignGroupToArea } = useFarm()
  const { t } = useLanguage()

  const [showCreate, setShowCreate] = useState(false)
  const [selectedId, setSelectedId] = useState(null)

  return (
    <div className="max-w-5xl mx-auto">

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-farm-100 dark:bg-stone-700 rounded-2xl flex items-center justify-center">
            <Layers2 size={22} className="text-farm-600 dark:text-stone-300" strokeWidth={1.8} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100 tracking-tight">Groups</h1>
            <p className="text-xs text-stone-400 dark:text-stone-500 mt-0.5">
              {groups.length} {groups.length === 1 ? 'group' : 'groups'} · {sheep.filter(s => s.groupId).length} grouped sheep
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-farm-400 hover:bg-farm-500 text-white font-semibold text-sm rounded-xl transition-colors"
        >
          <Plus size={16} />
          New Group
        </button>
      </div>

      {/* Empty state */}
      {groups.length === 0 && (
        <div className="bg-white dark:bg-[#2D2D2D] rounded-3xl shadow-card p-12 flex flex-col items-center text-center">
          <div className="w-14 h-14 bg-cream-100 dark:bg-stone-700 rounded-3xl flex items-center justify-center mb-4">
            <Layers2 size={26} className="text-stone-300 dark:text-stone-500" />
          </div>
          <h2 className="text-base font-bold text-stone-800 dark:text-stone-200 mb-1">No groups yet</h2>
          <p className="text-sm text-stone-400 dark:text-stone-500 mb-5 max-w-xs">
            Create a group to bulk-add sheep with shared info in one go. Great for lamb batches, new purchases, and more.
          </p>
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-farm-400 hover:bg-farm-500 text-white font-semibold text-sm rounded-xl transition-colors"
          >
            <Plus size={15} /> Create your first group
          </button>
        </div>
      )}

      {/* Groups grid */}
      {groups.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {groups.map(g => (
            <GroupCard
              key={g.id}
              group={g}
              sheep={sheep}
              areas={areas}
              selected={selectedId === g.id}
              onSelect={setSelectedId}
              onDelete={deleteGroup}
              onAssignArea={assignGroupToArea}
            />
          ))}
        </div>
      )}

      {/* Create modal */}
      {showCreate && (
        <CreateGroupModal
          areas={areas}
          onSave={addGroup}
          onClose={() => setShowCreate(false)}
        />
      )}
    </div>
  )
}
