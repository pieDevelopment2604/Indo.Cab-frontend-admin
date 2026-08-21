/**
 * Raw shape returned by GET /api/v1/admin/clients and /admin/clients/:id
 */
export interface ApiClient {
  id: number;
  company_name: string;
  contact_person: string;
  email: string;
  mobile_number: string;
  gst_number: string;
  pan_number: string;
  address: string;
  operating_cities: string[];
  discount_percentage: number;
  /** API returns uppercase: "ACTIVE" | "INACTIVE" | "SUSPENDED" | "BLACKLISTED" */
  status: string;
  created_at: string;
}

export interface PricingContract {
  id: string;
  tierName: "Enterprise Premium" | "Corporate Standard" | "Custom Rate";
  baseRatePerKm: number;
  extraHourRate: number;
  nightSurchargePercent: number;
  tollPolicy: "Billed to Client" | "Included in Base";
  contractStart: string;
  contractEnd: string;
  status: "Active" | "Expiring Soon" | "Expired";
}

export interface ClientBookingRecord {
  id: string;
  route: string;
  bookingDate: string;
  assignedVendor: string;
  amount: string;
  status: "COMPLETED" | "IN PROGRESS" | "CANCELLED";
}

export interface ClientBillingDetails {
  billingAddress: string;
  contactPerson: string;
  email: string;
  paymentTerms: string;
}

export interface ClientIntegrationDetails {
  apiKey: string;
  webhookUrl: string;
}

export interface RazorpayPaymentInfo {
  transactionId: string;
  orderId: string;
  method:
    | "UPI"
    | "Credit/Debit Card"
    | "Netbanking"
    | "QR Code"
    | "Wallet"
    | "Razorpay Authorized"
    | "Official Razorpay SDK"
    | (string & {});
  methodDetail: string;
  amount: string;
  status: "SUCCESS" | "PENDING";
  paidAt: string;
}

/**
 * Normalised front-end model — all fields camelCase, status lowercased.
 * Created by mapApiClient() from ApiClient.
 */
export interface CorporateClient {
  id: string | number;
  // API snake_case mirrors (kept for backward-compat with existing components)
  company_name: string;
  contact_person: string;
  mobile_number: string;
  gst_number: string;
  pan_number: string;
  address: string;
  operating_cities: string[];
  discount_percentage: number;
  created_at: string;
  // Normalised camelCase aliases
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  gstin: string;
  city: string;
  status: "active" | "inactive" | "suspended" | "blacklisted";
  createdAt: string;
  // Optional extended fields (not in list API, may come from detail API later)
  category?: "Corporate" | "SME" | "Inter-City";
  monthlyBookingVolume?: number;
  totalSpent?: string;
  billingDetails?: ClientBillingDetails;
  integration?: ClientIntegrationDetails;
  paymentInfo?: RazorpayPaymentInfo;
  contract?: PricingContract;
  bookingHistory?: ClientBookingRecord[];
}

/**
 * Maps a raw API client object → normalised CorporateClient.
 * Handles uppercase status, snake_case fields, and missing keys.
 */
export function mapApiClient(raw: ApiClient): CorporateClient {
  const statusRaw = (raw.status ?? "").toLowerCase();
  const validStatuses = [
    "active",
    "inactive",
    "suspended",
    "blacklisted",
  ] as const;
  const status = (
    validStatuses.includes(statusRaw as any) ? statusRaw : "inactive"
  ) as CorporateClient["status"];

  return {
    id: raw.id,
    // snake_case mirrors
    company_name: raw.company_name || "",
    contact_person: raw.contact_person || "",
    mobile_number: raw.mobile_number || "",
    gst_number: raw.gst_number || "",
    pan_number: raw.pan_number || "",
    address: raw.address || "",
    operating_cities: Array.isArray(raw.operating_cities)
      ? raw.operating_cities
      : [],
    discount_percentage: Number(raw.discount_percentage ?? 0),
    created_at: raw.created_at || "",
    // camelCase aliases
    companyName: raw.company_name || "",
    contactPerson: raw.contact_person || "",
    email: raw.email || "",
    phone: raw.mobile_number || "",
    gstin: raw.gst_number || "",
    city:
      raw.address ||
      (Array.isArray(raw.operating_cities) && raw.operating_cities[0]) ||
      "",
    status,
    createdAt: raw.created_at || "",
  };
}
