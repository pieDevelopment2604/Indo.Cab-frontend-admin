export type DriverOnlineStatus = 'online' | 'offline' | 'on_trip' | 'busy';

export type DriverKycStatus =
  | 'approved'
  | 'pending'
  | 'under_review'
  | 'rejected'
  | 'suspended';

export interface DriverDocumentInfo {
  status: 'valid' | 'expiring_soon' | 'expired' | 'verified' | 'pending' | 'rejected' | 'awaiting_upload' | 'locked';
  label: string;
  documentNumber?: string;
  expiryDate?: string;
  uploadDate?: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: string;
  verifiedApi?: boolean;
  notes?: string;
}

export interface DriverDocuments {
  drivingLicense: DriverDocumentInfo;
  aadhaarCard: DriverDocumentInfo;
  panCard: DriverDocumentInfo;
  medicalFitness: DriverDocumentInfo;
  policeVerification?: DriverDocumentInfo;
}

export interface Driver {
  id: string;
  customId: string; // e.g. #DRV-8821
  name: string;
  phone: string;
  email: string;
  avatar: string;
  
  // Vendor Association
  vendorId: string;
  vendorName: string;
  vendorCompany: string;

  // Vehicle & Fleet
  assignedVehicle?: string; // e.g. MH-12-QX-4029
  vehicleModel?: string; // e.g. Maruti Suzuki Dzire
  vehicleType?: 'Sedan' | 'SUV' | 'Hatchback' | 'Electric' | 'Heavy Vehicle';

  // Geographical Hub
  city: string;
  state: string;
  hub: string;

  // Professional Background
  experienceYears: number;
  category: string; // e.g. Heavy Vehicle Driver, Commercial Cab Driver
  bloodGroup?: string;
  dateOfBirth?: string;
  joiningDate: string;
  appliedDate?: string;

  // Compliance & Live Status
  onlineStatus: DriverOnlineStatus;
  kycStatus: DriverKycStatus;
  backgroundCheckPassed: boolean;

  // Performance Metrics
  rating: number;
  totalTrips: number;
  acceptanceRate: number;
  cancellationRate: number;
  dailyEarnings?: number;

  // Emergency & Bank
  emergencyContact?: {
    name: string;
    phone: string;
    relation: string;
  };
  bankDetails?: {
    accountHolder: string;
    accountNumber: string;
    bankName: string;
    ifscCode: string;
  };

  // Documents
  documents: DriverDocuments;
}

export interface ApprovalQueueItem {
  id: string;
  type: 'driver' | 'vehicle';
  regId: string; // e.g. #DRV-8821 or MH-12-QX-4029
  title: string; // Driver Name or Vehicle Model
  subtitle: string; // e.g. "Heavy Vehicle Driver • 12 Years Exp." or "Eicher 10.75 E2 Plus"
  appliedTime: string; // e.g. "Applied 2 hours ago"
  avatar?: string;
  vendorName: string;
  driverData?: Driver;
  status: 'pending' | 'approved' | 'rejected';
}

/**
 * Maps raw backend API driver object to normalized Driver model
 */
