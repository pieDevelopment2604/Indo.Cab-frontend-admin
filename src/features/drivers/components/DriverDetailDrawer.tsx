import React from 'react';
import {
  X,
  User,
  Phone,
  Mail,
  Building2,
  Truck,
  MapPin,
  Calendar,
  ShieldCheck,
  Star,
  FileText,
  CreditCard,
  PhoneCall,
  CheckCircle,
  AlertTriangle,
  Lock,
} from '@/utils/icons';
import StatusBadge, { type StatusVariant } from '@/components/common/StatusBadge';
import type { Driver } from '../types';

interface DriverDetailDrawerProps {
  driver: Driver | null;
  isOpen: boolean;
  onClose: () => void;
  onApproveDriver?: (driverId: string) => void;
  onSuspendDriver?: (driverId: string) => void;
}

export default function DriverDetailDrawer({
  driver,
  isOpen,
  onClose,
  onApproveDriver,
  onSuspendDriver,
}: DriverDetailDrawerProps) {
  if (!isOpen || !driver) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fadeIn">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-neutral-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Container */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-xl bg-white shadow-2xl flex flex-col justify-between border-l border-neutral-200">
          {/* Header */}
          <div className="p-6 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
            <div className="flex items-center gap-3">
              <img
                src={driver.avatar}
                alt={driver.name}
                className="w-12 h-12 rounded-2xl object-cover border border-neutral-200 shadow-2xs"
              />
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-extrabold text-neutral-900">
                    {driver.name}
                  </h3>
                  <span className="text-[10.5px] font-mono font-bold bg-neutral-200/80 text-neutral-700 px-2 py-0.5 rounded-md">
                    {driver.customId}
                  </span>
                </div>
                <p className="text-xs text-neutral-500 font-medium">
                  {driver.category}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Body Content */}
          <div className="p-6 flex-1 overflow-y-auto flex flex-col gap-6 text-xs text-neutral-700">
            {/* Status Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-neutral-50 p-3.5 rounded-2xl border border-neutral-200/70">
              <div className="flex flex-col">
                <span className="text-[10px] text-neutral-400 uppercase font-bold">
                  Live Status
                </span>
                <div className="mt-1">
                  <StatusBadge
                    status={driver.onlineStatus === 'online' ? 'Online' : driver.onlineStatus.replace('_', ' ')}
                    variant={driver.onlineStatus === 'online' ? 'active' : 'neutral'}
                    pulse={driver.onlineStatus === 'online'}
                  />
                </div>
              </div>

              <div className="flex flex-col">
                <span className="text-[10px] text-neutral-400 uppercase font-bold">
                  KYC Verification
                </span>
                <div className="mt-1">
                  <StatusBadge
                    status={driver.kycStatus === 'approved' ? 'Verified' : driver.kycStatus}
                    variant={driver.kycStatus === 'approved' ? 'active' : 'warning'}
                    showDot={false}
                  />
                </div>
              </div>

              <div className="flex flex-col">
                <span className="text-[10px] text-neutral-400 uppercase font-bold">
                  Rating
                </span>
                <div className="flex items-center gap-1 font-extrabold text-neutral-900 mt-1">
                  <Star size={13} className="text-amber-500 fill-amber-500" />
                  <span>{driver.rating.toFixed(1)}</span>
                </div>
              </div>

              <div className="flex flex-col">
                <span className="text-[10px] text-neutral-400 uppercase font-bold">
                  Total Completed
                </span>
                <span className="font-extrabold text-neutral-900 mt-1">
                  {driver.totalTrips} Trips
                </span>
              </div>
            </div>

            {/* Vendor Partnership Information */}
            <div className="flex flex-col gap-2.5">
              <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider flex items-center gap-1.5">
                <Building2 size={14} className="text-[#0E453B]" />
                <span>Vendor Partnership</span>
              </h4>
              <div className="p-3.5 rounded-xl border border-neutral-200 bg-white flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500">Partner Name:</span>
                  <span className="font-bold text-neutral-900">{driver.vendorName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500">Registered Company:</span>
                  <span className="font-semibold text-neutral-800">{driver.vendorCompany}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500">Vendor ID:</span>
                  <span className="font-mono text-neutral-600">{driver.vendorId}</span>
                </div>
              </div>
            </div>

            {/* Vehicle & Hub Assignment */}
            <div className="flex flex-col gap-2.5">
              <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider flex items-center gap-1.5">
                <Truck size={14} className="text-[#0E453B]" />
                <span>Vehicle & Operating Hub</span>
              </h4>
              <div className="p-3.5 rounded-xl border border-neutral-200 bg-white grid grid-cols-2 gap-3">
                <div className="flex flex-col">
                  <span className="text-neutral-400 text-[11px]">Assigned Vehicle</span>
                  <span className="font-mono font-bold text-neutral-900 mt-0.5">
                    {driver.assignedVehicle || 'Unassigned'}
                  </span>
                  <span className="text-[10px] text-neutral-500">{driver.vehicleModel}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-neutral-400 text-[11px]">Logistics Hub</span>
                  <span className="font-semibold text-neutral-900 mt-0.5">
                    {driver.hub}
                  </span>
                  <span className="text-[10px] text-neutral-500">{driver.city}, {driver.state}</span>
                </div>
              </div>
            </div>

            {/* Compliance & KYC Documents */}
            <div className="flex flex-col gap-2.5">
              <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-[#0E453B]" />
                <span>KYC Documents</span>
              </h4>
              <div className="flex flex-col gap-2">
                {/* DL */}
                <div className="p-3 rounded-xl border border-neutral-200 bg-white flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-teal-50 text-[#0E453B] flex items-center justify-center font-bold text-[10px]">
                      DL
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-neutral-900">
                        {driver.documents.drivingLicense.label}
                      </span>
                      <span className="text-[10.5px] font-mono text-neutral-400">
                        {driver.documents.drivingLicense.documentNumber} • Exp:{' '}
                        {driver.documents.drivingLicense.expiryDate}
                      </span>
                    </div>
                  </div>
                  <span className="status-success text-[10px]">Valid</span>
                </div>

                {/* Aadhaar */}
                <div className="p-3 rounded-xl border border-neutral-200 bg-white flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-teal-50 text-[#0E453B] flex items-center justify-center font-bold text-[10px]">
                      UID
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-neutral-900">
                        {driver.documents.aadhaarCard.label}
                      </span>
                      <span className="text-[10.5px] font-mono text-neutral-400">
                        {driver.documents.aadhaarCard.documentNumber}
                      </span>
                    </div>
                  </div>
                  <span className="status-success text-[10px]">Verified API</span>
                </div>

                {/* PAN */}
                <div className="p-3 rounded-xl border border-neutral-200 bg-white flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-teal-50 text-[#0E453B] flex items-center justify-center font-bold text-[10px]">
                      PAN
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-neutral-900">
                        {driver.documents.panCard.label}
                      </span>
                      <span className="text-[10.5px] font-mono text-neutral-400">
                        {driver.documents.panCard.documentNumber}
                      </span>
                    </div>
                  </div>
                  <span className="status-success text-[10px]">Verified</span>
                </div>
              </div>
            </div>

            {/* Emergency Contact & Bank */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Emergency Contact */}
              <div className="p-3.5 rounded-xl border border-neutral-200 bg-white flex flex-col gap-1.5">
                <span className="text-[10.5px] text-neutral-400 uppercase font-bold">
                  Emergency Contact
                </span>
                <span className="font-bold text-neutral-900">
                  {driver.emergencyContact?.name || 'N/A'}
                </span>
                <span className="text-neutral-500">
                  {driver.emergencyContact?.relation} • {driver.emergencyContact?.phone}
                </span>
              </div>

              {/* Bank Details */}
              <div className="p-3.5 rounded-xl border border-neutral-200 bg-white flex flex-col gap-1.5">
                <span className="text-[10.5px] text-neutral-400 uppercase font-bold">
                  Bank Settlement
                </span>
                <span className="font-bold text-neutral-900">
                  {driver.bankDetails?.bankName || 'N/A'}
                </span>
                <span className="text-neutral-500 font-mono text-[10.5px]">
                  A/C: {driver.bankDetails?.accountNumber}
                </span>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-4 border-t border-neutral-200 bg-neutral-50/60 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => {
                if (onSuspendDriver) onSuspendDriver(driver.id);
                onClose();
              }}
              className="btn btn-delete text-xs px-4 py-2.5 rounded-xl shadow-2xs"
            >
              Suspend Driver
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="btn btn-neutral text-xs px-4 py-2.5 rounded-xl"
              >
                Close
              </button>
              {driver.kycStatus === 'pending' && onApproveDriver && (
                <button
                  type="button"
                  onClick={() => {
                    onApproveDriver(driver.id);
                    onClose();
                  }}
                  className="btn btn-submit text-xs px-5 py-2.5 rounded-xl shadow-xs"
                >
                  Approve KYC
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
