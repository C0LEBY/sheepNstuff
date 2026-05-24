import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AlertTriangle, HeartPulse, CheckSquare, Baby, Heart,
  ArrowRight, Scale, TrendingUp, ShoppingCart, Users,
  MapPin, Leaf, ChevronRight, Activity, Stethoscope, Search, X, Tag, Shield,
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from 'recharts'
import { useFarm } from '../context/FarmContext'
import { useUser } from '../context/UserContext'
import { useLanguage } from '../context/LanguageContext'
import Card, { CardHeader } from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import FarmLogo from '../components/ui/FarmLogo'
function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })
}

/* ─── constants ────────────────────────────────────────────────── */
const AREA_GRADIENTS = [
  ['#1a3d1a', '#0d2410'],
  ['#1e4422', '#0f2812'],
  ['#163d30', '#0a2419'],
  ['#2e3d1a', '#1b2410'],
  ['#1a2a3d', '#0d1a2a'],
  ['#3a2a1a', '#241810'],
]

/* ─── helpers ──────────────────────────────────────────────────── */
function daysFromNow(dateStr) {
  return Math.round((new Date(dateStr) - new Date()) / 86_400_000)
}

/* ─── sub-components ───────────────────────────────────────────── */
function AttentionCard({ count, label, sub, color = 'amber', onClick }) {
  const s = {
    red:    { wrap: 'bg-red-50 border-red-200',       num: 'text-red-600',    dot: 'bg-red-500' },
    amber:  { wrap: 'bg-amber-50 border-amber-200',   num: 'text-amber-700',  dot: 'bg-amber-500' },
    purple: { wrap: 'bg-purple-50 border-purple-200', num: 'text-purple-700', dot: 'bg-purple-400' },
    blue:   { wrap: 'bg-blue-50 border-blue-200',     num: 'text-blue-700',   dot: 'bg-blue-400' },
    green:  { wrap: 'bg-farm-50 border-farm-200',     num: 'text-farm-600',   dot: 'bg-farm-400' },
  }[color]

  return (
    <button
      onClick={onClick}
      className={`flex-shrink-0 sm:flex-1 flex flex-col gap-1.5 p-4 rounded-3xl border text-left hover:opacity-75 transition-opacity min-w-[136px] ${s.wrap}`}
    >
      <div className="flex items-center gap-1.5">
        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${s.dot}`} />
        <p className="text-[10px] font-semibold text-stone-500 uppercase tracking-wide leading-none">{label}</p>
      </div>
      <p className={`text-4xl font-bold leading-none ${s.num}`}>{count}</p>
      <p className="text-xs text-stone-400 leading-snug">{sub}</p>
    </button>
  )
}

/* ─── Flock Overview Style 1 — Kit Widget ──────────────────────
   Label on top, big number, thin coloured progress bar below     */
function FlockStyle1({ items }) {
  return (
    <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-1 -mx-4 px-4 sm:mx-0 sm:px-0">
      {items.map(s => (
        <button key={s.label} onClick={s.onClick}
          className="flex-shrink-0 sm:flex-1 bg-white dark:bg-[#2D2D2D] rounded-2xl p-4 min-w-[90px] text-left border border-cream-200 dark:border-stone-700 hover:shadow-card-hover transition-all">
          <p className="text-xs text-stone-400 font-medium mb-2 truncate">{s.label}</p>
          <p className="text-3xl font-bold text-stone-900 dark:text-stone-100 leading-none">{s.value}</p>
          <div className="mt-3 h-1 bg-cream-200 dark:bg-stone-700 rounded-full overflow-hidden">
            <div className={`h-1 ${s.bar} rounded-full transition-all`} style={{ width: s.pct }} />
          </div>
        </button>
      ))}
    </div>
  )
}

/* ─── Flock Overview Style 2 — Bold Colour Cards ───────────────
   Each stat gets its own vivid solid-colour background           */
function FlockStyle2({ items }) {
  return (
    <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-1 -mx-4 px-4 sm:mx-0 sm:px-0">
      {items.map(s => (
        <button key={s.label} onClick={s.onClick}
          className={`flex-shrink-0 sm:flex-1 ${s.solidBg} rounded-2xl px-4 pt-3.5 pb-3 min-w-[80px] text-center hover:opacity-90 transition-opacity`}>
          <p className="text-2xl font-bold text-white leading-none">{s.value}</p>
          <p className="text-[10px] font-medium mt-1.5 uppercase tracking-wide text-white/75">{s.label}</p>
        </button>
      ))}
    </div>
  )
}

/* ─── Flock Overview Style 3 — Icon + Number Grid ──────────────
   3×2 grid, no scroll, icon bubble + big number + label         */
function FlockStyle3({ items }) {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
      {items.map(s => (
        <button key={s.label} onClick={s.onClick}
          className="bg-white dark:bg-[#2D2D2D] rounded-2xl p-4 flex flex-col items-center text-center gap-2 border border-cream-200 dark:border-stone-700 hover:shadow-card-hover transition-all">
          <div className={`w-9 h-9 ${s.iconBg} dark:bg-opacity-20 rounded-xl flex items-center justify-center flex-shrink-0`}>
            <s.icon size={17} className={s.iconClr} />
          </div>
          <p className="text-2xl font-bold text-stone-900 dark:text-stone-100 leading-none">{s.value}</p>
          <p className="text-[10px] font-medium text-stone-400 dark:text-stone-500 uppercase tracking-wide leading-tight">{s.label}</p>
        </button>
      ))}
    </div>
  )
}

/* ─── Flock Overview Style 4 — Single Summary Card ─────────────
   One card, all stats in a divided row — no scroll              */
function FlockStyle4({ items }) {
  return (
    <div className="bg-white dark:bg-[#2D2D2D] rounded-2xl border border-cream-200 dark:border-stone-700 shadow-card overflow-hidden">
      <div className="grid grid-cols-3 sm:grid-cols-6 divide-x divide-y sm:divide-y-0 divide-cream-200 dark:divide-stone-700">
        {items.map(s => (
          <button key={s.label} onClick={s.onClick}
            className="flex flex-col items-center py-4 px-3 hover:bg-cream-100 dark:hover:bg-[#333333] transition-colors">
            <p className={`text-2xl font-bold leading-none ${s.numClr}`}>{s.value}</p>
            <p className="text-[10px] font-medium text-stone-400 dark:text-stone-500 uppercase tracking-wide mt-1.5">{s.label}</p>
          </button>
        ))}
      </div>
    </div>
  )
}

/* ─── Flock Overview Style 5 — Left-Border Accent Cards ────────
   White cards with a thick coloured left border + sub-label     */
function FlockStyle5({ items }) {
  return (
    <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-1 -mx-4 px-4 sm:mx-0 sm:px-0">
      {items.map(s => (
        <button key={s.label} onClick={s.onClick}
          className={`flex-shrink-0 sm:flex-1 bg-white dark:bg-[#2D2D2D] rounded-r-2xl border-l-4 ${s.border} shadow-card px-4 py-3.5 min-w-[110px] text-left hover:shadow-card-hover transition-all`}>
          <p className="text-xs text-stone-400 dark:text-stone-500 font-medium leading-none truncate">{s.label}</p>
          <p className="text-3xl font-bold text-stone-900 dark:text-stone-100 leading-none my-1.5">{s.value}</p>
          <p className="text-[10px] text-stone-400 dark:text-stone-500 truncate">{s.sub}</p>
        </button>
      ))}
    </div>
  )
}

