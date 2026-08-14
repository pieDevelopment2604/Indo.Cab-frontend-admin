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
  BarChart3,
  Star,
  UserCheck,
  DollarSign,
  Navigation,
  Users
} from '@/utils/icons'
import { SAMPLE_ACTIVITY_LOGS } from '../types'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Cell
} from 'recharts'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'

// Fix leaflet icon issue in React
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
})

interface OverviewTabProps {
  onNavigateToVendors: () => void
}

const BEST_VENDORS_DATA = [
  { name: 'Indo.Cab', rating: 4.92, completedTrips: 420 },
  { name: 'SwiftLink', rating: 4.85, completedTrips: 380 },
  { name: 'NorthStar', rating: 4.78, completedTrips: 310 },
  { name: 'Titan', rating: 4.72, completedTrips: 290 },
  { name: 'Apex', rating: 4.65, completedTrips: 250 },
  { name: 'Global', rating: 4.58, completedTrips: 210 }
]

// Mock Active Vehicles Data for Map
const ACTIVE_VEHICLES = [
  { id: 'GJ01-XX-1234', type: 'Truck', lat: 23.0225, lng: 72.5714, status: 'Active' },
  { id: 'MH02-AB-9876', type: 'Car', lat: 23.0300, lng: 72.5800, status: 'Idle' },
  { id: 'DL01-ZA-5678', type: 'Truck', lat: 23.0100, lng: 72.5500, status: 'Active' },
  { id: 'KA03-CD-3456', type: 'Car', lat: 23.0400, lng: 72.5600, status: 'Maintenance' }
]

