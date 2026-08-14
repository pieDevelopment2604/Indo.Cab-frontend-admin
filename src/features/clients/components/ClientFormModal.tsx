import React from 'react'
import type { CorporateClient } from '../types'
import { X } from '@/utils/icons'

export interface ClientFormData {
  companyName: string
  gstin: string
  contactPerson: string
  email: string
  phone: string
  city: string
  tierName: 'Enterprise Premium' | 'Corporate Standard' | 'Custom Rate'
  baseRatePerKm: number
  extraHourRate: number
  nightSurchargePercent: number
}

interface ClientFormModalProps {
  isOpen: boolean
  editingClient: CorporateClient | null
  formData: ClientFormData
  setFormData: React.Dispatch<React.SetStateAction<ClientFormData>>
  onClose: () => void
  onSubmit: (e: React.FormEvent) => void
}

export default function ClientFormModal({
  isOpen,
  editingClient,
  formData,
  setFormData,
  onClose,
  onSubmit
}: ClientFormModalProps) {
  if (!isOpen && !editingClient) return null

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn font-sans">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-neutral-200 flex flex-col gap-5">
        <div className="flex justify-between items-center border-b border-neutral-100 pb-3">
          <h3 className="text-lg font-bold text-neutral-900">
            {editingClient ? `Edit Corporate Client (${editingClient.id})` : 'Onboard New Corporate Client'}
          </h3>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600 cursor-pointer p-1">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="flex flex-col gap-1">
              <label className="font-semibold text-neutral-700">Company Name</label>
              <input
                type="text"
                required
                placeholder="e.g. ABC Company Ltd."
                className="px-3 py-2 text-sm border border-neutral-200 rounded-xl outline-none focus:border-[#1B6B5C]"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-semibold text-neutral-700">GSTIN / Reg Number</label>
              <input
                type="text"
                required
                placeholder="24AAAAA0000A1Z5"
                className="px-3 py-2 text-sm border border-neutral-200 rounded-xl outline-none focus:border-[#1B6B5C]"
                value={formData.gstin}
                onChange={(e) => setFormData({ ...formData, gstin: e.target.value })}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-semibold text-neutral-700">Contact Person</label>
              <input
                type="text"
                required
                placeholder="e.g. Rohan Sharma"
                className="px-3 py-2 text-sm border border-neutral-200 rounded-xl outline-none focus:border-[#1B6B5C]"
                value={formData.contactPerson}
                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-semibold text-neutral-700">Corporate Email</label>
              <input
                type="email"
                required
                placeholder="rohan@abccorp.com"
                className="px-3 py-2 text-sm border border-neutral-200 rounded-xl outline-none focus:border-[#1B6B5C]"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-semibold text-neutral-700">Phone Number</label>
              <input
                type="text"
                required
                placeholder="+91 9811122334"
                className="px-3 py-2 text-sm border border-neutral-200 rounded-xl outline-none focus:border-[#1B6B5C]"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-semibold text-neutral-700">City / Region</label>
              <input
                type="text"
                required
                placeholder="Ahmedabad"
                className="px-3 py-2 text-sm border border-neutral-200 rounded-xl outline-none focus:border-[#1B6B5C]"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-semibold text-neutral-700">Pricing Tier Contract</label>
              <select
                className="px-3 py-2 text-sm border border-neutral-200 rounded-xl outline-none focus:border-[#1B6B5C] bg-white"
                value={formData.tierName}
                onChange={(e) => setFormData({ ...formData, tierName: e.target.value as any })}
              >
                <option value="Enterprise Premium">Enterprise Premium</option>
                <option value="Corporate Standard">Corporate Standard</option>
                <option value="Custom Rate">Custom Rate</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-semibold text-neutral-700">Base Rate per KM (₹)</label>
              <input
                type="number"
                min="10"
                required
                className="px-3 py-2 text-sm border border-neutral-200 rounded-xl outline-none focus:border-[#1B6B5C]"
                value={formData.baseRatePerKm}
                onChange={(e) => setFormData({ ...formData, baseRatePerKm: parseFloat(e.target.value) || 18 })}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-semibold text-neutral-700">Extra Hour Rate (₹/hr)</label>
              <input
                type="number"
                min="50"
                required
                className="px-3 py-2 text-sm border border-neutral-200 rounded-xl outline-none focus:border-[#1B6B5C]"
                value={formData.extraHourRate}
                onChange={(e) => setFormData({ ...formData, extraHourRate: parseFloat(e.target.value) || 150 })}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-semibold text-neutral-700">Night Surcharge (%)</label>
              <input
                type="number"
                min="0"
                max="50"
                required
                className="px-3 py-2 text-sm border border-neutral-200 rounded-xl outline-none focus:border-[#1B6B5C]"
                value={formData.nightSurchargePercent}
                onChange={(e) => setFormData({ ...formData, nightSurchargePercent: parseFloat(e.target.value) || 15 })}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2.5 mt-2 pt-3 border-t border-neutral-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-600 hover:bg-neutral-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-xs font-bold bg-[#0D5C4D] hover:bg-[#094237] text-white transition-colors cursor-pointer"
            >
              {editingClient ? 'Save Changes' : 'Onboard Client'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
