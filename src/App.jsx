import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { FarmProvider } from './context/FarmContext'
import { UserProvider } from './context/UserContext'
import { LanguageProvider } from './context/LanguageContext'
import Layout from './components/layout/Layout'
import Dashboard  from './pages/Dashboard'
import Sheep      from './pages/Sheep'
import SheepDetail from './pages/SheepDetail'
import Areas      from './pages/Areas'
import Births     from './pages/Births'
import Health     from './pages/Health'
import Breeding   from './pages/Breeding'
import Sales      from './pages/Sales'
import Tasks      from './pages/Tasks'
import Reports    from './pages/Reports'
import Settings   from './pages/Settings'
import Farms      from './pages/Farms'

export default function App() {
  return (
    <LanguageProvider>
    <UserProvider>
      <FarmProvider>
        <BrowserRouter>
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
        </BrowserRouter>
      </FarmProvider>
    </UserProvider>
    </LanguageProvider>
  )
}
