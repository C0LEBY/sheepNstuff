import { useState } from 'react'
import Card, { CardHeader } from '../components/ui/Card'
import Button from '../components/ui/Button'
import PageHeader from '../components/ui/PageHeader'

export default function Settings() {
  const [farm, setFarm] = useState({
    name: 'Groenplaas',
    owner: 'Jan van der Merwe',
    region: 'Western Cape',
    season: '2025',
    currency: 'R (ZAR)',
  })
  const [saved, setSaved] = useState(false)

  function handleSave(e) {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const field = 'w-full px-3 py-2.5 text-sm border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-farm-400 bg-white'
  const label = 'block text-sm font-medium text-stone-700 mb-1'

  return (
    <div className="max-w-2xl mx-auto">
      <PageHeader title="Settings" subtitle="Manage your farm profile and preferences" />

      <form onSubmit={handleSave} className="space-y-5">
        <Card>
          <CardHeader title="Farm Details" />
          <div className="space-y-4">
            <div>
              <label className={label}>Farm Name</label>
              <input className={field} value={farm.name} onChange={e => setFarm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div>
              <label className={label}>Owner / Manager</label>
              <input className={field} value={farm.owner} onChange={e => setFarm(f => ({ ...f, owner: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={label}>Region</label>
                <input className={field} value={farm.region} onChange={e => setFarm(f => ({ ...f, region: e.target.value }))} />
              </div>
              <div>
                <label className={label}>Current Season</label>
                <input className={field} value={farm.season} onChange={e => setFarm(f => ({ ...f, season: e.target.value }))} />
              </div>
            </div>
            <div>
              <label className={label}>Currency</label>
              <select className={field} value={farm.currency} onChange={e => setFarm(f => ({ ...f, currency: e.target.value }))}>
                <option>R (ZAR)</option>
                <option>$ (USD)</option>
                <option>£ (GBP)</option>
                <option>€ (EUR)</option>
                <option>A$ (AUD)</option>
                <option>NZ$ (NZD)</option>
              </select>
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader title="Notifications" subtitle="Coming soon" />
          <div className="space-y-3 opacity-50 pointer-events-none">
            {[
              'Lambing date reminders',
              'Vaccination due reminders',
              'Follow-up treatment alerts',
              'Area capacity warnings',
              'Daily task summary',
            ].map(label => (
              <div key={label} className="flex items-center justify-between">
                <span className="text-sm text-stone-700">{label}</span>
                <div className="w-10 h-5 bg-cream-300 rounded-full" />
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader title="Data" />
          <div className="space-y-3">
            <p className="text-sm text-stone-500">SheepTrack is currently running with demo data. Connect a backend to store real records.</p>
            <div className="flex gap-3">
              <Button variant="outline" type="button" disabled>Export to CSV</Button>
              <Button variant="outline" type="button" disabled>Import Data</Button>
            </div>
          </div>
        </Card>

        <div className="flex justify-end gap-3">
          <Button variant="outline" type="button">Cancel</Button>
          <Button type="submit">{saved ? '✓ Saved!' : 'Save Settings'}</Button>
        </div>
      </form>
    </div>
  )
}
