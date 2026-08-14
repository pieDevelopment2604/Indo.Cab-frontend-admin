import React, { useState, useMemo } from 'react'
import KpiCard from '@/components/common/KpiCard'
import {
  Calendar,
  Building2,
  FileText,
  Tag,
  Headphones,
  CheckCircle,
  AlertCircle,
  Truck,
  Car,
  BarChart3,
  Star,
  ShieldAlert,
  UserCheck,
  DollarSign,
  AlertTriangle,
  Navigation,
  Users
} from '@/utils/icons'
import { SAMPLE_ACTIVITY_LOGS } from '../types'

interface OverviewTabProps {
  onNavigateToVendors: () => void
}

const BEST_VENDORS_DATA = [
  { name: 'Indo.Cab Fleet', rating: 4.92, completedTrips: 420 },
  { name: 'SwiftLink Express', rating: 4.85, completedTrips: 380 },
  { name: 'NorthStar Freight', rating: 4.78, completedTrips: 310 },
  { name: 'Titan Haulage', rating: 4.72, completedTrips: 290 },
  { name: 'Apex Logistics', rating: 4.65, completedTrips: 250 },
  { name: 'Global Express', rating: 4.58, completedTrips: 210 },
]

function OverviewTabComponent({ onNavigateToVendors }: OverviewTabProps) {
  const activeBookings = 1284
  const activeVendors = 86
  const suspendedClients = 12
  const totalRegisteredVehicles = 542

  const [hoveredVendor, setHoveredVendor] = useState<number | null>(0)

  // Array mapping for 5 KPI Stat Cards
  const kpiCards = useMemo(
    () => [
      {
        id: 'totalBookings',
        title: 'Total Bookings',
        value: '3,492',
        badge: '+8% this week',
        icon: Calendar,
        iconStyle: 'bg-teal-50 text-[#1B6B5C] border-teal-100',
        badgeStyle: 'text-emerald-600 font-bold'
      },
      {
        id: 'activeTrips',
        title: 'Active Trips',
        value: '32',
        badge: 'Live',
        icon: Navigation,
        iconStyle: 'bg-blue-50 text-blue-600 border-blue-100',
        badgeStyle: 'text-blue-600 font-bold'
      },
      {
        id: 'pendingVendors',
        title: 'Pending Vendors',
        value: '14',
        badge: 'Action Needed',
        icon: Building2,
        iconStyle: 'bg-amber-50 text-amber-600 border-amber-100',
        badgeStyle: 'text-amber-600 font-bold'
      },
      {
        id: 'revenue',
        title: 'Revenue Summary',
        value: '₹ 14.5L',
        badge: '+12.5%',
        icon: DollarSign,
        iconStyle: 'bg-emerald-50 text-emerald-600 border-emerald-100',
        badgeStyle: 'text-emerald-600 font-bold'
      },
      {
        id: 'totalClients',
        title: 'Total Clients',
        value: '5',
        badge: 'Clients',
        icon: Users,
        iconStyle: 'bg-red-50 text-red-600 border-red-100',
        badgeStyle: 'text-red-600 font-bold'
      }
    ],
    []
  )

  // Array mapping for Administrative Tasks
  const adminTasks = useMemo(
    () => [
      { id: 'report', label: 'Daily Report', icon: FileText, onClick: undefined },
      { id: 'verify', label: 'Verify Vendors', icon: UserCheck, onClick: onNavigateToVendors },
      { id: 'pricing', label: 'Zone Pricing', icon: Tag, onClick: undefined },
      { id: 'support', label: 'Support Desk', icon: Headphones, onClick: undefined }
    ],
    [onNavigateToVendors]
  )

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight">
            Fleet & Operational Command
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Real-time operational summary, live vehicle tracking, and vendor performance ratings.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Live Monitoring Active
          </span>
        </div>
      </div>

      {/* 5 Executive KPI Stat Cards (Using KpiCard Component) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {kpiCards.map((card) => (
          <KpiCard key={card.id} {...card} />
        ))}
      </div>

      {/* Grid: Best Vendors Rating Bar Graph + Live Vehicle Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Monthly Best Vendor Service Bar Graph Widget */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-xs flex flex-col justify-between gap-6">
          <div className="flex justify-between items-center border-b border-neutral-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <BarChart3 size={18} className="text-[#1B6B5C]" />
                <h3 className="text-base font-bold text-neutral-900">Monthly Best Vendors Service</h3>
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">Top rated logistics partners ranked by customer satisfaction & ratings</p>
            </div>

            <div className="flex items-center gap-2 text-xs font-extrabold text-amber-500 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              <Star size={14} className="fill-amber-400 text-amber-400" />
              <span>Top Performance Rating</span>
            </div>
          </div>

          {/* Vendor Rating Bar Graph Canvas */}
          <div className="flex items-end justify-between gap-3 h-52 pt-6 px-2 border-b border-neutral-100 relative select-none">
            {BEST_VENDORS_DATA.map((vendor, idx) => {
              const ratingPercent = (vendor.rating / 5.0) * 100
              const isHovered = hoveredVendor === idx

              return (
                <div
                  key={vendor.name}
                  onMouseEnter={() => setHoveredVendor(idx)}
                  className="flex-1 flex flex-col items-center gap-2 h-full justify-end cursor-pointer group"
                >
                  {/* Tooltip on hover */}
                  {isHovered && (
                    <div className="absolute -top-3 bg-neutral-900 text-white text-[10px] p-2 rounded-xl shadow-lg border border-neutral-700 z-20 animate-fadeIn pointer-events-none flex flex-col gap-0.5 text-center">
                      <span className="font-bold border-b border-neutral-700 pb-0.5">{vendor.name}</span>
                      <span className="text-amber-400 font-bold flex items-center justify-center gap-1">
                        ★ {vendor.rating} / 5.0
                      </span>
                      <span className="text-neutral-300">{vendor.completedTrips} Trips Completed</span>
                    </div>
                  )}

                  {/* Rating Column Bar */}
                  <div className="w-full flex flex-col items-center justify-end h-full">
                    <div
                      className={`w-full rounded-t-xl transition-all duration-300 flex items-center justify-center text-[10px] font-bold text-white shadow-xs ${
                        isHovered ? 'bg-[#0D5C4D]' : 'bg-[#1B6B5C]'
                      }`}
                      style={{ height: `${ratingPercent}%` }}
                    >
                      {vendor.rating}
                    </div>
                  </div>

                  <span className="text-[10px] font-bold text-neutral-600 group-hover:text-[#1B6B5C] transition-colors truncate max-w-[70px] text-center">
                    {vendor.name.split(' ')[0]}
                  </span>
                </div>
              )
            })}
          </div>

          <div className="flex justify-between items-center text-xs text-neutral-500 pt-1">
            <span>Overall Fleet Satisfaction: <strong className="text-emerald-600">4.82 / 5.0</strong></span>
            <button
              onClick={onNavigateToVendors}
              className="text-xs font-bold text-[#1B6B5C] hover:underline cursor-pointer"
            >
              View Full Vendor Leaderboard →
            </button>
          </div>
        </div>

        {/* Live Map of Vehicles Widget */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-xs flex flex-col justify-between gap-4">
          <div className="flex justify-between items-center border-b border-neutral-100 pb-3">
            <div className="flex items-center gap-2">
              <Truck size={18} className="text-emerald-600" />
              <h3 className="text-base font-bold text-neutral-900">Live Map of Vehicles</h3>
            </div>
            <span className="bg-emerald-50 text-emerald-700 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-emerald-200">
              32 Cabs Active
            </span>
          </div>

          {/* Interactive Map Visual Box */}
          <div className="relative w-full h-56 rounded-2xl bg-[#0B131E] overflow-hidden border border-slate-800 flex items-center justify-center select-none shadow-inner">
            <svg className="absolute inset-0 w-full h-full opacity-35" viewBox="0 0 400 250" fill="none">
              <circle cx="200" cy="125" r="70" stroke="#EAB308" strokeWidth="1" strokeDasharray="3 3" />
              <circle cx="200" cy="125" r="130" stroke="#EAB308" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="0" y1="125" x2="400" y2="125" stroke="#CA8A04" strokeWidth="1" />
              <line x1="200" y1="0" x2="200" y2="250" stroke="#CA8A04" strokeWidth="1" />
            </svg>

            {/* Vehicle Pins */}
            <div className="absolute top-1/4 left-1/3 flex flex-col items-center animate-bounce">
              <span className="w-7 h-7 rounded-full bg-emerald-500 text-white font-bold text-xs flex items-center justify-center shadow-lg border-2 border-white">
                <Truck size={14} />
              </span>
              <span className="text-[9px] font-bold text-white bg-slate-900/90 px-1.5 py-0.2 rounded border border-slate-700 mt-0.5">
                GJ01-XX-1234
              </span>
            </div>

            <div className="absolute bottom-1/3 right-1/4 flex flex-col items-center">
              <span className="w-7 h-7 rounded-full bg-teal-600 text-white font-bold text-xs flex items-center justify-center shadow-lg border-2 border-white">
                <Car size={14} />
              </span>
              <span className="text-[9px] font-bold text-white bg-slate-900/90 px-1.5 py-0.2 rounded border border-slate-700 mt-0.5">
                MH02-AB-9876
              </span>
            </div>

            <div className="absolute bottom-4 left-4 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700 text-white text-[10px] flex items-center gap-3">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500" /> 32 Active
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-500" /> 10 Idle
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-neutral-400" /> 4 Maint.
              </span>
            </div>
          </div>

          <button
            onClick={onNavigateToVendors}
            className="w-full py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold text-xs rounded-xl transition-colors cursor-pointer text-center"
          >
            Manage Fleet Vehicles & Vendors →
          </button>
        </div>
      </div>

      {/* Grid: Recent Activity Feed + Administrative Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Recent Activity Feed */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-neutral-200/80 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-neutral-100 flex justify-between items-center">
            <h3 className="text-base font-bold text-neutral-900">Recent Operational Activity</h3>
            <button className="text-xs font-bold text-[#1B6B5C] hover:underline cursor-pointer">
              View All
            </button>
          </div>

          <div className="divide-y divide-neutral-100 p-2">
            {SAMPLE_ACTIVITY_LOGS.map((item) => (
              <div key={item.id} className="p-4 hover:bg-neutral-50/70 transition-colors flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center shrink-0 text-neutral-600">
                  {item.type === 'vendor_registered' && <UserCheck size={18} />}
                  {item.type === 'payout_released' && <CheckCircle size={18} className="text-emerald-600" />}
                  {item.type === 'failed_booking' && <AlertCircle size={18} className="text-red-500" />}
                </div>

                <div className="flex-1 flex flex-col gap-1">
                  <span className="font-bold text-neutral-900 text-sm">{item.title}</span>
                  <span className="text-xs text-neutral-500 leading-relaxed">{item.description}</span>

                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        item.tagType === 'warning'
                          ? 'bg-amber-100 text-amber-800'
                          : item.tagType === 'success'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {item.tag}
                    </span>
                    <span className="text-[10px] text-neutral-400">{item.timeAgo}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Administrative Tasks */}
        <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-xs flex flex-col gap-3">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-neutral-400">
            ADMINISTRATIVE TASKS
          </span>

          <div className="grid grid-cols-2 gap-3">
            {adminTasks.map(({ id, label, icon: TaskIcon, onClick }) => (
              <button
                key={id}
                onClick={onClick}
                className="p-3 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200/60 rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <TaskIcon size={18} className="text-neutral-700" />
                <span className="text-[11px] font-bold text-neutral-800">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default React.memo(OverviewTabComponent)
