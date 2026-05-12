import { useState } from 'react'
import { Plus, CheckSquare, Check, Clock, AlertTriangle } from 'lucide-react'
import { useFarm } from '../context/FarmContext'
import { getAreaById, formatDate } from '../data/mockData'
import Card, { CardHeader } from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import PageHeader from '../components/ui/PageHeader'

const CATEGORIES = ['vaccination', 'health', 'movement', 'maintenance', 'general', 'breeding', 'feeding']

function AddTaskModal({ open, onClose }) {
  const { areas, addTask } = useFarm()
  const [form, setForm] = useState({
    title: '',
    category: 'general',
    dueDate: '',
    priority: 'medium',
    notes: '',
    areaId: '',
  })

  function set(k, v) { setForm(f => ({ ...f, [k]: v })) }

  function handleSubmit(e) {
    e.preventDefault()
    addTask({ ...form, areaId: form.areaId || null })
    onClose()
    setForm({ title: '', category: 'general', dueDate: '', priority: 'medium', notes: '', areaId: '' })
  }

  const field = 'w-full px-3 py-2.5 text-sm border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-farm-400 bg-white'
  const label = 'block text-sm font-medium text-stone-700 mb-1'

  return (
    <Modal open={open} onClose={onClose} title="Add Task" size="sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={label}>Task *</label>
          <input required className={field} placeholder="What needs to be done?" value={form.title} onChange={e => set('title', e.target.value)} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={label}>Category</label>
            <select className={field} value={form.category} onChange={e => set('category', e.target.value)}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
            </select>
          </div>
          <div>
            <label className={label}>Priority</label>
            <select className={field} value={form.priority} onChange={e => set('priority', e.target.value)}>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>

        <div>
          <label className={label}>Due Date</label>
          <input type="date" className={field} value={form.dueDate} onChange={e => set('dueDate', e.target.value)} />
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
          <textarea rows={2} className={field} placeholder="Any details…" value={form.notes} onChange={e => set('notes', e.target.value)} />
        </div>

        <div className="flex justify-end gap-3 pt-1">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit">Add Task</Button>
        </div>
      </form>
    </Modal>
  )
}

