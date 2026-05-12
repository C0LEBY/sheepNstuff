import { useNavigate } from 'react-router-dom'
import {
  AlertTriangle, HeartPulse, CheckSquare, Baby, Heart,
  ArrowRight, Scale, TrendingUp, ShoppingCart, Users,
  MapPin, Leaf, ChevronRight, Activity, Stethoscope,
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from 'recharts'
import { useFarm } from '../context/FarmContext'
import Card, { CardHeader } from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import { formatDate, getSheepInArea, monthlyStats } from '../data/mockData'

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

function StatPill({ label, value, accent, onClick }) {
  return (
    <button
      onClick={onClick}
      className={[
        'flex-shrink-0 sm:flex-1 flex flex-col items-center px-4 pt-3.5 pb-3 rounded-2xl shadow-card text-center hover:opacity-80 transition-opacity min-w-[72px]',
        accent ? 'bg-farm-400' : 'bg-white',
      ].join(' ')}
    >
      <p className={`text-2xl font-bold leading-none ${accent ? 'text-white' : 'text-stone-900'}`}>{value}</p>
      <p className={`text-[10px] font-medium mt-1.5 uppercase tracking-wide ${accent ? 'text-white/70' : 'text-stone-400'}`}>{label}</p>
    </button>
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
    activeSheep, sheep, areas, births, tasks,
    stats, healthRecords, breedingRecords, transactions,
  } = useFarm()
  const navigate = useNavigate()
  const today = new Date()

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
      ewe:      activeSheep.find(s => s.id === b.ewedId),
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
    const count = getSheepInArea(a.id).length
    const pct   = Math.round((count / a.capacity) * 100)
    return { ...a, count, pct, gradient: AREA_GRADIENTS[i % AREA_GRADIENTS.length] }
  })

  /* ─────────────────────────── render ─────────────────────── */
  return (
    <div className="max-w-5xl mx-auto space-y-6">

      {/* ══ 1. Farm header ══════════════════════════════════════ */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-stone-400 text-xs uppercase tracking-widest font-medium">Welcome back</p>
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight mt-0.5">Groenplaas</h1>
          <p className="flex items-center gap-1 text-xs text-stone-400 mt-1">
            <MapPin size={11} /> North Cape · Season 2025
          </p>
        </div>
        <div className="w-11 h-11 bg-farm-400 rounded-2xl flex items-center justify-center text-white font-bold text-base flex-shrink-0">
          G
        </div>
      </div>

      {/* ══ 2. Needs attention ══════════════════════════════════ */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-stone-900">Needs Attention</h2>
          {overdueTasks.length === 0 && sickSheep.length === 0 && overdueLambings.length === 0 && (
            <span className="text-xs text-farm-600 font-medium bg-farm-50 px-2.5 py-1 rounded-full">All clear ✓</span>
          )}
        </div>
        <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-1 -mx-4 px-4 sm:mx-0 sm:px-0">
          {overdueLambings.length > 0 && (
            <AttentionCard
              count={overdueLambings.length}
              label="Overdue Lambings"
              sub={overdueLambings.map(b => b.ewe?.tagNumber || '—').join(', ')}
              color="red"
              onClick={() => navigate('/breeding')}
            />
          )}
          {sickSheep.length > 0 && (
            <AttentionCard
              count={sickSheep.length}
              label="Sick Sheep"
              sub={sickSheep.map(s => s.tagNumber).join(', ')}
              color="red"
              onClick={() => navigate('/health')}
            />
          )}
          {overdueFollowUps.length > 0 && (
            <AttentionCard
              count={overdueFollowUps.length}
              label="Treatment Follow-ups"
              sub="Past due date"
              color="amber"
              onClick={() => navigate('/health')}
            />
          )}
          {overdueTasks.length > 0 && (
            <AttentionCard
              count={overdueTasks.length}
              label="Overdue Tasks"
              sub={`${overdueTasks.filter(t => t.priority === 'high').length} high priority`}
              color="amber"
              onClick={() => navigate('/tasks')}
            />
          )}
          {pregnantEwes.length > 0 && (
            <AttentionCard
              count={pregnantEwes.length}
              label="Pregnant Ewes"
              sub="Monitor closely"
              color="purple"
              onClick={() => navigate('/breeding')}
            />
          )}
          {overdueTasks.length === 0 && sickSheep.length === 0 && overdueLambings.length === 0 && (
            <AttentionCard count={0} label="No urgent issues" sub="Farm is running smoothly" color="green" onClick={() => {}} />
          )}
        </div>
      </div>

      {/* ══ 3. Flock overview ═══════════════════════════════════ */}
      <div>
        <h2 className="text-base font-semibold text-stone-900 mb-3">Flock Overview</h2>
        <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-1 -mx-4 px-4 sm:mx-0 sm:px-0">
          <StatPill label="Total"    value={stats.totalSheep}    accent onClick={() => navigate('/sheep')} />
          <StatPill label="Ewes"     value={stats.ewes}          onClick={() => navigate('/sheep')} />
          <StatPill label="Rams"     value={stats.rams}          onClick={() => navigate('/sheep')} />
          <StatPill label="Lambs"    value={stats.lambs}         onClick={() => navigate('/sheep')} />
          <StatPill label="Pregnant" value={stats.pregnantEwes}  onClick={() => navigate('/breeding')} />
          <StatPill label="Sick"     value={stats.sickSheep}     onClick={() => navigate('/health')} />
        </div>
      </div>

      {/* ══ 4. Areas ════════════════════════════════════════════ */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-stone-900">Areas & Paddocks</h2>
          <button onClick={() => navigate('/areas')} className="text-xs text-farm-500 font-medium flex items-center gap-1 hover:text-farm-600">
            Manage <ArrowRight size={12} />
          </button>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {areaCards.map(area => {
            const capacityColor = area.pct >= 85 ? 'bg-red-400' : area.pct >= 60 ? 'bg-amber-400' : 'bg-farm-400'
            const capacityLabel = area.pct >= 85 ? 'Almost full' : area.pct >= 60 ? 'Getting full' : null
            return (
              <div
                key={area.id}
                onClick={() => navigate('/areas')}
                className="rounded-3xl overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                style={{ background: `linear-gradient(145deg, ${area.gradient[0]}, ${area.gradient[1]})`, height: 160 }}
              >
                <div className="h-full p-4 flex flex-col justify-between">
                  <div>
                    <p className="text-white/50 text-[10px] uppercase tracking-wider">Area</p>
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
            title="Health Status"
            action={
              <button onClick={() => navigate('/health')} className="text-xs text-farm-500 font-medium flex items-center gap-1 hover:text-farm-600">
                View <ArrowRight size={12} />
              </button>
            }
          />
          {/* Big health % */}
          <div className="flex items-end gap-3 mb-4">
            <p className="text-5xl font-bold text-stone-900 leading-none">{healthPct}%</p>
            <div className="mb-1">
              <p className="text-xs text-stone-400 font-medium">flock healthy</p>
              <div className="mt-1 w-24 h-1.5 bg-cream-200 rounded-full">
                <div className="h-1.5 bg-farm-400 rounded-full" style={{ width: `${healthPct}%` }} />
              </div>
            </div>
          </div>

          {/* Breakdown */}
          <div className="space-y-2">
            {[
              { label: 'Healthy',  val: healthCount.healthy,  color: 'bg-farm-400'   },
              { label: 'Sick',     val: healthCount.sick,     color: 'bg-red-400'    },
              { label: 'Pregnant', val: healthCount.pregnant, color: 'bg-purple-400' },
              { label: 'Missing',  val: healthCount.missing,  color: 'bg-amber-400', hide: !healthCount.missing },
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
                <p className="text-xs font-semibold">{overdueFollowUps.length} treatment follow-up{overdueFollowUps.length > 1 ? 's' : ''} overdue</p>
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
            title="Tasks & Reminders"
            subtitle={`${overdueTasks.length} overdue · ${tasks.filter(t => !t.completed).length} open`}
            action={
              <button onClick={() => navigate('/tasks')} className="text-xs text-farm-500 font-medium flex items-center gap-1 hover:text-farm-600">
                All <ArrowRight size={12} />
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
          title="Breeding & Lambing"
          action={
            <button onClick={() => navigate('/breeding')} className="text-xs text-farm-500 font-medium flex items-center gap-1 hover:text-farm-600">
              View all <ArrowRight size={12} />
            </button>
          }
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Stats column */}
          <div className="space-y-3">
            {[
              { label: 'Pregnant Ewes',      val: pregnantEwes.length,  unit: 'ewes' },
              { label: 'Births This Season',  val: births.length,        unit: 'recorded' },
              { label: 'Lamb Survival Rate',  val: `${lambSurvivalPct}%`, unit: '' },
              { label: 'Last Birth',          val: recentBirth ? recentBirth.type : '—', unit: recentBirth ? formatDate(recentBirth.date) : '' },
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
            <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-3">Upcoming Lambings</p>
            {lambingList.length === 0 ? (
              <p className="text-sm text-stone-400">No upcoming lambings recorded</p>
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
            title="Weight Insights"
            action={
              <button onClick={() => navigate('/reports')} className="text-xs text-farm-500 font-medium flex items-center gap-1 hover:text-farm-600">
                Reports <ArrowRight size={12} />
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
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#a8a29e' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#a8a29e' }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #E0E1D9', fontSize: 12 }} />
              <Bar dataKey="births" name="Births" radius={[5, 5, 0, 0]} fill="#96CB3A" />
              <Bar dataKey="deaths" name="Deaths" radius={[5, 5, 0, 0]} fill="#fca5a5" />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-4 mt-2 text-xs text-stone-400">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-farm-400 inline-block" /> Births</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-red-300 inline-block" /> Deaths</span>
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
            <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#a8a29e' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: '#a8a29e' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #E0E1D9', fontSize: 12 }}
              formatter={(v, n) => [v, n === 'count' ? 'Sheep' : 'Capacity']} />
            <Bar dataKey="count"    name="count"    radius={[5, 5, 0, 0]} fill="#96CB3A" />
            <Bar dataKey="capacity" name="capacity" radius={[5, 5, 0, 0]} fill="#E3F3CB" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* ══ 9. Sales summary ════════════════════════════════════ */}
      <Card>
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-base font-semibold text-stone-900">Sales & Purchases</h2>
            <p className="text-xs text-stone-400 mt-0.5">{yr} year to date</p>
          </div>
          <button onClick={() => navigate('/sales')} className="text-xs text-farm-500 font-medium flex items-center gap-1 hover:text-farm-600">
            View all <ArrowRight size={12} />
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
