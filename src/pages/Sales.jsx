import { useState } from 'react'
import { Plus, ShoppingCart, TrendingUp, TrendingDown, DollarSign } from 'lucide-react'
import { useFarm } from '../context/FarmContext'
import { formatDate } from '../lib/utils'
import Card, { CardHeader } from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import PageHeader from '../components/ui/PageHeader'
import StatCard from '../components/ui/StatCard'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/table'

function AddTransactionModal({ open, onClose, defaultType = 'sale' }) {
  const { sheep, addTransaction } = useFarm()
  const activeSheep = sheep.filter(s => s.status !== 'sold' && s.status !== 'dead')

  const [form, setForm] = useState({
    type: defaultType,
    date: new Date().toISOString().split('T')[0],
    count: '1',
    pricePerHead: '',
    party: '',
    notes: '',
  })

  function set(k, v) { setForm(f => ({ ...f, [k]: v })) }

  const total = (parseInt(form.count) || 0) * (parseFloat(form.pricePerHead) || 0)

  function handleSubmit(e) {
    e.preventDefault()
    addTransaction({
      type: form.type,
      date: form.date,
      sheepIds: [],
      count: parseInt(form.count) || 1,
      pricePerHead: parseFloat(form.pricePerHead) || 0,
      totalAmount: total,
      party: form.party,
      notes: form.notes,
    })
    onClose()
    setForm({ type: defaultType, date: new Date().toISOString().split('T')[0], count: '1', pricePerHead: '', party: '', notes: '' })
  }

  const field = 'w-full px-3 py-2.5 text-sm border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-farm-400 bg-white'
  const label = 'block text-sm font-medium text-stone-700 mb-1'

  return (
    <Modal open={open} onClose={onClose} title={form.type === 'sale' ? 'Record Sale' : 'Record Purchase'} size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Sale / Purchase toggle */}
        <div className="flex rounded-xl border border-cream-300 overflow-hidden">
          <button type="button" onClick={() => set('type', 'sale')}
            className={`flex-1 py-2 text-sm font-medium transition-colors ${form.type === 'sale' ? 'bg-farm-600 text-white' : 'bg-white text-stone-600 hover:bg-cream-50'}`}>
            Sale
          </button>
          <button type="button" onClick={() => set('type', 'purchase')}
            className={`flex-1 py-2 text-sm font-medium transition-colors ${form.type === 'purchase' ? 'bg-farm-600 text-white' : 'bg-white text-stone-600 hover:bg-cream-50'}`}>
            Purchase
          </button>
        </div>

        <div>
          <label className={label}>Date *</label>
          <input required type="date" className={field} value={form.date} onChange={e => set('date', e.target.value)} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={label}>Number of Sheep *</label>
            <input required type="number" min="1" className={field} value={form.count} onChange={e => set('count', e.target.value)} />
          </div>
          <div>
            <label className={label}>Price per Head (R) *</label>
            <input required type="number" step="0.01" min="0" className={field} placeholder="0.00" value={form.pricePerHead} onChange={e => set('pricePerHead', e.target.value)} />
          </div>
        </div>

        {total > 0 && (
          <div className="bg-farm-50 border border-farm-200 rounded-xl px-4 py-3 text-sm text-farm-800">
            Total: <strong>R {total.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</strong>
          </div>
        )}

        <div>
          <label className={label}>{form.type === 'sale' ? 'Buyer' : 'Seller'} *</label>
          <input required className={field} placeholder="Name of buyer or seller" value={form.party} onChange={e => set('party', e.target.value)} />
        </div>

        <div>
          <label className={label}>Notes</label>
          <textarea rows={2} className={field} placeholder="Breed, condition, auction details…" value={form.notes} onChange={e => set('notes', e.target.value)} />
        </div>

        <div className="flex justify-end gap-3 pt-1">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit">Save {form.type === 'sale' ? 'Sale' : 'Purchase'}</Button>
        </div>
      </form>
    </Modal>
  )
}

