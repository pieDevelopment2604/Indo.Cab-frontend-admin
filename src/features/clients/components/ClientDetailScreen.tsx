import { StatusBadge } from "@/components/common";
import type { CorporateClient, ClientBookingRecord } from "../types";
import DataTable from "@/components/common/DataTable";
import type { Column } from "@/components/common/DataTable";
import {
  ArrowLeft,
  Building2,
  Mail,
  ShieldAlert,
  Tag,
  CheckCircle,
  Trash2,
  Edit,
  Phone,
  MapPin,
} from "@/utils/icons";

interface ClientDetailScreenProps {
  client: CorporateClient;
  canManageClients: boolean;
  onBackToOverview: () => void;
  onToggleBlacklist: (id: string | number) => void;
  onDeleteClient: (id: string | number) => void;
  onEditClientClick?: (client: CorporateClient) => void;
}

export default function ClientDetailScreen({
  client,
  canManageClients,
  onBackToOverview,
  onToggleBlacklist,
  onDeleteClient,
  onEditClientClick,
}: ClientDetailScreenProps) {
  // Safe field accessors to handle API payloads cleanly
  const companyName =
    client.companyName || client.company_name || "Corporate Entity";
  const contactPerson =
    client.contactPerson || client.contact_person || "Primary Contact";
  const email = client.email || "N/A";
  const totalSpent = client.totalSpent || "₹0";
  // Discount from API
  const discountPct = client.discount_percentage ?? 0;
  // Contract fallbacks
  const contractTier = client.contract?.tierName || "Corporate Standard";
  const baseRate = client.contract?.baseRatePerKm ?? 20;
  const extraHourRate = client.contract?.extraHourRate ?? 150;
  const nightSurcharge = client.contract?.nightSurchargePercent ?? 15;
  const tollPolicy = client.contract?.tollPolicy || "Billed to Client";
  const contractStart = client.contract?.contractStart || "Jan 01, 2026";
  const contractEnd = client.contract?.contractEnd || "Dec 31, 2026";

  // Booking history fallback
  const bookingHistory = client.bookingHistory || [];

  const bookingColumns: Column<ClientBookingRecord>[] = [
    {
      header: "BOOKING ID",
      accessorKey: "id",
      className: "font-mono font-bold text-neutral-900",
    },
    { header: "ROUTE", accessorKey: "route", className: "text-neutral-800" },
    {
      header: "DATE",
      accessorKey: "bookingDate",
      className: "text-neutral-500",
    },
    {
      header: "ASSIGNED VENDOR",
      accessorKey: "assignedVendor",
      className: "font-semibold text-[#1B6B5C]",
    },
    {
      header: "STATUS",
      cell: (bk) => <StatusBadge status={bk.status} />,
    },
    {
      header: "TOTAL INVOICE",
      accessorKey: "amount",
      align: "right",
      className: "font-extrabold text-neutral-900",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Breadcrumbs & Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col gap-1">
          <button
            onClick={onBackToOverview}
            className="inline-flex items-normal gap-1.5 text-xs font-semibold text-neutral-400 hover:text-neutral-700 transition-colors cursor-pointer w-fit"
          >
            <ArrowLeft size={13} />
            All Clients 
          </button>
          <h1 className="text-2xl font-extrabold text-neutral-900 tracking-tight leading-tight">
            {companyName}
          </h1>
          <div className="flex items-center gap-2 mt-0.5">
            <StatusBadge
              status={client.status}
              pulse={client.status === "active"}
            />
            <span className="text-xs text-neutral-400">{companyName}</span>
          </div>
        </div>

        {canManageClients && (
          <div className="flex items-center gap-2.5">
            {onEditClientClick && (
              <button
                onClick={() => onEditClientClick(client)}
                className="btn btn-submit"
              >
                <Edit size={15} />
                Edit
              </button>
            )}

            <button
              onClick={() => onToggleBlacklist(String(client.id))}
              className={`btn ${client.status === "blacklisted" || client.status === "suspended" ? "btn-toggle" : "btn-warning"}`}
            >
              <ShieldAlert size={15} />
              {client.status === "blacklisted" || client.status === "suspended"
                ? "Re-activate"
                : "Suspend"}
            </button>

            <button
              onClick={() => onDeleteClient(client.id)}
              className="btn btn-delete"
            >
              <Trash2 size={15} />
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Grid Layout: Left Column (Company Profile) | Right Column (Pricing Tier & Booking History) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column */}
       <div className="lg:col-span-4 flex flex-col gap-5">
          {/* Identity Card */}
          <div className="card overflow-hidden">
            {/* Tinted banner */}
            <div className="h-16 bg-gradient-to-r from-teal-700 to-teal-500" />
            {/* Avatar */}
            <div className="px-6 pb-6">
              <div className="-mt-8 mb-4 w-16 h-16 rounded-xl bg-white border-2 border-white shadow-md text-[#1B6B5C] flex items-center justify-center">
                <Building2 size={28} strokeWidth={1.5} />
              </div>
              <h2 className="text-base font-extrabold text-neutral-900">
                {client.companyName}
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5 mb-4">
                {companyName}
              </p>

              {/* Key contact info */}
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center gap-2.5 text-xs text-neutral-700">
                  <Mail size={13} className="text-neutral-400 shrink-0" />
                  <span className="truncate">{email}</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-neutral-700">
                  <Phone size={13} className="text-neutral-400 shrink-0" />
                  <span>{client.phone}</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-neutral-700">
                  <MapPin size={13} className="text-neutral-400 shrink-0" />
                  <span>{client.address}</span>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-neutral-100 my-5" />

              {/* Detail fields — only the most important ones */}
              <dl className="flex flex-col gap-3.5">
                {[
                  {
                    label: "Client ID",
                    value: String(client.id),
                    mono: true,
                  },
                  { label: "Contact", value: contactPerson },
                  { label: "GST Number", value: client.gst_number, mono: true },
                  { label: "PAN Number", value: client.pan_number, mono: true },
                  {
                    label: "Commission Rate",
                    value: `${client.contract?.baseRatePerKm}%`,
                    highlight: true,
                  },
                ].map(({ label, value, mono, highlight }) => (
                  <div
                    key={label}
                    className="flex justify-between items-baseline gap-2"
                  >
                    <dt className="text-xs text-neutral-400 font-medium shrink-0">
                      {label}
                    </dt>
                    <dd
                      className={`text-xs font-bold text-right truncate max-w-[160px] ${
                        highlight
                          ? "text-[#1B6B5C]"
                          : mono
                            ? "text-neutral-700 font-mono"
                            : "text-neutral-800"
                      }`}
                    >
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>

              {/* Divider */}
              <div className="border-t border-neutral-100 my-5" />

              {/* Quick actions */}

              <div className="grid grid-cols-2 gap-2">
                <button className="btn btn-neutral">
                  <Mail size={13} /> Email
                </button>
                <button className="btn btn-neutral">
                  <Phone size={13} /> Call
                </button>
              </div>
            </div>
          </div>

          {/* Fleet Status Card */}
          {/* <div className="bg-white rounded-xl border border-neutral-200/80 shadow-sm p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Truck size={15} className="text-[#1B6B5C]" />
                <h3 className="text-sm font-bold text-neutral-900">
                  Fleet Status
                </h3>
              </div>
              <span className="text-xs font-bold text-neutral-400">
                {selectedVendor.fleetSize} total
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-emerald-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-black text-emerald-700">
                  {selectedVendor.activeCars}
                </div>
                <div className="text-[11px] font-semibold text-emerald-600 mt-1">
                  Active
                </div>
              </div>
              <div className="bg-neutral-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-black text-neutral-500">
                  {selectedVendor.idleCars}
                </div>
                <div className="text-[11px] font-semibold text-neutral-400 mt-1">
                  Idle
                </div>
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
          </div> */}
        </div>

        {/* Right Column */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Contract & Pricing Tier Breakdown Card */}
          <div className="card p-6 flex flex-col gap-4">
            <div className="flex justify-between items-center border-b border-neutral-100 pb-3">
              <div className="flex items-center gap-2">
                <Tag className="text-[#1B6B5C]" size={18} />
                <h3 className="text-base font-bold text-neutral-900">
                  Contract & Pricing Tier Rates
                </h3>
              </div>
              <span className="px-3 py-1 bg-teal-50 text-[#1B6B5C] border border-teal-200 text-xs font-bold rounded-lg">
                {contractTier}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 bg-neutral-50/80 p-4 rounded-lg text-xs">
              <div>
                <span className="text-[10px] font-bold text-neutral-400 uppercase block">
                  BASE RATE / KM
                </span>
                <span className="font-extrabold text-[#1B6B5C] text-lg">
                  ₹{baseRate}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold text-neutral-400 uppercase block">
                  EXTRA HOUR RATE
                </span>
                <span className="font-extrabold text-neutral-900 text-lg">
                  ₹{extraHourRate}/hr
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold text-neutral-400 uppercase block">
                  NIGHT SURCHARGE
                </span>
                <span className="font-extrabold text-neutral-900 text-lg">
                  {nightSurcharge}%
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold text-neutral-400 uppercase block">
                  DISCOUNT
                </span>
                <span className="font-extrabold text-neutral-900 text-lg">
                  {discountPct}%
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold text-neutral-400 uppercase block">
                  TOLL POLICY
                </span>
                <span className="font-bold text-neutral-800 text-xs mt-1 block">
                  {tollPolicy}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center text-xs text-neutral-500 pt-1">
              <span>
                Contract Period: <strong>{contractStart}</strong> to{" "}
                <strong>{contractEnd}</strong>
              </span>
              <span className="font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle size={13} /> SLA Active
              </span>
            </div>
          </div>

          {/* Client Booking History */}
          <div className="card overflow-hidden flex flex-col">
            <div className="p-5 border-b border-neutral-100 flex justify-between items-center">
              <h3 className="text-base font-bold text-neutral-900">
                Recent Corporate Trips
              </h3>
              <span className="text-xs font-bold text-neutral-500">
                Total Spent: {totalSpent}
              </span>
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
  );
}
