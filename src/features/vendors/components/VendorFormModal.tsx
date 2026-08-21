import React from 'react'
import type { Vendor } from '../types'
import { X } from '@/utils/icons'

import type { VendorFormData } from '../hooks/useVendorEditModal'

interface VendorFormModalProps {
  isOpen: boolean
  editingVendor: Vendor | null
  formData: VendorFormData
  setFormData: React.Dispatch<React.SetStateAction<VendorFormData>>
  onClose: () => void
  onSubmit: (e: React.FormEvent) => void
}

export default function VendorFormModal({
  isOpen,
  editingVendor,
  formData,
  setFormData,
  onClose,
  onSubmit
}: VendorFormModalProps) {
  if (!isOpen && !editingVendor) return null

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="card max-w-lg w-full p-6 shadow-2xl flex flex-col gap-5">
        <div className="flex justify-between items-center border-b border-neutral-100 pb-3">
          <h3 className="text-lg font-bold text-neutral-900">
            {editingVendor ? `Edit Vendor (${editingVendor.id})` : 'Add New Partner Vendor'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="icon-btn icon-btn-sm text-neutral-400 hover:text-neutral-600"
            title="Close Modal"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-semibold text-neutral-700">Vendor Display Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Indo.Cab Premium"
                className="px-3 py-2 text-sm border border-neutral-200 rounded-xl outline-none focus:border-[#1B6B5C]"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
{/* 
            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-semibold text-neutral-700">Registered Company Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Indo.Cab Fleet Solutions"
                className="px-3 py-2 text-sm border border-neutral-200 rounded-xl outline-none focus:border-[#1B6B5C]"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              />
            </div> */}

            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-semibold text-neutral-700">Contact Person Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Budi Santoso"
                className="px-3 py-2 text-sm border border-neutral-200 rounded-xl outline-none focus:border-[#1B6B5C]"
                value={formData.contactPerson}
                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-semibold text-neutral-700">Email Address</label>
              <input
                type="email"
                required
                placeholder="budi@indocab.com"
                className="px-3 py-2 text-sm border border-neutral-200 rounded-xl outline-none focus:border-[#1B6B5C]"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-semibold text-neutral-700">Phone Number</label>
              <input
                type="text"
                required
                placeholder="+91 9876543210"
                className="px-3 py-2 text-sm border border-neutral-200 rounded-xl outline-none focus:border-[#1B6B5C]"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-semibold text-neutral-700">Operating Region / City</label>
              <select
                className="px-3 py-2 text-sm border border-neutral-200 rounded-xl outline-none focus:border-[#1B6B5C] bg-white"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              >
                <option value="Jakarta Metro">Jakarta Metro</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Bengaluru">Bengaluru</option>
                <option value="New York, NY">New York, NY</option>
                <option value="Jersey City, NJ">Jersey City, NJ</option>
                <option value="Newark, NJ">Newark, NJ</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-semibold text-neutral-700">Initial Fleet Size</label>
              <input
                type="number"
                min="1"
                required
                className="px-3 py-2 text-sm border border-neutral-200 rounded-xl outline-none focus:border-[#1B6B5C]"
                value={formData.fleetSize}
                onChange={(e) => setFormData({ ...formData, fleetSize: parseInt(e.target.value) || 1 })}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-semibold text-neutral-700">Commission Rate (%)</label>
              <input
                type="number"
                step="0.5"
                min="5"
                max="30"
                required
                className="px-3 py-2 text-sm border border-neutral-200 rounded-xl outline-none focus:border-[#1B6B5C]"
                value={formData.commissionRate}
                onChange={(e) => setFormData({ ...formData, commissionRate: parseFloat(e.target.value) || 10 })}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2.5 mt-2 pt-3 border-t border-neutral-100">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-neutral"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-submit"
            >
              {editingVendor ? 'Save Changes' : 'Create Vendor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
