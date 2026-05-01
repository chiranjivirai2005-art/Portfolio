import { useAuth } from '../context/useAuth.js'

function ProtectedRoute({ children }) {
  const { loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-[50vh] place-content-center text-center text-slate-500">
        Loading secure workspace...
      </div>
    )
  }

  return children
}

export default ProtectedRoute
