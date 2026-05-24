import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Loader2, CheckCircle } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function Register() {
  const { signUp } = useAuth()
  const navigate = useNavigate()

  const [name, setName]         = useState('')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw]     = useState(false)
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [done, setDone]         = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    setLoading(true)
    const { error, session } = await signUp(email, password, name)
    setLoading(false)
    if (error) {
      setError(error.message)
    } else if (session) {
      // Email confirm is OFF — user is immediately signed in, go straight to the app
      navigate('/')
    } else {
      // Email confirm is ON — user needs to verify before logging in
      setDone(true)
    }
  }

  if (done) {
    return (
      <div className="min-h-screen bg-cream-100 dark:bg-[#272727] flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-sm bg-white rounded-3xl shadow-card p-8 text-center">
          <div className="w-14 h-14 bg-farm-100 rounded-3xl flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={28} className="text-farm-500" />
          </div>
          <h2 className="text-xl font-bold text-stone-900 mb-2">Check your email</h2>
          <p className="text-sm text-stone-400 mb-6 leading-relaxed">
            We sent a confirmation link to <span className="font-medium text-stone-700">{email}</span>.
            Click it to activate your account, then sign in.
          </p>
          <Link
            to="/login"
            className="block w-full bg-farm-400 hover:bg-farm-500 text-white font-semibold py-2.5 rounded-xl text-center transition-colors"
          >
            Go to Sign in
          </Link>
        </div>
      </div>
    )
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

      {/* Card */}
      <div className="w-full max-w-sm bg-white dark:bg-[#2D2D2D] rounded-3xl shadow-card p-8">
        <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100 tracking-tight mb-1">Create account</h1>
        <p className="text-sm text-stone-400 mb-6">Start managing your farm today</p>

        {error && (
          <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-2xl text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1.5">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Nathan Jonck"
              className="w-full px-4 py-2.5 text-sm border border-cream-300 dark:border-stone-600 rounded-xl bg-white dark:bg-[#272727] text-stone-900 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-600 focus:outline-none focus:ring-2 focus:ring-farm-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1.5">Email</label>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-2.5 text-sm border border-cream-300 dark:border-stone-600 rounded-xl bg-white dark:bg-[#272727] text-stone-900 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-600 focus:outline-none focus:ring-2 focus:ring-farm-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'}
                required
                autoComplete="new-password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Min. 6 characters"
                className="w-full px-4 py-2.5 pr-11 text-sm border border-cream-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-farm-400"
              />
              <button
                type="button"
                onClick={() => setShowPw(v => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
              >
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-farm-400 hover:bg-farm-500 disabled:opacity-60 text-white font-semibold py-2.5 rounded-xl transition-colors mt-2"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="text-center text-sm text-stone-400 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-farm-600 hover:text-farm-700 font-semibold">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
