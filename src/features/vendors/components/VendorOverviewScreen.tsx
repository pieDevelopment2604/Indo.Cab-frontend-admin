import React, { useMemo, useState } from 'react'
import KpiCard from '@/components/common/KpiCard'
import StatusBadge from '@/components/common/StatusBadge'
import DataTable, { type Column } from '@/components/common/DataTable'
import AddButton from '@/components/common/AddButton'
import type { Vendor } from '../types'
import {
  Star,
  Edit,
  MapPin,
  Building2,
  Truck,
  AlertTriangle,
  Trash2
} from '@/utils/icons'

interface VendorOverviewScreenProps {
  vendors: Vendor[]
  filteredVendors: Vendor[]
  searchTerm: string
  onSearchChange: (term: string) => void
  selectedStatusFilter: string
  onStatusFilterChange: (status: string) => void
  canManageVendors: boolean
  onAddVendorClick: () => void
  onVendorDetailClick: (vendor: Vendor) => void
  onSuspendToggle: (id: string) => void
  onDeleteVendor: (id: string) => void
  isLoading?: boolean
}

function VendorOverviewScreen({
  vendors,
  filteredVendors,
  searchTerm,
  onSearchChange,
  selectedStatusFilter,
  onStatusFilterChange,
  canManageVendors,
  onAddVendorClick,
  onVendorDetailClick,
  onSuspendToggle,
  onDeleteVendor,
  isLoading
}: VendorOverviewScreenProps) {
  // Constants for pagination State
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10

  // Dynamic pagination calculations
  const totalItems = filteredVendors.length
  const totalPages = Math.ceil(totalItems / pageSize) || 1
  const startIndex = (currentPage - 1) * pageSize
  const paginatedVendors = useMemo(
    () => filteredVendors.slice(startIndex, startIndex + pageSize),
    [filteredVendors, startIndex, pageSize]
  )

  // Dynamic KPI Calculations from live vendors list
  const totalVendors = vendors.length
  const activeVendors = vendors.filter((v) => v.status === 'active').length
  const pendingApprovals = vendors.filter((v) => v.status === 'pending').length
  const avgRatingValue = vendors.length > 0
    ? (vendors.reduce((acc, v) => acc + (v.rating || 0), 0) / vendors.length).toFixed(1)
    : '0.0'

  // Array mapping for KPI Stat Cards using reusable KpiCard component
  const kpiCards = useMemo(
    () => [
      {
        id: 'totalVendors',
        title: 'Total Vendors',
        value: totalVendors.toString(),
        subnote: 'Registered Logistics Partners',
        icon: Building2,
        iconStyle: 'bg-teal-50 text-[#1B6B5C] border-teal-100',
        subnoteStyle: 'text-[11px] font-semibold text-teal-700 mt-0.5',
      },
      {
        id: 'activeVendors',
        title: 'Active Vendors',
        value: activeVendors.toString(),
        subnote: 'Active Fleet Operations',
        icon: Truck,
        iconStyle: 'bg-emerald-50 text-emerald-600 border-emerald-100',
        subnoteStyle: 'text-[11px] font-semibold text-emerald-700 mt-0.5',
      },
      {
        id: 'pendingApproval',
        title: 'Pending Approval',
        value: pendingApprovals.toString(),
        subnote: 'Verification Pending',
        icon: AlertTriangle,
        iconStyle: 'bg-amber-50 text-amber-600 border-amber-100',
        subnoteStyle: 'text-[11px] font-semibold text-amber-700 mt-0.5',
      },
      {
        id: 'averageRating',
        title: 'Average Rating',
        value: `${avgRatingValue}/5`,
        subnote: `★ ${avgRatingValue} Rating`,
        icon: Star,
        iconStyle: 'bg-amber-50 text-amber-500 border-amber-100',
        subnoteStyle: 'text-[11px] font-semibold text-amber-600 mt-0.5',
      }
    ],
    [totalVendors, activeVendors, pendingApprovals, avgRatingValue]
  )

  // DataTable Column Definitions
  const columns: Column<Vendor>[] = [
    {
      header: 'VENDOR PARTNER',
      cell: (vendor) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-teal-50 text-[#1B6B5C] border border-teal-100 flex items-center justify-center font-bold text-sm shrink-0 overflow-hidden">
            {vendor.logo ? (
              <img src={vendor.logo} alt={vendor.name} className="w-full h-full object-cover" />
            ) : (
              vendor.name.charAt(0)
            )}
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-neutral-900 text-sm hover:text-[#1B6B5C] transition-colors">
              {vendor.name}
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[11px] text-neutral-400 font-mono">{vendor.id}</span>
              {vendor.vehicleCategories && vendor.vehicleCategories.length > 0 && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 bg-teal-50 text-[#1B6B5C] rounded-md border border-teal-100/60">
                  {vendor.vehicleCategories.length} Categories
                </span>
              )}
            </div>
          </div>
        </div>
      )
    },
    {
      header: 'CONTACT PERSON',
      cell: (vendor) => (
        <div className="flex flex-col">
          <span className="font-semibold text-neutral-800">{vendor.contactPerson}</span>
          <span className="text-[11px] text-neutral-400">{vendor.email}</span>
        </div>
      )
    },
    {
      header: 'CITY / REGION',
      cell: (vendor) => (
        <span className="inline-flex items-center gap-1 font-medium text-neutral-700">
          <MapPin size={12} className="text-neutral-400" />
          {vendor.city}
        </span>
      )
    },
    {
      header: 'FLEET SIZE',
      align: 'center',
      cell: (vendor) => (
        <span className="font-bold text-neutral-900 px-2.5 py-1 rounded-lg bg-neutral-100 border border-neutral-200/60">
          {vendor.fleetSize} Vehicles
        </span>
      )
    },
    {
      header: 'RATING',
      align: 'center',
      cell: (vendor) => (
        <div className="flex items-center justify-center gap-1 font-bold text-neutral-900">
          <Star size={13} className="fill-amber-400 text-amber-400" />
          {vendor.rating}
        </div>
      )
    },
    {
      header: 'STATUS',
      cell: (vendor) => <StatusBadge status={vendor.status} pulse={vendor.status === 'active'} />
    },
    {
      header: 'ACTIONS',
      align: 'right',
      cell: (vendor) => (
        <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => onVendorDetailClick(vendor)}
            className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-semibold rounded-lg text-xs transition-colors cursor-pointer"
          >
            View Detail
          </button>
          {canManageVendors && (
            <>
              <button
                onClick={() => onSuspendToggle(vendor.id)}
                className="p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg cursor-pointer"
                title="Toggle Status"
              >
                <Edit size={14} />
              </button>
              <button
                onClick={() => onDeleteVendor(vendor.id)}
                className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg cursor-pointer"
                title="Delete Vendor Partner"
              >
                <Trash2 size={14} />
              </button>
            </>
          )}
        </div>
      )
    }
  ]

  return (
    <div className="flex-1 flex flex-col min-h-0 gap-6">
      {/* Section Breadcrumb & Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>

          <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight">
            Vendor Management
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Manage and monitor the lifecycle of your logistics partners.
          </p>
        </div>

        {canManageVendors && (
          <AddButton label="Add Vendor" onClick={onAddVendorClick} />
        )}
      </div>

      {/* 4 KPI Stat Cards (Using KpiCard Component) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((card) => (
          <KpiCard key={card.id} {...card} />
        ))}
      </div>

      {/* Merged Reusable DataTable Component with Integrated Search & Filter Toolbar */}
      <DataTable
        data={paginatedVendors}
        columns={columns}
        keyExtractor={(vendor) => vendor.id}
        onRowClick={onVendorDetailClick}
        emptyMessage="No Vendor Partners Found"
        emptyIcon={<Building2 size={28} />}
        searchQuery={searchTerm}
        onSearchChange={onSearchChange}
        searchPlaceholder="Search vendors by name, company, email..."
        filterOptions={[
          { key: 'all', label: 'All Vendors', count: vendors.length },
          { key: 'active', label: 'Active', count: vendors.filter((v) => v.status === 'active').length },
          { key: 'pending', label: 'Pending Approval', count: vendors.filter((v) => v.status === 'pending').length },
          { key: 'suspended', label: 'Suspended/Blacklist', count: vendors.filter((v) => ['suspended', 'blacklisted'].includes(v.status)).length }
        ]}
        selectedFilter={selectedStatusFilter}
        onFilterChange={onStatusFilterChange}
        isLoading={isLoading}
        pagination={{
          currentPage,
          totalPages,
          onPageChange: setCurrentPage,
          totalItems,
          pageSize
        }}
      />
    </div>
  )
}

export default React.memo(VendorOverviewScreen)
