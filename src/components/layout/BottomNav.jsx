import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Tag, MapPin, HeartPulse, CheckSquare } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'

const ITEMS = [
  { to: '/',       key: 'nav.dashboard', icon: LayoutDashboard },
  { to: '/sheep',  key: 'nav.sheep',     icon: Tag },
  { to: '/areas',  key: 'nav.areas',     icon: MapPin },
  { to: '/health', key: 'nav.health',    icon: HeartPulse },
  { to: '/tasks',  key: 'nav.tasks',     icon: CheckSquare },
]

export default function BottomNav() {
  const { t } = useLanguage()

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white dark:bg-[#2D2D2D] border-t border-cream-200 dark:border-stone-700 pb-safe">
      <div className="flex">
        {ITEMS.map(({ to, key, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) => [
              'flex-1 flex flex-col items-center gap-1 pt-3 pb-2 transition-colors',
              isActive ? 'text-stone-900 dark:text-stone-100' : 'text-stone-400 dark:text-stone-500',
            ].join(' ')}
          >
            {({ isActive }) => (
              <>
                <div className={[
                  'w-9 h-7 flex items-center justify-center rounded-full transition-colors',
                  isActive ? 'bg-stone-100 dark:bg-stone-700/50' : '',
                ].join(' ')}>
                  <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
                </div>
                <span className="text-[10px] font-medium">{t(key)}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
