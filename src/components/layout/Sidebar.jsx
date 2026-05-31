import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Tag, MapPin, Baby, HeartPulse,
  Heart, ShoppingCart, CheckSquare, BarChart3, Settings, X, Plus, Layers2,
} from 'lucide-react'
import { useUser }     from '../../context/UserContext'
import { useLanguage } from '../../context/LanguageContext'
import FarmLogo        from '../ui/FarmLogo'

/* ── Navigation items ──────────────────────────────────────────── */
const MAIN_NAV = [
  { to: '/',         key: 'nav.dashboard', icon: LayoutDashboard },
  { to: '/sheep',    key: 'nav.sheep',     icon: Tag             },
  { to: '/groups',   key: 'nav.groups',    icon: Layers2         },
  { to: '/areas',    key: 'nav.areas',     icon: MapPin          },
  { to: '/births',   key: 'nav.births',    icon: Baby            },
  { to: '/health',   key: 'nav.health',    icon: HeartPulse      },
  { to: '/breeding', key: 'nav.breeding',  icon: Heart           },
  { to: '/sales',    key: 'nav.sales',     icon: ShoppingCart    },
  { to: '/tasks',    key: 'nav.tasks',     icon: CheckSquare     },
  { to: '/reports',  key: 'nav.reports',   icon: BarChart3       },
]

/* ── Single nav item ───────────────────────────────────────────── */
function NavItem({ to, icon: Icon, label, onClose }) {
  return (
    <NavLink
      to={to}
      end={to === '/'}
      onClick={onClose}
      className={({ isActive }) =>
        [
          'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
          isActive
            ? 'bg-white/[0.08] text-white'
            : 'text-slate-400 hover:text-slate-200 hover:bg-white/5',
        ].join(' ')
      }
    >
      <Icon size={18} strokeWidth={1.5} />
      <span>{label}</span>
    </NavLink>
  )
}

/* ── Sidebar ───────────────────────────────────────────────────── */
export default function Sidebar({ open, onClose }) {
  const { activeFarm } = useUser()
  const { t }          = useLanguage()
  const navigate       = useNavigate()

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={[
          'fixed top-0 left-0 h-full w-64 bg-[#111827] flex flex-col z-30 transition-transform duration-300',
          open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        ].join(' ')}
      >

        {/* ── Header ─────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-5 h-14 flex-shrink-0">
          <div className="flex items-center gap-3">
            <img
              src="/sheep-logo.png"
              alt="SheepTrack"
              className="w-8 h-8 object-contain brightness-0 invert"
            />
            <span className="font-bold text-white text-base tracking-tight leading-none">
              SheepTrack
            </span>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-colors"
          >
            <X size={17} />
          </button>
        </div>

        {/* ── Main nav ───────────────────────────────────────── */}
        <nav className="flex-1 overflow-y-auto px-3 scrollbar-dark">
          <div className="space-y-0.5">
            {MAIN_NAV.map(({ to, key, icon }) => (
              <NavItem
                key={to}
                to={to}
                icon={icon}
                label={t(key)}
                onClose={onClose}
              />
            ))}
          </div>

          {/* Divider */}
          <div className="my-3 border-t border-white/[0.06]" />

          {/* Settings */}
          <NavItem
            to="/settings"
            icon={Settings}
            label={t('nav.settings')}
            onClose={onClose}
          />
        </nav>

        {/* ── Farm footer ────────────────────────────────────── */}
        <div className="flex-shrink-0 px-4 py-4 border-t border-white/[0.06]">
          {activeFarm ? (
            <button
              onClick={() => { navigate('/farms'); onClose() }}
              className="flex items-center gap-2.5 w-full text-left rounded-lg px-2 py-2 -mx-2 hover:bg-white/5 transition-colors group"
            >
              <FarmLogo farm={activeFarm} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-200 truncate leading-tight">
                  {activeFarm.name}
                </p>
                <p className="text-xs text-slate-500 group-hover:text-slate-400 transition-colors mt-0.5">
                  Switch farm
                </p>
              </div>
            </button>
          ) : (
            <button
              onClick={() => { navigate('/farms'); onClose() }}
              className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 font-medium transition-colors"
            >
              <Plus size={15} strokeWidth={2} />
              Create your first farm
            </button>
          )}
        </div>

      </aside>
    </>
  )
}
