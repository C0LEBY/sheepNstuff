import { useState } from 'react'
import { Plus, Wheat, Users } from 'lucide-react'
import { useFarm } from '../context/FarmContext'
import { formatDate } from '../lib/utils'
import Card, { CardHeader } from '../components/ui/Card'
import PageHeader from '../components/ui/PageHeader'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import EmptyState from '../components/ui/EmptyState'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend,
} from 'recharts'

const COLORS = ['#56CA00', '#84BFA2', '#D97706', '#9333ea', '#3b82f6', '#ef4444']
const MONTH_LABELS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

const SUPPLEMENT_LABELS = {
  feedlot_pellets:  'Feedlot Pellets',
  lactation_pills:  'Lactation Supplement',
  hay:              'Hay',
  grain:            'Grain',
  mineral_lick:     'Mineral Lick',
  other:            'Other',
}
const SUPPLEMENT_TYPES = Object.keys(SUPPLEMENT_LABELS)

const CAUSE_LABELS = {
  disease:             'Disease',
  predators:           'Predators',
  theft:               'Theft',
  birth_complications: 'Birth Complications',
  old_age:             'Old Age',
  injury:              'Injury',
  unknown:             'Unknown',
}

/* ── Shared tooltip ──────────────────────────────────────────────── */
function CustomTooltip({ active, payload, label }) {
  if (active && payload?.length) {
    return (
      <div className="bg-white border border-cream-200 rounded-xl px-3 py-2 shadow-card text-sm">
        <p className="font-medium text-stone-700">{label}</p>
        {payload.map(p => (
          <p key={p.name} style={{ color: p.color }}>{p.name}: {p.value}</p>
        ))}
      </div>
    )
  }
  return null
}

