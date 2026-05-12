import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Menu, AlertTriangle, Bell, ChevronRight, LogOut, Users, Check } from 'lucide-react'
import { useFarm } from '../../context/FarmContext'
import { useUser } from '../../context/UserContext'
import FarmLogo from '../ui/FarmLogo'

const AVATAR_COLORS = ['bg-farm-400','bg-blue-400','bg-purple-400','bg-amber-500','bg-pink-400']

function avatarColor(id = '') {
  const n = parseInt(id.replace(/\D/g, '')) || 0
  return AVATAR_COLORS[n % AVATAR_COLORS.length]
}

export default function TopBar({ onMenuClick, title }) {
  const { tasks } = useFarm()
  const { currentUser, myFarms, activeFarm, activeFarmId, setActiveFarmId } = useUser()
  const navigate = useNavigate()
  const [showProfile, setShowProfile] = useState(false)
  const [showFarmSwitch, setShowFarmSwitch] = useState(false)

  const overdueTasks = tasks.filter(t => !t.completed && new Date(t.dueDate) < new Date())
  const color = avatarColor(currentUser.id)

  function close() { setShowProfile(false); setShowFarmSwitch(false) }

  return (
    <header className="h-14 bg-white border-b border-cream-200 flex items-center px-4 gap-3 sticky top-0 z-10">
      {/* Hamburger */}
      <button onClick={onMenuClick} className="lg:hidden p-2 rounded-xl text-stone-500 hover:bg-cream-100 transition-colors">
        <Menu size={20} />
      </button>

      {/* Page title */}
      <h1 className="text-base font-semibold text-stone-900 flex-1">{title}</h1>

      {/* Tasks bell */}
      <button
        onClick={() => navigate('/tasks')}
        className="relative p-2 rounded-xl text-stone-500 hover:bg-cream-100 transition-colors"
      >
        {overdueTasks.length > 0
          ? <AlertTriangle size={19} className="text-amber-500" />
          : <Bell size={19} />
        }
        {overdueTasks.length > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-amber-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center leading-none">
            {overdueTasks.length > 9 ? '9+' : overdueTasks.length}
          </span>
        )}
      </button>

      {/* User avatar */}
      <div className="relative">
        <button
          onClick={() => { setShowProfile(v => !v); setShowFarmSwitch(false) }}
          className={`w-8 h-8 ${color} rounded-full flex items-center justify-center text-white font-bold text-xs hover:opacity-90 transition-opacity flex-shrink-0`}
        >
          {currentUser.initials}
        </button>

        {showProfile && (
          <>
            <div className="fixed inset-0 z-40" onClick={close} />
            <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-card-lg border border-cream-200 z-50 overflow-hidden">

              {!showFarmSwitch ? (
                <>
                  {/* User info */}
                  <div className="px-4 py-3.5 border-b border-cream-100">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 ${color} rounded-full flex items-center justify-center text-white font-bold flex-shrink-0`}>
                        {currentUser.initials}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-stone-900 truncate">{currentUser.name}</p>
                        <p className="text-xs text-stone-400 truncate">{currentUser.email}</p>
                      </div>
                    </div>
                  </div>

                  {/* Active farm */}
                  {activeFarm && (
                    <div className="px-4 py-2.5 border-b border-cream-100">
                      <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-wide mb-1">Active Farm</p>
                      <button
                        onClick={() => setShowFarmSwitch(true)}
                        className="w-full flex items-center gap-2.5 hover:bg-cream-50 rounded-xl p-1.5 -m-1.5 transition-colors"
                      >
                        <FarmLogo farm={activeFarm} size="xs" />
                        <div className="flex-1 min-w-0 text-left">
                          <p className="text-sm font-medium text-stone-800 truncate">{activeFarm.name}</p>
                          {activeFarm.location && <p className="text-xs text-stone-400 truncate">{activeFarm.location}</p>}
                        </div>
                        <ChevronRight size={14} className="text-stone-300 flex-shrink-0" />
                      </button>
                    </div>
                  )}

                  {/* Menu links */}
                  <div className="py-1.5">
                    {[
                      { label: 'Manage Farms & Users', to: '/farms',    Icon: Users    },
                      { label: 'Settings',              to: '/settings', Icon: null     },
                      { label: 'Reports',               to: '/reports',  Icon: null     },
                    ].map(({ label, to, Icon }) => (
                      <button
                        key={to}
                        onClick={() => { navigate(to); close() }}
                        className="w-full text-left px-4 py-2.5 text-sm text-stone-700 hover:bg-cream-50 transition-colors flex items-center gap-2"
                      >
                        {Icon && <Icon size={14} className="text-stone-400" />}
                        {label}
                      </button>
                    ))}
                  </div>

                  {/* Overdue callout */}
                  {overdueTasks.length > 0 && (
                    <div className="px-4 py-2.5 border-t border-cream-100">
                      <button
                        onClick={() => { navigate('/tasks'); close() }}
                        className="flex items-center gap-2 text-xs text-amber-600 font-semibold hover:text-amber-700"
                      >
                        <AlertTriangle size={13} />
                        {overdueTasks.length} overdue task{overdueTasks.length > 1 ? 's' : ''}
                      </button>
                    </div>
                  )}

                  {/* Sign out */}
                  <div className="px-4 py-2.5 border-t border-cream-100">
                    <button className="flex items-center gap-2 text-sm text-stone-400 hover:text-stone-600 transition-colors">
                      <LogOut size={14} /> Sign out
                    </button>
                  </div>
                </>
              ) : (
                /* Farm switcher sub-panel */
                <>
                  <div className="px-4 py-3 border-b border-cream-100 flex items-center gap-2">
                    <button onClick={() => setShowFarmSwitch(false)} className="text-stone-400 hover:text-stone-600">
                      <ChevronRight size={16} className="rotate-180" />
                    </button>
                    <p className="text-sm font-semibold text-stone-800">Switch Farm</p>
                  </div>
                  <div className="py-1.5 max-h-64 overflow-y-auto">
                    {myFarms.map(farm => (
                      <button
                        key={farm.id}
                        onClick={() => { setActiveFarmId(farm.id); close() }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-cream-50 transition-colors text-left"
                      >
                        <FarmLogo farm={farm} size="sm" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-stone-800 truncate">{farm.name}</p>
                          <p className="text-xs text-stone-400 truncate">{farm.members.length} members</p>
                        </div>
                        {farm.id === activeFarmId && <Check size={15} className="text-farm-500 flex-shrink-0" />}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </header>
  )
}
