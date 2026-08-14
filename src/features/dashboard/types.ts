export interface IncomingBooking {
  id: string
  vehicleType: string
  vehicleCategory: 'SUV' | 'Truck' | 'Sedan' | 'Hatchback'
  isUrgent?: boolean
  urgentMessage?: string
  pickup: {
    title: string
    address: string
    notes?: string
  }
  drop: {
    title: string
    address: string
    notes?: string
  }
  schedule: {
    time: string
    dueNote: string
    isOverdue?: boolean
  }
}

export interface ActiveTripDriver {
  id: string
  tripId: string
  driverName: string
  avatar: string
  status: 'On Time' | 'Caution' | 'Delayed'
  statusType: 'success' | 'warning' | 'error'
  origin: string
  destination: string
  eta: string
  etaNote: string
  progressPercent: number
  trafficLevelPercent?: number
  lat: number
  lng: number
  distance?: string
  duration?: string
}

export interface ActivityLogItem {
  id: string
  type: 'vendor_registered' | 'payout_released' | 'failed_booking' | 'system'
  title: string
  description: string
  tag: string
  tagType: 'warning' | 'success' | 'error' | 'info'
  timeAgo: string
}

export const SAMPLE_INCOMING_BOOKINGS: IncomingBooking[] = [
  {
    id: 'BK-1001',
    vehicleType: 'Standard SUV',
    vehicleCategory: 'SUV',
    pickup: {
      title: 'Indira Gandhi Int\'l Airport (DEL)',
      address: 'Terminal 3, Gate 4B'
    },
    drop: {
      title: 'Gurugram Cyber City, DLF Ph 2',
      address: 'Tower C Entrance'
    },
    schedule: {
      time: 'Oct 24, 14:30 PM',
      dueNote: 'Due in 45 mins'
    }
  },
  {
    id: 'BK-1002',
    vehicleType: 'Container Truck (12ft)',
    vehicleCategory: 'Truck',
    pickup: {
      title: 'Okhla Industrial Estate Ph 3',
      address: 'Warehouse G-12'
    },
    drop: {
      title: 'Sahibabad Logistic Park',
      address: 'Dock Station 04'
    },
    schedule: {
      time: 'Oct 24, 16:00 PM',
      dueNote: 'Starts in 2 hours'
    }
  },
  {
    id: 'BK-1003',
    vehicleType: 'Premium Sedan',
    vehicleCategory: 'Sedan',
    isUrgent: true,
    urgentMessage: '! Urgent Replace',
    pickup: {
      title: 'The Leela Palace, Chanakyapuri',
      address: 'Main Portico'
    },
    drop: {
      title: 'Agra Express Highway Pt 1',
      address: 'Client Awaiting'
    },
    schedule: {
      time: 'ASAP',
      dueNote: 'Overdue by 15m',
      isOverdue: true
    }
  }
]

export const SAMPLE_ACTIVE_DRIVERS: ActiveTripDriver[] = [
  {
    id: 'DRV-101',
    tripId: 'TRK-00912',
    driverName: 'Rajesh Kumar',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    status: 'On Time',
    statusType: 'success',
    origin: 'New Delhi Railway Station',
    destination: 'Connaught Place',
    eta: '14:45',
    etaNote: '12m left',
    progressPercent: 78,
    lat: 28.6429,
    lng: 77.2191,
    distance: '2.5 km',
    duration: '12 mins'
  },
  {
    id: 'DRV-102',
    tripId: 'TRK-00845',
    driverName: 'Sanjay Singh',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
    status: 'Caution',
    statusType: 'warning',
    origin: 'Indira Gandhi Int\'l Airport',
    destination: 'Gurugram Cyber City',
    eta: '15:30',
    etaNote: '+15m delay',
    progressPercent: 45,
    trafficLevelPercent: 82,
    lat: 28.5562,
    lng: 77.1000,
    distance: '18.2 km',
    duration: '45 mins'
  },
  {
    id: 'DRV-103',
    tripId: 'TRK-00722',
    driverName: 'Vikram Sharma',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    status: 'On Time',
    statusType: 'success',
    origin: 'Noida Sector 18',
    destination: 'Okhla Industrial Area',
    eta: '14:15',
    etaNote: 'Arriving',
    progressPercent: 92,
    lat: 28.5700,
    lng: 77.3200,
    distance: '12.4 km',
    duration: '28 mins'
  }
]

export const SAMPLE_ACTIVITY_LOGS: ActivityLogItem[] = [
  {
    id: 'LOG-1',
    type: 'vendor_registered',
    title: 'New Vendor Registered: Global Logistics Solutions Ltd.',
    description: 'Application pending documents verification.',
    tag: 'Warning',
    tagType: 'warning',
    timeAgo: '2 mins ago'
  },
  {
    id: 'LOG-2',
    type: 'payout_released',
    title: 'Payout Released: Settlement #TX-8829 for Swift Riders.',
    description: 'Processed successfully to registered bank account.',
    tag: 'Success',
    tagType: 'success',
    timeAgo: '45 mins ago'
  },
  {
    id: 'LOG-3',
    type: 'failed_booking',
    title: 'Failed Booking Attempt: Indo-8890-CX',
    description: 'Payment gateway timeout at checkout. Customer notified.',
    tag: 'Error',
    tagType: 'error',
    timeAgo: '2 hours ago'
  }
]
