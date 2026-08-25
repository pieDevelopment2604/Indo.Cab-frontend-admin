import React, { useState, useMemo, useEffect } from 'react';
import {
  User,
  Phone,
  Mail,
  Truck,
  MapPin,
  Star,
  MoreVertical,
  CheckCircle,
  Eye,
  ShieldAlert,
  Building2,
  Trash2,
  Edit,
  Filter,
  Download,
  SlidersHorizontal,
} from '@/utils/icons';
import DataTable, { type Column, type FilterOption } from '@/components/common/DataTable';
import StatusBadge, { type StatusVariant } from '@/components/common/StatusBadge';
import type { Driver, DriverOnlineStatus } from '../types';

interface DriverDirectoryViewProps {
  drivers: Driver[];
  onSelectDriver: (driver: Driver) => void;
  onEditDriver: (driver: Driver) => void;
  onDeleteDriver: (driverId: string) => void;
  onStatusToggle: (driverId: string) => void;
  selectedVendorId: string;
  onVendorChange: (vendorId: string) => void;
  vendorList: Array<{ id: string; name: string }>;
  isLoading?: boolean;
}

export default function DriverDirectoryView({
  drivers,
  onSelectDriver,
  onEditDriver,
  onDeleteDriver,
  onStatusToggle,
  selectedVendorId,
  onVendorChange,
  vendorList,
  isLoading = false,
}: DriverDirectoryViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'newest' | 'rating' | 'trips' | 'name'>('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Reset to page 1 when search, filters, or sort change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, selectedVendorId, sortBy]);

  // Filter options for DataTable top toolbar
  const filterOptions: FilterOption[] = [
    { key: 'all', label: 'All Drivers', count: drivers.length },
    {
      key: 'online',
      label: 'Online',
      count: drivers.filter((d) => d.onlineStatus === 'online').length,
    },
    {
      key: 'on_trip',
      label: 'On Trip',
      count: drivers.filter((d) => d.onlineStatus === 'on_trip').length,
    },
    {
      key: 'offline',
      label: 'Offline',
      count: drivers.filter((d) => d.onlineStatus === 'offline').length,
    },
    {
      key: 'pending',
      label: 'Pending KYC',
      count: drivers.filter((d) => d.kycStatus === 'pending').length,
    },
  ];

  // Filtered & Sorted dataset
  const filteredDrivers = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    const result = drivers.filter((driver) => {
      // Vendor filter
      if (selectedVendorId !== 'all' && driver.vendorId !== selectedVendorId) {
        return false;
      }

      // Status filter
      if (statusFilter === 'online' && driver.onlineStatus !== 'online') return false;
      if (statusFilter === 'on_trip' && driver.onlineStatus !== 'on_trip') return false;
      if (statusFilter === 'offline' && driver.onlineStatus !== 'offline') return false;
      if (statusFilter === 'pending' && driver.kycStatus !== 'pending') return false;

      // Search match
      if (!query) return true;
      return (
        driver.name.toLowerCase().includes(query) ||
        driver.customId.toLowerCase().includes(query) ||
        driver.phone.toLowerCase().includes(query) ||
        driver.email.toLowerCase().includes(query) ||
        driver.vendorName.toLowerCase().includes(query) ||
        (driver.assignedVehicle && driver.assignedVehicle.toLowerCase().includes(query)) ||
        driver.city.toLowerCase().includes(query)
      );
    });

    // Apply sorting
    return result.sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'trips') return b.totalTrips - a.totalTrips;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      // default newest (by joining date or id)
      return new Date(b.joiningDate || 0).getTime() - new Date(a.joiningDate || 0).getTime();
    });
  }, [drivers, selectedVendorId, statusFilter, searchQuery, sortBy]);

  // Export CSV handler
  const handleExportCsv = () => {
    const headers = [
      'Driver ID',
      'Full Name',
      'Phone Number',
      'Email Address',
      'Vendor Partner',
      'Assigned Vehicle',
      'Vehicle Model',
      'City / Hub',
      'Online Status',
      'KYC Status',
      'Rating',
      'Total Trips',
      'Acceptance Rate %',
      'Joining Date',
    ];

    const rows = filteredDrivers.map((d) => [
      d.customId || d.id,
      `"${d.name.replace(/"/g, '""')}"`,
      `"${d.phone}"`,
      `"${d.email}"`,
      `"${d.vendorName.replace(/"/g, '""')}"`,
      d.assignedVehicle || 'Unassigned',
      `"${d.vehicleModel || ''}"`,
      `"${d.city} (${d.hub})"`,
      d.onlineStatus,
      d.kycStatus,
      d.rating,
      d.totalTrips,
      `${d.acceptanceRate}%`,
      d.joiningDate || '',
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `fleet_drivers_export_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
  };

  // Dynamic pagination calculations
  const totalItems = filteredDrivers.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedDrivers = useMemo(
    () => filteredDrivers.slice(startIndex, startIndex + pageSize),
    [filteredDrivers, startIndex, pageSize]
  );

  // Online status helper for badge configuration
  const mapOnlineStatusToBadge = (status: DriverOnlineStatus): { label: string; variant: StatusVariant; pulse: boolean } => {
    switch (status) {
      case 'online':
        return { label: 'Online', variant: 'active', pulse: true };
      case 'on_trip':
        return { label: 'On Trip', variant: 'info', pulse: true };
      case 'busy':
        return { label: 'Busy', variant: 'warning', pulse: false };
      case 'offline':
      default:
        return { label: 'Offline', variant: 'neutral', pulse: false };
    }
  };

  // DataTable columns definition
  const columns: Column<Driver>[] = [
    {
      header: 'Driver',
      cell: (row) => (
        <div className="flex items-center gap-3">
          <img
            src={row.avatar}
            alt={row.name}
            className="w-10 h-10 rounded-xl object-cover border border-neutral-200 shadow-2xs"
          />
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-xs text-neutral-900 truncate">
                {row.name}
              </span>
              <span className="text-[10px] font-mono text-neutral-400 font-bold">
                {row.customId}
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-neutral-400 truncate mt-0.5">
              <span className="flex items-center gap-1">
                <Phone size={10} className="text-neutral-400" />
                {row.phone}
              </span>
            </div>
          </div>
        </div>
      ),
    },
    {
      header: 'Vendor Partner',
      cell: (row) => (
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-1.5">
            <Building2 size={13} className="text-[#0E453B] shrink-0" />
            <span className="font-bold text-xs text-neutral-800 truncate">
              {row.vendorName}
            </span>
          </div>
          <span className="text-[10px] text-neutral-400 truncate">
            {row.vendorCompany}
          </span>
        </div>
      ),
    },
    {
      header: 'Assigned Vehicle',
      cell: (row) => (
        <div className="flex flex-col">
          {row.assignedVehicle ? (
            <>
              <div className="flex items-center gap-1.5">
                <Truck size={13} className="text-neutral-500 shrink-0" />
                <span className="font-mono font-bold text-xs text-neutral-900">
                  {row.assignedVehicle}
                </span>
              </div>
              <span className="text-[10.5px] text-neutral-400">
                {row.vehicleModel || 'Fleet Cab'}
              </span>
            </>
          ) : (
            <span className="text-xs text-neutral-400 italic">Unassigned</span>
          )}
        </div>
      ),
    },
    {
      header: 'Operating Hub',
      cell: (row) => (
        <div className="flex flex-col">
          <div className="flex items-center gap-1 text-xs font-semibold text-neutral-700">
            <MapPin size={12} className="text-neutral-400" />
            <span>{row.city}</span>
          </div>
          <span className="text-[10px] text-neutral-400 truncate">{row.hub}</span>
        </div>
      ),
    },
    {
      header: 'Live Status',
      cell: (row) => {
        const badge = mapOnlineStatusToBadge(row.onlineStatus);
        return (
          <StatusBadge
            status={badge.label}
            variant={badge.variant}
            pulse={badge.pulse}
            showDot={true}
          />
        );
      },
    },
    {
      header: 'KYC Compliance',
      cell: (row) => {
        let variant: StatusVariant = 'active';
        if (row.kycStatus === 'pending' || row.kycStatus === 'under_review') variant = 'warning';
        if (row.kycStatus === 'rejected') variant = 'danger';
        if (row.kycStatus === 'suspended') variant = 'warning';

        return (
          <StatusBadge
            status={row.kycStatus === 'approved' ? 'Verified' : row.kycStatus.replace('_', ' ')}
            variant={variant}
            showDot={false}
          />
        );
      },
    },
    {
      header: 'Rating & Trips',
      cell: (row) => (
        <div className="flex flex-col">
          <div className="flex items-center gap-1 text-xs font-bold text-neutral-900">
            <Star size={12} className="text-amber-500 fill-amber-500" />
            <span>{row.rating.toFixed(1)}</span>
            <span className="text-[10px] text-neutral-400 font-normal">
              ({row.totalTrips} trips)
            </span>
          </div>
          <span className="text-[10px] text-emerald-600 font-semibold">
            {row.acceptanceRate}% accept rate
          </span>
        </div>
      ),
    },
    {
      header: 'Actions',
      align: 'right',
      cell: (row) => (
        <div
          className="flex items-center justify-end gap-1.5"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={() => onSelectDriver(row)}
            className="p-1.5 rounded-lg text-neutral-500 hover:text-[#0E453B] hover:bg-[#D0EDE8]/30 transition-colors"
            title="View full driver details"
          >
            <Eye size={15} />
          </button>

          <button
            type="button"
            onClick={() => onEditDriver(row)}
            className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
            title="Edit driver profile"
          >
            <Edit size={15} />
          </button>

          <button
            type="button"
            onClick={() => onDeleteDriver(row.id)}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
            title="Delete / Offboard driver"
          >
            <Trash2 size={15} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full flex flex-col flex-1">
      {/* Main DataTable with Integrated Toolbar (Search, Filter Tabs, Vendor Filter, and Pagination) */}
      <DataTable
        data={paginatedDrivers}
        columns={columns}
        keyExtractor={(row) => row.id}
        onRowClick={(row) => onSelectDriver(row)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search drivers by name, phone, vendor, vehicle, hub..."
        filterOptions={filterOptions}
        selectedFilter={statusFilter}
        onFilterChange={setStatusFilter}
        actionButtons={
          <div className="flex items-center flex-wrap gap-2.5">
            {/* Vendor Partner Filter Dropdown */}
            <div className="flex items-center gap-1.5 bg-neutral-50/90 border border-neutral-200 rounded-lg px-2.5 py-1">
              <Building2 size={13} className="text-[#0E453B] shrink-0" />
              <select
                value={selectedVendorId}
                onChange={(e) => onVendorChange(e.target.value)}
                className="bg-transparent text-xs font-semibold text-neutral-800 outline-none cursor-pointer"
                title="Filter by Vendor Partner"
              >
                <option value="all">All Vendors ({drivers.length})</option>
                {vendorList.map((v) => {
                  const count = drivers.filter((d) => d.vendorId === v.id).length;
                  return (
                    <option key={v.id} value={v.id}>
                      {v.name} ({count})
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Sort Options Dropdown */}
            <div className="flex items-center gap-1.5 bg-neutral-50/90 border border-neutral-200 rounded-lg px-2.5 py-1">
              <SlidersHorizontal size={13} className="text-neutral-500 shrink-0" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-xs font-semibold text-neutral-800 outline-none cursor-pointer"
                title="Sort Driver Records"
              >
                <option value="newest">Sort: Newest Joined</option>
                <option value="rating">Sort: Highest Rated</option>
                <option value="trips">Sort: Most Trips</option>
                <option value="name">Sort: Name (A-Z)</option>
              </select>
            </div>

            {/* Export CSV Button */}
            <button
              type="button"
              onClick={handleExportCsv}
              className="btn btn-neutral text-xs px-3 py-1.5 rounded-lg border border-neutral-200 shadow-2xs flex items-center gap-1.5 hover:bg-neutral-50"
              title="Download Driver Directory as CSV"
            >
              <Download size={13} />
              <span>Export CSV</span>
            </button>
          </div>
        }
        emptyMessage="No drivers found matching your selected filters."
        isLoading={isLoading}
        pagination={{
          currentPage,
          totalPages,
          onPageChange: setCurrentPage,
          totalItems,
          pageSize,
        }}
      />
    </div>
  );
}
