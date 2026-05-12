import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Plus, Search, Filter, ChevronRight } from 'lucide-react'
import { useFarm } from '../context/FarmContext'
import { getAge, getAreaById } from '../data/mockData'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import PageHeader from '../components/ui/PageHeader'
import EmptyState from '../components/ui/EmptyState'

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

  function handleSubmit(e) {
    e.preventDefault()
    addSheep({ ...form, weight: parseFloat(form.weight) || 0 })
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
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit">Save Sheep</Button>
        </div>
      </form>
    </Modal>
  )
}

export default function Sheep() {
  const { sheep, areas } = useFarm()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const [search, setSearch]         = useState('')
  const [filterSex, setFilterSex]   = useState('All')
  const [filterBreed, setFilterBreed] = useState('All')
  const [filterStatus, setFilterStatus] = useState('All')
  const [filterArea, setFilterArea]  = useState('All')
  const [addOpen, setAddOpen]        = useState(false)

  useEffect(() => {
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

  const select = 'text-sm border border-cream-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-farm-400'

  return (
    <div className="max-w-6xl mx-auto">
      <PageHeader
        title="Sheep Records"
        subtitle={`${sheep.filter(s => s.status !== 'sold' && s.status !== 'dead').length} active · ${sheep.length} total`}
        action={<Button onClick={() => setAddOpen(true)} icon={<Plus size={16} />}>Add Sheep</Button>}
      />

      {/* Filters */}
      <Card className="mb-5">
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
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-cream-50 border-b border-cream-200">
                <tr className="text-xs text-stone-500 uppercase tracking-wide">
                  <th className="text-left px-5 py-3 font-semibold">Tag</th>
                  <th className="text-left px-5 py-3 font-semibold">Name</th>
                  <th className="text-left px-5 py-3 font-semibold">Sex</th>
                  <th className="text-left px-5 py-3 font-semibold">Breed</th>
                  <th className="text-left px-5 py-3 font-semibold">Age</th>
                  <th className="text-left px-5 py-3 font-semibold">Area</th>
                  <th className="text-left px-5 py-3 font-semibold">Status</th>
                  <th className="text-left px-5 py-3 font-semibold">Weight</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-100">
                {filtered.map(s => {
                  const area = areas.find(a => a.id === s.areaId)
                  return (
                    <tr
                      key={s.id}
                      onClick={() => navigate(`/sheep/${s.id}`)}
                      className="hover:bg-cream-50 cursor-pointer transition-colors"
                    >
                      <td className="px-5 py-3 font-semibold text-stone-900">{s.tagNumber}</td>
                      <td className="px-5 py-3 text-stone-600">{s.name || <span className="text-stone-300">—</span>}</td>
                      <td className="px-5 py-3"><Badge variant={s.sex}>{s.sex}</Badge></td>
                      <td className="px-5 py-3 text-stone-700">{s.breed}</td>
                      <td className="px-5 py-3 text-stone-500">{getAge(s.dateOfBirth)}</td>
                      <td className="px-5 py-3 text-stone-600">{area?.name || <span className="text-stone-300">—</span>}</td>
                      <td className="px-5 py-3"><Badge variant={s.status}>{s.status}</Badge></td>
                      <td className="px-5 py-3 text-stone-600">{s.weight ? `${s.weight} kg` : '—'}</td>
                      <td className="px-5 py-3 text-stone-400"><ChevronRight size={16} /></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="sm:hidden divide-y divide-cream-100">
            {filtered.map(s => {
              const area = areas.find(a => a.id === s.areaId)
              return (
                <button
                  key={s.id}
                  onClick={() => navigate(`/sheep/${s.id}`)}
                  className="w-full flex items-center gap-4 px-4 py-3.5 hover:bg-cream-50 text-left"
                >
                  <div className="w-10 h-10 rounded-full bg-farm-100 flex items-center justify-center text-farm-700 font-bold text-xs flex-shrink-0">
                    {s.tagNumber.slice(0, 4)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-stone-900">{s.tagNumber}</p>
                      {s.name && <p className="text-stone-500 text-sm truncate">— {s.name}</p>}
                    </div>
                    <p className="text-sm text-stone-500">{s.breed} · {area?.name || '—'}</p>
                  </div>
                  <Badge variant={s.status}>{s.status}</Badge>
                  <ChevronRight size={16} className="text-stone-300 flex-shrink-0" />
                </button>
              )
            })}
          </div>
        </Card>
      )}

      <AddSheepModal open={addOpen} onClose={() => setAddOpen(false)} />
    </div>
  )
}
