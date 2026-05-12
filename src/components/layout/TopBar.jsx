import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Menu, Search, Plus, X, AlertTriangle, Bell } from 'lucide-react'
import { useFarm } from '../../context/FarmContext'

export default function TopBar({ onMenuClick, title }) {
  const { activeSheep, tasks } = useFarm()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [showSearch, setShowSearch] = useState(false)
  const [showProfile, setShowProfile] = useState(false)

  const overdueTasks = tasks.filter(t => !t.completed && new Date(t.dueDate) < new Date())

  function handleSearch(q) {
    setSearchQuery(q)
    if (q.length < 1) { setSearchResults([]); return }
    const lower = q.toLowerCase()
    const results = activeSheep.filter(s =>
      s.tagNumber.toLowerCase().includes(lower) ||
      (s.name && s.name.toLowerCase().includes(lower)) ||
      s.breed.toLowerCase().includes(lower)
    ).slice(0, 6)
    setSearchResults(results)
  }

  function selectSheep(id) {
    setSearchQuery(''); setSearchResults([]); setShowSearch(false)
    navigate(`/sheep/${id}`)
  }

  return (
    <header className="h-14 bg-white border-b border-cream-200 flex items-center px-4 gap-3 sticky top-0 z-10">
      {/* Hamburger (mobile) */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-xl text-stone-500 hover:bg-cream-100 transition-colors"
      >
        <Menu size={20} />
      </button>

      {/* Page title */}
      <h1 className="text-base font-semibold text-stone-900 flex-1 lg:flex-none">{title}</h1>

      {/* Desktop search */}
      <div className="hidden sm:flex flex-1 max-w-xs relative">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
        <input
          type="text"
          placeholder="Search sheep…"
          value={searchQuery}
          onChange={e => handleSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-2 text-sm bg-cream-100 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-farm-400"
        />
        {searchResults.length > 0 && (
          <div className="absolute top-full mt-2 left-0 right-0 bg-white rounded-2xl shadow-card-lg border border-cream-200 z-50 overflow-hidden">
            {searchResults.map(s => (
              <button
                key={s.id}
                onClick={() => selectSheep(s.id)}
                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-cream-50 text-left transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-farm-100 flex items-center justify-center text-farm-600 text-xs font-bold flex-shrink-0">
                  {s.sex === 'ram' ? '♂' : s.sex === 'ewe' ? '♀' : '✦'}
                </div>
                <div>
                  <p className="text-sm font-medium text-stone-900">{s.tagNumber}{s.name ? ` · ${s.name}` : ''}</p>
                  <p className="text-xs text-stone-400">{s.breed} · {s.sex}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Mobile search toggle */}
      <button
        onClick={() => setShowSearch(v => !v)}
        className="sm:hidden p-2 rounded-xl text-stone-500 hover:bg-cream-100 transition-colors"
      >
        {showSearch ? <X size={18} /> : <Search size={18} />}
      </button>

      {/* Overdue tasks bell */}
      <button
        onClick={() => navigate('/tasks')}
        className="relative p-2 rounded-xl text-stone-500 hover:bg-cream-100 transition-colors"
        title={overdueTasks.length > 0 ? `${overdueTasks.length} overdue tasks` : 'Tasks'}
      >
        {overdueTasks.length > 0
          ? <AlertTriangle size={19} className="text-amber-500" />
          : <Bell size={19} />
        }
        {overdueTasks.length > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-amber-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center leading-none">
            {overdueTasks.length > 9 ? '9+' : overdueTasks.length}
          </span>
        )}
      </button>

      {/* Add sheep */}
      <button
        onClick={() => navigate('/sheep?add=true')}
        className="flex items-center gap-1.5 bg-farm-400 hover:bg-farm-500 text-white text-sm font-semibold px-3.5 py-2 rounded-xl transition-colors"
      >
        <Plus size={16} />
        <span className="hidden sm:inline">Add Sheep</span>
      </button>

      {/* User profile avatar */}
      <div className="relative">
        <button
          onClick={() => setShowProfile(v => !v)}
          className="w-8 h-8 bg-farm-400 rounded-full flex items-center justify-center text-white font-bold text-sm hover:bg-farm-500 transition-colors flex-shrink-0"
        >
          G
        </button>

        {showProfile && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setShowProfile(false)} />
            <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-card-lg border border-cream-200 z-50 overflow-hidden">
              <div className="px-4 py-3.5 border-b border-cream-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-farm-400 rounded-full flex items-center justify-center text-white font-bold">G</div>
                  <div>
                    <p className="text-sm font-semibold text-stone-900">Groenplaas</p>
                    <p className="text-xs text-stone-400">Season 2025</p>
                  </div>
                </div>
              </div>
              <div className="py-1.5">
                {[
                  { label: 'Settings',  to: '/settings' },
                  { label: 'Reports',   to: '/reports'  },
                ].map(({ label, to }) => (
                  <button
                    key={to}
                    onClick={() => { navigate(to); setShowProfile(false) }}
                    className="w-full text-left px-4 py-2.5 text-sm text-stone-700 hover:bg-cream-50 transition-colors"
                  >
                    {label}
                  </button>
                ))}
              </div>
              {overdueTasks.length > 0 && (
                <div className="px-4 py-3 border-t border-cream-100">
                  <button
                    onClick={() => { navigate('/tasks'); setShowProfile(false) }}
                    className="flex items-center gap-2 text-xs text-amber-600 font-semibold hover:text-amber-700"
                  >
                    <AlertTriangle size={13} />
                    {overdueTasks.length} overdue task{overdueTasks.length > 1 ? 's' : ''}
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Mobile search dropdown */}
      {showSearch && (
        <div className="absolute top-14 left-0 right-0 p-3 bg-white border-b border-cream-200 sm:hidden z-10">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              autoFocus
              type="text"
              placeholder="Search sheep…"
              value={searchQuery}
              onChange={e => handleSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 text-sm bg-cream-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-farm-400"
            />
          </div>
          {searchResults.length > 0 && (
            <div className="mt-2 border border-cream-200 rounded-2xl overflow-hidden">
              {searchResults.map(s => (
                <button
                  key={s.id}
                  onClick={() => selectSheep(s.id)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-cream-50 text-left border-b border-cream-100 last:border-0"
                >
                  <p className="text-sm font-medium text-stone-900">{s.tagNumber}{s.name ? ` · ${s.name}` : ''}</p>
                  <p className="text-xs text-stone-400 ml-auto">{s.breed}</p>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </header>
  )
}
