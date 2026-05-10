import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/useAuth.js'
import { adminEmail, isAdminUser } from '../services/admin.js'

function ProtectedRoute({ children, requireAdmin = false }) {
  const location = useLocation()
  const { loading, logout, user } = useAuth()

  if (loading) {
    return (
      <div className="min-h-[50vh] place-content-center text-center text-slate-500">
        Loading secure workspace...
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  if (requireAdmin && !isAdminUser(user)) {
    return (
      <div className="ink-panel mx-auto max-w-xl rounded-lg p-6 md:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#d7b46a]">
          Access denied
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-white">This dashboard is private.</h1>
        <p className="mt-4 leading-7 text-slate-200">
          Signed in as {user.email}. Portfolio management is restricted to {adminEmail || 'the site owner'}.
        </p>
        <button className="primary-button mt-6 px-4 py-3" onClick={logout} type="button">
          Sign out
        </button>
      </div>
    )
  }

  return children
}

export default ProtectedRoute
