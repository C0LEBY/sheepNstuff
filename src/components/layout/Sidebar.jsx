import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Tag, MapPin, Baby, HeartPulse,
  Heart, ShoppingCart, CheckSquare, BarChart3, Settings, X
} from 'lucide-react'

const navItems = [
  { to: '/',          label: 'Dashboard',  icon: LayoutDashboard },
  { to: '/sheep',     label: 'Sheep',      icon: Tag },
  { to: '/areas',     label: 'Areas',      icon: MapPin },
  { to: '/births',    label: 'Births',     icon: Baby },
  { to: '/health',    label: 'Health',     icon: HeartPulse },
  { to: '/breeding',  label: 'Breeding',   icon: Heart },
  { to: '/sales',     label: 'Sales',      icon: ShoppingCart },
  { to: '/tasks',     label: 'Tasks',      icon: CheckSquare },
  { to: '/reports',   label: 'Reports',    icon: BarChart3 },
  { to: '/settings',  label: 'Settings',   icon: Settings },
]

export default function Sidebar({ open, onClose }) {
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
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-farm-400 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xs tracking-tight">ST</span>
            </div>
            <span className="font-bold text-stone-900 text-lg tracking-tight">SheepTrack</span>
          </div>
          <button onClick={onClose} className="lg:hidden p-1.5 rounded-lg text-stone-400 hover:bg-cream-100">
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 scrollbar-thin">
          <div className="space-y-0.5">
            {navItems.map(({ to, label, icon: Icon }) => (
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
                    {label}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </nav>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-cream-200">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-farm-400 rounded-full flex items-center justify-center text-white font-bold text-xs">G</div>
            <div>
              <p className="text-sm font-semibold text-stone-800">Groenplaas</p>
              <p className="text-xs text-stone-400">Season 2025</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
