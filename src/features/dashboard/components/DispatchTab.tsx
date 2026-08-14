import React, { useMemo } from 'react'
import KpiCard from '@/components/common/KpiCard'
import {
  Calendar,
  Truck,
  AlertTriangle,
  Gauge,
  Trash2,
  ArrowRight,
  MapPin,
  Clock,
  Car,
  Navigation
} from '@/utils/icons'
import { type IncomingBooking } from '../types'

interface DispatchTabProps {
  incomingBookings: IncomingBooking[]
  onManualBookingClick: () => void
  onAssignVendorClick: (booking: IncomingBooking) => void
  onDeleteBooking: (id: string) => void
}

function DispatchTabComponent({
  incomingBookings,
  onAssignVendorClick,
  onDeleteBooking
}: DispatchTabProps) {
  // Array mapping for Dispatch KPI Cards using reusable KpiCard component
  const dispatchKpiCards = useMemo(
    () => [
      {
        id: 'unassigned',
        title: 'Unassigned Bookings',
        value: '42',
        subnote: '+12% vs last hour',
        subnoteStyle: 'text-[10px] font-bold text-emerald-600 mb-1',
        icon: Calendar,
        iconStyle: 'bg-teal-50 text-[#1B6B5C] border-teal-100',
        heightClass: 'h-32'
      },
      {
        id: 'activeTrips',
        title: 'Active Trips',
        value: '128',
        icon: Truck,
        iconStyle: 'bg-amber-50 text-amber-600 border-amber-100',
        heightClass: 'h-32'
      },
      {
        id: 'criticalEscalations',
        title: 'Critical Escalations',
        value: '5',
        icon: AlertTriangle,
        iconStyle: 'bg-red-50 text-red-600 border-red-100',
        heightClass: 'h-32'
      },
      {
        id: 'avgAssignTime',
        title: 'Avg. Assign Time',
        value: '18m',
        icon: Gauge,
        iconStyle: 'bg-emerald-50 text-emerald-600 border-emerald-100',
        heightClass: 'h-32'
      }
    ],
    []
  )

  return (
    <div className="flex flex-col gap-6">
      {/* Header & Action Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight">
            Dispatch Dashboard
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Real-time management of active and pending transport requests.
          </p>
        </div>
      </div>

      {/* 4 Dispatch KPI Stat Cards (Using KpiCard Component) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {dispatchKpiCards.map((card) => (
          <KpiCard key={card.id} {...card} />
        ))}
      </div>

      {/* Incoming Bookings Section */}
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-neutral-900 tracking-tight">Incoming Bookings</h2>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Live Updates Enabled
          </span>
        </div>

        {/* Booking Item Cards List */}
        <div className="flex flex-col gap-4">
          {incomingBookings.map((booking) => (
            <div
              key={booking.id}
              className={`bg-white p-5 rounded-lg border shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 transition-all hover:shadow-md ${
                booking.isUrgent ? 'border-2 border-red-500 bg-red-50/10' : 'border-neutral-200'
              }`}
            >
              {/* Vehicle Type Icon & Label */}
              <div className="flex items-center gap-4 min-w-[200px]">
                <div
                  className={`w-12 h-12 rounded-md flex items-center justify-center text-xl shrink-0 ${
                    booking.isUrgent
                      ? 'bg-red-100 text-red-600'
                      : 'bg-teal-50 text-[#1B6B5C] border border-teal-100'
                  }`}
                >
                  {booking.vehicleCategory === 'Truck' ? <Truck size={22} /> : <Car size={22} />}
                </div>
                <div className="flex flex-col">
                  {booking.isUrgent && (
                    <span className="text-[10px] font-extrabold text-red-600 uppercase tracking-wider mb-0.5">
                      {booking.urgentMessage}
                    </span>
                  )}
                  <span className="text-[10px] font-bold text-neutral-400 uppercase">Vehicle Type</span>
                  <span className="font-extrabold text-neutral-900 text-sm">{booking.vehicleType}</span>
                </div>
              </div>

              {/* Pickup -> Drop Route Details */}
              <div className="flex-1 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-y md:border-y-0 md:border-x border-neutral-100 py-3 md:py-0 md:px-6">
                {/* Pickup */}
                <div className="flex flex-col max-w-[220px]">
                  <span className="text-[10px] font-extrabold text-neutral-400 uppercase flex items-center gap-1">
                    <MapPin size={11} className="text-[#1B6B5C]" /> PICKUP
                  </span>
                  <span className="font-bold text-neutral-900 text-xs mt-0.5">{booking.pickup.title}</span>
                  <span className="text-[11px] text-neutral-400 leading-tight">{booking.pickup.address}</span>
                </div>

                <ArrowRight size={18} className="text-neutral-300 hidden sm:block shrink-0" />

                {/* Drop */}
                <div className="flex flex-col max-w-[220px]">
                  <span className="text-[10px] font-extrabold text-neutral-400 uppercase flex items-center gap-1">
                    <Navigation size={11} className="text-teal-600" /> DROP
                  </span>
                  <span className="font-bold text-neutral-900 text-xs mt-0.5">{booking.drop.title}</span>
                  <span className="text-[11px] text-neutral-400 leading-tight">{booking.drop.address}</span>
                </div>
              </div>

              {/* Schedule & Action Buttons */}
              <div className="flex items-center gap-5 w-full md:w-auto justify-between md:justify-end">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase">Schedule</span>
                  <span className="font-extrabold text-neutral-900 text-xs">{booking.schedule.time}</span>
                  <span
                    className={`text-[10px] font-bold mt-0.5 flex items-center gap-1 ${
                      booking.schedule.isOverdue ? 'text-red-600' : 'text-amber-600'
                    }`}
                  >
                    <Clock size={11} /> {booking.schedule.dueNote}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onDeleteBooking(booking.id)}
                    className="p-2 text-neutral-400 hover:text-red-600 hover:bg-neutral-100 rounded-md cursor-pointer transition-colors"
                    title="Delete booking"
                  >
                    <Trash2 size={16} />
                  </button>

                  <button
                    onClick={() => onAssignVendorClick(booking)}
                    className={`px-4 py-2 rounded-md font-bold text-xs shadow-sm transition-all cursor-pointer ${
                      booking.isUrgent
                        ? 'bg-red-600 hover:bg-red-700 text-white'
                        : 'bg-[#0D5C4D] hover:bg-[#094237] text-white border border-[#094237]'
                    }`}
                  >
                    {booking.isUrgent ? 'Assign Emergency' : 'Assign Vendor'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default React.memo(DispatchTabComponent)
