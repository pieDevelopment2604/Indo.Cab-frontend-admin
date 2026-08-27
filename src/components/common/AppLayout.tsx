import { useState, useEffect, useRef, useCallback } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'
import RightSidebarDrawer from './RightSidebarDrawer'
import './layout.css'

export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const [isRightDrawerOpen, setIsRightDrawerOpen] = useState(false)
  const location = useLocation()
  const mainContentRef = useRef<HTMLElement>(null)

  // Reset scroll position on route change
  useEffect(() => {
    if (mainContentRef.current) {
      mainContentRef.current.scrollTo({ top: 0, behavior: 'instant' })
    }
  }, [location.pathname])

  const sidebarWidth = collapsed ? 64 : 256

  const handleToggleRightDrawer = useCallback(() => {
    setIsRightDrawerOpen((prev) => !prev)
  }, [])

  const handleCloseRightDrawer = useCallback(() => {
    setIsRightDrawerOpen(false)
  }, [])

  return (
    <div
      className="app-shell"
      style={
        {
          '--sidebar-offset': `${sidebarWidth}px`,
          '--header-left-offset': `${sidebarWidth}px`,
        } as React.CSSProperties
      }
    >
      {/* Desktop Sidebar (hidden on tablet & mobile) */}
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((c) => !c)}
      />

      {/* Main App Content Area */}
      <div className="app-main-wrapper">
        <Header
          sidebarCollapsed={collapsed}
          onToggleSidebar={() => setCollapsed((c) => !c)}
          isRightDrawerOpen={isRightDrawerOpen}
          onToggleRightDrawer={handleToggleRightDrawer}
        />
        <main className="main-content" ref={mainContentRef}>
          <div className="page-wrapper">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Right-Side Navigation Drawer (Mobile, Tablet & Profile Click) */}
      <RightSidebarDrawer
        isOpen={isRightDrawerOpen}
        onClose={handleCloseRightDrawer}
      />
    </div>
  )
}

