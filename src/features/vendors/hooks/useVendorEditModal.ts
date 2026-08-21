import { useState, useCallback } from 'react'
import type { Vendor } from '../types'

export interface VendorFormData {
  name: string
  // companyName: string
  profile_pic: string
  contactPerson: string
  email: string
  phone: string
  city: string
  fleetSize: number
  commissionRate: number
}

const initialFormData: VendorFormData = {
  name: '',
  // companyName: '',
  profile_pic:'',
  contactPerson: '',
  email: '',
  phone: '',
  city: '',
  fleetSize: 0,
  commissionRate: 0,
}

export function useVendorEditModal() {
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null)
  const [formData, setFormData] = useState<VendorFormData>(initialFormData)

  const handleEditVendorClick = useCallback((vendor: Vendor) => {
    setEditingVendor(vendor)
    setFormData({
      name: vendor.name || '',
      profile_pic:vendor.profile_pic || '',
      // companyName: vendor.companyName || '',
      contactPerson: vendor.contactPerson || '',
      email: vendor.email || '',
      phone: vendor.phone || '',
      city: vendor.city || '',
      fleetSize: vendor.fleetSize ?? 0,
      commissionRate: vendor.commissionRate ?? 0,
    })
  }, [])

  const closeEditModal = useCallback(() => {
    setEditingVendor(null)
  }, [])

  return {
    editingVendor,
    setEditingVendor,
    formData,
    setFormData,
    handleEditVendorClick,
    closeEditModal,
  }
}
