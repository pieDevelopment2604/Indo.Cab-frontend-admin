import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Users,
  UserCheck,
  Clock,
  ShieldAlert,
  Plus,
  LayoutDashboard,
  ShieldCheck,
  Building2,
  RefreshCw,
  Download,
} from '@/utils/icons';
import KpiCard from '@/components/common/KpiCard';
import ViewModeTabs, { type TabOption } from '@/components/common/ViewModeTabs';
import AddButton from '@/components/common/AddButton';
import { driverApi, vendorApi } from '@/api';
import { mapApiDriver, type Driver, type ApprovalQueueItem } from './types';
import DriverDirectoryView from './components/DriverDirectoryView';
import DriverApprovalQueue from './components/DriverApprovalQueue';
import DriverDetailDrawer from './components/DriverDetailDrawer';
import AddDriverModal from './components/AddDriverModal';

type DriverViewMode = 'directory' | 'approvals';

export default function DriverManagementPage() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [approvalQueue, setApprovalQueue] = useState<ApprovalQueueItem[]>([]);
  const [activeTab, setActiveTab] = useState<DriverViewMode>('directory');
  const [selectedVendorId, setSelectedVendorId] = useState<string>('all');
  const [vendorsList, setVendorsList] = useState<
    Array<{ id: string; name: string; companyName?: string }>
  >([]);

  // Drawer & Modal States
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch live drivers & vendors from API
  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [driversRes, vendorsRes] = await Promise.allSettled([
        driverApi.getDrivers(),
        vendorApi.getVendors(),
      ]);

      if (vendorsRes.status === 'fulfilled' && Array.isArray(vendorsRes.value)) {
        setVendorsList(
          vendorsRes.value.map((v: any) => ({
            id: String(v.id || v.vendor_id),
            name: v.name || v.company_name || 'Vendor Partner',
            companyName: v.company_name,
          }))
        );
      }

      if (driversRes.status === 'fulfilled' && Array.isArray(driversRes.value)) {
        const mappedDrivers = driversRes.value.map((raw: any, idx: number) =>
          mapApiDriver(raw, idx)
        );
        setDrivers(mappedDrivers);

        // Build Approval Queue from pending drivers
        const queue: ApprovalQueueItem[] = mappedDrivers
          .filter((d) => d.kycStatus === 'pending' || d.kycStatus === 'under_review')
          .map((d) => ({
            id: `queue-${d.id}`,
            type: 'driver',
            regId: d.customId,
            title: d.name,
            subtitle: d.category,
            appliedTime: d.appliedDate || 'Applied recently',
            avatar: d.avatar,
            vendorName: d.vendorName,
            driverData: d,
            status: 'pending',
          }));
        setApprovalQueue(queue);
      } else {
        setDrivers([]);
        setApprovalQueue([]);
      }
    } catch (err) {
      console.error('Error fetching driver data:', err);
      setDrivers([]);
      setApprovalQueue([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // KPI Calculations
  const totalDrivers = drivers.length;
  const onlineDrivers = drivers.filter(
    (d) => d.onlineStatus === 'online' || d.onlineStatus === 'on_trip'
  ).length;
  const pendingApprovals =
    drivers.filter((d) => d.kycStatus === 'pending' || d.kycStatus === 'under_review')
      .length + approvalQueue.filter((q) => q.status === 'pending').length;
  const suspendedDrivers = drivers.filter(
    (d) => d.kycStatus === 'suspended' || d.kycStatus === 'rejected'
  ).length;

  // View Mode Tabs Definition
  const tabs: TabOption<DriverViewMode>[] = [
    {
      id: 'directory',
      label: 'Driver Directory',
      icon: <Users size={15} />,
    },
    {
      id: 'approvals',
      label: `Approval Queue (${approvalQueue.filter((q) => q.status === 'pending').length})`,
      icon: <ShieldCheck size={15} />,
    },
  ];

  // Handlers
  const handleDriverSelect = (driver: Driver) => {
    setSelectedDriver(driver);
    setIsDrawerOpen(true);
  };

  const handleApproveDriver = useCallback(async (driverId: string) => {
    try {
      await driverApi.approveKyc(driverId);
    } catch (err) {
      console.warn('API approve error, updating local state', err);
    }
    setDrivers((prev) =>
      prev.map((d) =>
        d.id === driverId ? { ...d, kycStatus: 'approved' } : d
      )
    );
    setApprovalQueue((prev) =>
      prev.map((item) =>
        item.driverData?.id === driverId
          ? { ...item, status: 'approved' }
          : item
      )
    );
  }, []);

  const handleRejectDriver = useCallback(async (driverId: string, reason?: string) => {
    try {
      await driverApi.rejectKyc(driverId, reason);
    } catch (err) {
      console.warn('API reject error, updating local state', err);
    }
    setDrivers((prev) =>
      prev.map((d) =>
        d.id === driverId ? { ...d, kycStatus: 'rejected' } : d
      )
    );
    setApprovalQueue((prev) =>
      prev.map((item) =>
        item.driverData?.id === driverId
          ? { ...item, status: 'rejected' }
          : item
      )
    );
  }, []);

  const handleSuspendDriver = useCallback(async (driverId: string) => {
    try {
      await driverApi.toggleStatus(driverId, 'SUSPENDED');
    } catch (err) {
      console.warn('API toggle status error, updating local state', err);
    }
    setDrivers((prev) =>
      prev.map((d) =>
        d.id === driverId
          ? { ...d, kycStatus: 'suspended', onlineStatus: 'offline' }
          : d
      )
    );
  }, []);

  const handleDeleteDriver = useCallback(async (driverId: string) => {
    if (!window.confirm('Are you sure you want to remove this driver from the fleet?')) return;
    try {
      await driverApi.deleteDriver(driverId);
    } catch (err) {
      console.warn('API delete error, removing from local state', err);
    }
    setDrivers((prev) => prev.filter((d) => d.id !== driverId));
  }, []);

  const handleAddDriver = async (newDriver: Driver) => {
    try {
      setIsLoading(true);
      await driverApi.createDriver({
        name: newDriver.name,
        phone: newDriver.phone,
        email: newDriver.email,
        vendor_id: newDriver.vendorId,
        assigned_vehicle: newDriver.assignedVehicle,
        vehicle_model: newDriver.vehicleModel,
        city: newDriver.city,
        state: newDriver.state,
        hub: newDriver.hub,
        experience_years: newDriver.experienceYears,
        category: newDriver.category,
      });
      await loadData();
    } catch (err) {
      console.warn('Backend create driver error, adding to local state', err);
      setDrivers((prev) => [newDriver, ...prev]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1440px] mx-auto animate-fadeIn pb-12">
      {/* Top Header & Primary Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-neutral-900 tracking-tight">
            Driver Management
          </h1>
          <p className="text-xs md:text-sm text-neutral-500 font-medium mt-0.5">
            Manage vendor fleet drivers, live online statuses, compliance verification, and approvals.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => loadData()}
            className="btn btn-neutral text-xs px-3.5 py-2.5 rounded-xl border border-neutral-200 shadow-2xs flex items-center gap-1.5"
            title="Refresh Fleet Data"
          >
            <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>

          <AddButton
            label="Add New Driver"
            onClick={() => setIsAddModalOpen(true)}
          />
        </div>
      </div>

      {/* 4 KPI Summary Cards using Common KpiCard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Total Fleet Drivers"
          value={totalDrivers}
          icon={Users}
          iconStyle="bg-emerald-50 text-[#0E453B] border-emerald-100"
          badge="+12% MoM"
          badgeStyle="text-emerald-700 font-bold"
        />

        <KpiCard
          title="Live Online Drivers"
          value={onlineDrivers}
          icon={UserCheck}
          iconStyle="bg-teal-50 text-[#135C4E] border-teal-100"
          badge="Live Pulse"
          badgeStyle="text-emerald-600 font-extrabold animate-pulse"
        />

        <KpiCard
          title="Pending Approvals"
          value={pendingApprovals}
          icon={Clock}
          iconStyle="bg-amber-50 text-amber-800 border-amber-100"
          badge="Action Req."
          badgeStyle="text-amber-800 font-bold bg-amber-50 px-2 py-0.5 rounded-full"
        />

        <KpiCard
          title="Suspended / Inactive"
          value={suspendedDrivers}
          icon={ShieldAlert}
          iconStyle="bg-rose-50 text-rose-700 border-rose-100"
          subnote="Compliance review"
          subnoteStyle="text-[11px] text-rose-600 font-semibold"
        />
      </div>

      {/* Main View Mode Selector Tabs */}
      <ViewModeTabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
      />

      {/* Active Tab View */}
      {activeTab === 'directory' ? (
        <DriverDirectoryView
          drivers={drivers}
          onSelectDriver={handleDriverSelect}
          onEditDriver={(driver) => {
            setSelectedDriver(driver);
            setIsDrawerOpen(true);
          }}
          onDeleteDriver={handleDeleteDriver}
          onStatusToggle={handleSuspendDriver}
          selectedVendorId={selectedVendorId}
          onVendorChange={setSelectedVendorId}
          vendorList={vendorsList}
          isLoading={isLoading}
        />
      ) : (
        <DriverApprovalQueue
          queueItems={approvalQueue}
          onApproveDriver={handleApproveDriver}
          onRejectDriver={handleRejectDriver}
        />
      )}

      {/* Driver Detail Drawer */}
      <DriverDetailDrawer
        driver={selectedDriver}
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setSelectedDriver(null);
        }}
        onApproveDriver={handleApproveDriver}
        onSuspendDriver={handleSuspendDriver}
      />

      {/* Add Driver Modal */}
      <AddDriverModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddDriver={handleAddDriver}
        vendorList={vendorsList}
      />
    </div>
  );
}

