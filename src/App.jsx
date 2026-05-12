import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { FarmProvider }     from './context/FarmContext'
import { UserProvider }     from './context/UserContext'
import { LanguageProvider } from './context/LanguageContext'
import { AuthProvider, useAuth } from './context/AuthContext'
import Layout       from './components/layout/Layout'
import Dashboard    from './pages/Dashboard'
import Sheep        from './pages/Sheep'
import SheepDetail  from './pages/SheepDetail'
import Areas        from './pages/Areas'
import Births       from './pages/Births'
import Health       from './pages/Health'
import Breeding     from './pages/Breeding'
import Sales        from './pages/Sales'
import Tasks        from './pages/Tasks'
import Reports      from './pages/Reports'
import Settings     from './pages/Settings'
import Farms        from './pages/Farms'
import Login        from './pages/auth/Login'
import Register     from './pages/auth/Register'
import ForgotPassword from './pages/auth/ForgotPassword'
import ResetPassword  from './pages/auth/ResetPassword'

/* ── guards ─────────────────────────────────────────────────── */
function RequireAuth({ children }) {
  const { session, loading } = useAuth()
  if (loading) return (
    <div className="min-h-screen bg-cream-100 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-farm-400 border-t-transparent rounded-full animate-spin" />
    </div>
  )
  return session ? children : <Navigate to="/login" replace />
}

function RedirectIfAuthed({ children }) {
  const { session, loading } = useAuth()
  if (loading) return null
  return session ? <Navigate to="/" replace /> : children
}

/* ── app ─────────────────────────────────────────────────────── */
export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public auth routes */}
            <Route path="/login"          element={<RedirectIfAuthed><Login /></RedirectIfAuthed>} />
            <Route path="/register"       element={<RedirectIfAuthed><Register /></RedirectIfAuthed>} />
            <Route path="/forgot-password" element={<RedirectIfAuthed><ForgotPassword /></RedirectIfAuthed>} />
            <Route path="/reset-password"  element={<ResetPassword />} />

            {/* Protected app routes */}
            <Route path="/*" element={
              <RequireAuth>
                <UserProvider>
                  <FarmProvider>
                    <Layout>
                      <Routes>
                        <Route path="/"          element={<Dashboard />} />
                        <Route path="/sheep"     element={<Sheep />} />
                        <Route path="/sheep/:id" element={<SheepDetail />} />
                        <Route path="/areas"     element={<Areas />} />
                        <Route path="/births"    element={<Births />} />
                        <Route path="/health"    element={<Health />} />
                        <Route path="/breeding"  element={<Breeding />} />
                        <Route path="/sales"     element={<Sales />} />
                        <Route path="/tasks"     element={<Tasks />} />
                        <Route path="/reports"   element={<Reports />} />
                        <Route path="/settings"  element={<Settings />} />
                        <Route path="/farms"     element={<Farms />} />
                      </Routes>
                    </Layout>
                  </FarmProvider>
                </UserProvider>
              </RequireAuth>
            } />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </LanguageProvider>
  )
}
