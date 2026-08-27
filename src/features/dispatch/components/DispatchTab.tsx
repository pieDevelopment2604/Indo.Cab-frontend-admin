import React, { useMemo } from "react";
import KpiCard from "@/components/common/KpiCard";
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
  Navigation,
} from "@/utils/icons";
import { type IncomingBooking } from "../../dashboard/types";

interface DispatchTabProps {
  incomingBookings: IncomingBooking[];
  onManualBookingClick: () => void;
  onAssignVendorClick: (booking: IncomingBooking) => void;
  onDeleteBooking: (id: string) => void;
}

function DispatchTabComponent({
  incomingBookings,
  onAssignVendorClick,
  onDeleteBooking,
}: DispatchTabProps) {
  // Array mapping for Dispatch KPI Cards using reusable KpiCard component
  const dispatchKpiCards = useMemo(
    () => [
      {
        id: "unassigned",
        title: "Unassigned Bookings",
        value: "42",
        subnote: "+12% vs last hour",
        subnoteStyle: "text-[10px] font-bold text-emerald-600 mb-1",
        icon: Calendar,
        iconStyle: "bg-teal-50 text-[#1B6B5C] border-teal-100",
        heightClass: "h-32",
      },
      {
        id: "activeTrips",
        title: "Active Trips",
        value: "128",
        icon: Truck,
        iconStyle: "bg-amber-50 text-amber-600 border-amber-100",
        heightClass: "h-32",
      },
      {
        id: "criticalEscalations",
        title: "Critical Escalations",
        value: "5",
        icon: AlertTriangle,
        iconStyle: "bg-red-50 text-red-600 border-red-100",
        heightClass: "h-32",
      },
      {
        id: "avgAssignTime",
        title: "Avg. Assign Time",
        value: "18m",
        icon: Gauge,
        iconStyle: "bg-emerald-50 text-emerald-600 border-emerald-100",
        heightClass: "h-32",
      },
    ],
    [],
  );

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
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {dispatchKpiCards.map((card) => (
          <KpiCard key={card.id} {...card} />
        ))}
      </div>

      {/* Incoming Bookings Section */}
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-neutral-900 tracking-tight">
            Incoming Bookings
          </h2>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Live Updates Enabled
          </span>
        </div>

        {/* Booking Item Cards List */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {incomingBookings.map((booking) => (
            <div
              key={booking.id}
              className={`bg-white rounded-2xl border p-4 sm:p-5 flex flex-col gap-3.5 transition-all hover:shadow-md ${
                booking.isUrgent
                  ? "border-red-400 bg-red-50/10 shadow-xs"
                  : "border-neutral-200/80 shadow-xs"
              }`}
            >
              {/* Top Row: Vehicle Type + Assign Vendor Button */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0 ${
                      booking.isUrgent
                        ? "bg-red-50 text-red-600 border border-red-100"
                        : "bg-emerald-50 text-[#0D5C4D] border border-emerald-100/80"
                    }`}
                  >
                    {booking.vehicleCategory === "Truck" ? (
                      <Truck size={22} strokeWidth={1.8} />
                    ) : (
                      <Car size={22} strokeWidth={1.8} />
                    )}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-bold text-neutral-900 text-sm sm:text-base leading-snug truncate">
                      {booking.vehicleType}
                    </span>
                    <span className="text-xs text-neutral-400 font-medium truncate">
                      {booking.isUrgent && booking.urgentMessage ? (
                        <span className="text-red-600 font-bold uppercase text-[10px] tracking-wide">
                          {booking.urgentMessage}
                        </span>
                      ) : (
                        "Vehicle Type"
                      )}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onAssignVendorClick(booking)}
                  className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-xs cursor-pointer shrink-0 ${
                    booking.isUrgent
                      ? "bg-red-600 hover:bg-red-700 text-white"
                      : "bg-[#0D5C4D] hover:bg-[#09473b] text-white"
                  }`}
                >
                  {booking.isUrgent ? "Assign Emergency" : "Assign Vendor"}
                </button>
              </div>

              {/* Divider */}
              <div className="border-t border-neutral-100" />

              {/* Middle Row: Pickup -> Drop Route */}
              <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] items-start sm:items-center gap-2.5 sm:gap-4">
                {/* Pickup */}
                <div className="flex flex-col min-w-0">
                  <span className="text-[11px] font-bold text-[#0D5C4D] uppercase flex items-center gap-1.5 tracking-wider">
                    <MapPin size={13} className="text-[#0D5C4D] shrink-0" /> PICKUP
                  </span>
                  <span className="font-bold text-xs sm:text-[13px] text-neutral-900 mt-1 leading-snug">
                    {booking.pickup.title}
                  </span>
                  <span className="text-[11px] text-neutral-400 leading-tight mt-0.5">
                    {booking.pickup.address}
                  </span>
                </div>

                {/* Route Arrow */}
                <div className="hidden sm:flex items-center justify-center px-1">
                  <ArrowRight size={18} className="text-neutral-300 shrink-0" />
                </div>

                {/* Drop */}
                <div className="flex flex-col min-w-0">
                  <span className="text-[11px] font-bold text-[#0D5C4D] uppercase flex items-center gap-1.5 tracking-wider">
                    <Navigation size={13} className="text-[#0D5C4D] shrink-0" /> DROP
                  </span>
                  <span className="font-bold text-xs sm:text-[13px] text-neutral-900 mt-1 leading-snug">
                    {booking.drop.title}
                  </span>
                  <span className="text-[11px] text-neutral-400 leading-tight mt-0.5">
                    {booking.drop.address}
                  </span>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-neutral-100" />

              {/* Bottom Row: Schedule, Due Time, and Delete Button */}
              <div className="flex items-center justify-between gap-3">
                {/* Schedule Info */}
                <div className="flex items-center gap-2.5 min-w-0">
                  <Calendar size={18} className="text-[#0D5C4D] shrink-0" strokeWidth={1.8} />
                  <div className="flex flex-col min-w-0">
                    <span className="text-[10px] font-extrabold uppercase text-[#0D5C4D] tracking-wider leading-none">
                      SCHEDULE
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-neutral-900 mt-0.5 leading-tight truncate">
                      {booking.schedule.time}
                    </span>
                  </div>
                </div>

                {/* Due in X mins badge */}
                <div className="flex items-center gap-1.5 text-xs font-bold shrink-0">
                  <Clock
                    size={15}
                    className={`shrink-0 ${
                      booking.schedule.isOverdue ? "text-red-500" : "text-amber-500"
                    }`}
                  />
                  <span
                    className={
                      booking.schedule.isOverdue ? "text-red-600" : "text-amber-600"
                    }
                  >
                    {booking.schedule.dueNote}
                  </span>
                </div>

                {/* Delete / Cancel Button */}
                <button
                  type="button"
                  onClick={() => onDeleteBooking(booking.id)}
                  className="w-9 h-9 rounded-xl bg-rose-50/80 hover:bg-rose-100 border border-rose-200/90 text-rose-500 hover:text-rose-600 flex items-center justify-center transition-colors cursor-pointer shrink-0 shadow-2xs"
                  title="Delete booking"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default React.memo(DispatchTabComponent);
