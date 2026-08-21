import {
  LayoutDashboard,
  Users,
  Building2,
  UserCheck,
  Navigation2,
  MapPin,
  Tag,
  Receipt,
  Wallet,
  BarChart3,
  ScrollText,
  Car
} from '@/utils/icons'

import { ROUTES } from './routes'

export interface NavItem {
  label: string
  icon: React.ElementType
  to: string
  group: string
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', icon: LayoutDashboard, to: ROUTES.DASHBOARD, group: 'main' },
  { label: 'Clients', icon: Users, to: ROUTES.CLIENTS, group: 'management' },
  { label: 'Vendors', icon: Building2, to: ROUTES.VENDORS, group: 'management' },
  { label: 'Drivers', icon: UserCheck, to: ROUTES.DRIVERS, group: 'management' },
  { label: 'Vehicles', icon: Car, to: ROUTES.VEHICLES, group: 'management' },
  // { label: 'Bookings', icon: BookOpen, to: ROUTES.BOOKINGS, group: 'operations' },
  { label: 'Dispatch', icon: Navigation2, to: ROUTES.DISPATCH, group: 'operations' },
  { label: 'Live Tracking', icon: MapPin, to: ROUTES.TRACKING, group: 'operations' },
  { label: 'Pricing', icon: Tag, to: ROUTES.PRICING, group: 'finance' },
  { label: 'Billing', icon: Receipt, to: ROUTES.BILLING, group: 'finance' },
  { label: 'Settlements', icon: Wallet, to: ROUTES.SETTLEMENTS, group: 'finance' },
  { label: 'Reports', icon: BarChart3, to: ROUTES.REPORTS, group: 'system' },
  { label: 'Audit Logs', icon: ScrollText, to: ROUTES.AUDIT, group: 'system' },
]

export const NAV_GROUPS = [
  { key: 'main', label: '' },
  { key: 'management', label: 'Management' },
  { key: 'operations', label: 'Operations' },
  { key: 'finance', label: 'Finance' },
  { key: 'system', label: 'System' },
]
