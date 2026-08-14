export interface PricingContract {
  id: string
  tierName: 'Enterprise Premium' | 'Corporate Standard' | 'Custom Rate'
  baseRatePerKm: number
  extraHourRate: number
  nightSurchargePercent: number
  tollPolicy: 'Billed to Client' | 'Included in Base'
  contractStart: string
  contractEnd: string
  status: 'Active' | 'Expiring Soon' | 'Expired'
}

export interface ClientBookingRecord {
  id: string
  route: string
  bookingDate: string
  assignedVendor: string
  amount: string
  status: 'COMPLETED' | 'IN PROGRESS' | 'CANCELLED'
}

export interface ClientBillingDetails {
  billingAddress: string
  contactPerson: string
  email: string
  paymentTerms: string
}

export interface ClientIntegrationDetails {
  apiKey: string
  webhookUrl: string
}

export interface RazorpayPaymentInfo {
  transactionId: string
  orderId: string
  method: 'UPI' | 'Credit/Debit Card' | 'Netbanking' | 'QR Code' | 'Wallet' | 'Razorpay Authorized' | 'Official Razorpay SDK' | (string & {})
  methodDetail: string
  amount: string
  status: 'SUCCESS' | 'PENDING'
  paidAt: string
}

export interface CorporateClient {
  id: string | number
  company_name: string
  companyName?: string
  contact_person: string
  contactPerson?: string
  email: string
  mobile_number: string
  phone?: string
  gst_number: string
  gstin?: string
  pan_number: string
  address: string
  city?: string
  operating_cities: string[]
  category: 'Corporate' | 'SME' | 'Inter-City'
  status: 'active' | 'inactive' | 'suspended' | 'blacklisted'
  monthlyBookingVolume?: number
  totalSpent?: string
  billingDetails?: ClientBillingDetails
  integration?: ClientIntegrationDetails
  paymentInfo?: RazorpayPaymentInfo
  contract?: PricingContract
  bookingHistory?: ClientBookingRecord[]
  createdDate?: string
  createdAt?: string
  created_at?: string
}

// Initial empty clients state - all data is dynamically fetched from backend API (/api/v1/admin/clients)
export const INITIAL_CLIENTS: CorporateClient[] = []