export function mapApiDriver(raw: any, index = 0): Driver {
  const firstName = raw.first_name || raw.firstName || '';
  const lastName = raw.last_name || raw.lastName || '';
  const fullName = raw.name || `${firstName} ${lastName}`.trim() || `Driver #${raw.id || index + 1}`;
  const driverId = String(raw.id || raw.driver_id || raw.custom_id || index + 1);

  // Normalize online status
  let onlineStatus: DriverOnlineStatus = 'offline';
  const rawOnline = String(raw.online_status || raw.onlineStatus || raw.status || '').toLowerCase();
  if (rawOnline.includes('online') || rawOnline === 'active') onlineStatus = 'online';
  else if (rawOnline.includes('trip') || rawOnline.includes('busy')) onlineStatus = 'on_trip';
  else if (rawOnline.includes('busy')) onlineStatus = 'busy';
  else onlineStatus = 'offline';

  // Normalize KYC status
  let kycStatus: DriverKycStatus = 'approved';
  const rawKyc = String(raw.kyc_status || raw.kycStatus || raw.verification_status || raw.status || '').toLowerCase();
  if (rawKyc.includes('pend') || rawKyc.includes('submit')) kycStatus = 'pending';
  else if (rawKyc.includes('review') || rawKyc.includes('progress')) kycStatus = 'under_review';
  else if (rawKyc.includes('reject')) kycStatus = 'rejected';
  else if (rawKyc.includes('suspend') || rawKyc.includes('block')) kycStatus = 'suspended';
  else if (rawKyc.includes('approv') || rawKyc.includes('verif')) kycStatus = 'approved';
  else kycStatus = raw.status === 'active' ? 'approved' : 'pending';

  return {
    id: driverId,
    customId: raw.customId || raw.custom_id || `#DRV-${String(raw.id || index + 1000).padStart(4, '0')}`,
    name: fullName,
    phone: raw.phone || raw.mobile_number || raw.mobile || '+91 98200 11223',
    email: raw.email || 'driver@indocab.com',
    avatar:
      raw.avatar ||
      raw.profile_image_url ||
      `https://images.unsplash.com/photo-${1535713875002 + ((index % 5) * 1000)}?auto=format&fit=crop&w=300&q=80`,
    vendorId: String(raw.vendor_id || raw.vendorId || (raw.vendor?.id) || 'vnd-101'),
    vendorName:
      raw.vendor_name ||
      raw.vendorName ||
      (raw.vendor ? (raw.vendor.name || raw.vendor.company_name) : 'Sahani Logistics & Fleet'),
    vendorCompany:
      raw.vendor_company ||
      raw.vendorCompany ||
      (raw.vendor ? raw.vendor.company_name : 'Sahani Travels Pvt Ltd'),
    assignedVehicle:
      raw.assigned_vehicle || raw.assignedVehicle || raw.vehicle_number || raw.vehicle?.registration_number || undefined,
    vehicleModel: raw.vehicle_model || raw.vehicleModel || raw.vehicle?.model || 'Maruti Suzuki Dzire',
    vehicleType: (raw.vehicle_type || raw.vehicleType || 'Sedan') as any,
    city: raw.city || raw.hub_city || raw.address || 'Mumbai',
    state: raw.state || 'Maharashtra',
    hub: raw.hub || raw.operating_hub || 'Andheri Central Hub',
    experienceYears: Number(raw.experience_years || raw.experienceYears) || 5,
    category: raw.category || `${raw.experience_years || 5} Years Experience Driver`,
    joiningDate: raw.joining_date || raw.joiningDate || raw.created_at || new Date().toISOString().split('T')[0],
    onlineStatus,
    kycStatus,
    backgroundCheckPassed: raw.background_check_passed ?? true,
    rating: Number(raw.rating) || 4.8,
    totalTrips: Number(raw.total_trips || raw.totalTrips || raw.trips_count) || 0,
    acceptanceRate: Number(raw.acceptance_rate || raw.acceptanceRate) || 98,
    cancellationRate: Number(raw.cancellation_rate || raw.cancellationRate) || 2,
    dailyEarnings: Number(raw.daily_earnings || raw.dailyEarnings) || 0,
    emergencyContact: raw.emergency_contact || raw.emergencyContact,
    bankDetails: raw.bank_details || raw.bankDetails,
    documents: raw.documents || {
      drivingLicense: {
        status: raw.dl_verified ? 'valid' : 'expiring_soon',
        label: 'Driving License (DL)',
        documentNumber: raw.license_number || raw.dl_number || 'MH-01-20220099881',
        expiryDate: raw.license_expiry || '2028-12-31',
        fileUrl:
          raw.license_url ||
          'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80',
        fileName: 'driving_license.pdf',
        verifiedApi: true,
      },
      aadhaarCard: {
        status: 'verified',
        label: 'Aadhaar Card',
        documentNumber: raw.aadhaar_number || '**** **** 8812',
        fileUrl:
          raw.aadhaar_url ||
          'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
        fileName: 'aadhaar_doc.pdf',
        verifiedApi: true,
      },
      panCard: {
        status: 'verified',
        label: 'PAN Card',
        documentNumber: raw.pan_number || 'ABCDE1234F',
        fileUrl:
          raw.pan_url ||
          'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80',
        fileName: 'pan_card.jpg',
        verifiedApi: true,
      },
      medicalFitness: {
        status: raw.medical_cert ? 'verified' : 'awaiting_upload',
        label: 'Medical Fitness Cert.',
      },
    },
  };
}

