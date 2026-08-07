export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  OPS_ADMIN: 'ops_admin',
} as const

export type UserRole = typeof ROLES[keyof typeof ROLES]
