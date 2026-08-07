import { useSelector } from 'react-redux'
import type { RootState } from '@/store'
import { hasPermission, type PermissionKey } from '@/constants/permissions'
import type { UserRole } from '@/constants/roles'

export function usePermission() {
  const user = useSelector((state: RootState) => state.auth.user)
  const role = user?.role as UserRole | undefined

  const checkPermission = (permission: PermissionKey): boolean => {
    return hasPermission(role, permission)
  }

  return {
    role,
    user,
    hasPermission: checkPermission,
    isSuperAdmin: role === 'super_admin',
    isOpsAdmin: role === 'ops_admin',
  }
}
