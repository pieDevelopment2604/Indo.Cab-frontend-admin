import { useSelector } from 'react-redux'
import type { RootState } from '@/store'
import { hasPermission, type PermissionKey } from '@/constants/permissions'
import { ROLES, normalizeRole, getRoleFromToken } from '@/constants/roles'

export function usePermission() {
  const auth = useSelector((state: RootState) => state.auth)
  const rawRole = auth.user?.role || getRoleFromToken(auth.token)
  const role = normalizeRole(rawRole)

  const checkPermission = (permission: PermissionKey): boolean => {
    return hasPermission(rawRole, permission)
  }

  return {
    role,
    user: auth.user,
    hasPermission: checkPermission,
    isSuperAdmin: role === ROLES.SUPER_ADMIN,
    isOpsAdmin: role === ROLES.OPS_ADMIN,
  }
}
