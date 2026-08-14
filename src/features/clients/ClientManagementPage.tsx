import React, { useState, useMemo, useCallback, useEffect } from 'react'
import { usePermission } from '@/hooks/usePermission'
import { clientApi } from '@/api/Client.api'
import type { CorporateClient } from './types'
import { INITIAL_CLIENTS } from './types'
import ClientOverviewScreen from './components/ClientOverviewScreen'
import ClientDetailScreen from './components/ClientDetailScreen'
import ClientOnboardingWizard from './components/ClientOnboardingWizard'
import ClientFormModal, { type ClientFormData } from './components/ClientFormModal'

function ClientManagementPageComponent() {
  const { hasPermission, isSuperAdmin } = usePermission()
  const canManageClients = isSuperAdmin || hasPermission('CLIENTS_MANAGE')

  // Screen View Mode: 'overview' | 'onboard' | 'detail'
  const [clients, setClients] = useState<CorporateClient[]>(INITIAL_CLIENTS)
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'overview' | 'onboard' | 'detail'>('overview')
  const [selectedClient, setSelectedClient] = useState<CorporateClient | null>(
    INITIAL_CLIENTS[0] ?? null
  )

  // Edit Modal State
  const [editingClient, setEditingClient] = useState<CorporateClient | null>(null)
  const [clientFormData, setClientFormData] = useState<ClientFormData>({
    companyName: '',
    gstin: '',
    contactPerson: '',
    email: '',
    phone: '',
    city: '',
    tierName: 'Corporate Standard',
    baseRatePerKm: 18,
    extraHourRate: 150,
    nightSurchargePercent: 15
  })

  // Filters State
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all')

  // Fetch clients from API on mount
  useEffect(() => {
    let isMounted = true
    const fetchClientsFromApi = async () => {
      try {
        setLoading(true)
        const response: any = await clientApi.getClients()
        const fetchedList = Array.isArray(response)
          ? response
          : response?.data && Array.isArray(response.data)
          ? response.data
          : null

        if (isMounted && fetchedList && fetchedList.length > 0) {
          setClients(fetchedList)
          setSelectedClient(fetchedList[0])
        }
      } catch (err) {
        // Log & gracefully retain INITIAL_CLIENTS fallback if backend API is offline
        console.info('Client API endpoint not active, using cached client directory fallback.')
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchClientsFromApi()
    return () => {
      isMounted = false
    }
  }, [])

  // Memoized filter clients logic
  const filteredClients = useMemo(() => {
    const query = searchTerm.toLowerCase().trim()
    return clients.filter((c) => {
      const companyName = String(c.company_name || c.companyName || '').toLowerCase()
      const gstin = String(c.gst_number || c.gstin || '').toLowerCase()
      const contactPerson = String(c.contact_person || c.contactPerson || '').toLowerCase()
      const city = String(c.address || '').toLowerCase()
      const id = String(c.id ?? '').toLowerCase()

      const matchesSearch =
        !query ||
        companyName.includes(query) ||
        gstin.includes(query) ||
        contactPerson.includes(query) ||
        city.includes(query) ||
        id.includes(query)

      const matchesCategory =
        selectedCategoryFilter === 'all' || c.category === selectedCategoryFilter

      return matchesSearch && matchesCategory
    })
  }, [clients, searchTerm, selectedCategoryFilter])

  // Handlers
  const handleOpenDetail = useCallback((client: CorporateClient) => {
    setSelectedClient(client)
    setViewMode('detail')
  }, [])

  const handleToggleBlacklist = useCallback(
    async (id: string | number) => {
      if (!canManageClients) return

      let targetStatus = 'suspended'
      setClients((prev) =>
        prev.map((c) => {
          if (String(c.id) === String(id)) {
            targetStatus = c.status === 'suspended' || c.status === 'blacklisted' ? 'active' : 'suspended'
            return { ...c, status: targetStatus as any }
          }
          return c
        })
      )
      setSelectedClient((prev) => {
        if (prev && String(prev.id) === String(id)) {
          return { ...prev, status: targetStatus as any }
        }
        return prev
      })

      try {
        await clientApi.toggleStatus(id, targetStatus)
      } catch (err) {
        // Local state already updated
      }
    },
    [canManageClients]
  )

  const handleClientAdded = useCallback((newClient: CorporateClient) => {
    setClients((prev) => [newClient, ...prev])
  }, [])

  const handleDeleteClient = useCallback(
    async (id: string | number) => {
      if (!canManageClients) return
      if (!window.confirm('Are you sure you want to delete this corporate client account?')) return

      setClients((prev) => prev.filter((c) => String(c.id) !== String(id)))
      if (selectedClient && String(selectedClient.id) === String(id)) {
        setViewMode('overview')
        setSelectedClient(null)
      }

      try {
        await clientApi.deleteClient(id)
      } catch (err) {
        console.warn('Backend deleteClient API call returned error:', err)
      }
    },
    [canManageClients, selectedClient]
  )

  const handleEditClientClick = useCallback((client: CorporateClient) => {
    setEditingClient(client)
    setClientFormData({
      companyName: client.companyName || client.company_name || '',
      gstin: client.gstin || client.gst_number || '',
      contactPerson: client.contactPerson || client.contact_person || '',
      email: client.email || '',
      phone: client.phone || client.mobile_number || '',
      city: client.address || (client.operating_cities && client.operating_cities[0]) || '',
      tierName: client.contract?.tierName || 'Corporate Standard',
      baseRatePerKm: client.contract?.baseRatePerKm ?? 18,
      extraHourRate: client.contract?.extraHourRate ?? 150,
      nightSurchargePercent: client.contract?.nightSurchargePercent ?? 15
    })
  }, [])

  const handleSaveClientEdit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      if (!canManageClients || !editingClient) return

      const updatedPayload: Partial<CorporateClient> = {
        companyName: clientFormData.companyName,
        company_name: clientFormData.companyName,
        gstin: clientFormData.gstin,
        gst_number: clientFormData.gstin,
        contactPerson: clientFormData.contactPerson,
        contact_person: clientFormData.contactPerson,
        email: clientFormData.email,
        phone: clientFormData.phone,
        mobile_number: clientFormData.phone,
        address: clientFormData.city,
        contract: {
          ...editingClient.contract,
          id: editingClient.contract?.id || `CNT-${Math.floor(100 + Math.random() * 900)}`,
          tierName: clientFormData.tierName,
          baseRatePerKm: clientFormData.baseRatePerKm,
          extraHourRate: clientFormData.extraHourRate,
          nightSurchargePercent: clientFormData.nightSurchargePercent,
          tollPolicy: editingClient.contract?.tollPolicy || 'Billed to Client',
          contractStart: editingClient.contract?.contractStart || 'Aug 01, 2026',
          contractEnd: editingClient.contract?.contractEnd || 'Jul 31, 2027',
          status: editingClient.contract?.status || 'Active'
        }
      }

      setClients((prev) =>
        prev.map((c) => (String(c.id) === String(editingClient.id) ? { ...c, ...updatedPayload } : c))
      )
      setSelectedClient((prev) => (prev && String(prev.id) === String(editingClient.id) ? { ...prev, ...updatedPayload } : prev))
      setEditingClient(null)

      try {
        await clientApi.updateClient(editingClient.id, updatedPayload)
      } catch (err) {
        console.warn('Backend updateClient API call error:', err)
      }
    },
    [canManageClients, editingClient, clientFormData]
  )

  const handleUpdateClient = useCallback(
    async (id: string | number, updatedData: Partial<CorporateClient>) => {
      if (!canManageClients) return

      setClients((prev) =>
        prev.map((c) => (String(c.id) === String(id) ? { ...c, ...updatedData } : c))
      )
      setSelectedClient((prev) => (prev && String(prev.id) === String(id) ? { ...prev, ...updatedData } : prev))

      try {
        await clientApi.updateClient(id, updatedData)
      } catch (err) {
        console.warn('Backend updateClient API call returned error:', err)
      }
    },
    [canManageClients]
  )

  // Check empty state requirement: if no clients exist in state, present "Add New Client" onboarding screen directly!
  const isNoClientsAvailable = !loading && clients.length === 0

  return (
    <div className="flex flex-col gap-6 p-6 w-full mx-auto font-sans min-h-screen">
      {/* If no clients available or explicitly navigating to onboard wizard */}
      {!loading && (isNoClientsAvailable || viewMode === 'onboard') && (
        <ClientOnboardingWizard
          onBackToOverview={() => {
            if (clients.length > 0) {
              setViewMode('overview')
            }
          }}
          onClientAdded={handleClientAdded}
        />
      )}

      {/* Main Manage Clients Overview Dashboard */}
      { !isNoClientsAvailable && viewMode === 'overview' && (
        <ClientOverviewScreen
          clients={clients}
          filteredClients={filteredClients}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedCategoryFilter={selectedCategoryFilter}
          onCategoryFilterChange={setSelectedCategoryFilter}
          canManageClients={canManageClients}
          onAddClientClick={() => setViewMode('onboard')}
          onClientDetailClick={handleOpenDetail}
          onToggleBlacklist={handleToggleBlacklist}
          onDeleteClient={handleDeleteClient}
          onEditClientClick={handleEditClientClick}
        />
      )}

      {/* Detail Screen */}
      {!loading && !isNoClientsAvailable && viewMode === 'detail' && selectedClient && (
        <ClientDetailScreen
          client={selectedClient}
          canManageClients={canManageClients}
          onBackToOverview={() => setViewMode('overview')}
          onToggleBlacklist={handleToggleBlacklist}
          onDeleteClient={handleDeleteClient}
          onEditClientClick={handleEditClientClick}
        />
      )}

      {/* Edit Corporate Client Modal */}
      {editingClient && (
        <ClientFormModal
          isOpen={editingClient !== null}
          editingClient={editingClient}
          formData={clientFormData}
          setFormData={setClientFormData}
          onClose={() => setEditingClient(null)}
          onSubmit={handleSaveClientEdit}
        />
      )}
    </div>
  )
}

export default React.memo(ClientManagementPageComponent)