export default function Sales() {
  const { transactions } = useFarm()
  const [addOpen, setAddOpen] = useState(false)
  const [filter, setFilter] = useState('All')

  const sales     = transactions.filter(t => t.type === 'sale')
  const purchases = transactions.filter(t => t.type === 'purchase')

  const totalSalesRev = sales.reduce((s, t) => s + t.totalAmount, 0)
  const totalPurchCost = purchases.reduce((s, t) => s + t.totalAmount, 0)
  const profit = totalSalesRev - totalPurchCost

  const filtered  = filter === 'All' ? [...transactions] : transactions.filter(t => t.type === filter)
  const sorted    = filtered.sort((a, b) => new Date(b.date) - new Date(a.date))

  return (
    <div className="max-w-5xl mx-auto">
      <PageHeader
        title="Sales & Purchases"
        subtitle="Track sheep bought and sold"
        action={<Button onClick={() => setAddOpen(true)} icon={<Plus size={16} />}>Record Transaction</Button>}
      />

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <StatCard label="Total Sales"     value={sales.length}         icon={TrendingUp}   color="green" />
        <StatCard label="Total Purchases" value={purchases.length}     icon={TrendingDown} color="blue"  />
        <StatCard
          label="Sales Revenue"
          value={`R ${(totalSalesRev / 1000).toFixed(1)}k`}
          icon={DollarSign}
          color="green"
          sub={`${sales.reduce((s,t) => s + t.count, 0)} sheep sold`}
        />
        <StatCard
          label={profit >= 0 ? 'Net Profit' : 'Net Loss'}
          value={`R ${Math.abs(profit / 1000).toFixed(1)}k`}
          icon={DollarSign}
          color={profit >= 0 ? 'green' : 'red'}
          sub={`Purchases: R ${(totalPurchCost/1000).toFixed(1)}k`}
        />
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-5">
        {['All', 'sale', 'purchase'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={[
              'px-4 py-1.5 rounded-lg text-sm font-medium transition-colors',
              filter === f ? 'bg-farm-600 text-white' : 'bg-white text-stone-600 hover:bg-cream-100 shadow-card',
            ].join(' ')}
          >
            {f === 'All' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1) + 's'}
          </button>
        ))}
      </div>

      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <Table className="w-full text-sm">
            <TableHeader className="bg-cream-50 border-b border-cream-200">
              <TableRow className="text-xs text-stone-500 uppercase tracking-wide">
                <TableHead className="text-left px-5 py-3 font-semibold">Date</TableHead>
                <TableHead className="text-left px-5 py-3 font-semibold">Type</TableHead>
                <TableHead className="text-left px-5 py-3 font-semibold">Count</TableHead>
                <TableHead className="text-left px-5 py-3 font-semibold">Price / Head</TableHead>
                <TableHead className="text-left px-5 py-3 font-semibold">Total</TableHead>
                <TableHead className="text-left px-5 py-3 font-semibold">Party</TableHead>
                <TableHead className="text-left px-5 py-3 font-semibold">Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-cream-100">
              {sorted.map(tx => (
                <TableRow key={tx.id} className="hover:bg-cream-50">
                  <TableCell className="px-5 py-3 text-stone-700 whitespace-nowrap">{formatDate(tx.date)}</TableCell>
                  <TableCell className="px-5 py-3"><Badge variant={tx.type}>{tx.type}</Badge></TableCell>
                  <TableCell className="px-5 py-3 font-semibold text-stone-900">{tx.count}</TableCell>
                  <TableCell className="px-5 py-3 text-stone-700">R {tx.pricePerHead.toLocaleString()}</TableCell>
                  <TableCell className="px-5 py-3">
                    <span className={`font-semibold ${tx.type === 'sale' ? 'text-farm-700' : 'text-red-600'}`}>
                      {tx.type === 'purchase' ? '–' : '+'}R {tx.totalAmount.toLocaleString()}
                    </span>
                  </TableCell>
                  <TableCell className="px-5 py-3 text-stone-700">{tx.party}</TableCell>
                  <TableCell className="px-5 py-3 text-stone-400 max-w-40 truncate">{tx.notes || '—'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      <AddTransactionModal open={addOpen} onClose={() => setAddOpen(false)} />
    </div>
  )
}
