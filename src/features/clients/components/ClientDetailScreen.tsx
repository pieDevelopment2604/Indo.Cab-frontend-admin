import type { CorporateClient, ClientBookingRecord } from '../types'
import DataTable from '@/components/common/DataTable'
import type { Column } from '@/components/common/DataTable'
import {
  ArrowLeft,
  Building2,
  Mail,
  ShieldAlert,
  Tag,
  CheckCircle,
  Trash2,
  Edit
} from '@/utils/icons'

interface ClientDetailScreenProps {
  client: CorporateClient
  canManageClients: boolean
  onBackToOverview: () => void
  onToggleBlacklist: (id: string | number) => void
  onDeleteClient: (id: string | number) => void
  onEditClientClick?: (client: CorporateClient) => void
}

export default function ClientDetailScreen({
  client,
  canManageClients,
  onBackToOverview,
  onToggleBlacklist,
  onDeleteClient,
  onEditClientClick
}: ClientDetailScreenProps) {
  // Safe field accessors to handle API payloads cleanly
  const companyName = client.companyName || client.company_name || 'Corporate Entity'
  const gstin = client.gstin || client.gst_number || 'N/A'
  const panNumber = client.pan_number || (gstin.length >= 12 ? gstin.substring(2, 12) : 'N/A')
  const contactPerson = client.contactPerson || client.contact_person || 'Primary Contact'
  const email = client.email || 'N/A'
  const rawDate = client.createdAt || client.created_at
  const createdDate = rawDate
    ? !isNaN(Date.parse(String(rawDate)))
      ? new Date(rawDate).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
      : String(rawDate)
    : new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
  const totalSpent = client.totalSpent || '₹0'
  const address = client.address || 'N/A'
  // Discount from API
  const discountPct = client.discount_percentage ?? 0
  // Contract fallbacks
  const contractTier = client.contract?.tierName || 'Corporate Standard'
  const baseRate = client.contract?.baseRatePerKm ?? 20
  const extraHourRate = client.contract?.extraHourRate ?? 150
  const nightSurcharge = client.contract?.nightSurchargePercent ?? 15
  const tollPolicy = client.contract?.tollPolicy || 'Billed to Client'
  const contractStart = client.contract?.contractStart || 'Jan 01, 2026'
  const contractEnd = client.contract?.contractEnd || 'Dec 31, 2026'

  // Booking history fallback
  const bookingHistory = client.bookingHistory || []

  const bookingColumns: Column<ClientBookingRecord>[] = [
    { header: 'BOOKING ID', accessorKey: 'id', className: 'font-mono font-bold text-neutral-900' },
    { header: 'ROUTE', accessorKey: 'route', className: 'text-neutral-800' },
    { header: 'DATE', accessorKey: 'bookingDate', className: 'text-neutral-500' },
    { header: 'ASSIGNED VENDOR', accessorKey: 'assignedVendor', className: 'font-semibold text-[#1B6B5C]' },
    {
      header: 'STATUS',
      cell: (bk) => (
        <span
          className={`px-2 py-0.5 rounded text-[9px] font-extrabold tracking-wider ${
            bk.status === 'COMPLETED'
              ? 'bg-emerald-100 text-emerald-800'
              : 'bg-amber-100 text-amber-800'
          }`}
        >
          {bk.status}
        </span>
      )
    },
    { header: 'TOTAL INVOICE', accessorKey: 'amount', align: 'right', className: 'font-extrabold text-neutral-900' }
  ]

  return (
    <div className="flex flex-col gap-6">
      {/* Breadcrumbs & Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-neutral-500 mb-1">
            <button
              onClick={onBackToOverview}
              className="hover:text-neutral-900 cursor-pointer flex items-center gap-1"
            >
              <ArrowLeft size={13} /> Corporate Clients
            </button>
            <span>/</span>
            <span className="text-neutral-900 font-bold">{companyName}</span>
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">
            Client Account: {companyName}
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Corporate SLA contracts, base rates, billing authorization, and booking history.
          </p>
        </div>

        {canManageClients && (
          <div className="flex items-center gap-2.5">
            {onEditClientClick && (
              <button
                onClick={() => onEditClientClick(client)}
                className="px-4 py-2 bg-[#0D5C4D] hover:bg-[#094237] text-white font-bold text-xs rounded-lg shadow-xs transition-all flex items-center gap-2 cursor-pointer"
              >
                <Edit size={15} />
                Edit Client
              </button>
            )}

            <button
              onClick={() => onToggleBlacklist(String(client.id))}
              className={`px-4 py-2 font-bold text-xs rounded-lg shadow-xs transition-all flex items-center gap-2 cursor-pointer ${
                client.status === 'blacklisted' || client.status === 'suspended'
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-amber-500 hover:bg-amber-600 text-white'
              }`}
            >
              <ShieldAlert size={15} />
              {client.status === 'blacklisted' || client.status === 'suspended'
                ? 'Reactivate Corporate Account'
                : 'Suspend Account'}
            </button>

            <button
              onClick={() => onDeleteClient(client.id)}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-lg shadow-xs transition-all flex items-center gap-2 cursor-pointer"
            >
              <Trash2 size={15} />
              Delete Account
            </button>
          </div>
        )}
      </div>

      {/* Grid Layout: Left Column (Company Profile) | Right Column (Pricing Tier & Booking History) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Corporate Profile Card */}
          <div className="bg-white p-6 rounded-lg border border-neutral-200/80 shadow-sm flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-lg bg-teal-50 text-[#1B6B5C] border border-teal-100 flex items-center justify-center font-extrabold text-2xl mb-4">
              <Building2 size={36} />
            </div>

            <h3 className="text-lg font-bold text-neutral-900 tracking-tight">
              {companyName}
            </h3>

            <span className="mt-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-extrabold uppercase tracking-wider rounded-full">
              {client.status} ACCOUNT
            </span>

            <div className="w-full border-t border-neutral-100 my-5" />

            <div className="w-full flex flex-col gap-3 text-xs text-left">
              <div className="flex justify-between items-center">
                <span className="text-neutral-400 font-medium">Account ID</span>
                <span className="font-bold text-neutral-900 font-mono">{String(client.id)}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-neutral-400 font-medium">GSTIN</span>
                <span className="font-bold text-neutral-900 font-mono">{gstin}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-neutral-400 font-medium">PAN Number</span>
                <span className="font-bold text-neutral-900 font-mono">{panNumber}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-neutral-400 font-medium">Contact Person</span>
                <span className="font-bold text-neutral-900">{contactPerson}</span>
              </div>

              <div className="flex justify-between items-start gap-2">
                <span className="text-neutral-400 font-medium shrink-0">Address</span>
                <span className="font-bold text-neutral-900 text-right truncate max-w-[180px]">{address}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-neutral-400 font-medium">Onboarded</span>
                <span className="font-bold text-neutral-900">{createdDate}</span>
              </div>
            </div>

            <div className="w-full flex flex-col gap-2 mt-6">
              {onEditClientClick && (
                <button
                  onClick={() => onEditClientClick(client)}
                  className="w-full py-2 border border-neutral-200 hover:bg-neutral-50 text-neutral-800 font-bold text-xs rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <Edit size={14} />
                  Edit Corporate Profile
                </button>
              )}

              <button className="w-full py-2 border border-neutral-200 hover:bg-neutral-50 text-neutral-800 font-bold text-xs rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2">
                <Mail size={14} /> Contact Manager ({email})
              </button>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Contract & Pricing Tier Breakdown Card */}
          <div className="bg-white p-6 rounded-lg border border-neutral-200/80 shadow-sm flex flex-col gap-4">
            <div className="flex justify-between items-center border-b border-neutral-100 pb-3">
              <div className="flex items-center gap-2">
                <Tag className="text-[#1B6B5C]" size={18} />
                <h3 className="text-base font-bold text-neutral-900">Contract & Pricing Tier Rates</h3>
              </div>
              <span className="px-3 py-1 bg-teal-50 text-[#1B6B5C] border border-teal-200 text-xs font-bold rounded-lg">
                {contractTier}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 bg-neutral-50/80 p-4 rounded-lg text-xs">
              <div>
                <span className="text-[10px] font-bold text-neutral-400 uppercase block">BASE RATE / KM</span>
                <span className="font-extrabold text-[#1B6B5C] text-lg">₹{baseRate}</span>
              </div>

              <div>
                <span className="text-[10px] font-bold text-neutral-400 uppercase block">EXTRA HOUR RATE</span>
                <span className="font-extrabold text-neutral-900 text-lg">₹{extraHourRate}/hr</span>
              </div>

              <div>
                <span className="text-[10px] font-bold text-neutral-400 uppercase block">NIGHT SURCHARGE</span>
                <span className="font-extrabold text-neutral-900 text-lg">{nightSurcharge}%</span>
              </div>

              <div>
                <span className="text-[10px] font-bold text-neutral-400 uppercase block">DISCOUNT</span>
                <span className="font-extrabold text-neutral-900 text-lg">{discountPct}%</span>
              </div>

              <div>
                <span className="text-[10px] font-bold text-neutral-400 uppercase block">TOLL POLICY</span>
                <span className="font-bold text-neutral-800 text-xs mt-1 block">{tollPolicy}</span>
              </div>
            </div>

            <div className="flex justify-between items-center text-xs text-neutral-500 pt-1">
              <span>Contract Period: <strong>{contractStart}</strong> to <strong>{contractEnd}</strong></span>
              <span className="font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle size={13} /> SLA Active
              </span>
            </div>
          </div>

          {/* Client Booking History */}
          <div className="bg-white rounded-lg border border-neutral-200/80 shadow-sm overflow-hidden flex flex-col">
            <div className="p-5 border-b border-neutral-100 flex justify-between items-center">
              <h3 className="text-base font-bold text-neutral-900">Recent Corporate Trips</h3>
              <span className="text-xs font-bold text-neutral-500">Total Spent: {totalSpent}</span>
            </div>

            <div className="flex-1 w-full flex p-0">
              <DataTable<ClientBookingRecord>
                data={bookingHistory}
                columns={bookingColumns}
                keyExtractor={(bk) => bk.id}
                emptyMessage="No past trips recorded for this corporate account."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
