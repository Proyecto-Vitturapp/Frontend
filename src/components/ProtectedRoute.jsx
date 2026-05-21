import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children, mechanicOnly = false }) {
  const { user, loading, isMechanic } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-secondary-500">Cargando...</div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (mechanicOnly && !isMechanic) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}
