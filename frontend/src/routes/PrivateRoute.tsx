import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

interface PrivateRouteProps {
  children: React.ReactNode
  requiredRole?: 'ADMIN' | 'CONSULTA'
}

export default function PrivateRoute({ children, requiredRole }: PrivateRouteProps) {
  const { user } = useAuth()

  // Si no hay usuario, redirigir al login
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Si se requiere un rol específico y el usuario no lo tiene
  if (requiredRole && user.rol !== requiredRole) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
