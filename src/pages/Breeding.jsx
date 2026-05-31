import { useState } from 'react'
import { Plus, Heart, Calendar, CheckCircle, Microscope } from 'lucide-react'
import { useFarm } from '../context/FarmContext'
import { formatDate } from '../lib/utils'
import Card, { CardHeader } from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import PageHeader from '../components/ui/PageHeader'
import EmptyState from '../components/ui/EmptyState'
import StatCard from '../components/ui/StatCard'

/* ── Add Breeding Modal ──────────────────────────────────────────── */
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

/* ── Add Pregnancy Scan Modal ────────────────────────────────────── */
function AddScanModal({ open, onClose }) {
  const { groups, areas, addPregnancyScan } = useFarm()

  const [form, setForm] = useState({
    scanDate:    new Date().toISOString().split('T')[0],
    groupId:     '',
    areaId:      '',
    ewesScanned: '',
    singles:     '',
    twins:       '',
    triplets:    '',
    dry:         '',
    notes:       '',
  })

  function set(k, v) { setForm(f => ({ ...f, [k]: v })) }

  const scanned  = parseInt(form.ewesScanned) || 0
  const dryCount = parseInt(form.dry)         || 0
  const pregnancyRate = scanned > 0 ? Math.round(((scanned - dryCount) / scanned) * 100) : null

  function handleSubmit(e) {
    e.preventDefault()
    addPregnancyScan({
      scanDate:    form.scanDate,
      groupId:     form.groupId  || null,
      areaId:      form.areaId   || null,
      ewesScanned: parseInt(form.ewesScanned) || 0,
      singles:     parseInt(form.singles)     || 0,
      twins:       parseInt(form.twins)       || 0,
      triplets:    parseInt(form.triplets)    || 0,
      dry:         parseInt(form.dry)         || 0,
      notes:       form.notes || null,
    })
    setForm({ scanDate: new Date().toISOString().split('T')[0], groupId: '', areaId: '', ewesScanned: '', singles: '', twins: '', triplets: '', dry: '', notes: '' })
    onClose()
  }

  const field = 'w-full px-3 py-2.5 text-sm border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-farm-400 bg-white'
  const label = 'block text-sm font-medium text-stone-700 mb-1'

  return (
    <Modal open={open} onClose={onClose} title="Record Pregnancy Scan" size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={label}>Scan Date *</label>
          <input required type="date" className={field} value={form.scanDate} onChange={e => set('scanDate', e.target.value)} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={label}>Group (optional)</label>
            <select className={field} value={form.groupId} onChange={e => set('groupId', e.target.value)}>
              <option value="">No group</option>
              {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
            </select>
          </div>
          <div>
            <label className={label}>Area (optional)</label>
            <select className={field} value={form.areaId} onChange={e => set('areaId', e.target.value)}>
              <option value="">No area</option>
              {areas.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className={label}>Ewes Scanned *</label>
          <input required type="number" min="0" className={field} placeholder="Total ewes scanned" value={form.ewesScanned} onChange={e => set('ewesScanned', e.target.value)} />
        </div>

        <div>
          <label className={label + ' mb-2'}>Breakdown</label>
          <div className="grid grid-cols-4 gap-2">
            {[
              { key: 'singles',  label: 'Singles',  color: 'text-green-700' },
              { key: 'twins',    label: 'Twins',    color: 'text-blue-700'  },
              { key: 'triplets', label: 'Triplets', color: 'text-purple-700'},
              { key: 'dry',      label: 'Dry',      color: 'text-stone-500' },
            ].map(({ key, label: lbl, color }) => (
              <div key={key} className="text-center">
                <p className={`text-xs font-semibold mb-1 ${color}`}>{lbl}</p>
                <input
                  type="number" min="0"
                  className="w-full px-2 py-2 text-sm text-center border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-farm-400 bg-white"
                  value={form[key]}
                  onChange={e => set(key, e.target.value)}
                  placeholder="0"
                />
              </div>
            ))}
          </div>
        </div>

        {pregnancyRate !== null && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-sm text-blue-700">
            Pregnancy rate: <strong>{pregnancyRate}%</strong>
            {' '}({scanned - dryCount} of {scanned} ewes in lamb)
          </div>
        )}

        <div>
          <label className={label}>Notes</label>
          <textarea rows={2} className={field} placeholder="Any observations…" value={form.notes} onChange={e => set('notes', e.target.value)} />
        </div>

        <div className="flex justify-end gap-3 pt-1">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit">Save Scan</Button>
        </div>
      </form>
    </Modal>
  )
}

/* ── Scan card ───────────────────────────────────────────────────── */
function ScanCard({ scan, groups, areas }) {
  const group = groups.find(g => g.id === scan.groupId)
  const area  = areas.find(a => a.id === scan.areaId)
  const pregnancyRate = scan.ewesScanned > 0
    ? Math.round(((scan.ewesScanned - scan.dry) / scan.ewesScanned) * 100)
    : null

  const pills = [
    { label: 'Singles',  value: scan.singles,  bg: 'bg-green-100',  text: 'text-green-700'  },
    { label: 'Twins',    value: scan.twins,    bg: 'bg-blue-100',   text: 'text-blue-700'   },
    { label: 'Triplets', value: scan.triplets, bg: 'bg-purple-100', text: 'text-purple-700' },
    { label: 'Dry',      value: scan.dry,      bg: 'bg-stone-100',  text: 'text-stone-500'  },
  ].filter(p => p.value > 0)

  return (
    <Card className="hover:shadow-card-hover transition-shadow">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
          <Microscope size={18} className="text-blue-500" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <p className="font-semibold text-stone-900 text-sm">{formatDate(scan.scanDate)}</p>
            {group && <span className="text-xs bg-farm-100 text-farm-700 px-2 py-0.5 rounded-full">{group.name}</span>}
            {area  && <span className="text-xs bg-cream-200 text-stone-600 px-2 py-0.5 rounded-full">{area.name}</span>}
            {pregnancyRate !== null && (
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${pregnancyRate >= 90 ? 'bg-green-100 text-green-700' : pregnancyRate >= 75 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-600'}`}>
                {pregnancyRate}% pregnant
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-stone-500 mb-2">
            <span>{scan.ewesScanned} ewes scanned</span>
          </div>
          {pills.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {pills.map(p => (
                <span key={p.label} className={`text-xs font-medium px-2 py-0.5 rounded-full ${p.bg} ${p.text}`}>
                  {p.value} {p.label}
                </span>
              ))}
            </div>
          )}
          {scan.notes && <p className="text-xs text-stone-400 mt-1.5">{scan.notes}</p>}
        </div>
      </div>
    </Card>
  )
}

/* ── Main page ───────────────────────────────────────────────────── */
const STATUS_ORDER = { mated: 0, pregnant: 1, lambed: 2, failed: 3 }

export default function Breeding() {
  const { breedingRecords, sheep, pregnancyScans, groups, areas } = useFarm()
  const [view, setView]           = useState('matings') // 'matings' | 'scans'
  const [addOpen, setAddOpen]     = useState(false)
  const [scanOpen, setScanOpen]   = useState(false)
  const [filterStatus, setFilterStatus] = useState('All')

  const sorted   = [...breedingRecords].sort((a, b) => new Date(b.matingDate) - new Date(a.matingDate))
  const filtered = filterStatus === 'All' ? sorted : sorted.filter(b => b.status === filterStatus)

  const pregnant = breedingRecords.filter(b => b.status === 'pregnant' || b.status === 'mated')
  const lambed   = breedingRecords.filter(b => b.status === 'lambed')
  const upcoming = breedingRecords.filter(b => {
    return (b.status === 'pregnant' || b.status === 'mated') &&
      new Date(b.expectedLambingDate) > new Date() &&
      new Date(b.expectedLambingDate) < new Date(Date.now() + 30 * 86400000)
  })

  const sortedScans = [...pregnancyScans].sort((a, b) => new Date(b.scanDate) - new Date(a.scanDate))

  return (
    <div className="max-w-5xl mx-auto">
      <PageHeader
        title="Breeding"
        subtitle="Track mating, pregnancies, and lambing"
        action={
          <div className="flex gap-2">
            {view === 'scans' ? (
              <Button onClick={() => setScanOpen(true)} icon={<Plus size={16} />}>Record Scan</Button>
            ) : (
              <Button onClick={() => setAddOpen(true)} icon={<Plus size={16} />}>Record Mating</Button>
            )}
          </div>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        <StatCard label="Breeding Records"  value={breedingRecords.length} icon={Heart}       color="green"  />
        <StatCard label="Currently Pregnant" value={pregnant.length}       icon={Heart}       color="purple" />
        <StatCard label="Lambed This Year"   value={lambed.length}          icon={CheckCircle} color="green"  />
        <StatCard label="Pregnancy Scans"    value={pregnancyScans.length}  icon={Microscope}  color="blue"   />
      </div>

      {/* View toggle */}
      <div className="flex rounded-xl border border-cream-300 overflow-hidden mb-5 w-fit">
        <button
          onClick={() => setView('matings')}
          className={`px-5 py-2 text-sm font-medium transition-colors ${view === 'matings' ? 'bg-farm-600 text-white' : 'bg-white text-stone-600 hover:bg-cream-50'}`}
        >
          Matings
        </button>
        <button
          onClick={() => setView('scans')}
          className={`px-5 py-2 text-sm font-medium transition-colors ${view === 'scans' ? 'bg-farm-600 text-white' : 'bg-white text-stone-600 hover:bg-cream-50'}`}
        >
          Pregnancy Scans {pregnancyScans.length > 0 && <span className="ml-1 text-xs opacity-70">({pregnancyScans.length})</span>}
        </button>
      </div>

      {/* ── Matings view ── */}
      {view === 'matings' && (
        <>
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
        </>
      )}

      {/* ── Scans view ── */}
      {view === 'scans' && (
        <>
          {sortedScans.length === 0 ? (
            <Card>
              <EmptyState
                icon={Microscope}
                title="No pregnancy scans"
                description="Record scan results to track pregnancy rates per group."
                action={<Button onClick={() => setScanOpen(true)}>Record Scan</Button>}
              />
            </Card>
          ) : (
            <div className="space-y-3">
              {sortedScans.map(scan => (
                <ScanCard key={scan.id} scan={scan} groups={groups} areas={areas} />
              ))}
            </div>
          )}
        </>
      )}

      <AddBreedingModal open={addOpen}  onClose={() => setAddOpen(false)} />
      <AddScanModal     open={scanOpen} onClose={() => setScanOpen(false)} />
    </div>
  )
}
