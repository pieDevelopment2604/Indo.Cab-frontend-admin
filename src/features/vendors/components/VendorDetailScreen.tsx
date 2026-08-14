import type { Vendor, TripRecord } from '../types'
import { EMPTY_TRIPS } from '../types'
import DataTable from '@/components/common/DataTable'
import type { Column } from '@/components/common/DataTable'
import {
  ArrowLeft,
  AlertCircle,
  CheckCircle,
  Building2,
  Mail,
  Edit,
  Star,
  Trash2,
  Phone,
  MapPin,
  Truck
} from '@/utils/icons'

interface VendorDetailScreenProps {
  selectedVendor: Vendor
  canManageVendors: boolean
  onBackToOverview: () => void
  onSuspendToggle: (id: string) => void
  onApproveVendor: (id: string) => void
  onDeleteVendor: (id: string) => void
  onEditVendorClick?: (vendor: Vendor) => void
}

export default function VendorDetailScreen({
  selectedVendor,
  canManageVendors,
  onBackToOverview,
  onSuspendToggle,
  onApproveVendor,
  onDeleteVendor,
  onEditVendorClick
}: VendorDetailScreenProps) {
  const tripColumns: Column<TripRecord>[] = [
    { header: 'Trip ID', accessorKey: 'id', className: 'font-mono text-xs font-bold text-neutral-700' },
    {
      header: 'Driver',
      cell: (trip) => (
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-teal-100 text-teal-700 text-[11px] font-bold flex items-center justify-center shrink-0">
            {trip.driver.charAt(0)}
          </div>
          <span className="text-xs font-semibold text-neutral-800">{trip.driver}</span>
        </div>
      )
    },
    { header: 'Route', accessorKey: 'route', className: 'text-xs text-neutral-500' },
    {
      header: 'Status',
      cell: (trip) => (
        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide ${
          trip.status === 'COMPLETED'
            ? 'bg-emerald-100 text-emerald-700'
            : trip.status === 'CANCELLED'
            ? 'bg-rose-100 text-rose-700'
            : 'bg-amber-100 text-amber-700'
        }`}>
          {trip.status}
        </span>
      )
    },
    { header: 'Revenue', accessorKey: 'revenue', align: 'right', className: 'text-sm font-bold text-neutral-900' }
  ]
  const vendorName = selectedVendor.name || selectedVendor.companyName || 'Vendor Partner'
  const companyName = selectedVendor.companyName || vendorName
  const contactPerson = selectedVendor.contactPerson || '—'
  const email = selectedVendor.email || '—'
  const phone = selectedVendor.phone || '—'
  const city = selectedVendor.city || '—'
  const gstNumber = selectedVendor.gstNumber || '—'
  const panNumber = selectedVendor.panNumber || '—'

  const isSuspendedOrBlacklisted =
    selectedVendor.status === 'suspended' || selectedVendor.status === 'blacklisted'

  const statusConfig: Record<string, { bg: string; text: string; dot: string }> = {
    active:      { bg: 'bg-emerald-50 border border-emerald-200', text: 'text-emerald-700', dot: 'bg-emerald-500' },
    pending:     { bg: 'bg-amber-50 border border-amber-200',   text: 'text-amber-700',   dot: 'bg-amber-500'   },
    suspended:   { bg: 'bg-rose-50 border border-rose-200',     text: 'text-rose-700',    dot: 'bg-rose-500'    },
    blacklisted: { bg: 'bg-red-100 border border-red-300',      text: 'text-red-800',     dot: 'bg-red-600'     },
  }
  const sc = statusConfig[selectedVendor.status] ?? statusConfig.active

  const utilPct = selectedVendor.fleetSize > 0
    ? Math.round((selectedVendor.activeCars / selectedVendor.fleetSize) * 100)
    : 0

  const cities = (selectedVendor.operatingCities ?? []).filter(Boolean)
  if (cities.length === 0 && city !== '—') cities.push(city)

  return (
    <div className="flex flex-col gap-8">

      {/* ── Page Header ─────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5">
        {/* Breadcrumb + title */}
        <div className="flex flex-col gap-1">
          <button
            onClick={onBackToOverview}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-400 hover:text-neutral-700 transition-colors cursor-pointer w-fit"
          >
            <ArrowLeft size={13} />
            Vendor Partners
          </button>
          <h1 className="text-2xl font-extrabold text-neutral-900 tracking-tight leading-tight">
            {vendorName}
          </h1>
          <div className="flex items-center gap-2 mt-0.5">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${sc.bg} ${sc.text}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
              {selectedVendor.status.charAt(0).toUpperCase() + selectedVendor.status.slice(1)}
            </span>
            <span className="text-xs text-neutral-400">{companyName}</span>
          </div>
        </div>

        {/* Action Buttons */}
        {canManageVendors && (
          <div className="flex items-center gap-2 flex-wrap">
            {onEditVendorClick && (
              <button
                onClick={() => onEditVendorClick(selectedVendor)}
                className="px-4 py-2 bg-[#0D5C4D] hover:bg-[#094237] text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Edit size={13} /> Edit
              </button>
            )}
            <button
              onClick={() => onApproveVendor(selectedVendor.id)}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <CheckCircle size={13} /> Approve
            </button>
            <button
              onClick={() => onSuspendToggle(selectedVendor.id)}
              className={`px-4 py-2 font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm ${
                isSuspendedOrBlacklisted
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-amber-500 hover:bg-amber-600 text-white'
              }`}
            >
              <AlertCircle size={13} />
              {isSuspendedOrBlacklisted ? 'Reactivate' : 'Suspend'}
            </button>
            <button
              onClick={() => onDeleteVendor(selectedVendor.id)}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Trash2 size={13} /> Delete
            </button>
          </div>
        )}
      </div>

      {/* ── Two-column body ─────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* ── LEFT: Profile sidebar ──────── */}
        <div className="lg:col-span-4 flex flex-col gap-5">

          {/* Identity Card */}
          <div className="bg-white rounded-xl border border-neutral-200/80 shadow-sm overflow-hidden">
            {/* Tinted banner */}
            <div className="h-16 bg-gradient-to-r from-teal-700 to-teal-500" />
            {/* Avatar */}
            <div className="px-6 pb-6">
              <div className="-mt-8 mb-4 w-16 h-16 rounded-xl bg-white border-2 border-white shadow-md text-[#1B6B5C] flex items-center justify-center">
                <Building2 size={28} strokeWidth={1.5} />
              </div>
              <h2 className="text-base font-extrabold text-neutral-900">{vendorName}</h2>
              <p className="text-xs text-neutral-500 mt-0.5 mb-4">{companyName}</p>

              {/* Key contact info */}
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center gap-2.5 text-xs text-neutral-700">
                  <Mail size={13} className="text-neutral-400 shrink-0" />
                  <span className="truncate">{email}</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-neutral-700">
                  <Phone size={13} className="text-neutral-400 shrink-0" />
                  <span>{phone}</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-neutral-700">
                  <MapPin size={13} className="text-neutral-400 shrink-0" />
                  <span>{city}</span>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-neutral-100 my-5" />

              {/* Detail fields — only the most important ones */}
              <dl className="flex flex-col gap-3.5">
                {[
                  { label: 'Vendor ID',      value: String(selectedVendor.id), mono: true },
                  { label: 'Contact',         value: contactPerson },
                  { label: 'GST Number',      value: gstNumber,   mono: true },
                  { label: 'PAN Number',      value: panNumber,   mono: true },
                  { label: 'Commission Rate', value: `${selectedVendor.commissionRate}%`, highlight: true },
                  { label: 'Partner Since',   value: selectedVendor.joinDate || '—' },
                ].map(({ label, value, mono, highlight }) => (
                  <div key={label} className="flex justify-between items-baseline gap-2">
                    <dt className="text-xs text-neutral-400 font-medium shrink-0">{label}</dt>
                    <dd className={`text-xs font-bold text-right truncate max-w-[160px] ${
                      highlight ? 'text-[#1B6B5C]' : mono ? 'text-neutral-700 font-mono' : 'text-neutral-800'
                    }`}>
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>

              {/* Divider */}
              <div className="border-t border-neutral-100 my-5" />

              {/* Quick actions */}
              <div className="flex flex-col gap-2">
                {onEditVendorClick && (
                  <button
                    onClick={() => onEditVendorClick(selectedVendor)}
                    className="w-full py-2.5 border border-neutral-200 hover:bg-neutral-50 text-neutral-700 font-bold text-xs rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Edit size={13} /> Edit Profile
                  </button>
                )}
                <div className="grid grid-cols-2 gap-2">
                  <button className="py-2.5 border border-neutral-200 hover:bg-neutral-50 text-neutral-700 font-bold text-xs rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5">
                    <Mail size={13} /> Email
                  </button>
                  <button className="py-2.5 border border-neutral-200 hover:bg-neutral-50 text-neutral-700 font-bold text-xs rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5">
                    <Phone size={13} /> Call
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Fleet Status Card */}
          <div className="bg-white rounded-xl border border-neutral-200/80 shadow-sm p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Truck size={15} className="text-[#1B6B5C]" />
                <h3 className="text-sm font-bold text-neutral-900">Fleet Status</h3>
              </div>
              <span className="text-xs font-bold text-neutral-400">{selectedVendor.fleetSize} total</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-emerald-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-black text-emerald-700">{selectedVendor.activeCars}</div>
                <div className="text-[11px] font-semibold text-emerald-600 mt-1">Active</div>
              </div>
              <div className="bg-neutral-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-black text-neutral-500">{selectedVendor.idleCars}</div>
                <div className="text-[11px] font-semibold text-neutral-400 mt-1">Idle</div>
              </div>
            </div>

            {selectedVendor.fleetSize > 0 && (
              <div>
                <div className="flex justify-between text-[11px] font-semibold text-neutral-500 mb-2">
                  <span>Utilisation</span>
                  <span className="font-bold text-[#1B6B5C]">{utilPct}%</span>
                </div>
                <div className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 rounded-full"
                    style={{ width: `${Math.min(100, utilPct)}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── RIGHT: Metrics + Regions + Trips ─── */}
        <div className="lg:col-span-8 flex flex-col gap-6">

          {/* Performance Metrics — 4 large tiles */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              {
                label: 'Acceptance Rate',
                value: `${selectedVendor.acceptanceRate}%`,
                sub: '+2.1% vs last month',
                subColor: 'text-emerald-600',
                accent: 'border-t-4 border-t-emerald-500',
              },
              {
                label: 'Cancellation Rate',
                value: `${selectedVendor.cancellationRate}%`,
                sub: '-0.5% vs last month',
                subColor: 'text-rose-500',
                accent: 'border-t-4 border-t-rose-500',
              },
              {
                label: 'Completion Rate',
                value: `${selectedVendor.completionRate}%`,
                sub: 'Stable',
                subColor: 'text-neutral-400',
                accent: 'border-t-4 border-t-teal-500',
              },
              {
                label: 'Avg. Rating',
                value: selectedVendor.rating > 0 ? selectedVendor.rating.toFixed(1) : '—',
                sub: '842 reviews',
                subColor: 'text-neutral-400',
                accent: 'border-t-4 border-t-amber-400',
                isRating: true,
              },
            ].map(({ label, value, sub, subColor, accent, isRating }) => (
              <div key={label} className={`bg-white rounded-xl border border-neutral-200/80 shadow-sm p-5 flex flex-col gap-2 ${accent}`}>
                <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wide">{label}</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-neutral-900">{value}</span>
                  {isRating && <Star size={16} className="fill-amber-400 text-amber-400 mb-0.5" />}
                </div>
                <span className={`text-[11px] font-semibold ${subColor}`}>{sub}</span>
              </div>
            ))}
          </div>

          {/* Operating Regions */}
          {cities.length > 0 && (
            <div className="bg-white rounded-xl border border-neutral-200/80 shadow-sm p-6">
              <h3 className="text-sm font-bold text-neutral-900 mb-4">Operating Regions</h3>
              <div className="flex flex-wrap gap-2">
                {cities.map((c, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 text-[#1B6B5C] border border-teal-100 text-xs font-semibold rounded-lg"
                  >
                    <MapPin size={11} />
                    {c}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Recent Trip History */}
          <div className="bg-white rounded-xl border border-neutral-200/80 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-neutral-100 flex justify-between items-center">
              <h3 className="text-sm font-bold text-neutral-900">Recent Trip History</h3>
              <button className="text-xs font-semibold text-[#1B6B5C] hover:underline cursor-pointer">
                View All
              </button>
            </div>
            <div className="flex-1 w-full flex p-0">
              <DataTable<TripRecord>
                data={EMPTY_TRIPS}
                columns={tripColumns}
                keyExtractor={(trip) => trip.id}
                emptyMessage="No trip records yet. Trip data will appear here once available."
                emptyIcon={<Truck size={18} className="text-neutral-400" />}
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
