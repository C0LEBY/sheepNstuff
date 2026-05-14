import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import TopBar from './TopBar'
import BottomNav from './BottomNav'
import { useFarm } from '../../context/FarmContext'
import { CheckCircle, AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '../../components/reui/alert'

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
  '/farms':     'Farms & Groups',
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
        <div className="fixed bottom-24 lg:bottom-6 left-1/2 -translate-x-1/2 z-50 w-auto min-w-64 max-w-sm animate-in fade-in slide-in-from-bottom-2">
          <Alert variant={toast.type === 'success' ? 'success' : 'destructive'} className="shadow-card-lg">
            {toast.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
            <AlertDescription className="font-medium">{toast.message}</AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  )
}
