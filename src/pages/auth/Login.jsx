import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function Login() {
  const { signIn } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw]     = useState(false)
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await signIn(email, password)
    setLoading(false)
    if (error) {
      setError('Incorrect email or password. Please try again.')
    } else {
      navigate('/')
    }
  }

  function fillTestUser() {
    setEmail('test@sheeptrack.co.za')
    setPassword('Groenplaas2025')
    setShowPw(true)
  }

  return (
    <div className="min-h-screen bg-cream-100 flex flex-col items-center justify-center px-4">

      {/* Logo */}
      <div className="flex items-center gap-2.5 mb-8">
        <div className="w-10 h-10 bg-farm-400 rounded-2xl flex items-center justify-center">
          <span className="text-white font-bold text-sm tracking-tight">ST</span>
        </div>
        <span className="font-bold text-stone-900 text-xl tracking-tight">SheepTrack</span>
      </div>

      {/* Card */}
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-card p-8">
        <h1 className="text-2xl font-bold text-stone-900 tracking-tight mb-1">Welcome back</h1>
        <p className="text-sm text-stone-400 mb-6">Sign in to your farm account</p>

        {error && (
          <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-2xl text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">Email</label>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-2.5 text-sm border border-cream-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-farm-400"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-sm font-medium text-stone-700">Password</label>
              <Link to="/forgot-password" className="text-xs text-farm-600 hover:text-farm-700 font-medium">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'}
                required
                autoComplete="current-password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
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
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="text-center text-sm text-stone-400 mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-farm-600 hover:text-farm-700 font-semibold">
            Create one
          </Link>
        </p>
      </div>

      {/* Test account shortcut */}
      <div className="mt-5 w-full max-w-sm bg-farm-50 border border-farm-200 rounded-2xl px-5 py-4">
        <p className="text-xs font-semibold text-farm-700 mb-0.5">🐑 Try the demo</p>
        <p className="text-xs text-farm-600 mb-3">
          Log in with the test account to browse Groenplaas farm data.
        </p>
        <div className="flex items-center justify-between text-xs">
          <div className="space-y-0.5 text-stone-500">
            <p><span className="font-medium text-stone-700">Email:</span> test@sheeptrack.co.za</p>
            <p><span className="font-medium text-stone-700">Password:</span> Groenplaas2025</p>
          </div>
          <button
            onClick={fillTestUser}
            className="ml-4 px-3 py-1.5 bg-farm-400 text-white text-xs font-semibold rounded-lg hover:bg-farm-500 transition-colors flex-shrink-0"
          >
            Fill in
          </button>
        </div>
      </div>
    </div>
  )
}
