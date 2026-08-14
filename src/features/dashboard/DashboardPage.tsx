import React, { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import OverviewTab from './components/OverviewTab'

function DashboardPageComponent() {
  const navigate = useNavigate()

  const handleNavigateToVendors = useCallback(() => {
    navigate('/vendors')
  }, [navigate])

  return (
    <div className="flex flex-col gap-6 w-full mx-auto">
      <OverviewTab onNavigateToVendors={handleNavigateToVendors} />
    </div>
  )
}

export default React.memo(DashboardPageComponent)
