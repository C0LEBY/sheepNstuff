import { useState } from 'react'
import { Plus, Heart, Calendar, CheckCircle } from 'lucide-react'
import { useFarm } from '../context/FarmContext'
import { formatDate } from '../data/mockData'
import Card, { CardHeader } from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import PageHeader from '../components/ui/PageHeader'
import EmptyState from '../components/ui/EmptyState'
import StatCard from '../components/ui/StatCard'

function AddBreedingModal({ open, onClose }) {
  const { sheep, addBreedingRecord, updateSheep } = useFarm()
  const ewes = sheep.filter(s => s.sex === 'ewe' && s.status !== 'sold' && s.status !== 'dead')
  const rams = sheep.filter(s => s.sex === 'ram' && s.status !== 'sold' && s.status !== 'dead')

  const [form, setForm] = useState({
    ewedId: '',
    ramId: '',
    matingDate: new Date().toISOString().split('T')[0],
    notes: '',
  })

  function set(k, v) { setForm(f => ({ ...f, [k]: v })) }

  function calcLambingDate(matingDate) {
    if (!matingDate) return ''
    const d = new Date(matingDate)
    d.setDate(d.getDate() + 150)
    return d.toISOString().split('T')[0]
  }

  function handleSubmit(e) {
    e.preventDefault()
    const expectedLambingDate = calcLambingDate(form.matingDate)
    addBreedingRecord({
      ewedId: form.ewedId,
      ramId: form.ramId,
      matingDate: form.matingDate,
      expectedLambingDate,
      status: 'mated',
      lambsProduced: 0,
      notes: form.notes,
    })
    // Mark ewe as pregnant
    updateSheep(form.ewedId, { status: 'pregnant' })
    onClose()
    setForm({ ewedId: '', ramId: '', matingDate: new Date().toISOString().split('T')[0], notes: '' })
  }

  const field = 'w-full px-3 py-2.5 text-sm border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-farm-400 bg-white'
  const label = 'block text-sm font-medium text-stone-700 mb-1'
  const lambingEst = calcLambingDate(form.matingDate)

  return (
    <Modal open={open} onClose={onClose} title="Record Mating" size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={label}>Ewe *</label>
          <select required className={field} value={form.ewedId} onChange={e => set('ewedId', e.target.value)}>
            <option value="">Select ewe…</option>
            {ewes.map(s => (
              <option key={s.id} value={s.id}>{s.tagNumber}{s.name ? ` — ${s.name}` : ''} ({s.breed})</option>
            ))}
          </select>
        </div>

        <div>
          <label className={label}>Ram *</label>
          <select required className={field} value={form.ramId} onChange={e => set('ramId', e.target.value)}>
            <option value="">Select ram…</option>
            {rams.map(s => (
              <option key={s.id} value={s.id}>{s.tagNumber}{s.name ? ` — ${s.name}` : ''} ({s.breed})</option>
            ))}
          </select>
        </div>

        <div>
          <label className={label}>Mating Date *</label>
          <input required type="date" className={field} value={form.matingDate} onChange={e => set('matingDate', e.target.value)} />
        </div>

        {lambingEst && (
          <div className="bg-purple-50 border border-purple-200 rounded-xl px-4 py-3 text-sm text-purple-700">
            <Calendar size={14} className="inline mr-1.5" />
            Estimated lambing date: <strong>{formatDate(lambingEst)}</strong> (~150 days)
          </div>
        )}

        <div>
          <label className={label}>Notes</label>
          <textarea rows={2} className={field} placeholder="Any observations…" value={form.notes} onChange={e => set('notes', e.target.value)} />
        </div>

        <div className="flex justify-end gap-3 pt-1">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit">Save Record</Button>
        </div>
      </form>
    </Modal>
  )
}

const STATUS_ORDER = { mated: 0, pregnant: 1, lambed: 2, failed: 3 }

