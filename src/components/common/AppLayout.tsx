import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'
import './layout.css'

export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="app-shell">
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((c) => !c)}
      />
      <div
        style={{
          marginLeft: collapsed ? 64 : 256,
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          transition: 'margin-left 0.22s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <Header sidebarCollapsed={collapsed} onToggleSidebar={() => setCollapsed((c) => !c)} />
        <main className="main-content">
          <div className="page-wrapper ">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
