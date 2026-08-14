import React from 'react'
import  { SAMPLE_TRIPS } from '../types'
import type { Vendor } from '../types'
import {
  X,
  AlertCircle,
  CheckCircle,
  Building2,
  Mail,
  Edit,
  Star,
  Trash2
} from '@/utils/icons'

interface VendorDetailScreenProps {
  selectedVendor: Vendor
  canManageVendors: boolean
  onBackToOverview: () => void
  onSuspendToggle: (id: string) => void
  onApproveVendor: (id: string) => void
  onDeleteVendor: (id: string) => void
}

export default function VendorDetailScreen({
  selectedVendor,
  canManageVendors,
  onBackToOverview,
  onSuspendToggle,
  onApproveVendor,
  onDeleteVendor
}: VendorDetailScreenProps) {
  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white px-6 py-5 border-b border-neutral-100 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-neutral-900 tracking-tight">
            Vendor Details
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            {selectedVendor.name}
          </p>
        </div>
        <button
          onClick={onBackToOverview}
          className="w-8 h-8 rounded-full bg-neutral-50 hover:bg-neutral-100 text-neutral-500 flex items-center justify-center transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>
      </div>

      <div className="p-6 flex flex-col gap-6">
        {/* Action Buttons */}
        {canManageVendors && (
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => onSuspendToggle(selectedVendor.id)}
              className="flex-1 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <AlertCircle size={15} />
              {selectedVendor.status === 'suspended' ? 'Reactivate' : 'Suspend'}
            </button>

            <button
              onClick={() => onApproveVendor(selectedVendor.id)}
              className="flex-1 py-2 bg-[#0D5C4D] hover:bg-[#094237] text-white font-bold text-xs rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <CheckCircle size={15} />
              Approve
            </button>

            <button
              onClick={() => onDeleteVendor(selectedVendor.id)}
              className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Trash2 size={15} />
              Delete
            </button>
          </div>
        )}

        {/* Vendor Profile Summary Card */}
        <div className="bg-white p-5 rounded-xl border border-neutral-200/80 shadow-sm flex flex-col items-center text-center">
          {/* Logo Box */}
          <div className="w-20 h-20 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-[#1B6B5C] font-extrabold text-xl mb-3">
            <Building2 size={32} strokeWidth={1.8} />
          </div>

          <h3 className="text-lg font-bold text-neutral-900 tracking-tight">
            {selectedVendor.name}
          </h3>

          <span className="mt-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-extrabold uppercase tracking-wider rounded-md">
            {selectedVendor.status} VENDOR
          </span>

          <div className="w-full border-t border-neutral-100 my-4" />

          {/* Properties List */}
          <div className="w-full flex flex-col gap-2.5 text-xs text-left">
            <div className="flex justify-between items-center">
              <span className="text-neutral-400 font-medium">Vendor ID</span>
              <span className="font-bold text-neutral-900 font-mono">{selectedVendor.id}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-neutral-400 font-medium">Contact Person</span>
              <span className="font-bold text-neutral-900">{selectedVendor.contactPerson}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-neutral-400 font-medium">Fleet Size</span>
              <span className="font-bold text-neutral-900">{selectedVendor.fleetSize} Vehicles</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-neutral-400 font-medium">Region</span>
              <span className="font-bold text-neutral-900">{selectedVendor.city}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-neutral-400 font-medium">Joined</span>
              <span className="font-bold text-neutral-900">{selectedVendor.joinDate}</span>
            </div>
          </div>

          {/* Profile Action Buttons */}
          <div className="w-full grid grid-cols-2 gap-2 mt-5">
            <button className="py-2 border border-neutral-200 hover:bg-neutral-50 text-neutral-800 font-bold text-xs rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5">
              <Mail size={14} />
              Contact
            </button>

            <button className="py-2 border border-neutral-200 hover:bg-neutral-50 text-neutral-800 font-bold text-xs rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5">
              <Edit size={14} />
              Edit
            </button>
          </div>
        </div>

        {/* 4 Metric Indicator Bar Cards */}
        <div className="grid grid-cols-2 gap-3">
          {/* Metric 1 */}
          <div className="bg-white p-4 rounded-xl border border-neutral-200/80 border-l-4 border-l-emerald-500 shadow-sm flex flex-col justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
              ACCEPTANCE RATE
            </span>
            <div className="mt-2">
              <div className="text-xl font-black text-neutral-900">
                {selectedVendor.acceptanceRate}%
              </div>
              <span className="text-[10px] font-bold text-emerald-600 inline-flex items-center gap-0.5 mt-0.5">
                +2.1% ↑
              </span>
            </div>
          </div>

          {/* Metric 2 */}
          <div className="bg-white p-4 rounded-xl border border-neutral-200/80 border-l-4 border-l-red-500 shadow-sm flex flex-col justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
              CANCELLATION RATE
            </span>
            <div className="mt-2">
              <div className="text-xl font-black text-neutral-900">
                {selectedVendor.cancellationRate}%
              </div>
              <span className="text-[10px] font-bold text-red-500 inline-flex items-center gap-0.5 mt-0.5">
                -0.5% ↓
              </span>
            </div>
          </div>

          {/* Metric 3 */}
          <div className="bg-white p-4 rounded-xl border border-neutral-200/80 border-l-4 border-l-teal-600 shadow-sm flex flex-col justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
              COMPLETION RATE
            </span>
            <div className="mt-2">
              <div className="text-xl font-black text-neutral-900">
                {selectedVendor.completionRate}%
              </div>
              <span className="text-[10px] font-semibold text-neutral-500 mt-0.5 block">
                Stable
              </span>
            </div>
          </div>

          {/* Metric 4 */}
          <div className="bg-white p-4 rounded-xl border border-neutral-200/80 border-l-4 border-l-amber-400 shadow-sm flex flex-col justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
              CUSTOMER RATING
            </span>
            <div className="mt-2">
              <div className="text-xl font-black text-neutral-900 flex items-center gap-1">
                {selectedVendor.rating} <Star size={15} className="fill-amber-400 text-amber-400" />
              </div>
              <span className="text-[9px] font-bold text-neutral-400 uppercase mt-0.5 block">
                842 REVIEWS
              </span>
            </div>
          </div>
        </div>

          {/* Recent Trip History Card */}
          <div className="bg-white rounded-2xl border border-neutral-200/80 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-neutral-100 flex justify-between items-center">
              <h3 className="text-base font-bold text-neutral-900">Recent Trip History</h3>
              <button className="text-xs font-bold text-[#1B6B5C] hover:underline cursor-pointer">
                View All Records
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-neutral-50 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                    <th className="py-3 px-5">TRIP ID</th>
                    <th className="py-3 px-5">DRIVER</th>
                    <th className="py-3 px-5">ROUTE</th>
                    <th className="py-3 px-5">STATUS</th>
                    <th className="py-3 px-5 text-right">REVENUE</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 text-xs font-medium text-neutral-800">
                  {SAMPLE_TRIPS.map((trip) => (
                    <tr key={trip.id} className="hover:bg-neutral-50/80">
                      <td className="py-3.5 px-5 font-bold font-mono text-neutral-900">{trip.id}</td>
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 text-[10px] font-bold flex items-center justify-center">
                            {trip.driver.charAt(0)}
                          </div>
                          <span>{trip.driver}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-5 text-neutral-600">{trip.route}</td>
                      <td className="py-3.5 px-5">
                        <span
                          className={`px-2 py-0.5 rounded text-[9px] font-extrabold tracking-wider ${
                            trip.status === 'COMPLETED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {trip.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-5 text-right font-bold text-neutral-900">{trip.revenue}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-3 text-center text-[11px] text-neutral-400 bg-neutral-50/50 border-t border-neutral-100 italic">
              Showing last 5 trips of 2,410 total.
            </div>
          </div>

          {/* Fleet Geographic Distribution Card (Visual Map Container) */}
          <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-xs flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-neutral-900">Fleet Geographic Distribution</h3>
              <div className="flex items-center gap-3 text-xs font-semibold text-neutral-600">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  {selectedVendor.activeCars} Active
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-neutral-400" />
                  {selectedVendor.idleCars} Idle
                </span>
              </div>
            </div>

            {/* Simulated Visual Interactive Map Display */}
            <div className="relative w-full h-64 rounded-xl bg-[#E2E8F0] overflow-hidden border border-neutral-200/80 flex items-center justify-center select-none">
              <svg className="absolute inset-0 w-full h-full opacity-40" viewBox="0 0 600 300" fill="none">
                <path d="M 0 100 Q 150 50 300 120 T 600 180" stroke="#94A3B8" strokeWidth="4" fill="none" />
                <path d="M 100 0 Q 200 150 350 300" stroke="#94A3B8" strokeWidth="3" fill="none" />
                <path d="M 400 0 Q 450 150 550 300" stroke="#94A3B8" strokeWidth="3" fill="none" />
              </svg>

              <div className="absolute top-1/3 left-1/4 flex flex-col items-center">
                <span className="w-3 h-3 rounded-full bg-emerald-500 border-2 border-white shadow-md animate-ping" />
                <span className="w-3 h-3 rounded-full bg-emerald-600 border-2 border-white shadow-md -mt-3" />
              </div>

              <div className="absolute top-1/2 left-1/2 flex flex-col items-center">
                <span className="w-3 h-3 rounded-full bg-emerald-500 border-2 border-white shadow-md" />
              </div>

              <div className="absolute bottom-1/4 right-1/3 flex flex-col items-center">
                <span className="w-3 h-3 rounded-full bg-emerald-500 border-2 border-white shadow-md" />
              </div>

              <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md px-4 py-2 rounded-xl shadow-md border border-neutral-200/80 flex items-center gap-5 text-xs">
                <div>
                  <div className="text-[10px] font-bold uppercase text-neutral-400">UTILIZATION</div>
                  <div className="font-extrabold text-neutral-900">76%</div>
                </div>
                <div className="w-px h-5 bg-neutral-200" />
                <div>
                  <div className="text-[10px] font-bold uppercase text-neutral-400">AVG. PICKUP</div>
                  <div className="font-extrabold text-neutral-900">12 min</div>
                </div>
              </div>
            </div>
          </div>
      </div>
    </div>
  )
}
