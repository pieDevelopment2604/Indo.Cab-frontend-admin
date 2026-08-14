import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import type { RootState } from '@/store'
import { usePermission } from '@/hooks/usePermission'
import type { PermissionKey } from '@/constants/permissions'

interface ProtectedRouteProps {
  permission?: PermissionKey
}

export default function ProtectedRoute({ permission }: ProtectedRouteProps) {
  const token = useSelector((state: RootState) => state.auth.token)
  console.log("token", token)
  const { hasPermission } = usePermission()

  if (!token) {
    return <Navigate to="/login" replace />
  }

  if (permission && !hasPermission(permission)) {
    console.log("permission", permission)
    console.log("hasPermission", hasPermission(permission))
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
