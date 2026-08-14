import React, { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { ViewModeTabs } from '@/components/common'
import OverviewTab from './components/OverviewTab'
import DispatchTab from './components/DispatchTab'
import LiveTrackingTab from './components/LiveTrackingTab'
import NewBookingModal from './components/NewBookingModal'
import { type IncomingBooking, SAMPLE_INCOMING_BOOKINGS } from './types'

type DashboardTabId = 'overview' | 'dispatch' | 'tracking'

const DASHBOARD_TABS: Array<{ id: DashboardTabId; label: string }> = [
  { id: 'overview', label: 'Fleet Overview' },
  { id: 'dispatch', label: 'Dispatch Dashboard' },
  { id: 'tracking', label: 'Live Tracking Map' }
]

function DashboardPageComponent() {
  const navigate = useNavigate()

  // Tab State
  const [activeTab, setActiveTab] = useState<DashboardTabId>('overview')

  // Incoming Bookings Data State
  const [incomingBookings, setIncomingBookings] = useState<IncomingBooking[]>(SAMPLE_INCOMING_BOOKINGS)

  // Booking Modal state
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)

  const handleCreateBooking = useCallback((newBooking: IncomingBooking) => {
    setIncomingBookings((prev) => [newBooking, ...prev])
  }, [])

  const handleDeleteBooking = useCallback((id: string) => {
    setIncomingBookings((prev) => prev.filter((b) => b.id !== id))
  }, [])

  const handleAssignVendorRedirect = useCallback(() => {
    navigate('/vendors')
  }, [navigate])

  const handleNavigateToVendors = useCallback(() => {
    navigate('/vendors')
  }, [navigate])

  const handleOpenBookingModal = useCallback(() => {
    setIsBookingModalOpen(true)
  }, [])

  const handleCloseBookingModal = useCallback(() => {
    setIsBookingModalOpen(false)
  }, [])

  return (
    <div className="flex flex-col gap-6 p-6 w-full mx-auto font-sans min-h-screen">
      {/* Top Navigation View Switcher (Using ViewModeTabs component) */}
      <ViewModeTabs
        tabs={DASHBOARD_TABS}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        badgeText="Logistics Command Center"
      />

      {/* Screen Views */}
      {activeTab === 'overview' && (
        <OverviewTab onNavigateToVendors={handleNavigateToVendors} />
      )}

      {activeTab === 'dispatch' && (
        <DispatchTab
          incomingBookings={incomingBookings}
          onManualBookingClick={handleOpenBookingModal}
          onAssignVendorClick={handleAssignVendorRedirect}
          onDeleteBooking={handleDeleteBooking}
        />
      )}

      {activeTab === 'tracking' && <LiveTrackingTab />}
    </div>
  )
}

export default React.memo(DashboardPageComponent)
