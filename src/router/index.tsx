import { createBrowserRouter } from 'react-router-dom'
import AppLayout from '@/components/common/AppLayout'
import ProtectedRoute from '@/router/ProtectedRoute'
import { ROUTES, ROUTE_TITLES } from '@/constants/routes'

const PlaceholderPage = ({ path }: { path: string }) => {
  const title = ROUTE_TITLES[path] ?? 'Module'
  return (
    <div>
      <h2 style={{ marginBottom: '8px' }}>{title}</h2>
      <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
        This module is under construction.
      </p>
    </div>
  )
}

export const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2>Login Page Placeholder</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
          Please authenticate to access the admin portal.
        </p>
      </div>
    ),
  },
  {
    path: '/',
    element: <ProtectedRoute />, 
    children: [
      {
        element: <AppLayout />,
        children: [
          { index: true, element: <PlaceholderPage path={ROUTES.DASHBOARD} /> },

          // Client Management
          {
            element: <ProtectedRoute permission="CLIENTS_VIEW" />,
            children: [
              { path: ROUTES.CLIENTS.substring(1), element: <PlaceholderPage path={ROUTES.CLIENTS} /> },
            ],
          },

          // Vendor Management
          {
            element: <ProtectedRoute permission="VENDORS_VIEW" />,
            children: [
              { path: ROUTES.VENDORS.substring(1), element: <PlaceholderPage path={ROUTES.VENDORS} /> },
              { path: `${ROUTES.VENDORS.substring(1)}/:id`, element: <PlaceholderPage path={ROUTES.VENDORS} /> },
            ],
          },

          // Fleet Management (Drivers & Vehicles)
          {
            element: <ProtectedRoute permission="FLEET_VIEW" />,
            children: [
              { path: ROUTES.DRIVERS.substring(1), element: <PlaceholderPage path={ROUTES.DRIVERS} /> },
              { path: `${ROUTES.DRIVERS.substring(1)}/:id`, element: <PlaceholderPage path={ROUTES.DRIVERS} /> },
              { path: ROUTES.VEHICLES.substring(1), element: <PlaceholderPage path={ROUTES.VEHICLES} /> },
              { path: `${ROUTES.VEHICLES.substring(1)}/:id`, element: <PlaceholderPage path={ROUTES.VEHICLES} /> },
            ],
          },

          // Bookings
          {
            element: <ProtectedRoute permission="BOOKINGS_VIEW" />,
            children: [
              { path: ROUTES.BOOKINGS.substring(1), element: <PlaceholderPage path={ROUTES.BOOKINGS} /> },
              { path: `${ROUTES.BOOKINGS.substring(1)}/:id`, element: <PlaceholderPage path={ROUTES.BOOKINGS} /> },
            ],
          },

          // Dispatch Control
          {
            element: <ProtectedRoute permission="DISPATCH_CONTROL" />,
            children: [
              { path: ROUTES.DISPATCH.substring(1), element: <PlaceholderPage path={ROUTES.DISPATCH} /> },
            ],
          },

          // Live Tracking
          {
            element: <ProtectedRoute permission="LIVE_TRACKING" />,
            children: [
              { path: ROUTES.TRACKING.substring(1), element: <PlaceholderPage path={ROUTES.TRACKING} /> },
            ],
          },

          // Pricing Configuration
          {
            element: <ProtectedRoute permission="PRICING_MANAGE" />,
            children: [
              { path: ROUTES.PRICING.substring(1), element: <PlaceholderPage path={ROUTES.PRICING} /> },
            ],
          },

          // Billing & Settlements
          {
            element: <ProtectedRoute permission="BILLING_VIEW" />,
            children: [
              { path: ROUTES.BILLING.substring(1), element: <PlaceholderPage path={ROUTES.BILLING} /> },
              { path: ROUTES.SETTLEMENTS.substring(1), element: <PlaceholderPage path={ROUTES.SETTLEMENTS} /> },
            ],
          },

          // Reports
          {
            element: <ProtectedRoute permission="REPORTS_VIEW" />,
            children: [
              { path: ROUTES.REPORTS.substring(1), element: <PlaceholderPage path={ROUTES.REPORTS} /> },
            ],
          },

          // Audit Logs
          {
            element: <ProtectedRoute permission="AUDIT_VIEW" />,
            children: [
              { path: ROUTES.AUDIT.substring(1), element: <PlaceholderPage path={ROUTES.AUDIT} /> },
            ],
          },
        ],
      },
    ],
  },
])

