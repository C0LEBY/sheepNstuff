import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Tag, MapPin, Baby, HeartPulse,
  Heart, ShoppingCart, CheckSquare, BarChart3, Settings, X, Plus
} from 'lucide-react'
import { useUser } from '../../context/UserContext'
import { useLanguage } from '../../context/LanguageContext'
import FarmLogo from '../ui/FarmLogo'

const NAV_ITEMS = [
  { to: '/',          key: 'nav.dashboard', icon: LayoutDashboard },
  { to: '/sheep',     key: 'nav.sheep',     icon: Tag },
  { to: '/areas',     key: 'nav.areas',     icon: MapPin },
  { to: '/births',    key: 'nav.births',    icon: Baby },
  { to: '/health',    key: 'nav.health',    icon: HeartPulse },
  { to: '/breeding',  key: 'nav.breeding',  icon: Heart },
  { to: '/sales',     key: 'nav.sales',     icon: ShoppingCart },
  { to: '/tasks',     key: 'nav.tasks',     icon: CheckSquare },
  { to: '/reports',   key: 'nav.reports',   icon: BarChart3 },
  { to: '/settings',  key: 'nav.settings',  icon: Settings },
]

export default function Sidebar({ open, onClose }) {
  const { activeFarm } = useUser()
  const { t } = useLanguage()
  const navigate = useNavigate()

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={[
        'fixed top-0 left-0 h-full w-64 bg-white border-r border-cream-200 flex flex-col z-30 transition-transform duration-300',
        open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
      ].join(' ')}>

        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-cream-200">
          <div className="flex flex-col items-center gap-1">
            <img src="/sheep-logo.jpg" alt="Sheep N Stuff" className="w-10 h-10 object-contain" />
            <span className="font-bold text-stone-900 text-sm tracking-tight">SheepTrack</span>
          </div>
          <button onClick={onClose} className="lg:hidden p-1.5 rounded-lg text-stone-400 hover:bg-cream-100">
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 scrollbar-thin">
          <div className="space-y-0.5">
            {NAV_ITEMS.map(({ to, key, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                onClick={onClose}
                className={({ isActive }) => [
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-farm-100 text-farm-600'
                    : 'text-stone-500 hover:bg-cream-100 hover:text-stone-800',
                ].join(' ')}
              >
                {({ isActive }) => (
                  <>
                    <Icon size={18} strokeWidth={isActive ? 2.5 : 1.8} />
                    {t(key)}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </nav>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-cream-200">
          {activeFarm ? (
            <button
              onClick={() => { navigate('/farms'); onClose() }}
              className="flex items-center gap-2.5 w-full text-left hover:opacity-80 transition-opacity"
            >
              <FarmLogo farm={activeFarm} size="sm" />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-stone-800 truncate">{activeFarm.name}</p>
                <p className="text-xs text-stone-400">{activeFarm.season}</p>
              </div>
            </button>
          ) : (
            <button
              onClick={() => { navigate('/farms'); onClose() }}
              className="flex items-center gap-2 text-sm text-farm-600 font-medium hover:text-farm-700 transition-colors"
            >
              <Plus size={15} />
              Create your first farm
            </button>
          )}
        </div>
      </aside>
    </>
  )
}
