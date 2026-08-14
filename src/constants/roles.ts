export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  OPS_ADMIN: 'ops_admin',
} as const

export type UserRole = typeof ROLES[keyof typeof ROLES] | 'SUPERADMIN' | 'SUPER_ADMIN' | 'OPSADMIN' | 'OPS_ADMIN' | string

export function normalizeRole(role?: string | null): typeof ROLES[keyof typeof ROLES] {
  if (!role) return ROLES.SUPER_ADMIN
  const cleaned = String(role).toLowerCase().replace(/[^a-z0-9]/g, '')
  if (cleaned.includes('super') || cleaned.includes('admin') || cleaned === 'superadmin') {
    return ROLES.SUPER_ADMIN
  }
  if (cleaned.includes('ops') || cleaned.includes('operation')) {
    return ROLES.OPS_ADMIN
  }
  return ROLES.SUPER_ADMIN
}

export function getRoleFromToken(token?: string | null): string | undefined {
  if (!token) return undefined
  try {
    const parts = token.split('.')
    if (parts.length === 3) {
      const payloadBase64 = parts[1].replace(/-/g, '+').replace(/_/g, '/')
      const decodedJson = atob(payloadBase64)
      const payload = JSON.parse(decodedJson)
      const candidate = (
        payload.role ||
        payload.roleName ||
        payload.role_name ||
        payload.user_role ||
        payload.userRole ||
        payload.userType ||
        payload.user_type ||
        (Array.isArray(payload.roles) ? payload.roles[0] : payload.roles) ||
        (Array.isArray(payload.authorities) ? payload.authorities[0] : payload.authorities) ||
        payload.realm_access?.roles?.[0]
      )
      if (candidate && candidate !== 'access' && candidate !== 'refresh') {
        return String(candidate)
      }
    }
  } catch (e) {
    console.warn('Could not parse JWT token payload', e)
  }
  return undefined
}
