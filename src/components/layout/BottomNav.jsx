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
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-cream-200 pb-safe">
      <div className="flex">
        {ITEMS.map(({ to, key, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) => [
              'flex-1 flex flex-col items-center gap-1 pt-3 pb-2 transition-colors',
              isActive ? 'text-farm-400' : 'text-stone-400',
            ].join(' ')}
          >
            {({ isActive }) => (
              <>
                <div className={[
                  'w-9 h-7 flex items-center justify-center rounded-full transition-colors',
                  isActive ? 'bg-farm-100' : '',
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
