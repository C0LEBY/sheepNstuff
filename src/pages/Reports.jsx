import { useFarm } from '../context/FarmContext'
import Card, { CardHeader } from '../components/ui/Card'
import PageHeader from '../components/ui/PageHeader'
import Badge from '../components/ui/Badge'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend, CartesianGrid
} from 'recharts'

const COLORS = ['#56CA00', '#84BFA2', '#D97706', '#9333ea', '#3b82f6', '#ef4444']

const MONTH_LABELS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

export default function Reports() {
  const { sheep, areas, births, deaths, transactions, healthRecords, breedingRecords } = useFarm()

  // Sheep by sex
  const bySex = ['ewe', 'ram', 'lamb', 'wether'].map(sex => ({
    name: sex.charAt(0).toUpperCase() + sex.slice(1),
    value: sheep.filter(s => s.sex === sex && s.status !== 'sold' && s.status !== 'dead').length,
  })).filter(d => d.value > 0)

  // Sheep by breed
  const breedMap = {}
  sheep.filter(s => s.status !== 'sold' && s.status !== 'dead').forEach(s => {
    breedMap[s.breed] = (breedMap[s.breed] || 0) + 1
  })
  const byBreed = Object.entries(breedMap).map(([name, value]) => ({ name, value }))

  // Area occupancy
  const areaOccupancy = areas.map(a => {
    const count = sheep.filter(s => s.areaId === a.id && s.status !== 'sold' && s.status !== 'dead').length
    return {
      name: a.name.replace(' Paddock', '').replace(' Pen', '').replace(' Camp', ''),
      sheep: count,
      capacity: a.capacity,
      pct: Math.round((count / Math.max(a.capacity, 1)) * 100),
    }
  })

  // Health type breakdown
  const healthMap = {}
  healthRecords.forEach(h => { healthMap[h.type] = (healthMap[h.type] || 0) + 1 })
  const byHealth = Object.entries(healthMap).map(([name, value]) => ({ name: name.replace('_', ' '), value }))

  // Financial summary
  const sales     = transactions.filter(t => t.type === 'sale')
  const purchases = transactions.filter(t => t.type === 'purchase')
  const totalRev  = sales.reduce((s, t) => s + t.totalAmount, 0)
  const totalCost = purchases.reduce((s, t) => s + t.totalAmount, 0)

  // Births by type
  const birthTypes = { single: 0, twins: 0, triplets: 0 }
  births.forEach(b => { birthTypes[b.type] = (birthTypes[b.type] || 0) + 1 })
  const birthTypeData = Object.entries(birthTypes).map(([name, value]) => ({ name, value }))

  // Breeding success
  const breedSuccessRate = breedingRecords.length > 0
    ? Math.round((breedingRecords.filter(b => b.status === 'lambed').length / breedingRecords.length) * 100)
    : 0

  // Monthly births/deaths/sales chart data
  const today = new Date()
  const monthlyStats = MONTH_LABELS.map((month, i) => ({
    month,
    births:    births.filter(b => new Date(b.birthDate || b.date).getMonth() === i).length,
    deaths:    deaths.filter(d => new Date(d.date).getMonth() === i).length,
    sales:     transactions.filter(t => t.type === 'sale'     && new Date(t.date).getMonth() === i).length,
    purchases: transactions.filter(t => t.type === 'purchase' && new Date(t.date).getMonth() === i).length,
  })).filter((_, i) => {
    const diff = (today.getMonth() - i + 12) % 12
    return diff < 10
  }).sort((a, b) => {
    const ai = MONTH_LABELS.indexOf(a.month)
    const bi = MONTH_LABELS.indexOf(b.month)
    const nowM = today.getMonth()
    return ((ai - nowM + 12 - 9) % 12) - ((bi - nowM + 12 - 9) % 12)
  })

  const CustomTooltip = ({ active, payload, label }) => {
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

  return (
    <div className="max-w-6xl mx-auto">
      <PageHeader title="Reports" subtitle="Farm performance overview" />

      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Total Active Sheep',  value: sheep.filter(s => s.status !== 'sold' && s.status !== 'dead').length },
          { label: 'Births Recorded',     value: births.reduce((s, b) => s + b.lambCount, 0) },
          { label: 'Breeding Success',    value: `${breedSuccessRate}%` },
          { label: 'Net Profit',          value: `R ${((totalRev - totalCost) / 1000).toFixed(1)}k` },
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

        {/* Sheep by sex — pie */}
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
          <CardHeader title="Area Occupancy" subtitle="Sheep per area vs capacity" />
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

        {/* Monthly sales chart */}
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
              const pct = Math.round((b.value / total) * 100)
              return (
                <div key={b.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-stone-700">{b.name}</span>
                    <span className="text-stone-500">{b.value} sheep ({pct}%)</span>
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

        {/* Financial summary */}
        <Card className="lg:col-span-2">
          <CardHeader title="Financial Summary" subtitle="Sales and purchases this year" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Sheep Sold',       value: sales.reduce((s,t) => s + t.count, 0),       unit: 'head' },
              { label: 'Sales Revenue',    value: `R ${totalRev.toLocaleString()}`,              unit: '' },
              { label: 'Sheep Purchased',  value: purchases.reduce((s,t) => s + t.count, 0),   unit: 'head' },
              { label: 'Purchase Cost',    value: `R ${totalCost.toLocaleString()}`,             unit: '' },
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
    </div>
  )
}
