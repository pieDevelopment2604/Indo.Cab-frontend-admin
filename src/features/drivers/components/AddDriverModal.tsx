import React, { useState } from 'react';
import {
  X,
  UserPlus,
  Building2,
  Phone,
  Mail,
  Truck,
  MapPin,
  ShieldCheck,
  CreditCard,
  Calendar,
} from '@/utils/icons';
import type { Driver } from '../types';

interface AddDriverModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddDriver: (driver: Driver) => void;
  vendorList: Array<{ id: string; name: string; companyName?: string }>;
}

export default function AddDriverModal({
  isOpen,
  onClose,
  onAddDriver,
  vendorList,
}: AddDriverModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    vendorId: vendorList[0]?.id || '',
    assignedVehicle: '',
    vehicleModel: '',
    city: 'Mumbai',
    state: 'Maharashtra',
    hub: 'Andheri Central Hub',
    experienceYears: 5,
    category: 'Commercial Cab Driver',
    dlNumber: '',
    dlExpiry: '2030-12-31',
    aadhaarNumber: '',
    panNumber: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const vendor = vendorList.find((v) => v.id === formData.vendorId) || {
      id: 'vnd-101',
      name: 'Sahani Logistics & Fleet',
      companyName: 'Sahani Travels Pvt Ltd',
    };

    const newDriver: Driver = {
      id: `drv-${Date.now().toString().slice(-4)}`,
      customId: `#DRV-${Math.floor(1000 + Math.random() * 9000)}`,
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      avatar:
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
      vendorId: vendor.id,
      vendorName: vendor.name,
      vendorCompany: vendor.companyName || vendor.name,
      assignedVehicle: formData.assignedVehicle || undefined,
      vehicleModel: formData.vehicleModel || 'Standard Fleet',
      vehicleType: 'Sedan',
      city: formData.city,
      state: formData.state,
      hub: formData.hub,
      experienceYears: Number(formData.experienceYears) || 3,
      category: `${formData.category} • ${formData.experienceYears} Years Exp.`,
      joiningDate: new Date().toISOString().split('T')[0],
      appliedDate: 'Just now',
      onlineStatus: 'offline',
      kycStatus: 'pending',
      backgroundCheckPassed: true,
      rating: 5.0,
      totalTrips: 0,
      acceptanceRate: 100,
      cancellationRate: 0,
      dailyEarnings: 0,
      documents: {
        drivingLicense: {
          status: 'valid',
          label: 'Driving License (DL)',
          documentNumber: formData.dlNumber || 'MH-01-20240019283',
          expiryDate: formData.dlExpiry,
          fileUrl:
            'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80',
          fileName: 'dl_document.pdf',
          verifiedApi: true,
        },
        aadhaarCard: {
          status: 'verified',
          label: 'Aadhaar Card',
          documentNumber: formData.aadhaarNumber || '**** **** 8812',
          fileUrl:
            'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
          fileName: 'aadhaar_document.pdf',
          verifiedApi: true,
        },
        panCard: {
          status: 'verified',
          label: 'PAN Card',
          documentNumber: formData.panNumber || 'ABCDE1234F',
          fileUrl:
            'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80',
          fileName: 'pan_document.jpg',
          verifiedApi: true,
        },
        medicalFitness: {
          status: 'awaiting_upload',
          label: 'Medical Fitness Cert.',
        },
      },
    };

    setTimeout(() => {
      setIsSubmitting(false);
      onAddDriver(newDriver);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-neutral-900/40 backdrop-blur-xs animate-fadeIn">
      <div className="card w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#D0EDE8] text-[#0E453B] flex items-center justify-center">
              <UserPlus size={18} strokeWidth={2.2} />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-neutral-900">
                Register New Driver
              </h3>
              <p className="text-[11px] text-neutral-500">
                Super Admin Driver Onboarding under Vendor Partner
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="icon-btn icon-btn-sm text-neutral-400 hover:text-neutral-600"
            title="Close Modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-neutral-700">
                Driver Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Ramesh Patil"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs font-semibold outline-none focus:border-[#0E453B] focus:ring-2 focus:ring-[#0E453B]/10 bg-white"
              />
            </div>

            {/* Vendor Partner */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-neutral-700 flex items-center gap-1">
                <Building2 size={13} className="text-[#0E453B]" />
                <span>Assign to Vendor Partner *</span>
              </label>
              <select
                required
                value={formData.vendorId}
                onChange={(e) =>
                  setFormData({ ...formData, vendorId: e.target.value })
                }
                className="px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs font-semibold outline-none focus:border-[#0E453B] bg-white cursor-pointer"
              >
                {vendorList.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Mobile Number */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-neutral-700 flex items-center gap-1">
                <Phone size={13} className="text-[#0E453B]" />
                <span>Mobile Number *</span>
              </label>
              <input
                type="tel"
                required
                placeholder="e.g. +91 98201 22334"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs font-semibold outline-none focus:border-[#0E453B] bg-white"
              />
            </div>

            {/* Email Address */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-neutral-700 flex items-center gap-1">
                <Mail size={13} className="text-[#0E453B]" />
                <span>Email Address *</span>
              </label>
              <input
                type="email"
                required
                placeholder="e.g. ramesh.patil@gmail.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs font-semibold outline-none focus:border-[#0E453B] bg-white"
              />
            </div>

            {/* Driving License Number */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-neutral-700 flex items-center gap-1">
                <ShieldCheck size={13} className="text-[#0E453B]" />
                <span>Driving License (DL) Number *</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. MH-01-20220099881"
                value={formData.dlNumber}
                onChange={(e) =>
                  setFormData({ ...formData, dlNumber: e.target.value.toUpperCase() })
                }
                className="px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs font-mono font-bold uppercase outline-none focus:border-[#0E453B] bg-white"
              />
            </div>

            {/* Assigned Vehicle */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-neutral-700 flex items-center gap-1">
                <Truck size={13} className="text-[#0E453B]" />
                <span>Assign Fleet Vehicle (Optional)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. MH-12-QX-4029"
                value={formData.assignedVehicle}
                onChange={(e) =>
                  setFormData({ ...formData, assignedVehicle: e.target.value.toUpperCase() })
                }
                className="px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs font-mono font-bold uppercase outline-none focus:border-[#0E453B] bg-white"
              />
            </div>

            {/* Operating Hub */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-neutral-700 flex items-center gap-1">
                <MapPin size={13} className="text-[#0E453B]" />
                <span>Operating City & Hub</span>
              </label>
              <select
                value={formData.hub}
                onChange={(e) =>
                  setFormData({ ...formData, hub: e.target.value })
                }
                className="px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs font-semibold outline-none focus:border-[#0E453B] bg-white cursor-pointer"
              >
                <option value="Andheri Central Hub">Andheri Central Hub (Mumbai)</option>
                <option value="BKC Business Yard">BKC Business Yard (Mumbai)</option>
                <option value="Pune Logistics Hub">Pune Logistics Hub</option>
                <option value="Thane Transport Yard">Thane Transport Yard</option>
                <option value="IGI Airport Hub">IGI Airport Hub (Delhi)</option>
              </select>
            </div>

            {/* Experience */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-neutral-700">
                Experience (Years)
              </label>
              <input
                type="number"
                min={0}
                max={40}
                value={formData.experienceYears}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    experienceYears: Number(e.target.value),
                  })
                }
                className="px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs font-semibold outline-none focus:border-[#0E453B] bg-white"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-100 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-neutral text-xs px-4 py-2.5 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-submit text-xs px-6 py-2.5 rounded-xl shadow-xs flex items-center gap-1.5"
            >
              <UserPlus size={15} />
              <span>{isSubmitting ? 'Registering...' : 'Register Driver'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