/* ── Add Feed Record Modal ───────────────────────────────────────── */
function AddFeedModal({ open, onClose }) {
  const { areas, addFeedRecord } = useFarm()
  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    areaId: '',
    supplementType: 'feedlot_pellets',
    quantityKg: '',
    notes: '',
  })
  function set(k, v) { setForm(f => ({ ...f, [k]: v })) }

  async function handleSubmit(e) {
    e.preventDefault()
    await addFeedRecord({
      date: form.date,
      areaId: form.areaId || null,
      supplementType: form.supplementType,
      quantityKg: form.quantityKg ? parseFloat(form.quantityKg) : null,
      notes: form.notes || null,
    })
    setForm({ date: new Date().toISOString().split('T')[0], areaId: '', supplementType: 'feedlot_pellets', quantityKg: '', notes: '' })
    onClose()
  }

  const field = 'w-full px-3 py-2.5 text-sm border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-farm-400 bg-white'
  const label = 'block text-sm font-medium text-stone-700 mb-1'

  return (
    <Modal open={open} onClose={onClose} title="Add Feed Record" size="sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={label}>Date *</label>
          <input required type="date" className={field} value={form.date} onChange={e => set('date', e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={label}>Supplement Type</label>
            <select className={field} value={form.supplementType} onChange={e => set('supplementType', e.target.value)}>
              {SUPPLEMENT_TYPES.map(t => <option key={t} value={t}>{SUPPLEMENT_LABELS[t]}</option>)}
            </select>
          </div>
          <div>
            <label className={label}>Quantity (kg)</label>
            <input type="number" step="0.1" min="0" className={field} placeholder="e.g. 500" value={form.quantityKg} onChange={e => set('quantityKg', e.target.value)} />
          </div>
        </div>
        <div>
          <label className={label}>Area (optional)</label>
          <select className={field} value={form.areaId} onChange={e => set('areaId', e.target.value)}>
            <option value="">No specific area</option>
            {areas.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
        </div>
        <div>
          <label className={label}>Notes</label>
          <textarea rows={2} className={field} placeholder="Optional notes…" value={form.notes} onChange={e => set('notes', e.target.value)} />
        </div>
        <div className="flex justify-end gap-3 pt-1">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit">Save Record</Button>
        </div>
      </form>
    </Modal>
  )
}

/* ── Add Staff Allotment Modal ───────────────────────────────────── */
function AddAllotmentModal({ open, onClose }) {
  const { addStaffAllotment } = useFarm()
  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    staffName: '',
    kgAllocated: '',
    eventName: '',
    notes: '',
  })
  function set(k, v) { setForm(f => ({ ...f, [k]: v })) }

  async function handleSubmit(e) {
    e.preventDefault()
    await addStaffAllotment({
      date: form.date,
      staffName: form.staffName,
      kgAllocated: form.kgAllocated ? parseFloat(form.kgAllocated) : null,
      eventName: form.eventName || null,
      notes: form.notes || null,
    })
    setForm({ date: new Date().toISOString().split('T')[0], staffName: '', kgAllocated: '', eventName: '', notes: '' })
    onClose()
  }

  const field = 'w-full px-3 py-2.5 text-sm border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-farm-400 bg-white'
  const label = 'block text-sm font-medium text-stone-700 mb-1'

  return (
    <Modal open={open} onClose={onClose} title="Record Staff Allotment" size="sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={label}>Date *</label>
          <input required type="date" className={field} value={form.date} onChange={e => set('date', e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={label}>Staff Name *</label>
            <input required className={field} placeholder="e.g. Johan" value={form.staffName} onChange={e => set('staffName', e.target.value)} />
          </div>
          <div>
            <label className={label}>Kg Allocated</label>
            <input type="number" step="0.1" min="0" className={field} placeholder="e.g. 12.5" value={form.kgAllocated} onChange={e => set('kgAllocated', e.target.value)} />
          </div>
        </div>
        <div>
          <label className={label}>Event (optional)</label>
          <input className={field} placeholder="e.g. Nov 2025 Slaughter" value={form.eventName} onChange={e => set('eventName', e.target.value)} />
        </div>
        <div>
          <label className={label}>Notes</label>
          <textarea rows={2} className={field} placeholder="Optional notes…" value={form.notes} onChange={e => set('notes', e.target.value)} />
        </div>
        <div className="flex justify-end gap-3 pt-1">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit">Save Allotment</Button>
        </div>
      </form>
    </Modal>
  )
}

/* ── Main Reports page ───────────────────────────────────────────── */
export default function Reports() {
  const {
    sheep, areas, births, deaths, transactions, healthRecords, breedingRecords,
    groups, pregnancyScans, feedlotEntries, feedRecords, staffAllotments,
  } = useFarm()

  const [tab, setTab]             = useState('overview')
  const [feedOpen, setFeedOpen]   = useState(false)
  const [allotOpen, setAllotOpen] = useState(false)

  /* ── Overview computations ─────────────────────────────────── */
  const activeSheep  = sheep.filter(s => s.status !== 'sold' && s.status !== 'dead')
  const sales        = transactions.filter(t => t.type === 'sale')
  const purchases    = transactions.filter(t => t.type === 'purchase')
  const totalRev     = sales.reduce((s, t) => s + (t.totalAmount || 0), 0)
  const totalCost    = purchases.reduce((s, t) => s + (t.totalAmount || 0), 0)

  const bySex = ['ewe','ram','lamb','wether'].map(sex => ({
    name: sex.charAt(0).toUpperCase() + sex.slice(1),
    value: activeSheep.filter(s => s.sex === sex).length,
  })).filter(d => d.value > 0)

  const breedMap = {}
  activeSheep.forEach(s => { breedMap[s.breed] = (breedMap[s.breed] || 0) + 1 })
  const byBreed = Object.entries(breedMap).map(([name, value]) => ({ name, value }))

  const areaOccupancy = areas.map(a => {
    const count = sheep.filter(s => s.areaId === a.id && s.status !== 'sold' && s.status !== 'dead').length
    return { name: a.name.replace(/ (Paddock|Pen|Camp)$/,''), sheep: count, capacity: a.capacity }
  })

  const healthMap = {}
  healthRecords.forEach(h => { healthMap[h.type] = (healthMap[h.type] || 0) + 1 })
  const byHealth = Object.entries(healthMap).map(([name, value]) => ({ name: name.replace('_', ' '), value }))

  const breedSuccessRate = breedingRecords.length > 0
    ? Math.round((breedingRecords.filter(b => b.status === 'lambed').length / breedingRecords.length) * 100)
    : 0

  const today = new Date()
  const monthlyStats = MONTH_LABELS.map((month, i) => ({
    month,
    births:    births.filter(b => new Date(b.birthDate || b.date).getMonth() === i).length,
    deaths:    deaths.filter(d => new Date(d.date).getMonth() === i).length,
    sales:     transactions.filter(t => t.type === 'sale'     && new Date(t.date).getMonth() === i).length,
    purchases: transactions.filter(t => t.type === 'purchase' && new Date(t.date).getMonth() === i).length,
  })).filter((_, i) => ((today.getMonth() - i + 12) % 12) < 10)
    .sort((a, b) => {
      const ai = MONTH_LABELS.indexOf(a.month), bi = MONTH_LABELS.indexOf(b.month)
      const nowM = today.getMonth()
      return ((ai - nowM + 12 - 9) % 12) - ((bi - nowM + 12 - 9) % 12)
    })

  // Deaths by cause for overview chart
  const causeMap = {}
  deaths.forEach(d => { const k = d.cause || 'unknown'; causeMap[k] = (causeMap[k] || 0) + 1 })
  const byCause = Object.entries(causeMap).map(([name, value]) => ({ name: CAUSE_LABELS[name] || name, value }))

  // Slaughter R/kg trend
  const slaughterSales = sales
    .filter(t => t.pricePerKg)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .map(t => ({ date: formatDate(t.date), rkg: t.pricePerKg }))

  /* ── Lambing computations ──────────────────────────────────── */
  const lambingRows = groups.map(g => {
    const groupSheepIds = sheep.filter(s => s.groupId === g.id).map(s => s.id)
    const latestScan = pregnancyScans
      .filter(s => s.groupId === g.id)
      .sort((a, b) => new Date(b.scanDate) - new Date(a.scanDate))[0]
    const pregnancyRate = latestScan && latestScan.ewesScanned > 0
      ? Math.round(((latestScan.ewesScanned - latestScan.dry) / latestScan.ewesScanned) * 100)
      : null
    const groupDeaths = deaths.filter(d => groupSheepIds.includes(d.sheepId))
    const deathsByCause = {}
    groupDeaths.forEach(d => { const k = d.cause || 'unknown'; deathsByCause[k] = (deathsByCause[k] || 0) + 1 })
    const feedlotCount = feedlotEntries
      .filter(e => e.groupId === g.id)
      .reduce((s, e) => s + (e.sheepCount || 0), 0)
    const weaningWeights = sheep
      .filter(s => s.groupId === g.id && s.weaningWeightKg)
      .map(s => s.weaningWeightKg)
    const avgWeaning = weaningWeights.length > 0
      ? (weaningWeights.reduce((a, b) => a + b, 0) / weaningWeights.length).toFixed(1)
      : null
    const lambsBorn = births
      .filter(b => groupSheepIds.includes(b.motherId))
      .reduce((s, b) => s + b.lambCount, 0)
    const lambingRate = latestScan && latestScan.ewesScanned > 0 && lambsBorn > 0
      ? Math.round((lambsBorn / latestScan.ewesScanned) * 100)
      : null

    return { g, latestScan, pregnancyRate, groupDeaths, deathsByCause, feedlotCount, avgWeaning, lambsBorn, lambingRate, sheepCount: groupSheepIds.length }
  })

  /* ── Feed / Operations computations ───────────────────────── */
  // Monthly feed summary grouped by YYYY-MM × supplement type
  const feedByMonth = {}
  feedRecords.forEach(r => {
    const month = r.date ? r.date.slice(0, 7) : 'unknown'
    if (!feedByMonth[month]) feedByMonth[month] = {}
    feedByMonth[month][r.supplementType] = (feedByMonth[month][r.supplementType] || 0) + (r.quantityKg || 0)
  })
  const feedMonths = Object.keys(feedByMonth).sort().reverse()

  // Staff allotments grouped by event
  const allotByEvent = {}
  staffAllotments.forEach(a => {
    const key = a.eventName || 'Unspecified'
    if (!allotByEvent[key]) allotByEvent[key] = { total: 0, entries: [] }
    allotByEvent[key].total += a.kgAllocated || 0
    allotByEvent[key].entries.push(a)
  })

  const TAB_BTN = (id, label) => (
    <button
      key={id}
      onClick={() => setTab(id)}
      className={`px-5 py-2 text-sm font-medium transition-colors ${tab === id ? 'bg-farm-600 text-white' : 'bg-white text-stone-600 hover:bg-cream-50'}`}
    >
      {label}
    </button>
  )

  return (
    <div className="max-w-6xl mx-auto">
      <PageHeader title="Reports" subtitle="Farm performance overview" />

      {/* Tab toggle */}
      <div className="flex rounded-xl border border-cream-300 overflow-hidden mb-6 w-fit">
        {TAB_BTN('overview',   'Overview')}
        {TAB_BTN('lambing',    'Lambing')}
        {TAB_BTN('operations', 'Operations')}
      </div>

      {/* ══════════════════════════════════════════════════════════
          OVERVIEW TAB
      ══════════════════════════════════════════════════════════ */}
      {tab === 'overview' && (
        <>
          {/* Summary stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {[
              { label: 'Active Sheep',     value: activeSheep.length },
              { label: 'Births Recorded',  value: births.reduce((s, b) => s + b.lambCount, 0) },
              { label: 'Breeding Success', value: `${breedSuccessRate}%` },
              { label: 'Net Profit',       value: `R ${((totalRev - totalCost) / 1000).toFixed(1)}k` },
            ].map(s => (
              <div key={s.label} className="bg-white rounded-2xl shadow-card p-4 text-center">
                <p className="text-2xl font-bold text-stone-900">{s.value}</p>
                <p className="text-xs text-stone-500 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Monthly births & deaths */}
            <Card>
              <CardHeader title="Births & Deaths per Month" subtitle="Year to date" />
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={monthlyStats} barCategoryGap="25%">
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#969696' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#969696' }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="births" name="Births" radius={[4,4,0,0]} fill="#56CA00" />
                  <Bar dataKey="deaths" name="Deaths" radius={[4,4,0,0]} fill="#FF4C51" />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {/* Flock by sex */}
            <Card>
              <CardHeader title="Flock Breakdown by Sex" />
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={bySex} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`} labelLine={false}>
                    {bySex.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #E8E8E8', fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-3 justify-center">
                {bySex.map((d, i) => (
                  <span key={d.name} className="flex items-center gap-1.5 text-xs text-stone-600">
                    <span className="w-3 h-3 rounded-full inline-block" style={{ background: COLORS[i % COLORS.length] }} />
                    {d.name}: <strong>{d.value}</strong>
                  </span>
                ))}
              </div>
            </Card>

            {/* Area occupancy */}
            <Card>
              <CardHeader title="Area Occupancy" subtitle="Sheep vs capacity" />
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={areaOccupancy} barCategoryGap="30%">
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#969696' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#969696' }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="sheep" name="Sheep" radius={[5,5,0,0]} fill="#56CA00" />
                  <Bar dataKey="capacity" name="Capacity" radius={[5,5,0,0]} fill="#ABEA70" />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {/* Monthly sales */}
            <Card>
              <CardHeader title="Monthly Sales & Purchases" />
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={monthlyStats} barCategoryGap="25%">
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#969696' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#969696' }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="sales"     name="Sales"     radius={[4,4,0,0]} fill="#56CA00" />
                  <Bar dataKey="purchases" name="Purchases" radius={[4,4,0,0]} fill="#16B1FF" />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {/* Breed breakdown */}
            <Card>
              <CardHeader title="Flock by Breed" />
              <div className="space-y-3">
                {byBreed.sort((a,b) => b.value - a.value).map((b, i) => {
                  const total = byBreed.reduce((s, x) => s + x.value, 0)
                  const pct   = Math.round((b.value / total) * 100)
                  return (
                    <div key={b.name}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-stone-700">{b.name}</span>
                        <span className="text-stone-500">{b.value} ({pct}%)</span>
                      </div>
                      <div className="w-full h-2.5 bg-cream-200 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: COLORS[i % COLORS.length] }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </Card>

            {/* Health treatment breakdown */}
            <Card>
              <CardHeader title="Health Records by Type" />
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={byHealth} cx="50%" cy="50%" outerRadius={75} dataKey="value" label={({ name, value }) => `${name} (${value})`} labelLine={true}>
                    {byHealth.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #E8E8E8', fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </Card>

            {/* Deaths by cause */}
            {byCause.length > 0 && (
              <Card>
                <CardHeader title="Deaths by Cause" />
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={byCause} layout="vertical" barCategoryGap="20%">
                    <XAxis type="number" tick={{ fontSize: 11, fill: '#969696' }} axisLine={false} tickLine={false} allowDecimals={false} />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#696969' }} axisLine={false} tickLine={false} width={120} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="value" name="Deaths" radius={[0,4,4,0]} fill="#FF4C51" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            )}

            {/* Slaughter R/kg trend */}
            {slaughterSales.length > 0 && (
              <Card>
                <CardHeader title="Slaughter Price Trend" subtitle="R per kg" />
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={slaughterSales}>
                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#969696' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#969696' }} axisLine={false} tickLine={false} unit=" R" />
                    <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #E8E8E8', fontSize: 12 }} />
                    <Line type="monotone" dataKey="rkg" name="R/kg" stroke="#56CA00" strokeWidth={2.5} dot={{ fill: '#56CA00', r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            )}

            {/* Financial summary */}
            <Card className="lg:col-span-2">
              <CardHeader title="Financial Summary" subtitle="Sales and purchases all time" />
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: 'Sheep Sold',      value: sales.reduce((s,t) => s + t.count, 0),     unit: 'head' },
                  { label: 'Sales Revenue',   value: `R ${totalRev.toLocaleString()}`,            unit: '' },
                  { label: 'Sheep Purchased', value: purchases.reduce((s,t) => s + t.count, 0), unit: 'head' },
                  { label: 'Purchase Cost',   value: `R ${totalCost.toLocaleString()}`,           unit: '' },
                ].map(s => (
                  <div key={s.label} className="bg-cream-50 rounded-xl p-4 text-center">
                    <p className="text-xl font-bold text-stone-900">{s.value}</p>
                    {s.unit && <p className="text-xs text-stone-400">{s.unit}</p>}
                    <p className="text-xs text-stone-500 mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
              <div className="mt-5 pt-4 border-t border-cream-200 flex items-center justify-between">
                <p className="text-sm text-stone-600 font-medium">Net Profit / Loss</p>
                <p className={`text-xl font-bold ${totalRev - totalCost >= 0 ? 'text-farm-700' : 'text-red-600'}`}>
                  {totalRev - totalCost >= 0 ? '+' : '–'}R {Math.abs(totalRev - totalCost).toLocaleString()}
                </p>
              </div>
            </Card>
          </div>
        </>
      )}

      {/* ══════════════════════════════════════════════════════════
          LAMBING TAB
      ══════════════════════════════════════════════════════════ */}
      {tab === 'lambing' && (
        <div className="space-y-5">
          {lambingRows.length === 0 ? (
            <Card>
              <EmptyState
                icon={Users}
                title="No groups yet"
                description="Create groups and record pregnancy scans to see lambing performance here."
              />
            </Card>
          ) : (
            <>
              {/* Per-group table */}
              <Card className="overflow-hidden p-0">
                <div className="px-5 py-4 border-b border-cream-100">
                  <h3 className="text-sm font-semibold text-stone-800">Lambing Performance by Group</h3>
                  <p className="text-xs text-stone-400 mt-0.5">Based on latest scan per group · deaths after grouping · feedlot transfers</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-cream-50 border-b border-cream-200 text-xs text-stone-500 uppercase tracking-wide">
                        <th className="text-left px-5 py-3 font-semibold">Group</th>
                        <th className="text-left px-5 py-3 font-semibold">Sheep</th>
                        <th className="text-left px-5 py-3 font-semibold">Scan Date</th>
                        <th className="text-right px-5 py-3 font-semibold">Scanned</th>
                        <th className="text-right px-5 py-3 font-semibold">Preg %</th>
                        <th className="text-right px-5 py-3 font-semibold">Lambs Born</th>
                        <th className="text-right px-5 py-3 font-semibold">Lambing %</th>
                        <th className="text-right px-5 py-3 font-semibold">Deaths</th>
                        <th className="text-right px-5 py-3 font-semibold">Feedlot</th>
                        <th className="text-right px-5 py-3 font-semibold">Avg Wean</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-cream-100">
                      {lambingRows.map(({ g, latestScan, pregnancyRate, groupDeaths, deathsByCause, feedlotCount, avgWeaning, lambsBorn, lambingRate, sheepCount }) => (
                        <tr key={g.id} className="hover:bg-cream-50">
                          <td className="px-5 py-3 font-semibold text-stone-900">{g.name}</td>
                          <td className="px-5 py-3 text-stone-600">{sheepCount}</td>
                          <td className="px-5 py-3 text-stone-500 text-xs">{latestScan ? formatDate(latestScan.scanDate) : <span className="text-stone-300">—</span>}</td>
                          <td className="px-5 py-3 text-right text-stone-700">{latestScan?.ewesScanned || <span className="text-stone-300">—</span>}</td>
                          <td className="px-5 py-3 text-right">
                            {pregnancyRate !== null ? (
                              <span className={`font-semibold ${pregnancyRate >= 90 ? 'text-green-600' : pregnancyRate >= 75 ? 'text-amber-600' : 'text-red-500'}`}>
                                {pregnancyRate}%
                              </span>
                            ) : <span className="text-stone-300">—</span>}
                          </td>
                          <td className="px-5 py-3 text-right text-stone-700">{lambsBorn > 0 ? lambsBorn : <span className="text-stone-300">—</span>}</td>
                          <td className="px-5 py-3 text-right">
                            {lambingRate !== null ? (
                              <span className={`font-semibold ${lambingRate >= 130 ? 'text-green-600' : lambingRate >= 100 ? 'text-amber-600' : 'text-red-500'}`}>
                                {lambingRate}%
                              </span>
                            ) : <span className="text-stone-300">—</span>}
                          </td>
                          <td className="px-5 py-3 text-right">
                            {groupDeaths.length > 0 ? (
                              <span className="text-red-500 font-semibold">{groupDeaths.length}</span>
                            ) : <span className="text-stone-300">0</span>}
                          </td>
                          <td className="px-5 py-3 text-right text-stone-600">{feedlotCount > 0 ? feedlotCount : <span className="text-stone-300">—</span>}</td>
                          <td className="px-5 py-3 text-right text-stone-600">{avgWeaning ? `${avgWeaning} kg` : <span className="text-stone-300">—</span>}</td>
                        </tr>
                      ))}
                    </tbody>
                    {/* Totals row */}
                    <tfoot>
                      <tr className="bg-cream-50 border-t border-cream-200 font-semibold text-stone-700 text-xs">
                        <td className="px-5 py-3 text-stone-500 uppercase tracking-wide">Farm Total</td>
                        <td className="px-5 py-3">{lambingRows.reduce((s, r) => s + r.sheepCount, 0)}</td>
                        <td colSpan={2} />
                        <td className="px-5 py-3 text-right">
                          {(() => {
                            const scanned = lambingRows.reduce((s, r) => s + (r.latestScan?.ewesScanned || 0), 0)
                            const dry = lambingRows.reduce((s, r) => s + (r.latestScan?.dry || 0), 0)
                            return scanned > 0 ? `${Math.round(((scanned - dry) / scanned) * 100)}%` : '—'
                          })()}
                        </td>
                        <td className="px-5 py-3 text-right">{lambingRows.reduce((s, r) => s + r.lambsBorn, 0) || '—'}</td>
                        <td />
                        <td className="px-5 py-3 text-right text-red-500">{lambingRows.reduce((s, r) => s + r.groupDeaths.length, 0)}</td>
                        <td className="px-5 py-3 text-right">{lambingRows.reduce((s, r) => s + r.feedlotCount, 0) || '—'}</td>
                        <td />
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </Card>

              {/* Pregnancy % bar chart */}
              {lambingRows.some(r => r.pregnancyRate !== null) && (
                <Card>
                  <CardHeader title="Pregnancy Rate by Group" subtitle="Based on latest scan" />
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={lambingRows.filter(r => r.pregnancyRate !== null).map(r => ({ name: r.g.name, pct: r.pregnancyRate }))} barCategoryGap="30%">
                      <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#969696' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: '#969696' }} axisLine={false} tickLine={false} unit="%" domain={[0, 100]} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="pct" name="Pregnancy %" radius={[5,5,0,0]} fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
              )}
            </>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════
          OPERATIONS TAB
      ══════════════════════════════════════════════════════════ */}
      {tab === 'operations' && (
        <div className="space-y-8">

          {/* ── Feed / Supplement Log ── */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-semibold text-stone-800 flex items-center gap-2">
                  <Wheat size={17} className="text-amber-500" /> Feed & Supplement Log
                </h2>
                <p className="text-xs text-stone-400 mt-0.5">{feedRecords.length} records · {feedRecords.reduce((s, r) => s + (r.quantityKg || 0), 0).toLocaleString()} kg total</p>
              </div>
              <Button onClick={() => setFeedOpen(true)} icon={<Plus size={15} />} size="sm">Add Record</Button>
            </div>

            {feedRecords.length === 0 ? (
              <Card>
                <EmptyState icon={Wheat} title="No feed records" description="Log monthly supplement and feed consumption here." action={<Button onClick={() => setFeedOpen(true)}>Add Record</Button>} />
              </Card>
            ) : (
              <>
                {/* Monthly summary table */}
                <Card className="overflow-hidden p-0 mb-4">
                  <div className="px-5 py-3 bg-cream-50 border-b border-cream-200">
                    <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide">Monthly Summary</p>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-xs text-stone-500 border-b border-cream-100">
                          <th className="text-left px-5 py-2.5 font-semibold">Month</th>
                          {SUPPLEMENT_TYPES.map(t => (
                            <th key={t} className="text-right px-3 py-2.5 font-semibold whitespace-nowrap">{SUPPLEMENT_LABELS[t]}</th>
                          ))}
                          <th className="text-right px-5 py-2.5 font-semibold">Total kg</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-cream-50">
                        {feedMonths.map(m => {
                          const row = feedByMonth[m]
                          const total = Object.values(row).reduce((s, v) => s + v, 0)
                          return (
                            <tr key={m} className="hover:bg-cream-50">
                              <td className="px-5 py-2.5 font-medium text-stone-800">{m}</td>
                              {SUPPLEMENT_TYPES.map(t => (
                                <td key={t} className="px-3 py-2.5 text-right text-stone-600">
                                  {row[t] ? `${row[t].toLocaleString()} kg` : <span className="text-stone-300">—</span>}
                                </td>
                              ))}
                              <td className="px-5 py-2.5 text-right font-semibold text-stone-900">{total.toLocaleString()} kg</td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </Card>

                {/* Raw records */}
                <div className="space-y-2">
                  {feedRecords.slice(0, 20).map(r => {
                    const area = r.areaId ? areas.find(a => a.id === r.areaId) : null
                    return (
                      <Card key={r.id} className="py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-semibold text-stone-800">{SUPPLEMENT_LABELS[r.supplementType] || r.supplementType}</p>
                              {area && <span className="text-xs bg-cream-200 text-stone-600 px-2 py-0.5 rounded-full">{area.name}</span>}
                            </div>
                            {r.notes && <p className="text-xs text-stone-400 mt-0.5">{r.notes}</p>}
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="text-sm font-bold text-stone-900">{r.quantityKg ? `${r.quantityKg} kg` : '—'}</p>
                            <p className="text-xs text-stone-400">{formatDate(r.date)}</p>
                          </div>
                        </div>
                      </Card>
                    )
                  })}
                </div>
              </>
            )}
          </div>

          {/* ── Staff Meat Allotments ── */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-semibold text-stone-800 flex items-center gap-2">
                  <Users size={17} className="text-stone-500" /> Staff Meat Allotments
                </h2>
                <p className="text-xs text-stone-400 mt-0.5">
                  {staffAllotments.length} records · {staffAllotments.reduce((s, a) => s + (a.kgAllocated || 0), 0).toLocaleString()} kg total
                </p>
              </div>
              <Button onClick={() => setAllotOpen(true)} icon={<Plus size={15} />} size="sm">Add Allotment</Button>
            </div>

            {staffAllotments.length === 0 ? (
              <Card>
                <EmptyState icon={Users} title="No allotments" description="Track meat pack allocations for farm workers here." action={<Button onClick={() => setAllotOpen(true)}>Add Allotment</Button>} />
              </Card>
            ) : (
              <>
                {/* Grouped by event */}
                {Object.entries(allotByEvent).sort((a, b) => b[1].total - a[1].total).map(([event, data]) => (
                  <Card key={event} className="mb-3">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm font-bold text-stone-800">{event}</p>
                      <p className="text-sm font-semibold text-stone-600">{data.total.toLocaleString()} kg total</p>
                    </div>
                    <div className="divide-y divide-cream-100">
                      {data.entries.sort((a, b) => new Date(b.date) - new Date(a.date)).map(a => (
                        <div key={a.id} className="flex items-center justify-between py-2 text-sm">
                          <div>
                            <p className="font-medium text-stone-800">{a.staffName}</p>
                            {a.notes && <p className="text-xs text-stone-400">{a.notes}</p>}
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-stone-900">{a.kgAllocated ? `${a.kgAllocated} kg` : '—'}</p>
                            <p className="text-xs text-stone-400">{formatDate(a.date)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                ))}
              </>
            )}
          </div>

        </div>
      )}

      <AddFeedModal      open={feedOpen}  onClose={() => setFeedOpen(false)} />
      <AddAllotmentModal open={allotOpen} onClose={() => setAllotOpen(false)} />
    </div>
  )
}
