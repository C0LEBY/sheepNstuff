import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import TopBar from './TopBar'
import BottomNav from './BottomNav'
import { useFarm } from '../../context/FarmContext'
import { CheckCircle, AlertCircle } from 'lucide-react'

const PAGE_TITLES = {
  '/':          'Dashboard',
  '/sheep':     'Sheep Records',
  '/areas':     'Areas & Paddocks',
  '/births':    'Births',
  '/health':    'Health',
  '/breeding':  'Breeding',
  '/sales':     'Sales',
  '/tasks':     'Tasks',
  '/reports':   'Reports',
  '/settings':  'Settings',
}

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { toast } = useFarm()
  const location = useLocation()

  const pathKey = '/' + location.pathname.split('/').slice(1, 2).join('')
  const title = PAGE_TITLES[pathKey] || 'SheepTrack'

  return (
    <div className="flex h-screen overflow-hidden bg-cream-100">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
        <TopBar onMenuClick={() => setSidebarOpen(true)} title={title} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 pb-24 lg:pb-6 scrollbar-thin">
          {children}
        </main>
      </div>

      <BottomNav />

      {toast && (
        <div className={[
          'fixed bottom-24 lg:bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2.5 px-5 py-3 rounded-2xl shadow-card-lg text-sm font-medium z-50 transition-all',
          toast.type === 'success' ? 'bg-stone-900 text-white' : 'bg-red-600 text-white',
        ].join(' ')}>
          {toast.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          {toast.message}
        </div>
      )}
    </div>
  )
}
