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
  status: 'active' | 'pending' | 'suspended' | 'blacklisted'
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

export const INITIAL_VENDORS: Vendor[] = []

export const SAMPLE_TRIPS: TripRecord[] = []

export const SAMPLE_DOCS: ComplianceDoc[] = []
