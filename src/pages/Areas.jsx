import { useState, useEffect } from 'react'
import { MapPin, AlertTriangle, MoveRight, Plus, Pencil, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useFarm } from '../context/FarmContext'
import { useUser } from '../context/UserContext'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import PageHeader from '../components/ui/PageHeader'

const TYPES = ['pasture', 'pen', 'camp', 'paddock', 'feedlot']
const TYPE_LABELS = { pasture: 'Pasture', pen: 'Pen', camp: 'Camp', paddock: 'Paddock', feedlot: 'Feedlot' }

const FIELD  = 'w-full px-3 py-2.5 text-sm border border-cream-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-farm-400 bg-white'
const LABEL  = 'block text-sm font-medium text-stone-700 mb-1.5'

/* ── Add / Edit modal ──────────────────────────────────────────── */
function AreaFormModal({ open, onClose, existing }) {
  const { addArea, updateArea } = useFarm()
  const isEdit = !!existing

  const blank = { name: '', type: 'pasture', capacity: '', description: '' }
  const [form, setForm]     = useState(blank)
  const [saving, setSaving] = useState(false)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  // Sync form with existing data each time the modal opens
  useEffect(() => {
    if (open) setForm(existing ?? blank)
  }, [open]) // eslint-disable-line react-hooks/exhaustive-deps

  async function submit(e) {
    e.preventDefault()
    setSaving(true)
    const payload = { ...form, capacity: parseInt(form.capacity) || 0 }
    if (isEdit) {
      await updateArea(existing.id, payload)
    } else {
      await addArea(payload)
    }
    setSaving(false)
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose}
           title={isEdit ? 'Edit Area' : 'Add New Area'} size="sm">
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className={LABEL}>Name *</label>
          <input required className={FIELD} placeholder="e.g. North Paddock"
            value={form.name} onChange={e => set('name', e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={LABEL}>Type</label>
            <select className={FIELD} value={form.type} onChange={e => set('type', e.target.value)}>
              {TYPES.map(t => <option key={t} value={t}>{TYPE_LABELS[t]}</option>)}
            </select>
          </div>
          <div>
            <label className={LABEL}>Capacity</label>
            <input type="number" min="0" className={FIELD} placeholder="e.g. 50"
              value={form.capacity} onChange={e => set('capacity', e.target.value)} />
          </div>
        </div>
        <div>
          <label className={LABEL}>Description</label>
          <textarea rows={2} className={FIELD} placeholder="Optional notes about this area…"
            value={form.description} onChange={e => set('description', e.target.value)} />
        </div>
        <div className="flex gap-3 pt-1">
          <Button variant="outline" onClick={onClose} className="flex-1" disabled={saving}>Cancel</Button>
          <Button type="submit" className="flex-1" disabled={saving}>
            {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Area'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

/* ── Delete confirmation modal ─────────────────────────────────── */
function DeleteAreaModal({ open, onClose, area }) {
  const { sheep, deleteArea } = useFarm()
  const [deleting, setDeleting] = useState(false)

  const occupants = sheep.filter(s => s.areaId === area?.id && s.status !== 'sold' && s.status !== 'dead').length

  async function confirm() {
    setDeleting(true)
    await deleteArea(area.id)
    setDeleting(false)
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title="Delete Area" size="sm">
      <div className="space-y-4">
        <p className="text-sm text-stone-600">
          Are you sure you want to delete <span className="font-semibold text-stone-900">{area?.name}</span>?
        </p>
        {occupants > 0 && (
          <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2.5 text-sm text-amber-700">
            <AlertTriangle size={15} className="flex-shrink-0 mt-0.5" />
            <span>{occupants} sheep are currently in this area. They will be unassigned but not deleted.</span>
          </div>
        )}
        <div className="flex gap-3 pt-1">
          <Button variant="outline" onClick={onClose} className="flex-1" disabled={deleting}>Cancel</Button>
          <Button
            onClick={confirm}
            disabled={deleting}
            className="flex-1 !bg-red-500 hover:!bg-red-600"
          >
            {deleting ? 'Deleting…' : 'Delete'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

/* ── Move sheep modal ──────────────────────────────────────────── */
function MoveSheepModal({ open, onClose, sourceAreaId }) {
  const { sheep, areas, updateSheep } = useFarm()
  const [selectedSheepIds, setSelectedSheepIds] = useState([])
  const [targetAreaId, setTargetAreaId]         = useState('')

  const sourceSheep = sheep.filter(s => s.areaId === sourceAreaId && s.status !== 'sold' && s.status !== 'dead')
  const targetAreas = areas.filter(a => a.id !== sourceAreaId)
  const sourceArea  = areas.find(a => a.id === sourceAreaId)

  function toggle(id) {
    setSelectedSheepIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  function handleMove() {
    if (!targetAreaId || selectedSheepIds.length === 0) return
    selectedSheepIds.forEach(id => updateSheep(id, { areaId: targetAreaId }))
    setSelectedSheepIds([])
    setTargetAreaId('')
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title={`Move Sheep — ${sourceArea?.name}`} size="md">
      <div className="space-y-4">
        <div>
          <p className="text-sm font-medium text-stone-700 mb-2">Select sheep to move</p>
          <div className="border border-cream-200 rounded-xl overflow-hidden max-h-52 overflow-y-auto">
            {sourceSheep.length === 0 ? (
              <p className="text-sm text-stone-400 p-4">No sheep in this area</p>
            ) : sourceSheep.map(s => (
              <label key={s.id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-cream-50 cursor-pointer border-b border-cream-100 last:border-0">
                <input type="checkbox" checked={selectedSheepIds.includes(s.id)}
                  onChange={() => toggle(s.id)} className="accent-farm-600 w-4 h-4" />
                <span className="text-sm font-medium text-stone-800">{s.tagNumber}</span>
                {s.name && <span className="text-sm text-stone-500">— {s.name}</span>}
                <Badge variant={s.sex} className="ml-auto">{s.sex}</Badge>
              </label>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Move to</label>
          <select value={targetAreaId} onChange={e => setTargetAreaId(e.target.value)}
            className="w-full px-3 py-2.5 text-sm border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-farm-400">
            <option value="">Select an area…</option>
            {targetAreas.map(a => {
              const cnt = sheep.filter(s => s.areaId === a.id && s.status !== 'sold' && s.status !== 'dead').length
              return <option key={a.id} value={a.id}>{a.name} ({cnt}/{a.capacity})</option>
            })}
          </select>
        </div>
        <div className="flex justify-end gap-3 pt-1">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleMove} disabled={!targetAreaId || selectedSheepIds.length === 0}>
            Move {selectedSheepIds.length > 0 ? `${selectedSheepIds.length} sheep` : 'Sheep'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

/* ── Area card ─────────────────────────────────────────────────── */
function AreaCard({ area, onMove, onEdit, onDelete, canEdit }) {
  const { sheep } = useFarm()
  const navigate  = useNavigate()

  const currentSheep  = sheep.filter(s => s.areaId === area.id && s.status !== 'sold' && s.status !== 'dead')
  const pct           = Math.round((currentSheep.length / Math.max(area.capacity, 1)) * 100)
  const isOver        = currentSheep.length > area.capacity
  const isAt          = currentSheep.length === area.capacity
  const isNear        = !isOver && !isAt && pct >= 90
  const barColor      = isOver ? 'bg-red-500' : pct >= 90 ? 'bg-red-400' : pct >= 70 ? 'bg-amber-400' : 'bg-farm-500'

  const capacityLabel = isOver
    ? { text: 'Over capacity', cls: 'text-red-700 bg-red-100' }
    : isAt
    ? { text: 'At capacity',   cls: 'text-red-600 bg-red-50' }
    : isNear
    ? { text: 'Near capacity', cls: 'text-amber-700 bg-amber-50' }
    : null

  return (
    <Card>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-farm-100 rounded-xl flex items-center justify-center text-farm-700">
            <MapPin size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-stone-900">{area.name}</h3>
            <p className="text-xs text-stone-400">{TYPE_LABELS[area.type] || area.type}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {capacityLabel && (
            <div className={`flex items-center gap-1 text-xs px-2 py-1 rounded-lg mr-1 ${capacityLabel.cls}`}>
              <AlertTriangle size={12} /> {capacityLabel.text}
            </div>
          )}
          {canEdit && (
            <>
              <button onClick={() => onEdit(area)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-farm-600 hover:bg-farm-50 transition-colors">
                <Pencil size={14} />
              </button>
              <button onClick={() => onDelete(area)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                <Trash2 size={14} />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Occupancy bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-stone-500 mb-1.5">
          <span>{currentSheep.length} sheep</span>
          <span>Capacity: {area.capacity}</span>
        </div>
        <div className="w-full h-2.5 bg-cream-200 rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all ${barColor}`}
               style={{ width: `${Math.min(pct, 100)}%` }} />
        </div>
        <p className="text-xs text-stone-400 mt-1">{pct}% full</p>
      </div>

      {/* Sheep breakdown */}
      <div className="flex flex-wrap gap-2 mb-4">
        {['ewe','ram','lamb','wether'].map(sex => {
          const count = currentSheep.filter(s => s.sex === sex).length
          if (!count) return null
          return <Badge key={sex} variant={sex}>{count} {sex}{count !== 1 ? 's' : ''}</Badge>
        })}
        {currentSheep.length === 0 && <p className="text-sm text-stone-400">Empty</p>}
      </div>

      {area.description && <p className="text-xs text-stone-400 mb-4 leading-relaxed">{area.description}</p>}

      <div className="flex gap-2">
        <Button variant="outline" size="sm" icon={<MoveRight size={14} />}
          onClick={() => onMove(area.id)} className="flex-1">
          Move Sheep
        </Button>
        <Button variant="ghost" size="sm"
          onClick={() => navigate(`/sheep?area=${area.id}`)} className="flex-1">
          View Sheep
        </Button>
      </div>
    </Card>
  )
}

/* ── Page ──────────────────────────────────────────────────────── */
export default function Areas() {
  const { areas, sheep }      = useFarm()
  const { isOwnerOrAdmin }    = useUser()

  const [moveAreaId, setMoveAreaId]   = useState(null)
  const [addOpen, setAddOpen]         = useState(false)
  const [editArea, setEditArea]       = useState(null)
  const [deleteArea, setDeleteArea]   = useState(null)

  return (
    <div className="max-w-5xl mx-auto">
      <PageHeader
        title="Areas & Paddocks"
        subtitle="Manage your camps, pens, and grazing areas"
        action={isOwnerOrAdmin && (
          <Button icon={<Plus size={16} />} onClick={() => setAddOpen(true)}>
            Add Area
          </Button>
        )}
      />

      {/* Summary row */}
      <div className="grid grid-cols-4 gap-2 mb-5">
        {[
          { label: 'Total Areas',   value: areas.length },
          { label: 'Pastures',      value: areas.filter(a => a.type === 'pasture').length },
          { label: 'Pens / Camps',  value: areas.filter(a => a.type !== 'pasture').length },
          { label: 'Near Capacity', value: areas.filter(a => {
              const c = sheep.filter(s => s.areaId === a.id && s.status !== 'sold' && s.status !== 'dead').length
              return c / Math.max(a.capacity, 1) >= 0.9
            }).length },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl shadow-card px-2 py-2.5 text-center">
            <p className="text-xl font-bold text-stone-900">{s.value}</p>
            <p className="text-[10px] text-stone-500 mt-0.5 leading-tight">{s.label}</p>
          </div>
        ))}
      </div>

      {areas.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-14 h-14 bg-farm-100 rounded-3xl flex items-center justify-center mb-4">
            <MapPin size={24} className="text-farm-500" />
          </div>
          <p className="text-stone-500 font-medium mb-1">No areas yet</p>
          <p className="text-sm text-stone-400 mb-5">Add your first grazing camp or pen to get started.</p>
          {isOwnerOrAdmin && (
            <Button icon={<Plus size={16} />} onClick={() => setAddOpen(true)}>Add Area</Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {areas.map(area => (
            <AreaCard
              key={area.id}
              area={area}
              canEdit={isOwnerOrAdmin}
              onMove={id => setMoveAreaId(id)}
              onEdit={a => setEditArea(a)}
              onDelete={a => setDeleteArea(a)}
            />
          ))}
        </div>
      )}

      <AreaFormModal  open={addOpen}      onClose={() => setAddOpen(false)}   existing={null} />
      <AreaFormModal  open={!!editArea}   onClose={() => setEditArea(null)}   existing={editArea} />
      <DeleteAreaModal open={!!deleteArea} onClose={() => setDeleteArea(null)} area={deleteArea} />
      <MoveSheepModal  open={!!moveAreaId} onClose={() => setMoveAreaId(null)} sourceAreaId={moveAreaId} />
    </div>
  )
}
