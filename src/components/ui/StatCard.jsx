export default function StatCard({ label, value, icon: Icon, color = 'green', sub }) {
  const colors = {
    green:  { bg: 'bg-farm-50',    icon: 'bg-farm-100 text-farm-600',     val: 'text-stone-900' },
    purple: { bg: 'bg-purple-50',  icon: 'bg-purple-100 text-purple-600', val: 'text-stone-900' },
    red:    { bg: 'bg-red-50',     icon: 'bg-red-100 text-red-500',       val: 'text-stone-900' },
    amber:  { bg: 'bg-amber-50',   icon: 'bg-amber-100 text-amber-600',   val: 'text-stone-900' },
    blue:   { bg: 'bg-blue-50',    icon: 'bg-blue-100 text-blue-600',     val: 'text-stone-900' },
    stone:  { bg: 'bg-stone-50',   icon: 'bg-stone-100 text-stone-500',   val: 'text-stone-900' },
  }
  const c = colors[color] || colors.green

  return (
    <div className={`${c.bg} rounded-3xl p-5`}>
      {Icon && (
        <div className={`${c.icon} w-10 h-10 rounded-2xl flex items-center justify-center mb-3`}>
          <Icon size={20} />
        </div>
      )}
      <p className={`text-3xl font-bold ${c.val} leading-none`}>{value}</p>
      <p className="text-xs text-stone-400 font-medium mt-2">{label}</p>
      {sub && <p className="text-xs text-stone-400 mt-0.5">{sub}</p>}
    </div>
  )
}
