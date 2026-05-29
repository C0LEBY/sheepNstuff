import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Plus, Search, Filter, ChevronRight } from 'lucide-react'
import { useFarm } from '../context/FarmContext'
import { getAge } from '../lib/utils'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import PageHeader from '../components/ui/PageHeader'
import EmptyState from '../components/ui/EmptyState'
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from '../components/ui/table'

const BREEDS = ['All', 'Merino', 'Dorper', 'Dohne', 'Suffolk', 'Damara']
const SEXES  = ['All', 'ewe', 'ram', 'lamb', 'wether']
const STATUSES = ['All', 'healthy', 'sick', 'pregnant', 'sold', 'dead', 'missing']

function AddSheepModal({ open, onClose }) {
  const { addSheep, areas } = useFarm()
  const [form, setForm] = useState({
    tagNumber: '', name: '', sex: 'ewe', breed: 'Merino',
    dateOfBirth: '', areaId: areas[0]?.id || '', status: 'healthy', notes: '', weight: '',
    motherId: '', fatherId: '',
  })

  function set(key, val) { setForm(f => ({ ...f, [key]: val })) }

  const [saving, setSaving] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    await addSheep({
      ...form,
      weight:      parseFloat(form.weight) || 0,
      dateOfBirth: form.dateOfBirth || null,
      areaId:      form.areaId     || null,
      motherId:    form.motherId   || null,
      fatherId:    form.fatherId   || null,
    })
    setSaving(false)
    onClose()
    setForm({ tagNumber: '', name: '', sex: 'ewe', breed: 'Merino', dateOfBirth: '', areaId: areas[0]?.id || '', status: 'healthy', notes: '', weight: '', motherId: '', fatherId: '' })
  }

  const field = 'w-full px-3 py-2.5 text-sm border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-farm-400 bg-white'
  const label = 'block text-sm font-medium text-stone-700 mb-1'

  return (
    <Modal open={open} onClose={onClose} title="Add New Sheep" size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={label}>Tag Number *</label>
            <input required className={field} placeholder="e.g. E-022" value={form.tagNumber} onChange={e => set('tagNumber', e.target.value)} />
          </div>
          <div>
            <label className={label}>Name (optional)</label>
            <input className={field} placeholder="e.g. Daisy" value={form.name} onChange={e => set('name', e.target.value)} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={label}>Sex *</label>
            <select required className={field} value={form.sex} onChange={e => set('sex', e.target.value)}>
              {SEXES.slice(1).map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
            </select>
          </div>
          <div>
            <label className={label}>Breed *</label>
            <select required className={field} value={form.breed} onChange={e => set('breed', e.target.value)}>
              {BREEDS.slice(1).map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={label}>Date of Birth</label>
            <input type="date" className={field} value={form.dateOfBirth} onChange={e => set('dateOfBirth', e.target.value)} />
          </div>
          <div>
            <label className={label}>Current Weight (kg)</label>
            <input type="number" step="0.1" min="0" className={field} placeholder="e.g. 65.5" value={form.weight} onChange={e => set('weight', e.target.value)} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={label}>Area / Paddock</label>
            <select className={field} value={form.areaId} onChange={e => set('areaId', e.target.value)}>
              {areas.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </div>
          <div>
            <label className={label}>Status</label>
            <select className={field} value={form.status} onChange={e => set('status', e.target.value)}>
              {STATUSES.slice(1).map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className={label}>Notes</label>
          <textarea rows={2} className={field} placeholder="Any notes…" value={form.notes} onChange={e => set('notes', e.target.value)} />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="outline" onClick={onClose} disabled={saving}>Cancel</Button>
          <Button type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save Sheep'}</Button>
        </div>
      </form>
    </Modal>
  )
}

export default function Sheep() {
  const { sheep, areas, updateSheep } = useFarm()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const [search, setSearch]             = useState('')
  const [filterSex, setFilterSex]       = useState('All')
  const [filterBreed, setFilterBreed]   = useState('All')
  const [filterStatus, setFilterStatus] = useState('All')
  const [filterArea, setFilterArea]     = useState('All')
  const [addOpen, setAddOpen]           = useState(false)

  useEffect(() => {
    const area = searchParams.get('area')
    if (area) setFilterArea(area)
    if (searchParams.get('add') === 'true') setAddOpen(true)
  }, [searchParams])

  const filtered = sheep.filter(s => {
    const q = search.toLowerCase()
    const matchSearch = !q || s.tagNumber.toLowerCase().includes(q) || (s.name && s.name.toLowerCase().includes(q)) || s.breed.toLowerCase().includes(q)
    const matchSex    = filterSex === 'All'    || s.sex === filterSex
    const matchBreed  = filterBreed === 'All'  || s.breed === filterBreed
    const matchStatus = filterStatus === 'All' || s.status === filterStatus
    const matchArea   = filterArea === 'All'   || s.areaId === filterArea
    return matchSearch && matchSex && matchBreed && matchStatus && matchArea
  })

  const select        = 'text-sm border border-cream-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-farm-400'
  const selectMobile = 'w-full text-sm border border-cream-300 rounded-xl px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-farm-400'

  return (
    <div className="max-w-6xl mx-auto">
      <PageHeader
        title="Sheep Records"
        subtitle={`${sheep.filter(s => s.status !== 'sold' && s.status !== 'dead').length} active · ${sheep.length} total`}
        action={<Button onClick={() => setAddOpen(true)} icon={<Plus size={16} />}>Add Sheep</Button>}
      />

      {/* Filters — mobile */}
      <div className="sm:hidden mb-4 space-y-2.5">
        <div className="relative">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            placeholder="Search tag, name, breed…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-3 py-2.5 text-sm border border-cream-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-farm-400"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-0.5 hide-scrollbar">
          {SEXES.map(s => (
            <button
              key={s}
              onClick={() => setFilterSex(s)}
              className={[
                'px-3.5 py-1.5 rounded-full text-sm font-medium whitespace-nowrap flex-shrink-0 transition-colors',
                filterSex === s ? 'bg-farm-500 text-white' : 'bg-white text-stone-600 shadow-card',
              ].join(' ')}
            >
              {s === 'All' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1) + 's'}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-2">
          <select className={selectMobile} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            {STATUSES.map(s => <option key={s} value={s}>{s === 'All' ? 'Any Status' : s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
          </select>
          <select className={selectMobile} value={filterBreed} onChange={e => setFilterBreed(e.target.value)}>
            {BREEDS.map(b => <option key={b} value={b}>{b === 'All' ? 'Any Breed' : b}</option>)}
          </select>
          <select className={`${selectMobile} col-span-2`} value={filterArea} onChange={e => setFilterArea(e.target.value)}>
            <option value="All">All Areas</option>
            {areas.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
        </div>
      </div>

      {/* Filters — desktop */}
      <Card className="hidden sm:block mb-5">
        <div className="flex flex-wrap gap-3">
          <div className="flex-1 min-w-48 relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              placeholder="Search by tag, name, or breed…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-farm-400"
            />
          </div>
          <select className={select} value={filterSex} onChange={e => setFilterSex(e.target.value)}>
            {SEXES.map(s => <option key={s}>{s}</option>)}
          </select>
          <select className={select} value={filterBreed} onChange={e => setFilterBreed(e.target.value)}>
            {BREEDS.map(b => <option key={b}>{b}</option>)}
          </select>
          <select className={select} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            {STATUSES.map(s => <option key={s}>{s}</option>)}
          </select>
          <select className={select} value={filterArea} onChange={e => setFilterArea(e.target.value)}>
            <option value="All">All Areas</option>
            {areas.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
        </div>
      </Card>

      {/* Results count */}
      <p className="text-sm text-stone-500 mb-3">{filtered.length} sheep found</p>

      {/* Table */}
      {filtered.length === 0 ? (
        <EmptyState icon={Filter} title="No sheep match your filters" description="Try adjusting the search or filters above." />
      ) : (
        <Card className="overflow-hidden p-0">
          {/* Desktop table */}
          <div className="hidden sm:block">
            <Table>
              <TableHeader className="bg-cream-50">
                <TableRow className="border-cream-200 hover:bg-cream-50">
                  <TableHead className="h-10 px-5 text-xs text-stone-500 uppercase tracking-wide font-semibold">Tag</TableHead>
                  <TableHead className="h-10 px-5 text-xs text-stone-500 uppercase tracking-wide font-semibold">Name</TableHead>
                  <TableHead className="h-10 px-5 text-xs text-stone-500 uppercase tracking-wide font-semibold">Sex</TableHead>
                  <TableHead className="h-10 px-5 text-xs text-stone-500 uppercase tracking-wide font-semibold">Breed</TableHead>
                  <TableHead className="h-10 px-5 text-xs text-stone-500 uppercase tracking-wide font-semibold">Age</TableHead>
                  <TableHead className="h-10 px-5 text-xs text-stone-500 uppercase tracking-wide font-semibold">Area</TableHead>
                  <TableHead className="h-10 px-5 text-xs text-stone-500 uppercase tracking-wide font-semibold">Status</TableHead>
                  <TableHead className="h-10 px-5 text-xs text-stone-500 uppercase tracking-wide font-semibold">Weight</TableHead>
                  <TableHead className="h-10 px-5" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(s => {
                  const area = areas.find(a => a.id === s.areaId)
                  return (
                    <TableRow
                      key={s.id}
                      onClick={() => navigate(`/sheep/${s.id}`)}
                      className="border-cream-100 hover:bg-cream-50 cursor-pointer"
                    >
                      <TableCell className="px-5 py-3 font-semibold text-stone-900">{s.tagNumber}</TableCell>
                      <TableCell className="px-5 py-3 text-stone-600">{s.name || <span className="text-stone-300">—</span>}</TableCell>
                      <TableCell className="px-5 py-3"><Badge variant={s.sex}>{s.sex}</Badge></TableCell>
                      <TableCell className="px-5 py-3 text-stone-700">{s.breed}</TableCell>
                      <TableCell className="px-5 py-3 text-stone-500">{getAge(s.dateOfBirth)}</TableCell>
                      <TableCell className="px-5 py-3 text-stone-600">{area?.name || <span className="text-stone-300">—</span>}</TableCell>
                      <TableCell className="px-5 py-3" onClick={e => e.stopPropagation()}>
                        <select
                          value={s.status}
                          onChange={e => updateSheep(s.id, { status: e.target.value })}
                          className="text-xs border border-cream-200 rounded-lg px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-farm-400 cursor-pointer"
                        >
                          {STATUSES.slice(1).map(st => (
                            <option key={st} value={st}>{st.charAt(0).toUpperCase() + st.slice(1)}</option>
                          ))}
                        </select>
                      </TableCell>
                      <TableCell className="px-5 py-3 text-stone-600">{s.weight ? `${s.weight} kg` : '—'}</TableCell>
                      <TableCell className="px-5 py-3" onClick={e => e.stopPropagation()}>
                        <button
                          onClick={() => navigate(`/sheep/${s.id}`)}
                          className="p-1.5 rounded-lg text-stone-400 hover:text-farm-600 hover:bg-farm-50 transition-colors"
                          title="View sheep"
                        >
                          <ChevronRight size={16} />
                        </button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>

          {/* Mobile cards */}
          <div className="sm:hidden divide-y divide-cream-200">
            {filtered.map(s => {
              const area = areas.find(a => a.id === s.areaId)
              return (
                <div key={s.id} className="flex items-center gap-3 px-4 py-3.5">
                  {/* Tag pill — tapping navigates */}
                  <button
                    onClick={() => navigate(`/sheep/${s.id}`)}
                    className="w-12 h-12 rounded-2xl bg-farm-50 border border-farm-100 flex items-center justify-center flex-shrink-0 active:bg-farm-100"
                  >
                    <span className="text-farm-700 font-bold text-[11px] leading-tight text-center px-0.5 break-all">
                      {s.tagNumber}
                    </span>
                  </button>

                  {/* Info — tapping navigates */}
                  <button
                    onClick={() => navigate(`/sheep/${s.id}`)}
                    className="flex-1 min-w-0 text-left"
                  >
                    <p className="font-semibold text-stone-900 text-sm leading-tight">
                      {s.name || s.tagNumber}
                      {s.name && <span className="font-normal text-stone-400 ml-1">#{s.tagNumber}</span>}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <Badge variant={s.sex} className="!text-[10px] !py-0 !px-1.5">{s.sex}</Badge>
                      <span className="text-xs text-stone-400">{s.breed}</span>
                      {area && (
                        <>
                          <span className="text-stone-300 text-xs">·</span>
                          <span className="text-xs text-stone-400 truncate">{area.name}</span>
                        </>
                      )}
                    </div>
                  </button>

                  {/* Status select + view arrow */}
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <select
                      value={s.status}
                      onChange={e => updateSheep(s.id, { status: e.target.value })}
                      className="text-xs border border-cream-200 rounded-lg px-1.5 py-1 bg-white focus:outline-none"
                      onClick={e => e.stopPropagation()}
                    >
                      {STATUSES.slice(1).map(st => (
                        <option key={st} value={st}>{st.charAt(0).toUpperCase() + st.slice(1)}</option>
                      ))}
                    </select>
                    <button
                      onClick={() => navigate(`/sheep/${s.id}`)}
                      className="p-1 rounded-lg text-stone-300 hover:text-farm-600"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      )}

      <AddSheepModal open={addOpen} onClose={() => setAddOpen(false)} />
    </div>
  )
}
