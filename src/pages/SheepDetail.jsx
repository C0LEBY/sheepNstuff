import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Scale, HeartPulse, Heart, MoveRight, Edit2 } from 'lucide-react'
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts'
import { useFarm } from '../context/FarmContext'
import { getAge, formatDate } from '../data/mockData'
import Card, { CardHeader } from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'

export default function SheepDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { sheep, areas, healthRecords, breedingRecords, births, weightHistory } = useFarm()

  const s = sheep.find(x => x.id === id)

  if (!s) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center">
        <p className="text-stone-500">Sheep not found.</p>
        <Button className="mt-4" onClick={() => navigate('/sheep')}>← Back to Sheep</Button>
      </div>
    )
  }

  const area    = areas.find(a => a.id === s.areaId)
  const mother  = sheep.find(x => x.id === s.motherId)
  const father  = sheep.find(x => x.id === s.fatherId)
  const treatments = healthRecords.filter(h => h.sheepId === s.id)
  const breeding   = breedingRecords.filter(b => b.ewedId === s.id || b.ramId === s.id)
  const lambBirths = births.filter(b => b.motherId === s.id)
  const wh = weightHistory[s.id] || []

  const infoRow = (label, value) => (
    <div key={label} className="flex items-start justify-between py-2.5 border-b border-cream-100 last:border-0">
      <span className="text-sm text-stone-500 flex-shrink-0 w-36">{label}</span>
      <span className="text-sm font-medium text-stone-800 text-right">{value || '—'}</span>
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      {/* Back + header */}
      <div>
        <button
          onClick={() => navigate('/sheep')}
          className="flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-800 mb-4"
        >
          <ArrowLeft size={15} /> Back to Sheep
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-farm-100 flex items-center justify-center text-farm-700 font-bold text-lg flex-shrink-0">
            {s.sex === 'ram' ? '♂' : s.sex === 'ewe' ? '♀' : s.sex === 'lamb' ? '✦' : '○'}
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold text-stone-900">{s.tagNumber}</h1>
              {s.name && <span className="text-xl text-stone-500">— {s.name}</span>}
              <Badge variant={s.status}>{s.status}</Badge>
              <Badge variant={s.sex}>{s.sex}</Badge>
            </div>
            <p className="text-stone-500 mt-1">{s.breed} · {getAge(s.dateOfBirth)} · {area?.name || 'No area assigned'}</p>
          </div>
          <Button variant="outline" icon={<Edit2 size={15} />} size="sm">Edit</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Basic info */}
        <Card>
          <CardHeader title="Basic Information" />
          <div>
            {infoRow('Tag Number',     s.tagNumber)}
            {infoRow('Name',           s.name)}
            {infoRow('Sex',            s.sex.charAt(0).toUpperCase() + s.sex.slice(1))}
            {infoRow('Breed',          s.breed)}
            {infoRow('Date of Birth',  formatDate(s.dateOfBirth))}
            {infoRow('Age',            getAge(s.dateOfBirth))}
            {infoRow('Current Area',   area?.name)}
            {infoRow('Current Weight', s.weight ? `${s.weight} kg` : null)}
            {infoRow('Status',         s.status.charAt(0).toUpperCase() + s.status.slice(1))}
          </div>
        </Card>

        {/* Parents */}
        <div className="space-y-4">
          <Card>
            <CardHeader title="Parents" />
            <div className="space-y-3">
              {[{ label: 'Mother', p: mother }, { label: 'Father', p: father }].map(({ label, p }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-cream-200 flex items-center justify-center text-stone-500 text-xs font-bold flex-shrink-0">
                    {label[0]}
                  </div>
                  <div>
                    <p className="text-xs text-stone-400">{label}</p>
                    {p ? (
                      <button
                        onClick={() => navigate(`/sheep/${p.id}`)}
                        className="text-sm font-medium text-farm-700 hover:underline"
                      >
                        {p.tagNumber}{p.name ? ` — ${p.name}` : ''}
                      </button>
                    ) : (
                      <p className="text-sm text-stone-400">Unknown</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {s.notes && (
            <Card>
              <CardHeader title="Notes" />
              <p className="text-sm text-stone-700 leading-relaxed">{s.notes}</p>
            </Card>
          )}
        </div>

        {/* Weight chart */}
        {wh.length > 0 && (
          <Card className="md:col-span-2">
            <CardHeader title="Weight History" subtitle={`Current: ${s.weight} kg`} icon={<Scale size={16} />} />
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={wh}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0ede8" />
                <XAxis dataKey="date" tickFormatter={d => formatDate(d).split(' ').slice(0, 2).join(' ')} tick={{ fontSize: 11, fill: '#78716c' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#a8a29e' }} axisLine={false} tickLine={false} unit=" kg" />
                <Tooltip formatter={v => [`${v} kg`, 'Weight']} labelFormatter={d => formatDate(d)} contentStyle={{ borderRadius: 10, border: '1px solid #e7e5e4', fontSize: 12 }} />
                <Line type="monotone" dataKey="weight" stroke="#4A8F6C" strokeWidth={2.5} dot={{ fill: '#4A8F6C', r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        )}

        {/* Health history */}
        <Card>
          <CardHeader
            title="Health & Treatments"
            subtitle={`${treatments.length} records`}
            action={
              <button onClick={() => navigate('/health')} className="text-xs text-farm-600 hover:underline">Add treatment</button>
            }
          />
          {treatments.length === 0 ? (
            <p className="text-sm text-stone-400 py-2">No treatment records</p>
          ) : (
            <div className="space-y-3">
              {treatments.map(h => (
                <div key={h.id} className="border-l-2 border-farm-200 pl-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium text-stone-800">{h.treatment}</p>
                    <Badge variant={h.type}>{h.type.replace('_', ' ')}</Badge>
                  </div>
                  <p className="text-xs text-stone-500 mt-0.5">{formatDate(h.date)}{h.vet ? ` · ${h.vet}` : ''}</p>
                  {h.notes && <p className="text-xs text-stone-500 mt-0.5">{h.notes}</p>}
                  {h.followUpDate && <p className="text-xs text-amber-600 mt-0.5">Follow-up: {formatDate(h.followUpDate)}</p>}
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Breeding / lambing history */}
        <Card>
          <CardHeader title="Breeding History" subtitle={`${lambBirths.length} births recorded`} />
          {lambBirths.length === 0 && breeding.length === 0 ? (
            <p className="text-sm text-stone-400 py-2">No breeding records</p>
          ) : (
            <div className="space-y-3">
              {breeding.map(b => (
                <div key={b.id} className="border-l-2 border-purple-200 pl-3">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-stone-800">
                      {b.ewedId === s.id ? 'Mated with ' : 'Sired '}
                      {(b.ewedId === s.id
                        ? sheep.find(x => x.id === b.ramId)?.tagNumber
                        : sheep.find(x => x.id === b.ewedId)?.tagNumber) || '—'}
                    </p>
                    <Badge variant={b.status}>{b.status}</Badge>
                  </div>
                  <p className="text-xs text-stone-500 mt-0.5">Mating: {formatDate(b.matingDate)} · Expected: {formatDate(b.expectedLambingDate)}</p>
                  {b.lambsProduced > 0 && <p className="text-xs text-farm-600 mt-0.5">{b.lambsProduced} lamb{b.lambsProduced > 1 ? 's' : ''} born</p>}
                </div>
              ))}
              {lambBirths.map(b => (
                <div key={b.id} className="border-l-2 border-amber-200 pl-3">
                  <p className="text-sm font-medium text-stone-800">{b.lambCount} lamb{b.lambCount > 1 ? 's' : ''} — {b.type}</p>
                  <p className="text-xs text-stone-500 mt-0.5">{formatDate(b.date)}</p>
                  {b.stillborns > 0 && <p className="text-xs text-red-500">{b.stillborns} stillborn</p>}
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
