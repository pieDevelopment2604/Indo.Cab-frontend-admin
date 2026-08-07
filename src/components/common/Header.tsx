import { Bell, Search, ChevronDown } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { ROUTE_TITLES } from '@/constants/routes'

interface HeaderProps {
  sidebarCollapsed: boolean
}

export default function Header({ sidebarCollapsed }: HeaderProps) {
  const location = useLocation()

  const pageTitle =
    Object.entries(ROUTE_TITLES).find(([path]) =>
      path === '/' ? location.pathname === '/' : location.pathname.startsWith(path)
    )?.[1] ?? 'Admin'

  return (
    <header
      className="topbar"
      style={{
        left: sidebarCollapsed ? 64 : 256
      }}
    >
      <div className="topbar-left">
        <h1 className="topbar-page-title">{pageTitle}</h1>
      </div>

      <div className="topbar-search">
        <Search size={14} className="topbar-search-icon" />
        <input
          type="text"
          placeholder="Search..."
          className="topbar-search-input"
        />
        <kbd className="topbar-search-kbd">⌘K</kbd>
      </div>

      <div className="topbar-right">
        <button className="topbar-icon-btn topbar-notif-btn" title="Notifications">
          <Bell size={16} strokeWidth={1.8} />
          <span className="topbar-notif-badge">3</span>
        </button>

        <div className="topbar-divider" />

        <button className="topbar-user-btn">
          <div className="topbar-avatar">SA</div>
          <div className="topbar-user-info">
            <span className="topbar-user-name">Super Admin</span>
            <span className="topbar-user-role">admin@indo.cab</span>
          </div>
          <ChevronDown size={14} strokeWidth={1.8} className="topbar-chevron" />
        </button>
      </div>
    </header>
  )
}