export default function Breeding() {
  const { breedingRecords, sheep } = useFarm()
  const [addOpen, setAddOpen] = useState(false)
  const [filterStatus, setFilterStatus] = useState('All')

  const sorted = [...breedingRecords].sort((a, b) => new Date(b.matingDate) - new Date(a.matingDate))
  const filtered = filterStatus === 'All' ? sorted : sorted.filter(b => b.status === filterStatus)

  const pregnant = breedingRecords.filter(b => b.status === 'pregnant' || b.status === 'mated')
  const lambed   = breedingRecords.filter(b => b.status === 'lambed')
  const upcoming = breedingRecords.filter(b => {
    return (b.status === 'pregnant' || b.status === 'mated') &&
      new Date(b.expectedLambingDate) > new Date() &&
      new Date(b.expectedLambingDate) < new Date(Date.now() + 30 * 86400000)
  })

  return (
    <div className="max-w-5xl mx-auto">
      <PageHeader
        title="Breeding"
        subtitle="Track mating, pregnancies, and lambing"
        action={<Button onClick={() => setAddOpen(true)} icon={<Plus size={16} />}>Record Mating</Button>}
      />

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <StatCard label="Breeding Records" value={breedingRecords.length} icon={Heart}       color="green"  />
        <StatCard label="Currently Pregnant" value={pregnant.length}       icon={Heart}       color="purple" />
        <StatCard label="Lambed This Year"  value={lambed.length}          icon={CheckCircle} color="green"  />
        <StatCard label="Lambing Next 30d"  value={upcoming.length}        icon={Calendar}    color="amber"  />
      </div>

      {/* Upcoming lambing alert */}
      {upcoming.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 mb-5">
          <p className="text-sm font-semibold text-amber-800 mb-2">
            <Calendar size={15} className="inline mr-1.5" />
            Lambing expected in the next 30 days
          </p>
          <div className="space-y-1">
            {upcoming.map(b => {
              const ewe = sheep.find(s => s.id === b.ewedId)
              return (
                <p key={b.id} className="text-sm text-amber-700">
                  {ewe?.tagNumber}{ewe?.name ? ` — ${ewe.name}` : ''} · Expected {formatDate(b.expectedLambingDate)}
                  {b.notes && <span className="text-amber-600"> · {b.notes}</span>}
                </p>
              )
            })}
          </div>
        </div>
      )}

      {/* Filter */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {['All', 'mated', 'pregnant', 'lambed', 'failed'].map(s => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={[
              'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
              filterStatus === s ? 'bg-farm-600 text-white' : 'bg-white text-stone-600 hover:bg-cream-100 shadow-card',
            ].join(' ')}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
        <p className="text-sm text-stone-400 ml-auto self-center">{filtered.length} records</p>
      </div>

      {filtered.length === 0 ? (
        <Card>
          <EmptyState
            icon={Heart}
            title="No breeding records"
            description="Record a mating to start tracking pregnancies and lambing."
            action={<Button onClick={() => setAddOpen(true)}>Record Mating</Button>}
          />
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map(b => {
            const ewe = sheep.find(s => s.id === b.ewedId)
            const ram = sheep.find(s => s.id === b.ramId)
            const isLambingNear = b.status !== 'lambed' && b.status !== 'failed' &&
              new Date(b.expectedLambingDate) < new Date(Date.now() + 21 * 86400000)
            return (
              <Card key={b.id}>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 flex-shrink-0">
                      <Heart size={18} />
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold text-stone-900">
                          {ewe ? `${ewe.tagNumber}${ewe.name ? ` — ${ewe.name}` : ''}` : '—'}
                        </p>
                        <span className="text-stone-400 text-sm">×</span>
                        <p className="text-stone-700">
                          {ram ? `${ram.tagNumber}${ram.name ? ` — ${ram.name}` : ''}` : '—'}
                        </p>
                        <Badge variant={b.status}>{b.status}</Badge>
                        {isLambingNear && <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">Lambing soon!</span>}
                      </div>
                      <div className="flex flex-wrap gap-4 mt-1 text-xs text-stone-500">
                        <span>Mated: {formatDate(b.matingDate)}</span>
                        <span>Expected: {formatDate(b.expectedLambingDate)}</span>
                        {b.lambsProduced > 0 && <span className="text-farm-700 font-medium">{b.lambsProduced} lambs born</span>}
                      </div>
                      {b.notes && <p className="text-xs text-stone-400 mt-0.5">{b.notes}</p>}
                    </div>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}

      <AddBreedingModal open={addOpen} onClose={() => setAddOpen(false)} />
    </div>
  )
}
