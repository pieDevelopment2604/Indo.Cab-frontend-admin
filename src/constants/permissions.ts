import { ROLES, normalizeRole } from './roles'

export const PERMISSIONS = {
  // Client Management
  CLIENTS_VIEW:   [ROLES.SUPER_ADMIN, ROLES.OPS_ADMIN],
  CLIENTS_MANAGE: [ROLES.SUPER_ADMIN], // Add, Edit, Suspends clients

  // Vendor Management
  VENDORS_VIEW:   [ROLES.SUPER_ADMIN, ROLES.OPS_ADMIN],
  VENDORS_MANAGE: [ROLES.SUPER_ADMIN], // Approve or blacklist vendors

  // Fleet/Drivers/Vehicles Approval Workflow
  FLEET_VIEW:     [ROLES.SUPER_ADMIN, ROLES.OPS_ADMIN],
  FLEET_APPROVE:  [ROLES.SUPER_ADMIN], // Verify and approve uploaded driver/vehicle docs

  // Operations
  BOOKINGS_VIEW:    [ROLES.SUPER_ADMIN, ROLES.OPS_ADMIN],
  BOOKINGS_MANAGE:  [ROLES.SUPER_ADMIN, ROLES.OPS_ADMIN],
  DISPATCH_CONTROL: [ROLES.SUPER_ADMIN, ROLES.OPS_ADMIN],
  LIVE_TRACKING:    [ROLES.SUPER_ADMIN, ROLES.OPS_ADMIN],

  // Pricing & Billing Configuration
  PRICING_MANAGE: [ROLES.SUPER_ADMIN],
  BILLING_VIEW:   [ROLES.SUPER_ADMIN, ROLES.OPS_ADMIN],
  BILLING_MANAGE: [ROLES.SUPER_ADMIN],

  // System Administration
  REPORTS_VIEW: [ROLES.SUPER_ADMIN, ROLES.OPS_ADMIN],
  AUDIT_VIEW:   [ROLES.SUPER_ADMIN],
} as const

export type PermissionKey = keyof typeof PERMISSIONS

export function hasPermission(role: string | null | undefined, permission: PermissionKey): boolean {
  const normalized = normalizeRole(role)
  const allowedRoles = (PERMISSIONS[permission] || []) as readonly string[]
  return allowedRoles.includes(normalized)
}