function TaskItem({ task, onToggle, areas }) {
  const area = areas.find(a => a.id === task.areaId)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const due = task.dueDate ? new Date(task.dueDate) : null
  if (due) due.setHours(0, 0, 0, 0)

  const isOverdue  = due && due < today && !task.completed
  const isDueToday = due && due.getTime() === today.getTime() && !task.completed

  const priorityDot = {
    high:   'bg-red-400',
    medium: 'bg-amber-400',
    low:    'bg-farm-400',
  }

  return (
    <div className={[
      'flex items-start gap-4 p-4 rounded-xl transition-all',
      task.completed ? 'opacity-50' : isOverdue ? 'bg-red-50 border border-red-100' : isDueToday ? 'bg-amber-50 border border-amber-100' : 'bg-white border border-cream-200',
    ].join(' ')}>
      {/* Checkbox */}
      <button
        onClick={() => onToggle(task.id)}
        className={[
          'w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all',
          task.completed ? 'bg-farm-500 border-farm-500 text-white' : 'border-cream-300 hover:border-farm-400',
        ].join(' ')}
      >
        {task.completed && <Check size={13} strokeWidth={3} />}
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-start gap-2">
          <p className={`text-sm font-medium leading-snug ${task.completed ? 'line-through text-stone-400' : 'text-stone-800'}`}>
            {task.title}
          </p>
          <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-1.5 ${priorityDot[task.priority]}`} />
        </div>

        <div className="flex flex-wrap gap-2 mt-1.5 items-center">
          <Badge variant="default" className="bg-stone-100 text-stone-600">{task.category}</Badge>
          {area && <span className="text-xs text-stone-400">{area.name}</span>}
          {task.dueDate && (
            <span className={`text-xs flex items-center gap-1 ${
              isOverdue ? 'text-red-600 font-medium' :
              isDueToday ? 'text-amber-600 font-medium' : 'text-stone-400'
            }`}>
              {isOverdue && <AlertTriangle size={11} />}
              {isDueToday && <Clock size={11} />}
              {isOverdue ? 'Overdue · ' : isDueToday ? 'Due today · ' : ''}{formatDate(task.dueDate)}
            </span>
          )}
        </div>

        {task.notes && !task.completed && (
          <p className="text-xs text-stone-400 mt-1">{task.notes}</p>
        )}
      </div>
    </div>
  )
}

export default function Tasks() {
  const { tasks, areas, toggleTask } = useFarm()
  const [addOpen, setAddOpen] = useState(false)
  const [showCompleted, setShowCompleted] = useState(false)
  const [filterCat, setFilterCat] = useState('All')

  const open      = tasks.filter(t => !t.completed)
  const completed = tasks.filter(t => t.completed)

  const filtered = open
    .filter(t => filterCat === 'All' || t.category === filterCat)
    .sort((a, b) => {
      // Sort by overdue first, then by due date, then by priority
      const aOver = a.dueDate && new Date(a.dueDate) < new Date() ? -1 : 0
      const bOver = b.dueDate && new Date(b.dueDate) < new Date() ? -1 : 0
      if (aOver !== bOver) return aOver - bOver
      const priMap = { high: 0, medium: 1, low: 2 }
      return (priMap[a.priority] || 1) - (priMap[b.priority] || 1)
    })

  const overdue = open.filter(t => t.dueDate && new Date(t.dueDate) < new Date())

  return (
    <div className="max-w-2xl mx-auto">
      <PageHeader
        title="Tasks & Reminders"
        subtitle={`${open.length} open · ${overdue.length} overdue`}
        action={<Button onClick={() => setAddOpen(true)} icon={<Plus size={16} />}>Add Task</Button>}
      />

      {/* Category filter */}
      <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
        {['All', ...CATEGORIES].map(c => (
          <button
            key={c}
            onClick={() => setFilterCat(c)}
            className={[
              'px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors flex-shrink-0',
              filterCat === c ? 'bg-farm-600 text-white' : 'bg-white text-stone-600 hover:bg-cream-100 shadow-card',
            ].join(' ')}
          >
            {c.charAt(0).toUpperCase() + c.slice(1)}
          </button>
        ))}
      </div>

      {/* Open tasks */}
      {filtered.length === 0 && filterCat === 'All' ? (
        <div className="bg-farm-50 border border-farm-200 rounded-2xl px-5 py-8 text-center mb-5">
          <CheckSquare size={32} className="text-farm-400 mx-auto mb-3" />
          <p className="font-semibold text-farm-700">All done!</p>
          <p className="text-sm text-farm-500 mt-1">No open tasks. Add a new task to get started.</p>
        </div>
      ) : (
        <div className="space-y-2 mb-6">
          {filtered.map(task => (
            <TaskItem key={task.id} task={task} onToggle={toggleTask} areas={areas} />
          ))}
        </div>
      )}

      {/* Completed section */}
      {completed.length > 0 && (
        <div>
          <button
            onClick={() => setShowCompleted(v => !v)}
            className="flex items-center gap-2 text-sm text-stone-500 hover:text-stone-700 mb-3"
          >
            <Check size={15} className="text-farm-500" />
            {showCompleted ? 'Hide' : 'Show'} {completed.length} completed task{completed.length !== 1 ? 's' : ''}
          </button>
          {showCompleted && (
            <div className="space-y-2">
              {completed.map(task => (
                <TaskItem key={task.id} task={task} onToggle={toggleTask} areas={areas} />
              ))}
            </div>
          )}
        </div>
      )}

      <AddTaskModal open={addOpen} onClose={() => setAddOpen(false)} />
    </div>
  )
}