function TaskRow({ task }) {
  const today = new Date()
  const due   = new Date(task.dueDate)
  const isOverdue = due < today
  const isToday   = due.toDateString() === today.toDateString()

  const dot = isOverdue ? 'bg-red-500' : isToday ? 'bg-amber-400' : 'bg-farm-400'
  const dateClr = isOverdue ? 'text-red-500 font-semibold' : 'text-stone-400'

  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-cream-100 last:border-0">
      <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${dot}`} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-stone-800 leading-snug truncate">{task.title}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className={`text-xs ${dateClr}`}>
            {isOverdue ? 'Overdue · ' : isToday ? 'Today · ' : ''}{formatDate(task.dueDate)}
          </span>
          {task.priority === 'high' && (
            <span className="text-[10px] font-semibold text-red-500 uppercase tracking-wide">High</span>
          )}
        </div>
      </div>
    </div>
  )
}

/* ─── main component ───────────────────────────────────────────── */
export default function Dashboard() {
  const {
    activeSheep, sheep, areas, births, deaths, tasks,
    stats, healthRecords, breedingRecords, transactions,
  } = useFarm()
  const { activeFarm } = useUser()
  const { t } = useLanguage()
  const navigate = useNavigate()
  const today = new Date()

  const [searchQuery, setSearchQuery]   = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [flockStyle, setFlockStyle] = useState(1)

  function handleSearch(q) {
    setSearchQuery(q)
    if (q.length < 1) { setSearchResults([]); return }
    const lower = q.toLowerCase()
    setSearchResults(
      activeSheep.filter(s =>
        s.tagNumber.toLowerCase().includes(lower) ||
        (s.name && s.name.toLowerCase().includes(lower)) ||
        s.breed.toLowerCase().includes(lower)
      ).slice(0, 6)
    )
  }

  function selectSheep(id) {
    setSearchQuery(''); setSearchResults([])
    navigate(`/sheep/${id}`)
  }

  /* ── attention ── */
  const overdueTasks     = tasks.filter(t => !t.completed && new Date(t.dueDate) < today)
  const sickSheep        = activeSheep.filter(s => s.status === 'sick')
  const pregnantEwes     = activeSheep.filter(s => s.status === 'pregnant')
  const overdueLambings  = (breedingRecords || []).filter(
    b => b.status === 'pregnant' && new Date(b.expectedLambingDate) < today
  )
  const overdueFollowUps = healthRecords.filter(
    h => h.followUpDate && new Date(h.followUpDate) < today
  )

  /* ── tasks ── */
  const pendingTasks = tasks
    .filter(t => !t.completed)
    .sort((a, b) => {
      const ao = new Date(a.dueDate) < today
      const bo = new Date(b.dueDate) < today
      if (ao !== bo) return ao ? -1 : 1
      return new Date(a.dueDate) - new Date(b.dueDate)
    })
    .slice(0, 7)

  /* ── health ── */
  const healthCount = {
    healthy:  activeSheep.filter(s => s.status === 'healthy').length,
    sick:     activeSheep.filter(s => s.status === 'sick').length,
    pregnant: activeSheep.filter(s => s.status === 'pregnant').length,
    missing:  activeSheep.filter(s => s.status === 'missing').length,
  }
  const healthPct = Math.round((healthCount.healthy / Math.max(activeSheep.length, 1)) * 100)

  /* ── breeding ── */
  const lambingList = (breedingRecords || [])
    .filter(b => b.status === 'pregnant')
    .map(b => ({
      ...b,
      ewe:      activeSheep.find(s => s.id === b.eweId),
      daysLeft: daysFromNow(b.expectedLambingDate),
    }))
    .sort((a, b) => a.daysLeft - b.daysLeft)

  const totalBorn      = births.reduce((s, b) => s + b.lambCount, 0)
  const totalStill     = births.reduce((s, b) => s + (b.stillborns || 0), 0)
  const lambSurvivalPct = totalBorn > 0
    ? Math.round(((totalBorn - totalStill) / totalBorn) * 100)
    : 0
  const recentBirth = [...births].sort((a, b) => new Date(b.date) - new Date(a.date))[0]

  /* ── weight ── */
  const withWeight    = activeSheep.filter(s => s.weight > 0)
  const avgWeight     = withWeight.length
    ? (withWeight.reduce((s, a) => s + a.weight, 0) / withWeight.length).toFixed(1) : 0
  const ewesW         = withWeight.filter(s => s.sex === 'ewe')
  const avgEweWeight  = ewesW.length
    ? (ewesW.reduce((s, a) => s + a.weight, 0) / ewesW.length).toFixed(1) : 0
  const ramsW         = withWeight.filter(s => s.sex === 'ram')
  const avgRamWeight  = ramsW.length
    ? (ramsW.reduce((s, a) => s + a.weight, 0) / ramsW.length).toFixed(1) : 0
  const heaviestLamb  = withWeight
    .filter(s => s.sex === 'lamb').sort((a, b) => b.weight - a.weight)[0]

  /* ── sales ── */
  const yr              = today.getFullYear()
  const salesYTD        = transactions.filter(t => t.type === 'sale'     && new Date(t.date).getFullYear() === yr)
  const purchasesYTD    = transactions.filter(t => t.type === 'purchase' && new Date(t.date).getFullYear() === yr)
  const incomeYTD       = salesYTD.reduce((s, t) => s + t.totalAmount, 0)
  const spendYTD        = purchasesYTD.reduce((s, t) => s + t.totalAmount, 0)
  const lastSale        = [...transactions]
    .filter(t => t.type === 'sale').sort((a, b) => new Date(b.date) - new Date(a.date))[0]

  /* ── areas ── */
  const areaCards = areas.map((a, i) => {
    const count = sheep.filter(s => s.areaId === a.id && s.status !== 'sold' && s.status !== 'dead').length
    const pct   = Math.round((count / Math.max(a.capacity, 1)) * 100)
    return { ...a, count, pct, gradient: AREA_GRADIENTS[i % AREA_GRADIENTS.length] }
  })

  /* ── monthly chart data ── */
  const MONTH_LABELS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  const monthlyStats = MONTH_LABELS.map((month, i) => ({
    month,
    births: births.filter(b => new Date(b.birthDate || b.date).getMonth() === i).length,
    deaths: deaths.filter(d => new Date(d.date).getMonth() === i).length,
  })).filter((_, i) => {
    // Show the last 10 months
    const nowMonth = today.getMonth()
    const diff = (nowMonth - i + 12) % 12
    return diff < 10
  }).sort((a, b) => {
    const ai = MONTH_LABELS.indexOf(a.month)
    const bi = MONTH_LABELS.indexOf(b.month)
    const nowMonth = today.getMonth()
    return ((ai - nowMonth + 12 - 9) % 12) - ((bi - nowMonth + 12 - 9) % 12)
  })

  /* ─────────────────────────── render ─────────────────────── */
  if (!activeFarm) {
    return (
      <div className="max-w-5xl mx-auto flex flex-col items-center justify-center py-24 text-center">
        <div className="w-16 h-16 bg-farm-100 rounded-3xl flex items-center justify-center mb-5">
          <Leaf size={28} className="text-farm-500" />
        </div>
        <h2 className="text-xl font-bold text-stone-900 mb-2">Welcome to SheepTrack</h2>
        <p className="text-stone-400 text-sm mb-6 max-w-xs">
          You don't have a farm yet. Create your first farm to start tracking your flock.
        </p>
        <button
          onClick={() => navigate('/farms')}
          className="px-5 py-2.5 bg-farm-400 hover:bg-farm-500 text-white font-semibold rounded-xl transition-colors text-sm"
        >
          Create my farm
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">

      {/* ══ 1. Farm header ══════════════════════════════════════ */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-stone-400 text-xs uppercase tracking-widest font-medium">{t('dash.welcomeBack')}</p>
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight mt-0.5">{activeFarm?.name ?? '—'}</h1>
          <p className="flex items-center gap-1 text-xs text-stone-400 mt-1">
            <MapPin size={11} /> {activeFarm?.location ? `${activeFarm.location} · ` : ''}{activeFarm?.season ?? ''}
          </p>
        </div>
        <FarmLogo farm={activeFarm} size="md" />
      </div>

      {/* ══ Search bar ══════════════════════════════════════════ */}
      <div className="relative">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
        <input
          type="text"
          placeholder={t('dash.searchPlaceholder')}
          value={searchQuery}
          onChange={e => handleSearch(e.target.value)}
          className="w-full pl-10 pr-10 py-3 text-sm bg-white rounded-2xl shadow-card focus:outline-none focus:ring-2 focus:ring-farm-400"
        />
        {searchQuery && (
          <button
            onClick={() => { setSearchQuery(''); setSearchResults([]) }}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
          >
            <X size={15} />
          </button>
        )}
        {searchResults.length > 0 && (
          <div className="absolute top-full mt-2 left-0 right-0 bg-white rounded-2xl shadow-card-lg border border-cream-200 z-50 overflow-hidden">
            {searchResults.map(s => (
              <button
                key={s.id}
                onClick={() => selectSheep(s.id)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-cream-50 text-left transition-colors border-b border-cream-100 last:border-0"
              >
                <div className="w-8 h-8 rounded-full bg-farm-100 flex items-center justify-center text-farm-600 text-xs font-bold flex-shrink-0">
                  {s.sex === 'ram' ? '♂' : s.sex === 'ewe' ? '♀' : '✦'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-stone-900">{s.tagNumber}{s.name ? ` · ${s.name}` : ''}</p>
                  <p className="text-xs text-stone-400">{s.breed} · {s.sex}</p>
                </div>
                <ChevronRight size={14} className="text-stone-300 flex-shrink-0" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ══ 3. Flock overview ═══════════════════════════════════ */}
      <div>
        {/* Header + style picker */}
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-stone-900 dark:text-stone-100">{t('dash.flockOverview')}</h2>
          <div className="flex items-center gap-1 bg-cream-200 dark:bg-stone-700 rounded-xl p-1">
            {[
              { n: 1, label: 'Kit'    },
              { n: 2, label: 'Bold'   },
              { n: 3, label: 'Icons'  },
              { n: 4, label: 'Row'    },
              { n: 5, label: 'Border' },
            ].map(({ n, label }) => (
              <button
                key={n}
                onClick={() => setFlockStyle(n)}
                className={[
                  'px-2.5 py-1 rounded-lg text-xs font-semibold transition-all',
                  flockStyle === n
                    ? 'bg-white dark:bg-[#2D2D2D] text-stone-900 dark:text-stone-100 shadow-sm'
                    : 'text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-300',
                ].join(' ')}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Shared data for all styles */}
        {(() => {
          const total = Math.max(stats.totalSheep, 1)
          const items = [
            {
              label: t('label.total'),     value: stats.totalSheep, onClick: () => navigate('/sheep'),
              bar: 'bg-farm-400',          pct: '100%',
              solidBg: 'bg-farm-400',
              icon: Tag,                   iconBg: 'bg-farm-100',    iconClr: 'text-farm-600',
              numClr: 'text-farm-500',
              border: 'border-l-farm-400', sub: 'active sheep',
            },
            {
              label: t('sex.ewes'),        value: stats.ewes,        onClick: () => navigate('/sheep'),
              bar: 'bg-pink-400',          pct: `${Math.round(stats.ewes/total*100)}%`,
              solidBg: 'bg-pink-400',
              icon: Heart,                 iconBg: 'bg-pink-100',    iconClr: 'text-pink-500',
              numClr: 'text-stone-900 dark:text-stone-100',
              border: 'border-l-pink-400', sub: `${Math.round(stats.ewes/total*100)}% of flock`,
            },
            {
              label: t('sex.rams'),        value: stats.rams,        onClick: () => navigate('/sheep'),
              bar: 'bg-blue-400',          pct: `${Math.round(stats.rams/total*100)}%`,
              solidBg: 'bg-blue-500',
              icon: Shield,                iconBg: 'bg-blue-100',    iconClr: 'text-blue-500',
              numClr: 'text-stone-900 dark:text-stone-100',
              border: 'border-l-blue-400', sub: `${Math.round(stats.rams/total*100)}% of flock`,
            },
            {
              label: t('sex.lambs'),       value: stats.lambs,       onClick: () => navigate('/sheep'),
              bar: 'bg-amber-400',         pct: `${Math.round(stats.lambs/total*100)}%`,
              solidBg: 'bg-amber-400',
              icon: Baby,                  iconBg: 'bg-amber-100',   iconClr: 'text-amber-600',
              numClr: 'text-stone-900 dark:text-stone-100',
              border: 'border-l-amber-400',sub: 'this season',
            },
            {
              label: t('status.pregnant'), value: stats.pregnantEwes,onClick: () => navigate('/breeding'),
              bar: 'bg-purple-400',        pct: `${Math.round(stats.pregnantEwes/Math.max(stats.ewes,1)*100)}%`,
              solidBg: 'bg-purple-500',
              icon: Activity,              iconBg: 'bg-purple-100',  iconClr: 'text-purple-500',
              numClr: 'text-purple-600',
              border: 'border-l-purple-400',sub: 'ewes confirmed',
            },
            {
              label: t('status.sick'),     value: stats.sickSheep,   onClick: () => navigate('/health'),
              bar: 'bg-[#FF4C51]',         pct: `${Math.round(stats.sickSheep/total*100)}%`,
              solidBg: 'bg-[#FF4C51]',
              icon: HeartPulse,            iconBg: 'bg-red-100',     iconClr: 'text-red-500',
              numClr: 'text-[#FF4C51]',
              border: 'border-l-[#FF4C51]',sub: 'need attention',
            },
          ]
          if (flockStyle === 1) return <FlockStyle1 items={items} />
          if (flockStyle === 2) return <FlockStyle2 items={items} />
          if (flockStyle === 3) return <FlockStyle3 items={items} />
          if (flockStyle === 4) return <FlockStyle4 items={items} />
          if (flockStyle === 5) return <FlockStyle5 items={items} />
        })()}
      </div>

      {/* ══ 4. Areas ════════════════════════════════════════════ */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-stone-900">{t('dash.areasAndPaddocks')}</h2>
          <button onClick={() => navigate('/areas')} className="text-xs text-farm-500 font-medium flex items-center gap-1 hover:text-farm-600">
            {t('action.manage')} <ArrowRight size={12} />
          </button>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {areaCards.map(area => {
            const capacityColor = area.pct >= 85 ? 'bg-red-400' : area.pct >= 60 ? 'bg-amber-400' : 'bg-farm-400'
            const capacityLabel = area.pct >= 85 ? t('dash.almostFull') : area.pct >= 60 ? t('dash.gettingFull') : null
            return (
              <div
                key={area.id}
                onClick={() => navigate('/areas')}
                className="rounded-3xl overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                style={{ background: `linear-gradient(145deg, ${area.gradient[0]}, ${area.gradient[1]})`, height: 160 }}
              >
                <div className="h-full p-4 flex flex-col justify-between">
                  <div>
                    <p className="text-white/50 text-[10px] uppercase tracking-wider">{t('label.area')}</p>
                    <p className="text-white font-semibold text-sm mt-1 leading-tight">{area.name}</p>
                    <p className="text-white/60 text-xs mt-1.5">{area.count}/{area.capacity}</p>
                    {capacityLabel && (
                      <p className="text-amber-300 text-[10px] font-semibold mt-1">{capacityLabel}</p>
                    )}
                  </div>
                  <div>
                    <div className="h-1 bg-white/20 rounded-full mb-2.5">
                      <div className={`h-1 rounded-full ${capacityColor}`} style={{ width: `${Math.min(area.pct, 100)}%` }} />
                    </div>
                    <div className="flex justify-end">
                      <div className="w-7 h-7 bg-farm-400 rounded-full flex items-center justify-center">
                        <ArrowRight size={13} className="text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ══ 5. Health + Tasks ════════════════════════════════════ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        {/* Health status */}
        <Card>
          <CardHeader
            title={t('dash.healthStatus')}
            action={
              <button onClick={() => navigate('/health')} className="text-xs text-farm-500 font-medium flex items-center gap-1 hover:text-farm-600">
                {t('action.view')} <ArrowRight size={12} />
              </button>
            }
          />
          {/* Big health % */}
          <div className="flex items-end gap-3 mb-4">
            <p className="text-5xl font-bold text-stone-900 leading-none">{healthPct}%</p>
            <div className="mb-1">
              <p className="text-xs text-stone-400 font-medium">{t('dash.flockHealthy')}</p>
              <div className="mt-1 w-24 h-1.5 bg-cream-200 rounded-full">
                <div className="h-1.5 bg-farm-400 rounded-full" style={{ width: `${healthPct}%` }} />
              </div>
            </div>
          </div>

          {/* Breakdown */}
          <div className="space-y-2">
            {[
              { label: t('status.healthy'),  val: healthCount.healthy,  color: 'bg-farm-400'   },
              { label: t('status.sick'),     val: healthCount.sick,     color: 'bg-red-400'    },
              { label: t('status.pregnant'), val: healthCount.pregnant, color: 'bg-purple-400' },
              { label: t('status.missing'),  val: healthCount.missing,  color: 'bg-amber-400', hide: !healthCount.missing },
            ].filter(r => !r.hide).map(row => (
              <div key={row.label} className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${row.color}`} />
                <p className="text-sm text-stone-600 flex-1">{row.label}</p>
                <p className="text-sm font-semibold text-stone-900">{row.val}</p>
              </div>
            ))}
          </div>

          {/* Overdue follow-ups */}
          {overdueFollowUps.length > 0 && (
            <div className="mt-4 pt-4 border-t border-cream-100">
              <div className="flex items-center gap-2 text-amber-600">
                <AlertTriangle size={13} />
                <p className="text-xs font-semibold">{overdueFollowUps.length} {overdueFollowUps.length > 1 ? t('dash.overdueFollowUps') : t('dash.overdueFollowUp')}</p>
              </div>
            </div>
          )}

          {/* Sick sheep list */}
          {sickSheep.length > 0 && (
            <div className="mt-4 space-y-2">
              {sickSheep.map(s => (
                <button
                  key={s.id}
                  onClick={() => navigate(`/sheep/${s.id}`)}
                  className="w-full flex items-center gap-3 p-2 rounded-2xl hover:bg-cream-100 text-left transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-500 font-bold text-xs flex-shrink-0">
                    {s.tagNumber.slice(0, 3)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-stone-900">{s.tagNumber}{s.name ? ` · ${s.name}` : ''}</p>
                    <p className="text-xs text-stone-400 truncate">{s.notes || s.breed}</p>
                  </div>
                  <ChevronRight size={14} className="text-stone-300 flex-shrink-0" />
                </button>
              ))}
            </div>
          )}
        </Card>

        {/* Tasks */}
        <Card>
          <CardHeader
            title={t('dash.tasksAndReminders')}
            subtitle={`${overdueTasks.length} ${t('dash.overdue')} · ${tasks.filter(tk => !tk.completed).length} ${t('dash.open')}`}
            action={
              <button onClick={() => navigate('/tasks')} className="text-xs text-farm-500 font-medium flex items-center gap-1 hover:text-farm-600">
                {t('label.all')} <ArrowRight size={12} />
              </button>
            }
          />
          <div className="divide-y divide-cream-100">
            {pendingTasks.map(t => <TaskRow key={t.id} task={t} />)}
          </div>
        </Card>
      </div>

      {/* ══ 6. Breeding & Lambing ════════════════════════════════ */}
      <Card>
        <CardHeader
          title={t('dash.breedingAndLambing')}
          action={
            <button onClick={() => navigate('/breeding')} className="text-xs text-farm-500 font-medium flex items-center gap-1 hover:text-farm-600">
              {t('action.viewAll')} <ArrowRight size={12} />
            </button>
          }
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Stats column */}
          <div className="space-y-3">
            {[
              { label: t('dash.pregnantEwes'),     val: pregnantEwes.length,   unit: t('dash.ewes') },
              { label: t('dash.birthsThisSeason'), val: births.length,          unit: t('dash.recorded') },
              { label: t('dash.lambSurvivalRate'), val: `${lambSurvivalPct}%`,  unit: '' },
              { label: t('dash.lastBirth'),        val: recentBirth ? recentBirth.type : '—', unit: recentBirth ? formatDate(recentBirth.date) : '' },
            ].map(row => (
              <div key={row.label} className="flex items-center justify-between py-2 border-b border-cream-100 last:border-0">
                <p className="text-sm text-stone-500">{row.label}</p>
                <p className="text-sm font-semibold text-stone-900">
                  {row.val} <span className="font-normal text-stone-400">{row.unit}</span>
                </p>
              </div>
            ))}
          </div>

          {/* Upcoming lambings */}
          <div>
            <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-3">{t('dash.upcomingLambings')}</p>
            {lambingList.length === 0 ? (
              <p className="text-sm text-stone-400">{t('dash.noUpcomingLambings')}</p>
            ) : (
              <div className="space-y-2.5">
                {lambingList.slice(0, 4).map(b => (
                  <div key={b.id} className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${b.daysLeft < 0 ? 'bg-red-500' : b.daysLeft <= 7 ? 'bg-amber-400' : 'bg-farm-400'}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-stone-800">
                        {b.ewe?.tagNumber || '—'}{b.ewe?.name ? ` · ${b.ewe.name}` : ''}
                      </p>
                      <p className="text-xs text-stone-400">{formatDate(b.expectedLambingDate)}</p>
                    </div>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      b.daysLeft < 0
                        ? 'bg-red-100 text-red-600'
                        : b.daysLeft <= 7
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-farm-100 text-farm-700'
                    }`}>
                      {b.daysLeft < 0 ? `${Math.abs(b.daysLeft)}d overdue` : b.daysLeft === 0 ? 'Today' : `in ${b.daysLeft}d`}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* ══ 7. Weight insights + reports chart ══════════════════ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        {/* Weight insights */}
        <Card>
          <CardHeader
            title={t('dash.weightAndGrowth')}
            action={
              <button onClick={() => navigate('/reports')} className="text-xs text-farm-500 font-medium flex items-center gap-1 hover:text-farm-600">
                {t('nav.reports')} <ArrowRight size={12} />
              </button>
            }
          />
          <div className="space-y-0">
            {[
              { label: 'Avg Body Weight',  val: `${avgWeight} kg`,      icon: Scale },
              { label: 'Avg Ewe Weight',   val: `${avgEweWeight} kg`,   icon: Scale },
              { label: 'Avg Ram Weight',   val: `${avgRamWeight} kg`,   icon: TrendingUp },
              { label: 'Fastest Growing',  val: heaviestLamb ? `${heaviestLamb.tagNumber} · ${heaviestLamb.weight}kg` : '—', icon: Activity },
            ].map(row => (
              <div key={row.label} className="flex items-center gap-3 py-2.5 border-b border-cream-100 last:border-0">
                <div className="w-8 h-8 bg-cream-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <row.icon size={15} className="text-stone-500" />
                </div>
                <p className="text-sm text-stone-500 flex-1">{row.label}</p>
                <p className="text-sm font-semibold text-stone-900">{row.val}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Births & Deaths chart */}
        <Card>
          <CardHeader
            title="Births & Deaths"
            subtitle="Monthly this year"
            action={
              <button onClick={() => navigate('/reports')} className="text-xs text-farm-500 font-medium flex items-center gap-1 hover:text-farm-600">
                Reports <ArrowRight size={12} />
              </button>
            }
          />
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={monthlyStats} barCategoryGap="25%" barGap={3} margin={{ top: 4, right: 4, bottom: 0, left: -18 }}>
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#969696' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#969696' }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #E8E8E8', fontSize: 12 }} />
              <Bar dataKey="births" name="Births" radius={[5, 5, 0, 0]} fill="#56CA00" />
              <Bar dataKey="deaths" name="Deaths" radius={[5, 5, 0, 0]} fill="#FF4C51" />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-4 mt-2 text-xs text-stone-400">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-farm-400 inline-block" /> Births</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-[#FF4C51] inline-block" /> Deaths</span>
          </div>
        </Card>
      </div>

      {/* ══ 8. Area occupancy chart ══════════════════════════════ */}
      <Card>
        <CardHeader
          title="Area Occupancy"
          subtitle="Sheep vs capacity"
          action={
            <button onClick={() => navigate('/areas')} className="text-xs text-farm-500 font-medium flex items-center gap-1 hover:text-farm-600">
              Manage <ArrowRight size={12} />
            </button>
          }
        />
        <ResponsiveContainer width="100%" height={160}>
          <BarChart
            data={areaCards.map(a => ({
              name: a.name.replace(' Paddock', '').replace(' Pen', '').replace(' Camp', ''),
              count: a.count,
              capacity: a.capacity,
            }))}
            barCategoryGap="30%"
            margin={{ top: 4, right: 4, bottom: 0, left: -18 }}
          >
            <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#969696' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: '#969696' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #E8E8E8', fontSize: 12 }}
              formatter={(v, n) => [v, n === 'count' ? 'Sheep' : 'Capacity']} />
            <Bar dataKey="count"    name="count"    radius={[5, 5, 0, 0]} fill="#56CA00" />
            <Bar dataKey="capacity" name="capacity" radius={[5, 5, 0, 0]} fill="#ABEA70" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* ══ 9. Sales summary ════════════════════════════════════ */}
      <Card>
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-base font-semibold text-stone-900">{t('page.sales.title')}</h2>
            <p className="text-xs text-stone-400 mt-0.5">{yr} year to date</p>
          </div>
          <button onClick={() => navigate('/sales')} className="text-xs text-farm-500 font-medium flex items-center gap-1 hover:text-farm-600">
            {t('action.viewAll')} <ArrowRight size={12} />
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
          {[
            { label: 'Sales',          val: `R ${incomeYTD.toLocaleString()}`,  sub: `${salesYTD.length} transactions`,      icon: TrendingUp, color: 'text-farm-600 bg-farm-50' },
            { label: 'Purchases',      val: `R ${spendYTD.toLocaleString()}`,   sub: `${purchasesYTD.length} transactions`,   icon: ShoppingCart, color: 'text-blue-600 bg-blue-50' },
            { label: 'Net',            val: `R ${(incomeYTD - spendYTD).toLocaleString()}`, sub: 'income minus spend', icon: Activity, color: (incomeYTD - spendYTD) >= 0 ? 'text-farm-600 bg-farm-50' : 'text-red-600 bg-red-50' },
            { label: 'Last Sale',      val: lastSale ? formatDate(lastSale.date) : '—', sub: lastSale ? `R ${lastSale.totalAmount?.toLocaleString()} · ${lastSale.party}` : 'No sales yet', icon: ShoppingCart, color: 'text-stone-600 bg-stone-50' },
          ].map(item => (
            <div key={item.label} className={`rounded-2xl p-3.5 ${item.color.split(' ')[1]}`}>
              <p className="text-xs text-stone-400 font-medium mb-1">{item.label}</p>
              <p className={`text-base font-bold ${item.color.split(' ')[0]}`}>{item.val}</p>
              <p className="text-xs text-stone-400 mt-0.5 leading-snug">{item.sub}</p>
            </div>
          ))}
        </div>
      </Card>

    </div>
  )
}
