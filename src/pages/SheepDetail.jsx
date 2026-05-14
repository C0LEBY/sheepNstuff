import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Scale, Edit2, MapPin } from 'lucide-react'
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts'
import { useFarm } from '../context/FarmContext'
import { getAge, formatDate } from '../lib/utils'
import Card, { CardHeader } from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import {
  Timeline, TimelineItem, TimelineHeader, TimelineTitle,
  TimelineDate, TimelineContent, TimelineIndicator, TimelineSeparator,
} from '../components/reui/timeline'

export default function SheepDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { sheep, areas, healthRecords, breedingRecords, births, weightHistory, updateSheep } = useFarm()

  // Area state
  const [changingArea, setChangingArea]     = useState(false)
  const [selectedAreaId, setSelectedAreaId] = useState('')
  const [savingArea, setSavingArea]         = useState(false)

  // Edit modal state
  const [editOpen, setEditOpen]   = useState(false)
  const [editForm, setEditForm]   = useState({})
  const [savingEdit, setSavingEdit] = useState(false)

  // Parents edit state
  const [editingParents, setEditingParents]   = useState(false)
  const [parentForm, setParentForm]           = useState({ motherId: '', fatherId: '' })
  const [savingParents, setSavingParents]     = useState(false)

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

  // ── Edit handlers ─────────────────────────────────────────────
  function openEdit() {
    setEditForm({
      tagNumber:   s.tagNumber,
      name:        s.name        || '',
      sex:         s.sex,
      breed:       s.breed,
      dateOfBirth: s.dateOfBirth || '',
      weight:      s.weight      || '',
      status:      s.status,
      notes:       s.notes       || '',
    })
    setEditOpen(true)
  }

  async function handleEditSubmit(e) {
    e.preventDefault()
    setSavingEdit(true)
    await updateSheep(s.id, {
      ...editForm,
      weight:      parseFloat(editForm.weight) || 0,
      dateOfBirth: editForm.dateOfBirth || null,
    })
    setSavingEdit(false)
    setEditOpen(false)
  }

  // ── Parent handlers ───────────────────────────────────────────
  function openParentEdit() {
    setParentForm({ motherId: s.motherId || '', fatherId: s.fatherId || '' })
    setEditingParents(true)
  }

  async function handleSaveParents() {
    setSavingParents(true)
    await updateSheep(s.id, {
      motherId: parentForm.motherId || null,
      fatherId: parentForm.fatherId || null,
    })
    setSavingParents(false)
    setEditingParents(false)
  }

  // ── Area handlers ─────────────────────────────────────────────
  async function handleAssignArea() {
    setSavingArea(true)
    await updateSheep(s.id, { areaId: selectedAreaId || null })
    setSavingArea(false)
    setChangingArea(false)
    setSelectedAreaId('')
  }

  function openAreaChange() {
    setSelectedAreaId(s.areaId || '')
    setChangingArea(true)
  }

  const areaOccupancy = area
    ? sheep.filter(x => x.areaId === area.id && x.status !== 'sold' && x.status !== 'dead').length
    : 0

  const FIELD = 'w-full px-3 py-2 text-sm border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-farm-400 bg-white'

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
          <Button variant="outline" icon={<Edit2 size={15} />} size="sm" onClick={openEdit}>Edit</Button>
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
            <CardHeader
              title="Parents"
              action={
                !editingParents ? (
                  <button onClick={openParentEdit} className="text-xs text-farm-600 hover:underline font-medium">
                    Edit
                  </button>
                ) : null
              }
            />

            {!editingParents ? (
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
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-stone-500 mb-1">Mother (ewe)</label>
                  <select className={FIELD} value={parentForm.motherId}
                    onChange={e => setParentForm(f => ({ ...f, motherId: e.target.value }))}>
                    <option value="">Unknown / none</option>
                    {sheep.filter(x => x.id !== s.id && x.sex === 'ewe').map(x => (
                      <option key={x.id} value={x.id}>{x.tagNumber}{x.name ? ` — ${x.name}` : ''}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-500 mb-1">Father (ram)</label>
                  <select className={FIELD} value={parentForm.fatherId}
                    onChange={e => setParentForm(f => ({ ...f, fatherId: e.target.value }))}>
                    <option value="">Unknown / none</option>
                    {sheep.filter(x => x.id !== s.id && x.sex === 'ram').map(x => (
                      <option key={x.id} value={x.id}>{x.tagNumber}{x.name ? ` — ${x.name}` : ''}</option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-2 pt-1">
                  <Button variant="outline" size="sm" className="flex-1"
                    disabled={savingParents} onClick={() => setEditingParents(false)}>
                    Cancel
                  </Button>
                  <Button size="sm" className="flex-1"
                    disabled={savingParents} onClick={handleSaveParents}>
                    {savingParents ? 'Saving…' : 'Save'}
                  </Button>
                </div>
              </div>
            )}
          </Card>

          {/* Area */}
          <Card>
            <CardHeader
              title="Current Area"
              icon={<MapPin size={15} />}
              action={
                !changingArea && (
                  <button
                    onClick={openAreaChange}
                    className="text-xs text-farm-600 hover:underline font-medium"
                  >
                    {area ? 'Change' : 'Assign'}
                  </button>
                )
              }
            />

            {!changingArea ? (
              area ? (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-farm-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin size={18} className="text-farm-700" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-stone-900">{area.name}</p>
                    <p className="text-xs text-stone-400 capitalize">{area.type}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-medium text-stone-700">{areaOccupancy}<span className="text-stone-400">/{area.capacity}</span></p>
                    <p className="text-xs text-stone-400">sheep</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center py-3 gap-3">
                  <p className="text-sm text-stone-400">Not assigned to any area</p>
                  <Button size="sm" variant="outline" icon={<MapPin size={14} />} onClick={openAreaChange}>
                    Assign Area
                  </Button>
                </div>
              )
            ) : (
              <div className="space-y-2.5">
                <select
                  className={FIELD}
                  value={selectedAreaId}
                  onChange={e => setSelectedAreaId(e.target.value)}
                >
                  <option value="">No area (unassign)</option>
                  {areas.map(a => {
                    const cnt = sheep.filter(x => x.areaId === a.id && x.status !== 'sold' && x.status !== 'dead').length
                    return <option key={a.id} value={a.id}>{a.name} ({cnt}/{a.capacity})</option>
                  })}
                </select>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1"
                    disabled={savingArea} onClick={() => setChangingArea(false)}>
                    Cancel
                  </Button>
                  <Button size="sm" className="flex-1"
                    disabled={savingArea} onClick={handleAssignArea}>
                    {savingArea ? 'Saving…' : 'Save'}
                  </Button>
                </div>
              </div>
            )}
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
            <Timeline>
              {treatments.map((h, i) => (
                <TimelineItem key={h.id} step={i + 1}>
                  <TimelineIndicator className="bg-farm-100 border-farm-400" />
                  <TimelineSeparator />
                  <TimelineHeader>
                    <TimelineDate>{formatDate(h.date)}{h.vet ? ` · ${h.vet}` : ''}</TimelineDate>
                    <div className="flex items-center gap-2 flex-wrap">
                      <TimelineTitle>{h.treatment}</TimelineTitle>
                      <Badge variant={h.type}>{h.type.replace('_', ' ')}</Badge>
                    </div>
                  </TimelineHeader>
                  {(h.notes || h.followUpDate) && (
                    <TimelineContent>
                      {h.notes && <p>{h.notes}</p>}
                      {h.followUpDate && <p className="text-amber-600">Follow-up: {formatDate(h.followUpDate)}</p>}
                    </TimelineContent>
                  )}
                </TimelineItem>
              ))}
            </Timeline>
          )}
        </Card>

        {/* Breeding / lambing history */}
        <Card>
          <CardHeader title="Breeding History" subtitle={`${lambBirths.length} births recorded`} />
          {lambBirths.length === 0 && breeding.length === 0 ? (
            <p className="text-sm text-stone-400 py-2">No breeding records</p>
          ) : (
            <Timeline>
              {breeding.map((b, i) => {
                const partner = b.ewedId === s.id
                  ? sheep.find(x => x.id === b.ramId)
                  : sheep.find(x => x.id === b.ewedId)
                return (
                  <TimelineItem key={b.id} step={i + 1}>
                    <TimelineIndicator className="bg-purple-50 border-purple-400" />
                    <TimelineSeparator />
                    <TimelineHeader>
                      <TimelineDate>Mating: {formatDate(b.matingDate)}</TimelineDate>
                      <div className="flex items-center gap-2 flex-wrap">
                        <TimelineTitle>
                          {b.ewedId === s.id ? 'Mated with ' : 'Sired '}
                          {partner?.tagNumber || '—'}
                        </TimelineTitle>
                        <Badge variant={b.status}>{b.status}</Badge>
                      </div>
                    </TimelineHeader>
                    <TimelineContent>
                      Expected: {formatDate(b.expectedLambingDate)}
                      {b.lambsProduced > 0 && <span className="text-farm-600 ml-2">· {b.lambsProduced} lamb{b.lambsProduced > 1 ? 's' : ''} born</span>}
                    </TimelineContent>
                  </TimelineItem>
                )
              })}
              {lambBirths.map((b, i) => (
                <TimelineItem key={b.id} step={breeding.length + i + 1}>
                  <TimelineIndicator className="bg-amber-50 border-amber-400" />
                  <TimelineSeparator />
                  <TimelineHeader>
                    <TimelineDate>{formatDate(b.date)}</TimelineDate>
                    <TimelineTitle>{b.lambCount} lamb{b.lambCount > 1 ? 's' : ''} — {b.type}</TimelineTitle>
                  </TimelineHeader>
                  {b.stillborns > 0 && (
                    <TimelineContent>
                      <span className="text-red-500">{b.stillborns} stillborn</span>
                    </TimelineContent>
                  )}
                </TimelineItem>
              ))}
            </Timeline>
          )}
        </Card>
      </div>

      {/* ── Edit Sheep Modal ─────────────────────────────── */}
      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit Sheep" size="lg">
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-stone-500 mb-1">Tag Number *</label>
              <input required className={FIELD} value={editForm.tagNumber || ''}
                onChange={e => setEditForm(f => ({ ...f, tagNumber: e.target.value }))} />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-500 mb-1">Name</label>
              <input className={FIELD} placeholder="Optional" value={editForm.name || ''}
                onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-stone-500 mb-1">Sex</label>
              <select className={FIELD} value={editForm.sex || 'ewe'}
                onChange={e => setEditForm(f => ({ ...f, sex: e.target.value }))}>
                {['ewe','ram','lamb','wether'].map(v => (
                  <option key={v} value={v}>{v.charAt(0).toUpperCase() + v.slice(1)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-500 mb-1">Breed</label>
              <select className={FIELD} value={editForm.breed || 'Merino'}
                onChange={e => setEditForm(f => ({ ...f, breed: e.target.value }))}>
                {['Merino','Dorper','Dohne','Suffolk','Damara'].map(v => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-stone-500 mb-1">Date of Birth</label>
              <input type="date" className={FIELD} value={editForm.dateOfBirth || ''}
                onChange={e => setEditForm(f => ({ ...f, dateOfBirth: e.target.value }))} />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-500 mb-1">Weight (kg)</label>
              <input type="number" step="0.1" min="0" className={FIELD} value={editForm.weight || ''}
                onChange={e => setEditForm(f => ({ ...f, weight: e.target.value }))} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-500 mb-1">Status</label>
            <select className={FIELD} value={editForm.status || 'healthy'}
              onChange={e => setEditForm(f => ({ ...f, status: e.target.value }))}>
              {['healthy','sick','pregnant','sold','dead','missing'].map(v => (
                <option key={v} value={v}>{v.charAt(0).toUpperCase() + v.slice(1)}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-500 mb-1">Notes</label>
            <textarea rows={2} className={FIELD} placeholder="Any notes…" value={editForm.notes || ''}
              onChange={e => setEditForm(f => ({ ...f, notes: e.target.value }))} />
          </div>

          <div className="flex gap-3 pt-1">
            <Button variant="outline" className="flex-1" disabled={savingEdit}
              onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button type="submit" className="flex-1" disabled={savingEdit}>
              {savingEdit ? 'Saving…' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
