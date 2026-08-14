import React, { useState, useMemo, useCallback, useEffect } from 'react'
import { usePermission } from '@/hooks/usePermission'
import { vendorApi } from '@/api'
import type { Vendor } from './types'
import VendorOverviewScreen from './components/VendorOverviewScreen'
import VendorDetailScreen from './components/VendorDetailScreen'
import VendorFormModal from './components/VendorFormModal'
import VendorOnboardingWizard from './components/VendorOnboardingWizard'

function VendorManagementPageComponent() {
  const { hasPermission, isSuperAdmin } = usePermission()
  const canManageVendors = isSuperAdmin || hasPermission('VENDORS_MANAGE')

  // Screen View Mode: 'overview' | 'detail' | 'assign' | 'onboard'
  const [viewMode, setViewMode] = useState<'overview' | 'detail' | 'assign' | 'onboard'>('overview')
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null)

  // Vendors Data State & Loading Indicator (Initialized to empty array)
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all')

  // Modals state
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null)

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    city: '',
    fleetSize: 0,
    commissionRate: 0
  })

  // Fetch real vendors data from backend API on mount
  useEffect(() => {
    let isMounted = true
    const fetchVendorsData = async () => {
      setLoading(true)
      try {
        const res = await vendorApi.getVendors()
        const rawData = Array.isArray(res) ? res : (res as any).data || (res as any).vendors || []
        if (isMounted && Array.isArray(rawData)) {
          const mapped: Vendor[] = rawData.map((item: any, idx: number) => {
            const firstName = item.first_name || ''
            const lastName = item.last_name || ''
            const fullName = `${firstName} ${lastName}`.trim()
            const contact = fullName || item.contact_person || item.contactPerson || item.email || ''
            const vendorName = item.company_name || item.name || fullName || 'Vendor Partner'

            return {
              id: String(item.vendor_id ?? item.user_id ?? item.id ?? idx + 1),
              name: vendorName,
              companyName: item.company_name || vendorName,
              contactPerson: contact,
              firstName,
              lastName,
              email: item.email || '',
              phone: item.mobile_number || item.phone || '',
              city: item.address || (Array.isArray(item.operating_cities) && item.operating_cities[0]) || '',
              fleetSize: Number(item.fleet_size || item.fleetSize || 0),
              activeCars: Number(item.active_cars || item.activeCars || 0),
              idleCars: Number(item.idle_cars || item.idleCars || 0),
              commissionRate: Number(item.commission_rate || item.commissionRate || 0),
              rating: Number(item.rating || 0),
              acceptanceRate: Number(item.acceptance_rate || item.acceptanceRate || 0),
              cancellationRate: Number(item.cancellation_rate || item.cancellationRate || 0),
              completionRate: Number(item.completion_rate || item.completionRate || 0),
              status: (['active', 'pending', 'suspended', 'blacklisted'].includes(item.status?.toLowerCase())
                ? item.status.toLowerCase()
                : 'active') as any,
              joinDate: item.created_at
                ? new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
                : item.joinDate || '',
              logo: item.profile_image_url || item.logo || undefined,
              gstNumber: item.gst_number || undefined,
              panNumber: item.pan_number || undefined,
              licenseNumber: item.license_number || undefined,
              vehicleCategories: Array.isArray(item.vehicle_categories) ? item.vehicle_categories : [],
              operatingCities: Array.isArray(item.operating_cities) ? item.operating_cities : []
            }
          })
          setVendors(mapped)
          if (mapped.length > 0) {
            setSelectedVendor(mapped[0])
          }
        }
      } catch (err) {
        console.warn('Backend vendor API fetch returned error:', err)
        if (isMounted) setVendors([])
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchVendorsData()
    return () => {
      isMounted = false
    }
  }, [])

  // Memoized filter vendors logic
  const filteredVendors = useMemo(() => {
    const query = searchTerm.toLowerCase().trim()
    return vendors.filter((v) => {
      const matchesSearch =
        !query ||
        v.name.toLowerCase().includes(query) ||
        v.companyName.toLowerCase().includes(query) ||
        v.contactPerson.toLowerCase().includes(query) ||
        v.email.toLowerCase().includes(query) ||
        v.city.toLowerCase().includes(query) ||
        v.id.toLowerCase().includes(query)

      const matchesStatus =
        selectedStatusFilter === 'all' || v.status === selectedStatusFilter

      return matchesSearch && matchesStatus
    })
  }, [vendors, searchTerm, selectedStatusFilter])

  // Handlers
  const handleOpenDetail = useCallback((vendor: Vendor) => {
    setSelectedVendor(vendor)
    setViewMode('detail')
  }, [])

  const handleVendorAdded = useCallback((newVendor: Vendor) => {
    setVendors((prev) => [newVendor, ...prev])
    setSelectedVendor(newVendor)
  }, [])

  const handleApproveVendor = useCallback(
    async (id: string) => {
      if (!canManageVendors) return
      setVendors((prev) =>
        prev.map((v) => (v.id === id ? { ...v, status: 'active' } : v))
      )
      setSelectedVendor((prev) => (prev && prev.id === id ? { ...prev, status: 'active' } : prev))
      try {
        await vendorApi.toggleStatus(id, 'active')
      } catch (err) {
        console.warn('Backend toggleStatus API call failed, kept local state update:', err)
      }
    },
    [canManageVendors]
  )

  const handleSuspendToggle = useCallback(
    async (id: string) => {
      if (!canManageVendors) return
      let targetStatus = 'suspended'
      setVendors((prev) =>
        prev.map((v) => {
          if (v.id === id) {
            const nextStatus = v.status === 'suspended' ? 'active' : 'suspended'
            targetStatus = nextStatus
            return { ...v, status: nextStatus }
          }
          return v
        })
      )
      setSelectedVendor((prev) => {
        if (prev && prev.id === id) {
          return { ...prev, status: prev.status === 'suspended' ? 'active' : 'suspended' }
        }
        return prev
      })
      try {
        await vendorApi.toggleStatus(id, targetStatus)
      } catch (err) {
        console.warn('Backend toggleStatus API call failed, kept local state update:', err)
      }
    },
    [canManageVendors]
  )

  const handleDeleteVendor = useCallback(
    async (id: string) => {
      if (!canManageVendors) return
      if (!window.confirm('Are you sure you want to delete this vendor partner?')) return

      setVendors((prev) => prev.filter((v) => String(v.id) !== String(id)))
      if (selectedVendor && String(selectedVendor.id) === String(id)) {
        setViewMode('overview')
        setSelectedVendor(null)
      }

      try {
        await vendorApi.deleteVendor(id)
      } catch (err) {
        console.warn('Backend deleteVendor API call returned error:', err)
      }
    },
    [canManageVendors, selectedVendor]
  )

  const handleSaveVendor = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      if (!canManageVendors) return

      if (editingVendor) {
        setVendors((prev) =>
          prev.map((v) => (v.id === editingVendor.id ? { ...v, ...formData } : v))
        )
        setSelectedVendor((prev) => (prev && prev.id === editingVendor.id ? { ...prev, ...formData } : prev))
        setEditingVendor(null)
        try {
          await vendorApi.updateVendor(editingVendor.id, formData)
        } catch (err) {
          console.warn('Backend updateVendor API call failed, kept local update:', err)
        }
      }
    },
    [canManageVendors, editingVendor, formData]
  )

  const handleCloseModal = useCallback(() => {
    setEditingVendor(null)
  }, [])

  return (
    <div className="flex flex-col gap-6 w-full mx-auto font-sans min-h-screen relative">
      {/* Onboarding Wizard View Mode */}
      {!loading && viewMode === 'onboard' && (
        <VendorOnboardingWizard
          onBackToOverview={() => setViewMode('overview')}
          onVendorAdded={handleVendorAdded}
        />
      )}

      {/* Screen Views */}
      {viewMode !== 'onboard' && (
        <VendorOverviewScreen
          vendors={vendors}
          filteredVendors={filteredVendors}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedStatusFilter={selectedStatusFilter}
          onStatusFilterChange={setSelectedStatusFilter}
          canManageVendors={canManageVendors}
          onAddVendorClick={() => setViewMode('onboard')}
          onVendorDetailClick={handleOpenDetail}
          onSuspendToggle={handleSuspendToggle}
          onDeleteVendor={handleDeleteVendor}
          isLoading={loading}
        />
      )}

      {/* Vendor Detail Drawer */}
      {selectedVendor && viewMode === 'detail' && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs transition-opacity duration-300">
          <div className="w-[600px] h-full bg-white shadow-2xl animate-slideInRight overflow-y-auto">
            <VendorDetailScreen
              selectedVendor={selectedVendor}
              canManageVendors={canManageVendors}
              onBackToOverview={() => {
                setViewMode('overview')
                setSelectedVendor(null)
              }}
              onSuspendToggle={handleSuspendToggle}
              onApproveVendor={handleApproveVendor}
              onDeleteVendor={handleDeleteVendor}
            />
          </div>
        </div>
      )}

      {/* Edit Vendor Modal */}
      {editingVendor && (
        <VendorFormModal
          isOpen={editingVendor !== null}
          editingVendor={editingVendor}
          formData={formData}
          setFormData={setFormData}
          onClose={handleCloseModal}
          onSubmit={handleSaveVendor}
        />
      )}
    </div>
  )
}

export default React.memo(VendorManagementPageComponent)
