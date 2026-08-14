/**
 * Raw shape returned by GET /api/v1/admin/vendors and /admin/vendors/:id
 */
export interface ApiVendor {
  id?: number
  vendor_id?: number
  user_id?: number
  first_name?: string
  last_name?: string
  company_name?: string
  name?: string
  contact_person?: string
  email?: string
  mobile_number?: string
  phone?: string
  address?: string
  fleet_size?: number
  active_cars?: number
  idle_cars?: number
  commission_rate?: number
  rating?: number
  acceptance_rate?: number
  cancellation_rate?: number
  completion_rate?: number
  /** API returns uppercase: "ACTIVE" | "INACTIVE" | "PENDING" | "SUSPENDED" | "BLACKLISTED" */
  status?: string
  created_at?: string
  joinDate?: string
  profile_image_url?: string
  logo?: string
  gst_number?: string
  pan_number?: string
  license_number?: string
  vehicle_categories?: string[]
  operating_cities?: string[]
  bank_name?: string
  account_name?: string
  account_number?: string
  ifsc_code?: string
}

export interface Vendor {
  id: string
  name: string
  companyName: string
  contactPerson: string
  email: string
  phone: string
  city: string
  fleetSize: number
  activeCars: number
  idleCars: number
  commissionRate: number
  rating: number
  acceptanceRate: number
  cancellationRate: number
  completionRate: number
  status: 'active' | 'pending' | 'suspended' | 'blacklisted' | 'inactive'
  joinDate: string
  firstName?: string
  lastName?: string
  licenseNumber?: string
  logo?: string
  gstNumber?: string
  panNumber?: string
  vehicleCategories?: string[]
  operatingCities?: string[]
  bankDetails?: {
    bankName?: string
    accountName?: string
    accountNumber?: string
    ifscCode?: string
  }
  documents?: {
    licenseUrl?: string
    licenseFileName?: string
    fleetPhotoUrl?: string
    fleetPhotoFileName?: string
  }
}

/**
 * Maps a raw API vendor object → normalised Vendor.
 * Handles uppercase status, snake_case fields, and name composition.
 */
export function mapApiVendor(raw: ApiVendor, fallbackIdx = 0): Vendor {
  const firstName  = raw.first_name || ''
  const lastName   = raw.last_name  || ''
  const fullName   = `${firstName} ${lastName}`.trim()
  const vendorName = raw.company_name || raw.name || fullName || 'Vendor Partner'
  const contact    = raw.contact_person || fullName || raw.email || ''

  const statusRaw    = (raw.status ?? '').toLowerCase()
  const validStatuses = ['active', 'inactive', 'pending', 'suspended', 'blacklisted'] as const
  const status = (validStatuses.includes(statusRaw as any) ? statusRaw : 'inactive') as Vendor['status']

  const joinDate = raw.created_at
    ? new Date(raw.created_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
    : raw.joinDate || ''

  return {
    id:               String(raw.vendor_id ?? raw.user_id ?? raw.id ?? fallbackIdx + 1),
    name:             vendorName,
    companyName:      raw.company_name || vendorName,
    contactPerson:    contact,
    email:            raw.email         || '',
    phone:            raw.mobile_number || raw.phone || '',
    city:             raw.address || (Array.isArray(raw.operating_cities) && raw.operating_cities[0]) || '',
    fleetSize:        Number(raw.fleet_size      ?? 0),
    activeCars:       Number(raw.active_cars     ?? 0),
    idleCars:         Number(raw.idle_cars       ?? 0),
    commissionRate:   Number(raw.commission_rate ?? 0),
    rating:           Number(raw.rating          ?? 0),
    acceptanceRate:   Number(raw.acceptance_rate  ?? 0),
    cancellationRate: Number(raw.cancellation_rate ?? 0),
    completionRate:   Number(raw.completion_rate  ?? 0),
    status,
    joinDate,
    firstName,
    lastName,
    logo:             raw.profile_image_url || raw.logo || undefined,
    gstNumber:        raw.gst_number      || undefined,
    panNumber:        raw.pan_number      || undefined,
    licenseNumber:    raw.license_number  || undefined,
    vehicleCategories: Array.isArray(raw.vehicle_categories) ? raw.vehicle_categories : [],
    operatingCities:   Array.isArray(raw.operating_cities)   ? raw.operating_cities   : [],
    bankDetails: (raw.bank_name || raw.account_number) ? {
      bankName:      raw.bank_name      || undefined,
      accountName:   raw.account_name   || undefined,
      accountNumber: raw.account_number || undefined,
      ifscCode:      raw.ifsc_code      || undefined,
    } : undefined,
  }
}

export interface TripRecord {
  id: string
  driver: string
  route: string
  status: 'COMPLETED' | 'IN PROGRESS' | 'CANCELLED'
  revenue: string
}

export interface ComplianceDoc {
  id: string
  title: string
  expiry: string
  status: 'valid' | 'warning' | 'expired'
  statusText: string
}

export const EMPTY_TRIPS: TripRecord[] = []
