import { useEffect, useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import PageTransition from '../components/PageTransition.jsx'
import { useAuth } from '../context/useAuth.js'
import { adminEmail, isAdminUser } from '../services/admin.js'

function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { loading, login, logout, user } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const isAdmin = isAdminUser(user)

  useEffect(() => {
    if (isAdmin) {
      navigate(location.state?.from || '/admin', { replace: true })
    }
  }, [isAdmin, location.state, navigate])

  async function handleLogin(event) {
    event.preventDefault()
    setSubmitting(true)
    setStatus('Signing in...')

    try {
      const signedInUser = await login(email, password)

      if (isAdminUser(signedInUser)) {
        navigate(location.state?.from || '/admin', { replace: true })
      } else {
        setStatus('This account is not authorized for dashboard access.')
      }
    } catch (error) {
      setStatus(`Login failed: ${error.message}`)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <PageTransition>
        <div className="min-h-[50vh] place-content-center text-center text-slate-300">
          Loading secure access...
        </div>
      </PageTransition>
    )
  }

  if (isAdmin) {
    return <Navigate to="/admin" replace />
  }

  return (
    <PageTransition>
      <section className="mx-auto grid max-w-5xl overflow-hidden rounded-lg border border-white/12 bg-white shadow-2xl shadow-slate-950/30 md:grid-cols-[0.95fr_1.05fr]">
        <div className="login-panel p-6 text-white md:p-8 lg:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#d7b46a]">
            Owner access
          </p>
          <h1 className="mt-4 text-4xl font-semibold">Private portfolio dashboard</h1>
          <p className="mt-4 leading-7 text-slate-200">
            Sign in with the registered owner account to manage homepage content, gallery items,
            certificates, courses, and achievements.
          </p>
          <div className="mt-8 rounded-lg border border-white/12 bg-white/8 p-4">
            <p className="text-sm font-semibold text-white">Authorized account</p>
            <p className="mt-1 break-all text-sm text-slate-300">{adminEmail || 'Set VITE_ADMIN_EMAIL'}</p>
          </div>
        </div>

        <div className="p-6 md:p-8 lg:p-10">
          {user && !isAdmin ? (
            <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
              Signed in as {user.email}, but this dashboard is only for the site owner.
              <button className="ml-2 font-bold underline" onClick={logout} type="button">
                Sign out
              </button>
            </div>
          ) : null}
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#1f6f78]">
            Secure login
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-slate-950">Welcome back</h2>
          <form className="mt-6 space-y-4" onSubmit={handleLogin}>
            <label className="block text-sm font-semibold text-slate-700">
              Email
              <input
                className="field mt-2"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </label>
            <label className="block text-sm font-semibold text-slate-700">
              Password
              <input
                className="field mt-2"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </label>
            <button
              className="primary-button w-full px-4 py-3 disabled:opacity-60"
              disabled={submitting}
              type="submit"
            >
              Log in
            </button>
          </form>
          {status ? <p className="mt-4 text-sm text-slate-600">{status}</p> : null}
        </div>
      </section>
    </PageTransition>
  )
}

export default Login
