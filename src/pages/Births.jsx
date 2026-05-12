import { useState, useEffect } from 'react'
import { Plus, Baby, AlertCircle } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import { useFarm } from '../context/FarmContext'
import { formatDate } from '../data/mockData'
import Card, { CardHeader } from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import PageHeader from '../components/ui/PageHeader'
import EmptyState from '../components/ui/EmptyState'

function AddBirthModal({ open, onClose }) {
  const { sheep, areas, addBirth, addSheep } = useFarm()
  const ewes = sheep.filter(s => s.sex === 'ewe' && s.status !== 'sold' && s.status !== 'dead')
  const rams = sheep.filter(s => s.sex === 'ram' && s.status !== 'sold' && s.status !== 'dead')

  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    motherId: '',
    fatherId: '',
    lambCount: '1',
    stillborns: '0',
    type: 'single',
    notes: '',
    areaId: '',
  })

  function set(k, v) { setForm(f => ({ ...f, [k]: v })) }

  useEffect(() => {
    const n = parseInt(form.lambCount) || 0
    if (n === 1) set('type', 'single')
    else if (n === 2) set('type', 'twins')
    else if (n === 3) set('type', 'triplets')
    else if (n > 3) set('type', `${n} lambs`)
  }, [form.lambCount])

  function handleSubmit(e) {
    e.preventDefault()
    const lambCount = parseInt(form.lambCount) || 0
    const stillborns = parseInt(form.stillborns) || 0
    const liveCount = lambCount - stillborns

    // Create lamb records for live births
    const lambIds = []
    for (let i = 0; i < liveCount; i++) {
      const mother = ewes.find(s => s.id === form.motherId)
      const nextTag = `L-${String(Math.floor(Math.random() * 900) + 100)}`
      const newId = addSheep({
        tagNumber: nextTag,
        name: '',
        sex: 'lamb',
        breed: mother?.breed || 'Unknown',
        dateOfBirth: form.date,
        areaId: form.areaId || form.motherId && ewes.find(s => s.id === form.motherId)?.areaId || '',
        status: 'healthy',
        weight: 0,
        motherId: form.motherId,
        fatherId: form.fatherId,
        notes: '',
      })
      if (newId) lambIds.push(newId)
    }

    addBirth({
      date: form.date,
      motherId: form.motherId,
      fatherId: form.fatherId || null,
      lambCount,
      lambIds,
      type: form.type,
      stillborns,
      notes: form.notes,
    })

    // Update mother status if was pregnant
    onClose()
  }

  const field = 'w-full px-3 py-2.5 text-sm border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-farm-400 bg-white'
  const label = 'block text-sm font-medium text-stone-700 mb-1'

  return (
    <Modal open={open} onClose={onClose} title="Record a Birth" size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={label}>Birth Date *</label>
          <input required type="date" className={field} value={form.date} onChange={e => set('date', e.target.value)} />
        </div>

        <div>
          <label className={label}>Mother (Ewe) *</label>
          <select required className={field} value={form.motherId} onChange={e => set('motherId', e.target.value)}>
            <option value="">Select ewe…</option>
            {ewes.map(s => (
              <option key={s.id} value={s.id}>{s.tagNumber}{s.name ? ` — ${s.name}` : ''} ({s.breed})</option>
            ))}
          </select>
        </div>

        <div>
          <label className={label}>Father (Ram) — optional</label>
          <select className={field} value={form.fatherId} onChange={e => set('fatherId', e.target.value)}>
            <option value="">Unknown / not recorded</option>
            {rams.map(s => (
              <option key={s.id} value={s.id}>{s.tagNumber}{s.name ? ` — ${s.name}` : ''} ({s.breed})</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={label}>Number of Lambs Born *</label>
            <input
              required type="number" min="1" max="5"
              className={field} value={form.lambCount}
              onChange={e => set('lambCount', e.target.value)}
            />
          </div>
          <div>
            <label className={label}>Stillborns</label>
            <input
              type="number" min="0"
              className={field} value={form.stillborns}
              onChange={e => set('stillborns', e.target.value)}
            />
          </div>
        </div>

        {parseInt(form.stillborns) > 0 && (
          <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-700">
            <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
            <span>{form.stillborns} stillborn lamb{parseInt(form.stillborns) > 1 ? 's' : ''} — this will be noted in the birth record.</span>
          </div>
        )}

        <div>
          <label className={label}>Notes</label>
          <textarea rows={2} className={field} placeholder="Any observations or notes about this birth…" value={form.notes} onChange={e => set('notes', e.target.value)} />
        </div>

        <div className="bg-cream-50 border border-cream-200 rounded-xl px-4 py-3 text-sm text-stone-600">
          <strong>{parseInt(form.lambCount) - parseInt(form.stillborns) || 0}</strong> live lamb{(parseInt(form.lambCount) - parseInt(form.stillborns)) !== 1 ? 's' : ''} will be automatically added to your flock.
        </div>

        <div className="flex justify-end gap-3 pt-1">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit">Record Birth</Button>
        </div>
      </form>
    </Modal>
  )
}

export default function Births() {
  const { births, sheep } = useFarm()
  const [searchParams] = useSearchParams()
  const [addOpen, setAddOpen] = useState(false)

  useEffect(() => {
    if (searchParams.get('add') === 'true') setAddOpen(true)
  }, [searchParams])

  const sorted = [...births].sort((a, b) => new Date(b.date) - new Date(a.date))

  const totalLambs  = births.reduce((sum, b) => sum + b.lambCount, 0)
  const liveTotal   = births.reduce((sum, b) => sum + (b.lambCount - b.stillborns), 0)
  const stillTotal  = births.reduce((sum, b) => sum + b.stillborns, 0)
  const twinCount   = births.filter(b => b.type === 'twins').length

  return (
    <div className="max-w-5xl mx-auto">
      <PageHeader
        title="Birth Records"
        subtitle={`${births.length} births recorded`}
        action={<Button onClick={() => setAddOpen(true)} icon={<Plus size={16} />}>Record Birth</Button>}
      />

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Total Births', value: births.length },
          { label: 'Lambs Born',   value: totalLambs },
          { label: 'Stillborns',   value: stillTotal, color: stillTotal > 0 ? 'text-red-600' : 'text-stone-900' },
          { label: 'Twin Births',  value: twinCount },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl shadow-card p-4 text-center">
            <p className={`text-2xl font-bold ${s.color || 'text-stone-900'}`}>{s.value}</p>
            <p className="text-xs text-stone-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {sorted.length === 0 ? (
        <Card>
          <EmptyState
            icon={Baby}
            title="No birth records yet"
            description="Tap Record Birth to log the first birth on your farm."
            action={<Button onClick={() => setAddOpen(true)}>Record Birth</Button>}
          />
        </Card>
      ) : (
        <Card className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-cream-50 border-b border-cream-200">
                <tr className="text-xs text-stone-500 uppercase tracking-wide">
                  <th className="text-left px-5 py-3 font-semibold">Date</th>
                  <th className="text-left px-5 py-3 font-semibold">Mother</th>
                  <th className="text-left px-5 py-3 font-semibold">Father</th>
                  <th className="text-left px-5 py-3 font-semibold">Lambs</th>
                  <th className="text-left px-5 py-3 font-semibold">Type</th>
                  <th className="text-left px-5 py-3 font-semibold">Stillborns</th>
                  <th className="text-left px-5 py-3 font-semibold">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-100">
                {sorted.map(b => {
                  const mother = sheep.find(s => s.id === b.motherId)
                  const father = sheep.find(s => s.id === b.fatherId)
                  return (
                    <tr key={b.id} className="hover:bg-cream-50">
                      <td className="px-5 py-3 text-stone-700 whitespace-nowrap">{formatDate(b.date)}</td>
                      <td className="px-5 py-3 font-medium text-stone-900">
                        {mother ? `${mother.tagNumber}${mother.name ? ` — ${mother.name}` : ''}` : '—'}
                      </td>
                      <td className="px-5 py-3 text-stone-600">
                        {father ? father.tagNumber : <span className="text-stone-300">—</span>}
                      </td>
                      <td className="px-5 py-3 font-semibold text-stone-900">{b.lambCount}</td>
                      <td className="px-5 py-3">
                        <Badge variant={b.type === 'single' ? 'healthy' : 'mated'}>{b.type}</Badge>
                      </td>
                      <td className="px-5 py-3">
                        {b.stillborns > 0
                          ? <span className="text-red-600 font-semibold">{b.stillborns}</span>
                          : <span className="text-stone-300">0</span>}
                      </td>
                      <td className="px-5 py-3 text-stone-500 max-w-48 truncate">{b.notes || '—'}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <AddBirthModal open={addOpen} onClose={() => setAddOpen(false)} />
    </div>
  )
}
