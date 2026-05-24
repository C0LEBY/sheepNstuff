import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Loader2, CheckCircle, ArrowLeft } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function ForgotPassword() {
  const { resetPassword } = useAuth()
  const [email, setEmail]   = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState('')
  const [sent, setSent]     = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await resetPassword(email)
    setLoading(false)
    if (error) {
      setError(error.message)
    } else {
      setSent(true)
    }
  }

  return (
    <div className="min-h-screen bg-cream-100 dark:bg-[#272727] flex flex-col items-center justify-center px-4">

      {/* Logo */}
      <div className="flex items-center gap-2.5 mb-8">
        <div className="w-10 h-10 bg-farm-400 rounded-2xl flex items-center justify-center">
          <span className="text-white font-bold text-sm tracking-tight">ST</span>
        </div>
        <span className="font-bold text-stone-900 text-xl tracking-tight">SheepTrack</span>
      </div>

      <div className="w-full max-w-sm bg-white dark:bg-[#2D2D2D] rounded-3xl shadow-card p-8">
        {sent ? (
          <div className="text-center">
            <div className="w-14 h-14 bg-farm-100 rounded-3xl flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={28} className="text-farm-500" />
            </div>
            <h2 className="text-xl font-bold text-stone-900 mb-2">Email sent</h2>
            <p className="text-sm text-stone-400 mb-6 leading-relaxed">
              We sent a password reset link to{' '}
              <span className="font-medium text-stone-700">{email}</span>.
              Check your inbox and follow the link.
            </p>
            <Link
              to="/login"
              className="block w-full bg-farm-400 hover:bg-farm-500 text-white font-semibold py-2.5 rounded-xl text-center transition-colors"
            >
              Back to Sign in
            </Link>
          </div>
        ) : (
          <>
            <Link to="/login" className="flex items-center gap-1.5 text-sm text-stone-400 hover:text-stone-600 mb-6 transition-colors">
              <ArrowLeft size={14} /> Back to Sign in
            </Link>

            <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100 tracking-tight mb-1">Forgot password?</h1>
            <p className="text-sm text-stone-400 mb-6">
              Enter your email and we'll send you a reset link.
            </p>

            {error && (
              <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-2xl text-sm text-red-600">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1.5">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-2.5 text-sm border border-cream-300 dark:border-stone-600 rounded-xl bg-white dark:bg-[#272727] text-stone-900 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-600 focus:outline-none focus:ring-2 focus:ring-farm-400"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-farm-400 hover:bg-farm-500 disabled:opacity-60 text-white font-semibold py-2.5 rounded-xl transition-colors"
              >
                {loading && <Loader2 size={16} className="animate-spin" />}
                {loading ? 'Sending…' : 'Send reset link'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
