import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function ResetPassword() {
  const { updatePassword } = useAuth()
  const navigate = useNavigate()

  const [password, setPassword] = useState('')
  const [confirm, setConfirm]   = useState('')
  const [showPw, setShowPw]     = useState(false)
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return }
    if (password !== confirm) { setError('Passwords do not match.'); return }
    setLoading(true)
    const { error } = await updatePassword(password)
    setLoading(false)
    if (error) {
      setError(error.message)
    } else {
      navigate('/')
    }
  }

  return (
    <div className="min-h-screen bg-cream-100 flex flex-col items-center justify-center px-4">
      <div className="flex items-center gap-2.5 mb-8">
        <div className="w-10 h-10 bg-farm-400 rounded-2xl flex items-center justify-center">
          <span className="text-white font-bold text-sm tracking-tight">ST</span>
        </div>
        <span className="font-bold text-stone-900 text-xl tracking-tight">SheepTrack</span>
      </div>

      <div className="w-full max-w-sm bg-white rounded-3xl shadow-card p-8">
        <h1 className="text-2xl font-bold text-stone-900 tracking-tight mb-1">Set new password</h1>
        <p className="text-sm text-stone-400 mb-6">Choose a strong password for your account.</p>

        {error && (
          <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-2xl text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { label: 'New password', value: password, onChange: setPassword },
            { label: 'Confirm password', value: confirm, onChange: setConfirm },
          ].map(({ label, value, onChange }) => (
            <div key={label}>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">{label}</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  required
                  value={value}
                  onChange={e => onChange(e.target.value)}
                  placeholder="Min. 6 characters"
                  className="w-full px-4 py-2.5 pr-11 text-sm border border-cream-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-farm-400"
                />
                <button type="button" onClick={() => setShowPw(v => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-farm-400 hover:bg-farm-500 disabled:opacity-60 text-white font-semibold py-2.5 rounded-xl transition-colors mt-2"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {loading ? 'Saving…' : 'Save new password'}
          </button>
        </form>
      </div>
    </div>
  )
}
