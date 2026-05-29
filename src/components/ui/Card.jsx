import { cn } from '@/lib/utils'

// ── App Card ────────────────────────────────────────────────────
// Used throughout the app with the custom API: onClick, hover, className
export default function Card({ children, className = '', onClick, hover = false }) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-white dark:bg-[#2D2D2D] rounded-3xl shadow-card border border-cream-200 dark:border-stone-700 p-5',
        hover ? 'cursor-pointer hover:shadow-card-hover transition-shadow' : '',
        className,
      )}
    >
      {children}
    </div>
  )
}

// ── CardHeader ──────────────────────────────────────────────────
export function CardHeader({ title, subtitle, action, icon }) {
  return (
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center gap-2">
        {icon && <span className="text-stone-400">{icon}</span>}
        <div>
          <h2 className="text-base font-semibold text-stone-900 dark:text-stone-100">{title}</h2>
          {subtitle && <p className="text-xs text-stone-400 dark:text-stone-500 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}