function OverviewTabComponent({ onNavigateToVendors }: OverviewTabProps) {
  const [hoveredVendor, setHoveredVendor] = useState<number | null>(null)

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
          <p className="text-sm text-neutral-500 mt-1">
            Real-time operational summary, live vehicle tracking, and vendor performance ratings.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-md flex items-center gap-1.5 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Live Monitoring Active
          </span>
        </div>
      </div>

      {/* 5 Executive KPI Stat Cards (Using KpiCard Component) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
        {kpiCards.map((card) => (
          <KpiCard key={card.id} {...card} />
        ))}
      </div>

      {/* Grid: Best Vendors Rating Bar Graph + Live Vehicle Map */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Monthly Best Vendor Service Bar Graph Widget */}
        <div className="xl:col-span-7 bg-white p-5 rounded-lg border border-neutral-200 shadow-sm flex flex-col justify-between gap-6">
          <div className="flex justify-between items-center border-b border-neutral-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <BarChart3 size={18} className="text-[#1B6B5C]" />
                <h3 className="text-sm font-bold text-neutral-900">Monthly Best Vendors Service</h3>
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">Top rated logistics partners ranked by customer satisfaction & ratings</p>
            </div>

            <div className="flex items-center gap-2 text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
              <Star size={14} className="fill-amber-500 text-amber-500" />
              <span>Top Ratings</span>
            </div>
          </div>

          {/* Recharts Bar Graph */}
          <div className="w-full h-64 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={BEST_VENDORS_DATA}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                onMouseMove={(e) => {
                  if (e.activeTooltipIndex !== undefined) {
                    setHoveredVendor(e.activeTooltipIndex as number)
                  }
                }}
                onMouseLeave={() => setHoveredVendor(null)}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6B7280', fontWeight: 600 }} dy={10} />
                <YAxis domain={[4.0, 5.0]} axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6B7280' }} />
                <RechartsTooltip
                  cursor={{ fill: 'transparent' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload
                      return (
                        <div className="bg-neutral-900 text-white text-xs p-3 rounded-md shadow-lg border border-neutral-700 flex flex-col gap-1 z-50">
                          <span className="font-bold border-b border-neutral-700 pb-1 mb-0.5">{data.name}</span>
                          <span className="text-amber-400 font-bold flex items-center gap-1">
                            ★ {data.rating} / 5.0
                          </span>
                          <span className="text-neutral-300">{data.completedTrips} Trips Completed</span>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Bar dataKey="rating" radius={[4, 4, 0, 0]} maxBarSize={45}>
                  {BEST_VENDORS_DATA.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={hoveredVendor === index ? '#0D5C4D' : '#1B6B5C'}
                      style={{ transition: 'fill 0.2s ease' }}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex justify-between items-center text-xs text-neutral-500 pt-3 border-t border-neutral-100">
            <span>Overall Fleet Satisfaction: <strong className="text-emerald-600">4.82 / 5.0</strong></span>
            <button
              onClick={onNavigateToVendors}
              className="font-bold text-[#1B6B5C] hover:underline cursor-pointer"
            >
              View Full Vendor Leaderboard &rarr;
            </button>
          </div>
        </div>

        {/* Live Map of Vehicles Widget */}
        <div className="xl:col-span-5 bg-white p-5 rounded-lg border border-neutral-200 shadow-sm flex flex-col gap-4 relative">
          <div className="flex justify-between items-center border-b border-neutral-100 pb-3">
            <div className="flex items-center gap-2">
              <Truck size={18} className="text-emerald-600" />
              <h3 className="text-sm font-bold text-neutral-900">Live Map of Vehicles</h3>
            </div>
            <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-1 rounded-md border border-emerald-200">
              32 Cabs Active
            </span>
          </div>

          {/* React Leaflet Map */}
          <div className="w-full h-64 rounded-md overflow-hidden border border-neutral-200 relative z-0">
            <MapContainer center={[23.0225, 72.5714]} zoom={11} className="w-full h-full" zoomControl={false}>
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://carto.com/">Carto</a>'
              />
              {ACTIVE_VEHICLES.map((v) => (
                <Marker key={v.id} position={[v.lat, v.lng]}>
                  <Popup className="text-xs font-sans">
                    <div className="font-bold mb-1">{v.id}</div>
                    <div className="text-neutral-500">Type: {v.type}</div>
                    <div className={`font-semibold mt-1 ${v.status === 'Active' ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {v.status}
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
            
            {/* Overlay Map Legend */}
            <div className="absolute bottom-2 left-2 right-2 bg-white/90 backdrop-blur-sm p-2 rounded-md border border-neutral-200 text-[10px] flex justify-between items-center shadow-sm z-[400] font-semibold text-neutral-700">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Active (32)</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500"></span> Idle (10)</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-neutral-400"></span> Maint. (4)</span>
            </div>
          </div>

          <button
            onClick={onNavigateToVendors}
            className="w-full mt-auto py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold text-xs rounded-md transition-colors cursor-pointer text-center border border-neutral-200/50"
          >
            Manage Fleet Vehicles &amp; Vendors &rarr;
          </button>
        </div>
      </div>

      {/* Grid: Recent Activity Feed + Administrative Tasks */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left Column: Recent Activity Feed */}
        <div className="xl:col-span-8 bg-white rounded-lg border border-neutral-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-neutral-100 flex justify-between items-center">
            <h3 className="text-sm font-bold text-neutral-900">Recent Operational Activity</h3>
            <button className="text-xs font-bold text-[#1B6B5C] hover:underline cursor-pointer">
              View All
            </button>
          </div>

          <div className="divide-y divide-neutral-100">
            {SAMPLE_ACTIVITY_LOGS.map((item) => (
              <div key={item.id} className="p-4 hover:bg-neutral-50/70 transition-colors flex items-start gap-4">
                <div className="w-9 h-9 rounded-md bg-neutral-100 flex items-center justify-center shrink-0 text-neutral-600 border border-neutral-200/50">
                  {item.type === 'vendor_registered' && <UserCheck size={16} />}
                  {item.type === 'payout_released' && <CheckCircle size={16} className="text-emerald-600" />}
                  {item.type === 'failed_booking' && <AlertCircle size={16} className="text-red-500" />}
                </div>

                <div className="flex-1 flex flex-col gap-1">
                  <span className="font-bold text-neutral-900 text-sm">{item.title}</span>
                  <span className="text-xs text-neutral-500 leading-relaxed">{item.description}</span>

                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                        item.tagType === 'warning'
                          ? 'bg-amber-100 text-amber-800 border-amber-200'
                          : item.tagType === 'success'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                          : 'bg-red-100 text-red-800 border-red-200'
                      } border`}
                    >
                      {item.tag}
                    </span>
                    <span className="text-[10px] text-neutral-400 font-medium">{item.timeAgo}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Administrative Tasks */}
        <div className="xl:col-span-4 bg-white p-5 rounded-lg border border-neutral-200 shadow-sm flex flex-col gap-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
            Administrative Tasks
          </span>

          <div className="grid grid-cols-2 gap-3 flex-1">
            {adminTasks.map(({ id, label, icon: TaskIcon, onClick }) => (
              <button
                key={id}
                onClick={onClick}
                className="p-3 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 rounded-md flex flex-col items-center justify-center gap-2 cursor-pointer transition-all shadow-xs"
              >
                <TaskIcon size={18} className="text-neutral-700" />
                <span className="text-[11px] font-semibold text-neutral-800">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default React.memo(OverviewTabComponent)
