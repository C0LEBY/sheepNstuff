import { useState, useEffect } from 'react'
import { Plus, HeartPulse, AlertCircle, Calendar } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import { useFarm } from '../context/FarmContext'
import { formatDate } from '../data/mockData'
import Card, { CardHeader } from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import PageHeader from '../components/ui/PageHeader'
import EmptyState from '../components/ui/EmptyState'

const TYPES = ['vaccination', 'deworming', 'treatment', 'injury', 'illness', 'checkup', 'vet_visit']

function AddTreatmentModal({ open, onClose }) {
  const { sheep, addHealthRecord } = useFarm()
  const activeSheep = sheep.filter(s => s.status !== 'sold' && s.status !== 'dead')

  const [isBatch, setIsBatch] = useState(false)
  const [form, setForm] = useState({
    sheepId: '',
    batchIds: [],
    date: new Date().toISOString().split('T')[0],
    type: 'vaccination',
    treatment: '',
    notes: '',
    followUpDate: '',
    vet: '',
  })

  function set(k, v) { setForm(f => ({ ...f, [k]: v })) }

  function toggleBatch(id) {
    setForm(f => ({
      ...f,
      batchIds: f.batchIds.includes(id) ? f.batchIds.filter(x => x !== id) : [...f.batchIds, id],
    }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    const ids = isBatch ? form.batchIds : [form.sheepId]
    ids.forEach(id => {
      addHealthRecord({
        sheepId: id,
        date: form.date,
        type: form.type,
        treatment: form.treatment,
        notes: form.notes,
        followUpDate: form.followUpDate || null,
        vet: form.vet,
      })
    })
    onClose()
  }

  const field = 'w-full px-3 py-2.5 text-sm border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-farm-400 bg-white'
  const label = 'block text-sm font-medium text-stone-700 mb-1'

  return (
    <Modal open={open} onClose={onClose} title="Record Treatment" size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Single vs batch toggle */}
        <div className="flex rounded-xl border border-cream-300 overflow-hidden">
          <button
            type="button"
            onClick={() => setIsBatch(false)}
            className={`flex-1 py-2 text-sm font-medium transition-colors ${!isBatch ? 'bg-farm-600 text-white' : 'bg-white text-stone-600 hover:bg-cream-50'}`}
          >
            Single Sheep
          </button>
          <button
            type="button"
            onClick={() => setIsBatch(true)}
            className={`flex-1 py-2 text-sm font-medium transition-colors ${isBatch ? 'bg-farm-600 text-white' : 'bg-white text-stone-600 hover:bg-cream-50'}`}
          >
            Batch (Multiple)
          </button>
        </div>

        {isBatch ? (
          <div>
            <label className={label}>Select Sheep ({form.batchIds.length} selected)</label>
            <div className="border border-cream-200 rounded-xl overflow-hidden max-h-48 overflow-y-auto">
              {activeSheep.map(s => (
                <label key={s.id} className="flex items-center gap-3 px-4 py-2 hover:bg-cream-50 cursor-pointer border-b border-cream-100 last:border-0">
                  <input type="checkbox" checked={form.batchIds.includes(s.id)} onChange={() => toggleBatch(s.id)} className="accent-farm-600 w-4 h-4" />
                  <span className="text-sm font-medium text-stone-800">{s.tagNumber}</span>
                  {s.name && <span className="text-sm text-stone-500">— {s.name}</span>}
                  <Badge variant={s.sex} className="ml-auto text-xs">{s.sex}</Badge>
                </label>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <label className={label}>Sheep *</label>
            <select required className={field} value={form.sheepId} onChange={e => set('sheepId', e.target.value)}>
              <option value="">Select sheep…</option>
              {activeSheep.map(s => (
                <option key={s.id} value={s.id}>{s.tagNumber}{s.name ? ` — ${s.name}` : ''}</option>
              ))}
            </select>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={label}>Date *</label>
            <input required type="date" className={field} value={form.date} onChange={e => set('date', e.target.value)} />
          </div>
          <div>
            <label className={label}>Type *</label>
            <select required className={field} value={form.type} onChange={e => set('type', e.target.value)}>
              {TYPES.map(t => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className={label}>Treatment / Medication *</label>
          <input required className={field} placeholder="e.g. Pulpy Kidney vaccine, Levamisole drench…" value={form.treatment} onChange={e => set('treatment', e.target.value)} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={label}>Follow-up Date</label>
            <input type="date" className={field} value={form.followUpDate} onChange={e => set('followUpDate', e.target.value)} />
          </div>
          <div>
            <label className={label}>Vet Name</label>
            <input className={field} placeholder="Optional" value={form.vet} onChange={e => set('vet', e.target.value)} />
          </div>
        </div>

        <div>
          <label className={label}>Notes</label>
          <textarea rows={2} className={field} placeholder="Observations, dosage, outcome…" value={form.notes} onChange={e => set('notes', e.target.value)} />
        </div>

        <div className="flex justify-end gap-3 pt-1">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit">Save Treatment</Button>
        </div>
      </form>
    </Modal>
  )
}

export default function Health() {
  const { healthRecords, sheep } = useFarm()
  const [searchParams] = useSearchParams()
  const [addOpen, setAddOpen] = useState(false)
  const [filterType, setFilterType] = useState('All')

  useEffect(() => {
    if (searchParams.get('add') === 'true') setAddOpen(true)
  }, [searchParams])

  const sorted = [...healthRecords].sort((a, b) => new Date(b.date) - new Date(a.date))
  const filtered = filterType === 'All' ? sorted : sorted.filter(h => h.type === filterType)

  const upcoming = sorted.filter(h => h.followUpDate && new Date(h.followUpDate) > new Date() && new Date(h.followUpDate) < new Date(Date.now() + 14 * 86400000))
  const overdue  = sorted.filter(h => h.followUpDate && new Date(h.followUpDate) < new Date())

  const select = 'text-sm border border-cream-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-farm-400'

  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader
        title="Health & Treatments"
        subtitle={`${healthRecords.length} records`}
        action={<Button onClick={() => setAddOpen(true)} icon={<Plus size={16} />}>Record Treatment</Button>}
      />

      {/* Alert: overdue follow-ups */}
      {overdue.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-2xl px-5 py-4 flex items-start gap-3 mb-5">
          <AlertCircle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-red-800">{overdue.length} overdue follow-up{overdue.length > 1 ? 's' : ''}</p>
            <p className="text-sm text-red-600">{overdue.map(h => {
              const s = sheep.find(x => x.id === h.sheepId)
              return s ? s.tagNumber : '—'
            }).join(', ')}</p>
          </div>
        </div>
      )}

      {/* Upcoming follow-ups */}
      {upcoming.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 flex items-start gap-3 mb-5">
          <Calendar size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-800">Upcoming follow-ups (next 14 days)</p>
            <div className="space-y-0.5 mt-1">
              {upcoming.map(h => {
                const s = sheep.find(x => x.id === h.sheepId)
                return (
                  <p key={h.id} className="text-sm text-amber-700">
                    {s?.tagNumber || '—'} — {h.treatment} · {formatDate(h.followUpDate)}
                  </p>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Filter */}
      <Card className="mb-5">
        <div className="flex flex-wrap gap-3 items-center">
          <p className="text-sm font-medium text-stone-600">Filter by type:</p>
          <select className={select} value={filterType} onChange={e => setFilterType(e.target.value)}>
            <option value="All">All types</option>
            {TYPES.map(t => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
          </select>
          <p className="text-sm text-stone-400 ml-auto">{filtered.length} records</p>
        </div>
      </Card>

      {filtered.length === 0 ? (
        <Card>
          <EmptyState
            icon={HeartPulse}
            title="No health records"
            description="Record vaccinations, treatments, and vet visits here."
            action={<Button onClick={() => setAddOpen(true)}>Record Treatment</Button>}
          />
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map(h => {
            const s = sheep.find(x => x.id === h.sheepId)
            const isFollowUpOverdue = h.followUpDate && new Date(h.followUpDate) < new Date()
            return (
              <Card key={h.id} className="hover:shadow-card-hover transition-shadow">
                <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-10 h-10 bg-farm-100 rounded-xl flex items-center justify-center text-farm-700 font-bold text-xs flex-shrink-0">
                      {s?.tagNumber?.slice(0, 4) || '?'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold text-stone-900">
                          {s ? `${s.tagNumber}${s.name ? ` — ${s.name}` : ''}` : 'Unknown sheep'}
                        </p>
                        <Badge variant={h.type}>{h.type.replace('_', ' ')}</Badge>
                      </div>
                      <p className="text-sm text-stone-700 mt-0.5">{h.treatment}</p>
                      {h.notes && <p className="text-sm text-stone-500 mt-0.5">{h.notes}</p>}
                      <div className="flex flex-wrap gap-3 mt-1.5 text-xs text-stone-400">
                        <span>{formatDate(h.date)}</span>
                        {h.vet && <span>· {h.vet}</span>}
                        {h.followUpDate && (
                          <span className={isFollowUpOverdue ? 'text-red-500 font-medium' : 'text-amber-500'}>
                            {isFollowUpOverdue ? '⚠ Overdue follow-up: ' : '↻ Follow-up: '}{formatDate(h.followUpDate)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}

      <AddTreatmentModal open={addOpen} onClose={() => setAddOpen(false)} />
    </div>
  )
}
