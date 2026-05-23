export default function StatCard({ label, value, icon: Icon, color = 'green', sub }) {
  const colors = {
    green:  { bg: 'bg-farm-50 dark:bg-farm-900/20',     icon: 'bg-farm-100 dark:bg-farm-900/40 text-farm-600 dark:text-farm-400',     val: 'text-stone-900 dark:text-stone-100' },
    purple: { bg: 'bg-purple-50 dark:bg-purple-900/20', icon: 'bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400', val: 'text-stone-900 dark:text-stone-100' },
    red:    { bg: 'bg-red-50 dark:bg-red-900/20',       icon: 'bg-red-100 dark:bg-red-900/40 text-red-500 dark:text-red-400',       val: 'text-stone-900 dark:text-stone-100' },
    amber:  { bg: 'bg-amber-50 dark:bg-amber-900/20',   icon: 'bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400',   val: 'text-stone-900 dark:text-stone-100' },
    blue:   { bg: 'bg-blue-50 dark:bg-blue-900/20',     icon: 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400',     val: 'text-stone-900 dark:text-stone-100' },
    stone:  { bg: 'bg-stone-50 dark:bg-stone-800/40',   icon: 'bg-stone-100 dark:bg-stone-700 text-stone-500 dark:text-stone-400',   val: 'text-stone-900 dark:text-stone-100' },
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
      <p className="text-xs text-stone-400 dark:text-stone-500 font-medium mt-2">{label}</p>
      {sub && <p className="text-xs text-stone-400 dark:text-stone-500 mt-0.5">{sub}</p>}
    </div>
  )
}
