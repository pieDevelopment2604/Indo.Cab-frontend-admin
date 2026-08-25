import React, { useState, useEffect } from 'react';
import {
  User,
  Truck,
  ShieldCheck,
  MapPin,
  CheckCircle,
  X,
  Lock,
  Filter,
  SlidersHorizontal,
  FileText,
  Search,
  Check,
  AlertTriangle,
  Clock,
  Sparkles,
} from '@/utils/icons';
import StatusBadge from '@/components/common/StatusBadge';
import type { ApprovalQueueItem, Driver } from '../types';

interface DriverApprovalQueueProps {
  queueItems: ApprovalQueueItem[];
  onApproveDriver: (driverId: string) => void;
  onRejectDriver: (driverId: string, reason?: string) => void;
}

export default function DriverApprovalQueue({
  queueItems,
  onApproveDriver,
  onRejectDriver,
}: DriverApprovalQueueProps) {
  const [items, setItems] = useState<ApprovalQueueItem[]>(queueItems);
  const [selectedId, setSelectedId] = useState<string>(
    queueItems[0]?.id || ''
  );
  const [sortOrder, setSortOrder] = useState<'oldest' | 'newest'>('oldest');
  const [filterType, setFilterType] = useState<'all' | 'driver' | 'vehicle'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    setItems(queueItems);
    if ((!selectedId || !queueItems.some((q) => q.id === selectedId)) && queueItems.length > 0) {
      setSelectedId(queueItems[0].id);
    }
  }, [queueItems, selectedId]);

  const selectedItem = items.find((i) => i.id === selectedId) || items[0];
  const driver: Driver | undefined = selectedItem?.driverData;

  // Filter & Sort Logic
  const filteredQueue = items
    .filter((item) => {
      const matchesType = filterType === 'all' || item.type === filterType;
      const matchesSearch =
        !searchQuery ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.regId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.vendorName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesType && matchesSearch && item.status === 'pending';
    })
    .sort((a, b) => {
      if (sortOrder === 'newest') return b.id.localeCompare(a.id);
      return a.id.localeCompare(b.id);
    });

  const handleApproveAll = (item: ApprovalQueueItem) => {
    if (item.driverData) {
      onApproveDriver(item.driverData.id);
    }
    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, status: 'approved' } : i))
    );
    setActionSuccessMsg(`Approved ${item.title} successfully!`);
    setTimeout(() => setActionSuccessMsg(null), 3500);

    // Auto-select next pending item
    const remaining = items.filter((i) => i.id !== item.id && i.status === 'pending');
    if (remaining.length > 0) {
      setSelectedId(remaining[0].id);
    }
  };

  const handleRejectProfile = (item: ApprovalQueueItem) => {
    const reason = window.prompt(
      `Please provide rejection reason for ${item.title}:`,
      'Document mismatch or blurred image'
    );
    if (reason === null) return; // cancelled

    if (item.driverData) {
      onRejectDriver(item.driverData.id, reason);
    }
    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, status: 'rejected' } : i))
    );
    setActionSuccessMsg(`Rejected ${item.title}.`);
    setTimeout(() => setActionSuccessMsg(null), 3500);

    const remaining = items.filter((i) => i.id !== item.id && i.status === 'pending');
    if (remaining.length > 0) {
      setSelectedId(remaining[0].id);
    }
  };

  return (
    <div className="flex flex-col gap-5 w-full">
      {/* Toast Notification */}
      {actionSuccessMsg && (
        <div className="bg-[#0E453B] text-white px-4 py-3 rounded-xl shadow-lg flex items-center justify-between text-xs font-semibold animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle size={16} className="text-[#A2DBD1]" />
            <span>{actionSuccessMsg}</span>
          </div>
          <button
            type="button"
            onClick={() => setActionSuccessMsg(null)}
            className="text-white/80 hover:text-white"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Top Header & Quick Filter Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900 tracking-tight">
            Approval Queue
          </h2>
          <p className="text-xs md:text-sm text-neutral-500 font-normal mt-0.5">
            Verify pending vehicle and driver registrations across vendor partners.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Filter Type Toggle */}
          <div className="flex items-center bg-white border border-neutral-200 rounded-lg p-1 text-xs">
            <button
              type="button"
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                filterType === 'all'
                  ? 'bg-neutral-100 text-neutral-900 font-semibold shadow-2xs'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              All ({items.filter((i) => i.status === 'pending').length})
            </button>
            <button
              type="button"
              onClick={() => setFilterType('driver')}
              className={`px-3 py-1.5 rounded-md font-medium transition-all flex items-center gap-1.5 ${
                filterType === 'driver'
                  ? 'bg-neutral-100 text-neutral-900 font-semibold shadow-2xs'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              <User size={13} />
              <span>Drivers</span>
            </button>
            <button
              type="button"
              onClick={() => setFilterType('vehicle')}
              className={`px-3 py-1.5 rounded-md font-medium transition-all flex items-center gap-1.5 ${
                filterType === 'vehicle'
                  ? 'bg-neutral-100 text-neutral-900 font-semibold shadow-2xs'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              <Truck size={13} />
              <span>Vehicles</span>
            </button>
          </div>

          {/* Sort Button */}
          <button
            type="button"
            onClick={() =>
              setSortOrder((prev) => (prev === 'oldest' ? 'newest' : 'oldest'))
            }
            className="btn btn-neutral text-xs font-semibold px-3 py-2 border border-neutral-200 bg-white hover:bg-neutral-50 rounded-lg flex items-center gap-2 shadow-2xs"
          >
            <SlidersHorizontal size={14} className="text-neutral-500" />
            <span>{sortOrder === 'oldest' ? 'Oldest First' : 'Newest First'}</span>
          </button>
        </div>
      </div>

      {/* Main 2-Column Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Pending Queue List (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
              PENDING ({filteredQueue.length})
            </span>
            <span className="text-[11px] text-neutral-400 font-medium">
              Real-time Queue
            </span>
          </div>

          {/* Search box within queue */}
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search approvals by name or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-neutral-200 rounded-xl bg-white text-neutral-900 outline-none focus:border-[#135c4e] focus:ring-2 focus:ring-[#135c4e]/10 transition-all placeholder:text-neutral-400"
            />
          </div>

          {/* Queue Items List */}
          <div className="flex flex-col gap-2.5 max-h-[calc(100vh-230px)] overflow-y-auto pr-1">
            {filteredQueue.length === 0 ? (
              <div className="card p-8 text-center flex flex-col items-center justify-center gap-2 border-dashed border-neutral-200">
                <CheckCircle size={28} className="text-emerald-500" />
                <span className="text-xs font-bold text-neutral-800">
                  All Caught Up!
                </span>
                <p className="text-[11px] text-neutral-400">
                  No pending registrations matching your criteria.
                </p>
              </div>
            ) : (
              filteredQueue.map((item) => {
                const isSelected = selectedId === item.id;
                const isDriver = item.type === 'driver';

                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedId(item.id)}
                    className={`card p-3.5 rounded-2xl transition-all cursor-pointer border ${
                      isSelected
                        ? 'border-[#0E453B] bg-white ring-2 ring-[#0E453B]/10 shadow-sm'
                        : 'border-neutral-200/80 bg-white hover:border-neutral-300 hover:bg-neutral-50/50 shadow-2xs'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Left Icon Badge */}
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          isDriver
                            ? 'bg-[#D0EDE8] text-[#0E453B]'
                            : 'bg-neutral-100 text-neutral-600'
                        }`}
                      >
                        {isDriver ? (
                          <User size={18} strokeWidth={2.2} />
                        ) : (
                          <Truck size={18} strokeWidth={2.2} />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1.5">
                          <h4 className="text-xs font-extrabold text-neutral-900 truncate">
                            {item.title}
                          </h4>
                          <span
                            className={`text-[9.5px] font-extrabold px-1.5 py-0.5 rounded tracking-wide shrink-0 ${
                              isDriver
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-neutral-200 text-neutral-700'
                            }`}
                          >
                            {isDriver ? 'DRIVER' : 'VEHICLE'}
                          </span>
                        </div>

                        <div className="text-[11px] text-neutral-600 font-medium truncate mt-0.5">
                          {isDriver
                            ? `Reg ID: ${item.regId}`
                            : item.subtitle}
                        </div>

                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-neutral-100">
                          <span className="text-[10px] text-neutral-400 italic">
                            {item.appliedTime}
                          </span>
                          <span className="text-[10px] text-neutral-500 font-semibold truncate max-w-[130px]">
                            {item.vendorName}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Detailed Dossier & Document Inspection (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          {selectedItem && driver ? (
            <>
              {/* Profile Top Hero Card */}
              <div className="card p-5 rounded-2xl bg-white border border-neutral-200 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img
                    src={driver.avatar}
                    alt={driver.name}
                    className="w-14 h-14 rounded-2xl object-cover border border-neutral-200 shadow-xs"
                  />
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-extrabold text-neutral-900">
                        {driver.name}
                      </h3>
                      <span className="text-xs font-mono font-bold text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded-md">
                        {driver.customId}
                      </span>
                    </div>

                    <p className="text-xs font-semibold text-neutral-600 mt-0.5">
                      {driver.category}
                    </p>

                    <div className="flex items-center gap-3 mt-2 flex-wrap">
                      <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <ShieldCheck size={13} />
                        <span>Background Check Passed</span>
                      </span>

                      <span className="text-[11px] font-semibold text-neutral-600 bg-neutral-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <MapPin size={12} className="text-neutral-400" />
                        <span>
                          {driver.city}, {driver.state === 'Maharashtra' ? 'MH' : driver.state}
                        </span>
                      </span>

                      <span className="text-[11px] font-semibold text-neutral-500">
                        Vendor: <strong>{driver.vendorName}</strong>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Main Action Buttons */}
                <div className="flex items-center gap-2.5 w-full sm:w-auto shrink-0">
                  <button
                    type="button"
                    onClick={() => handleRejectProfile(selectedItem)}
                    className="btn btn-delete px-4 py-2.5 text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-2xs flex-1 sm:flex-none justify-center"
                  >
                    <X size={15} strokeWidth={2.5} />
                    <span>Reject Profile</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleApproveAll(selectedItem)}
                    className="btn btn-submit px-5 py-2.5 text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs flex-1 sm:flex-none justify-center"
                  >
                    <CheckCircle size={15} strokeWidth={2.5} />
                    <span>Approve All</span>
                  </button>
                </div>
              </div>

              {/* 2x2 Document Inspection Grid matching reference screen */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. Driving License (DL) Card */}
                <div className="card p-4 rounded-2xl bg-white border border-neutral-200 shadow-2xs flex flex-col justify-between gap-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-xs font-bold text-neutral-900">
                        Driving License (DL)
                      </h4>
                      <p className="text-[11px] font-mono text-neutral-500 mt-0.5">
                        ID: {driver.documents.drivingLicense.documentNumber}
                      </p>
                    </div>

                    <span className="text-[9.5px] font-extrabold px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
                      EXPIRES SOON
                    </span>
                  </div>

                  {/* Document Preview Area */}
                  <div className="relative w-full h-36 rounded-xl overflow-hidden bg-neutral-900 border border-neutral-200 flex items-center justify-center group">
                    <img
                      src={driver.documents.drivingLicense.fileUrl}
                      alt="Driving License"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-2.5">
                      <span className="text-[10.5px] font-mono font-bold text-white drop-shadow">
                        DL: {driver.documents.drivingLicense.documentNumber}
                      </span>
                    </div>
                  </div>

                  {/* Inline Action Buttons */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => alert(`Driving license marked as rejected.`)}
                      className="w-full py-2 text-xs font-bold rounded-lg border border-rose-300 text-rose-600 bg-white hover:bg-rose-50 transition-colors"
                    >
                      Reject
                    </button>
                    <button
                      type="button"
                      onClick={() => alert(`Driving license verified and approved!`)}
                      className="w-full py-2 text-xs font-bold rounded-lg border border-[#0E453B] text-[#0E453B] bg-white hover:bg-[#D0EDE8]/30 transition-colors"
                    >
                      Approve
                    </button>
                  </div>
                </div>

                {/* 2. Aadhaar Card */}
                <div className="card p-4 rounded-2xl bg-white border border-neutral-200 shadow-2xs flex flex-col justify-between gap-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-xs font-bold text-neutral-900">
                        Aadhaar Card
                      </h4>
                      <p className="text-[11px] font-mono text-neutral-500 mt-0.5">
                        ID: {driver.documents.aadhaarCard.documentNumber}
                      </p>
                    </div>

                    <span className="text-[9.5px] font-extrabold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                      <Check size={11} strokeWidth={3} />
                      <span>VERIFIED API</span>
                    </span>
                  </div>

                  {/* Document Preview Area */}
                  <div className="relative w-full h-36 rounded-xl overflow-hidden bg-neutral-100 border border-neutral-200 flex items-center justify-center group">
                    <img
                      src={driver.documents.aadhaarCard.fileUrl}
                      alt="Aadhaar Card"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent flex items-end p-2.5">
                      <span className="text-[10.5px] font-mono font-bold text-white drop-shadow">
                        UIDAI: {driver.documents.aadhaarCard.documentNumber}
                      </span>
                    </div>
                  </div>

                  {/* Inline Action Buttons */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => alert(`Aadhaar card rejected.`)}
                      className="w-full py-2 text-xs font-bold rounded-lg border border-rose-300 text-rose-600 bg-white hover:bg-rose-50 transition-colors"
                    >
                      Reject
                    </button>
                    <button
                      type="button"
                      onClick={() => alert(`Aadhaar card verified and approved!`)}
                      className="w-full py-2 text-xs font-bold rounded-lg border border-[#0E453B] text-[#0E453B] bg-white hover:bg-[#D0EDE8]/30 transition-colors"
                    >
                      Approve
                    </button>
                  </div>
                </div>

                {/* 3. PAN Card */}
                <div className="card p-4 rounded-2xl bg-white border border-neutral-200 shadow-2xs flex flex-col justify-between gap-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-xs font-bold text-neutral-900">
                        PAN Card
                      </h4>
                      <p className="text-[11px] font-mono text-neutral-500 mt-0.5">
                        ID: {driver.documents.panCard.documentNumber}
                      </p>
                    </div>
                  </div>

                  {/* PAN Card Graphic Display */}
                  <div className="relative w-full h-36 rounded-xl overflow-hidden bg-slate-900 border border-neutral-300 flex items-center justify-center p-3">
                    <div className="w-full h-full bg-gradient-to-r from-sky-900 to-indigo-950 rounded-lg p-3 flex flex-col justify-between text-white shadow-inner">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold tracking-widest text-sky-200 uppercase">
                          INCOME TAX DEPARTMENT
                        </span>
                        <div className="w-4 h-4 rounded-full bg-amber-400/80" />
                      </div>

                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded bg-white/20 flex items-center justify-center">
                          <User size={16} className="text-sky-100" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[11px] font-bold tracking-wide">
                            {driver.name}
                          </span>
                          <span className="text-[10px] font-mono text-sky-300">
                            {driver.documents.panCard.documentNumber}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Inline Action Buttons */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => alert(`PAN card rejected.`)}
                      className="w-full py-2 text-xs font-bold rounded-lg border border-rose-300 text-rose-600 bg-white hover:bg-rose-50 transition-colors"
                    >
                      Reject
                    </button>
                    <button
                      type="button"
                      onClick={() => alert(`PAN card verified and approved!`)}
                      className="w-full py-2 text-xs font-bold rounded-lg border border-[#0E453B] text-[#0E453B] bg-white hover:bg-[#D0EDE8]/30 transition-colors"
                    >
                      Approve
                    </button>
                  </div>
                </div>

                {/* 4. Medical Fitness Cert. */}
                <div className="card p-4 rounded-2xl bg-neutral-50/70 border border-neutral-200 shadow-2xs flex flex-col justify-between gap-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-xs font-bold text-neutral-900">
                        Medical Fitness Cert.
                      </h4>
                      <p className="text-[11px] text-neutral-400 mt-0.5">
                        {driver.documents.medicalFitness.uploadDate || 'Awaiting Upload'}
                      </p>
                    </div>

                    <div className="w-6 h-6 rounded-md bg-neutral-200/80 flex items-center justify-center text-neutral-500">
                      <Lock size={12} />
                    </div>
                  </div>

                  {/* Empty / Awaiting Placeholder */}
                  <div className="w-full h-36 rounded-xl border-2 border-dashed border-neutral-300 bg-white/60 flex flex-col items-center justify-center gap-1.5 text-neutral-400">
                    <Clock size={24} className="text-neutral-400" />
                    <span className="text-xs font-bold text-neutral-600">
                      Awaiting Upload
                    </span>
                    <span className="text-[10px] text-neutral-400">
                      Doctor stamp & fitness clearance
                    </span>
                  </div>

                  {/* Disabled Action Button */}
                  <div className="pt-1">
                    <button
                      type="button"
                      disabled
                      className="w-full py-2 text-xs font-semibold rounded-lg border border-neutral-200 text-neutral-400 bg-neutral-100 cursor-not-allowed"
                    >
                      Actions Disabled
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : selectedItem && !driver ? (
            /* Vehicle Verification Dossier */
            <div className="card p-6 rounded-2xl bg-white border border-neutral-200 shadow-2xs flex flex-col gap-4">
              <div className="flex items-center gap-3 border-b border-neutral-100 pb-4">
                <div className="w-12 h-12 rounded-xl bg-neutral-100 text-neutral-700 flex items-center justify-center">
                  <Truck size={22} />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-neutral-900">
                    {selectedItem.title}
                  </h3>
                  <span className="text-xs font-mono font-bold text-neutral-500">
                    Registration: {selectedItem.regId}
                  </span>
                </div>
              </div>

              <p className="text-xs text-neutral-600 leading-relaxed">
                Vehicle compliance papers (RC, Insurance, PUC, Fitness) under{' '}
                <strong>{selectedItem.vendorName}</strong> are currently ready for inspection.
              </p>

              <div className="flex items-center gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => handleApproveAll(selectedItem)}
                  className="btn btn-submit text-xs px-5 py-2.5 rounded-xl shadow-xs"
                >
                  Approve Vehicle
                </button>
                <button
                  type="button"
                  onClick={() => handleRejectProfile(selectedItem)}
                  className="btn btn-delete text-xs px-5 py-2.5 rounded-xl shadow-2xs"
                >
                  Reject Vehicle
                </button>
              </div>
            </div>
          ) : (
            <div className="card p-12 text-center text-neutral-400 text-xs">
              Select an item from the approval queue to view documents.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
