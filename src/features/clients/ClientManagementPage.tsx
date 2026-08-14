import React, { useState, useMemo, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePermission } from '@/hooks/usePermission'
import { clientApi } from '@/api/client.api'
import type { CorporateClient } from './types'
import { mapApiClient } from './types'
import ClientOverviewScreen from './components/ClientOverviewScreen'
import ClientOnboardingWizard from './components/ClientOnboardingWizard'
import ClientFormModal, { type ClientFormData } from './components/ClientFormModal'

/**
 * ClientManagementPage — rendered at /clients
 * Shows the clients list/overview. Navigates to /clients/:id for detail.
 */
function ClientManagementPageComponent() {
  const { hasPermission, isSuperAdmin } = usePermission()
  const canManageClients = isSuperAdmin || hasPermission('CLIENTS_MANAGE')
  const navigate = useNavigate()

  const [clients, setClients] = useState<CorporateClient[]>([])
  const [loading, setLoading] = useState(true)
  const [showOnboarding, setShowOnboarding] = useState(false)

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
        const rawList: any[] = Array.isArray(response)
          ? response
          : Array.isArray(response?.data)
          ? response.data
          : []

        if (isMounted && rawList.length > 0) {
          // Normalise raw API shape (uppercase status, snake_case) → CorporateClient
          setClients(rawList.map(mapApiClient))
        }
      } catch {
        console.info('Client API endpoint not active, using cached client directory fallback.')
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchClientsFromApi()
    return () => { isMounted = false }
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
      try {
        await clientApi.toggleStatus(id, targetStatus)
      } catch {
        // Local state already updated optimistically
      }
    },
    [canManageClients]
  )

  const handleClientAdded = useCallback((newClient: CorporateClient) => {
    setClients((prev) => [newClient, ...prev])
    setShowOnboarding(false)
    navigate(`/clients/${newClient.id}`)
  }, [navigate])

  const handleDeleteClient = useCallback(
    async (id: string | number) => {
      if (!canManageClients) return
      // TODO: Replace with an in-app confirmation modal
      if (!window.confirm('Are you sure you want to delete this corporate client account?')) return
      setClients((prev) => prev.filter((c) => String(c.id) !== String(id)))
      try {
        await clientApi.deleteClient(id)
      } catch {
        console.warn('Backend deleteClient API call returned error')
      }
    },
    [canManageClients]
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
      setEditingClient(null)

      try {
        await clientApi.updateClient(editingClient.id, updatedPayload)
      } catch {
        console.warn('Backend updateClient API call error')
      }
    },
    [canManageClients, editingClient, clientFormData]
  )

  const isNoClientsAvailable = !loading && clients.length === 0

  // Show onboarding wizard if no clients or explicitly triggered
  if (!loading && (isNoClientsAvailable || showOnboarding)) {
    return (
      <ClientOnboardingWizard
        onBackToOverview={() => setShowOnboarding(false)}
        onClientAdded={handleClientAdded}
      />
    )
  }

  return (
    <div className="flex flex-col gap-6 w-full h-full mx-auto flex-1">
      <ClientOverviewScreen
        clients={clients}
        filteredClients={filteredClients}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedCategoryFilter={selectedCategoryFilter}
        onCategoryFilterChange={setSelectedCategoryFilter}
        canManageClients={canManageClients}
        onAddClientClick={() => setShowOnboarding(true)}
        onClientDetailClick={(client) => navigate(`/clients/${client.id}`)}
        onToggleBlacklist={handleToggleBlacklist}
        onDeleteClient={handleDeleteClient}
        onEditClientClick={handleEditClientClick}
        isLoading={loading}
      />

      {/* Edit Client Modal */}
      {editingClient && (
        <ClientFormModal
          isOpen={true}
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
