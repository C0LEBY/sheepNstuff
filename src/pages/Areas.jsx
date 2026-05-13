import { useState } from 'react'
import { MapPin, Users, AlertTriangle, MoveRight, ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useFarm } from '../context/FarmContext'
import Card, { CardHeader } from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import PageHeader from '../components/ui/PageHeader'

const TYPE_LABELS = {
  pasture: 'Pasture',
  pen:     'Pen',
  camp:    'Camp',
  paddock: 'Paddock',
}

function MoveSheepModal({ open, onClose, sourceAreaId }) {
  const { sheep, areas, updateSheep } = useFarm()
  const [selectedSheepIds, setSelectedSheepIds] = useState([])
  const [targetAreaId, setTargetAreaId] = useState('')

  const sourceSheep = sheep.filter(s => s.areaId === sourceAreaId && s.status !== 'sold' && s.status !== 'dead')
  const targetAreas = areas.filter(a => a.id !== sourceAreaId)

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

  const sourceArea = areas.find(a => a.id === sourceAreaId)

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
                <input
                  type="checkbox"
                  checked={selectedSheepIds.includes(s.id)}
                  onChange={() => toggle(s.id)}
                  className="accent-farm-600 w-4 h-4"
                />
                <span className="text-sm font-medium text-stone-800">{s.tagNumber}</span>
                {s.name && <span className="text-sm text-stone-500">— {s.name}</span>}
                <Badge variant={s.sex} className="ml-auto">{s.sex}</Badge>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Move to</label>
          <select
            value={targetAreaId}
            onChange={e => setTargetAreaId(e.target.value)}
            className="w-full px-3 py-2.5 text-sm border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-farm-400"
          >
            <option value="">Select an area…</option>
            {targetAreas.map(a => {
                const cnt = sheep.filter(s => s.areaId === a.id && s.status !== 'sold' && s.status !== 'dead').length
                return <option key={a.id} value={a.id}>{a.name} ({cnt}/{a.capacity})</option>
              })}
          </select>
        </div>

        <div className="flex justify-end gap-3 pt-1">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button
            onClick={handleMove}
            disabled={!targetAreaId || selectedSheepIds.length === 0}
          >
            Move {selectedSheepIds.length > 0 ? `${selectedSheepIds.length} sheep` : 'Sheep'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

function AreaCard({ area, onMove }) {
  const { sheep } = useFarm()
  const navigate = useNavigate()
  const currentSheep = sheep.filter(s => s.areaId === area.id && s.status !== 'sold' && s.status !== 'dead')
  const pct = Math.round((currentSheep.length / area.capacity) * 100)
  const isOvercrowded = pct >= 90

  const barColor = pct >= 90 ? 'bg-red-400' : pct >= 70 ? 'bg-amber-400' : 'bg-farm-500'

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
        {isOvercrowded && (
          <div className="flex items-center gap-1 text-xs text-red-600 bg-red-50 px-2 py-1 rounded-lg">
            <AlertTriangle size={12} /> Near capacity
          </div>
        )}
      </div>

      {/* Occupancy bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-stone-500 mb-1.5">
          <span>{currentSheep.length} sheep</span>
          <span>Capacity: {area.capacity}</span>
        </div>
        <div className="w-full h-2.5 bg-cream-200 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${barColor}`}
            style={{ width: `${Math.min(pct, 100)}%` }}
          />
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
        <Button
          variant="outline"
          size="sm"
          icon={<MoveRight size={14} />}
          onClick={() => onMove(area.id)}
          className="flex-1"
        >
          Move Sheep
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(`/sheep?area=${area.id}`)}
          className="flex-1"
        >
          View Sheep
        </Button>
      </div>
    </Card>
  )
}

export default function Areas() {
  const { areas, sheep } = useFarm()
  const [moveAreaId, setMoveAreaId] = useState(null)

  return (
    <div className="max-w-5xl mx-auto">
      <PageHeader
        title="Areas & Paddocks"
        subtitle="Manage your kennels, pens, camps, and grazing areas"
      />

      {/* Summary row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Total Areas', value: areas.length },
          { label: 'Pastures',    value: areas.filter(a => a.type === 'pasture').length },
          { label: 'Pens / Camps', value: areas.filter(a => a.type !== 'pasture').length },
          { label: 'Near Capacity', value: areas.filter(a => {
            const c = sheep.filter(s => s.areaId === a.id && s.status !== 'sold' && s.status !== 'dead').length
            return c / Math.max(a.capacity, 1) >= 0.9
          }).length },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl shadow-card p-4 text-center">
            <p className="text-2xl font-bold text-stone-900">{s.value}</p>
            <p className="text-xs text-stone-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {areas.map(area => (
          <AreaCard key={area.id} area={area} onMove={setMoveAreaId} />
        ))}
      </div>

      <MoveSheepModal
        open={!!moveAreaId}
        onClose={() => setMoveAreaId(null)}
        sourceAreaId={moveAreaId}
      />
    </div>
  )
}
