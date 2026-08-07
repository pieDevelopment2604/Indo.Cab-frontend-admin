import { PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { NavLink, useLocation } from 'react-router-dom'
import { NAV_ITEMS, NAV_GROUPS } from '@/constants/navigation'

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const location = useLocation()

  return (
    <aside
      className="sidebar"
      style={{ width: collapsed ? 64 : 256 }}
    >
      <div className="sidebar-logo">
        <div className="sidebar-logo-mark">
          <span>IC</span>
        </div>
        {!collapsed && (
          <div className="sidebar-logo-text">
            <span className="sidebar-logo-title">Indo.Cab</span>
            <span className="sidebar-logo-sub">Operations</span>
          </div>
        )}
      </div>

      <nav className="sidebar-nav">
        {NAV_GROUPS.map(({ key, label }) => {
          const items = NAV_ITEMS.filter((n) => n.group === key)
          if (!items.length) return null
          return (
            <div key={key} className="sidebar-group">
              {!collapsed && label && (
                <span className="sidebar-group-label">{label}</span>
              )}
              {items.map((item) => {
                const isActive =
                  item.to === '/'
                    ? location.pathname === '/'
                    : location.pathname.startsWith(item.to)
                const Icon = item.icon
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === '/'}
                    title={collapsed ? item.label : undefined}
                    className={`sidebar-item ${isActive ? 'active' : ''} ${collapsed ? 'collapsed' : ''}`}
                  >
                    <Icon size={17} className="sidebar-item-icon" strokeWidth={isActive ? 2.2 : 1.8} />
                    {!collapsed && <span className="sidebar-item-label">{item.label}</span>}
                  </NavLink>
                )
              })}
            </div>
          )
        })}
      </nav>

      <div className="sidebar-footer">
        <button
          onClick={onToggle}
          className="sidebar-collapse-btn"
          title={collapsed ? 'Expand' : 'Collapse sidebar'}
        >
          {collapsed
            ? <PanelLeftOpen size={16} strokeWidth={1.8} />
            : <><PanelLeftClose size={16} strokeWidth={1.8} /><span>Collapse</span></>
          }
        </button>
      </div>
    </aside>
  )
}
