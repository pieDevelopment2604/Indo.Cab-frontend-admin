import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { usePermission } from '@/hooks/usePermission'
import { vendorApi } from '@/api'
import { mapApiVendor } from './types'
import type { Vendor } from './types'
import VendorDetailScreen from './components/VendorDetailScreen'
import VendorFormModal from './components/VendorFormModal'

/**
 * VendorDetailPage — standalone page for /vendors/:id
 * Uses getVendorById for a direct, efficient single-record fetch.
 * All raw API data is normalised through mapApiVendor() before reaching the UI.
 */
export default function VendorDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { hasPermission, isSuperAdmin } = usePermission()
  const canManageVendors = isSuperAdmin || hasPermission('VENDORS_MANAGE')

  const [vendor, setVendor] = useState<Vendor | null>(null)
  const [loading, setLoading] = useState(true)

  // Edit modal state
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    city: '',
    fleetSize: 0,
    commissionRate: 0,
  })

  useEffect(() => {
    let isMounted = true

    const fetchVendor = async () => {
      setLoading(true)
      try {
        // Use dedicated getVendorById — avoids fetching the whole list
        const raw: any = await vendorApi.getVendorById(id!)
        if (isMounted) {
          if (raw && (raw.id || raw.vendor_id || raw.user_id)) {
            setVendor(mapApiVendor(raw))
          } else {
            navigate('/vendors', { replace: true })
          }
        }
      } catch {
        if (isMounted) navigate('/vendors', { replace: true })
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    if (id) fetchVendor()
    return () => { isMounted = false }
  }, [id, navigate])

  const handleSuspendToggle = async (vendorId: string) => {
    if (!canManageVendors || !vendor) return
    const newStatus = vendor.status === 'suspended' ? 'active' : 'suspended'
    setVendor((prev) => prev ? { ...prev, status: newStatus as any } : prev)
    try {
      await vendorApi.toggleStatus(vendorId, newStatus)
    } catch {
      console.warn('SuspendToggle API call failed')
    }
  }

  const handleApproveVendor = async (vendorId: string) => {
    if (!canManageVendors) return
    setVendor((prev) => prev ? { ...prev, status: 'active' as any } : prev)
    try {
      await vendorApi.toggleStatus(vendorId, 'active')
    } catch {
      console.warn('ApproveVendor API call failed')
    }
  }

  const handleDeleteVendor = async (vendorId: string) => {
    if (!canManageVendors) return
    // TODO: Replace with an in-app confirmation modal
    if (!window.confirm('Are you sure you want to delete this vendor partner?')) return
    try {
      await vendorApi.deleteVendor(vendorId)
    } catch {
      console.warn('Delete API call failed')
    }
    navigate('/vendors')
  }

  const handleEditVendorClick = (v: Vendor) => {
    setEditingVendor(v)
    setFormData({
      name:          v.name          || '',
      companyName:   v.companyName   || '',
      contactPerson: v.contactPerson || '',
      email:         v.email         || '',
      phone:         v.phone         || '',
      city:          v.city          || '',
      fleetSize:     v.fleetSize     ?? 0,
      commissionRate: v.commissionRate ?? 0,
    })
  }

  const handleSaveVendorEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canManageVendors || !editingVendor) return
    const updatedPayload: Partial<Vendor> = { ...formData }
    setVendor((prev) => prev ? { ...prev, ...updatedPayload } : prev)
    setEditingVendor(null)
    try {
      await vendorApi.updateVendor(editingVendor.id, updatedPayload)
    } catch {
      console.warn('Update API call failed')
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-4 p-6 animate-pulse">
        <div className="h-8 bg-neutral-100 rounded-lg w-40" />
        <div className="h-32 bg-neutral-100 rounded-lg" />
        <div className="grid grid-cols-2 gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-neutral-100 rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  if (!vendor) return null

  return (
    <>
      <VendorDetailScreen
        selectedVendor={vendor}
        canManageVendors={canManageVendors}
        onBackToOverview={() => navigate('/vendors')}
        onSuspendToggle={handleSuspendToggle}
        onApproveVendor={handleApproveVendor}
        onDeleteVendor={handleDeleteVendor}
        onEditVendorClick={handleEditVendorClick}
      />
      {editingVendor && (
        <VendorFormModal
          isOpen={true}
          editingVendor={editingVendor}
          formData={formData}
          setFormData={setFormData}
          onClose={() => setEditingVendor(null)}
          onSubmit={handleSaveVendorEdit}
        />
      )}
    </>
  )
}
