import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { LogOut, User, Settings, ChevronUp, PanelLeft, HelpCircle } from '@/utils/icons'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { clearAuth } from '@/store/authSlice'
import { NAV_ITEMS, NAV_GROUPS } from '@/constants/navigation'

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

const PROFILE_MENU_ITEMS = [
  { label: 'Profile Settings', icon: User, path: '/profile' },
  { label: 'Organization Settings', icon: Settings, path: '/settings' },
  { label: 'Support & Help', icon: HelpCircle, path: '/support' },
]

function SidebarComponent({ collapsed, onToggle }: SidebarProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [isLogoHovered, setIsLogoHovered] = useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const handleLogout = useCallback(() => {
    setIsProfileMenuOpen(false)
    dispatch(clearAuth())
    navigate('/login')
  }, [dispatch, navigate])

  const handleAction = useCallback(
    (path?: string) => {
      setIsProfileMenuOpen(false)
      if (path) {
        navigate(path)
      }
    },
    [navigate]
  )

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false)
      }
    }

    if (isProfileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isProfileMenuOpen])

  // Memoize nav groups to prevent redundant iterations
  const navGroupsRender = useMemo(() => {
    return NAV_GROUPS.map(({ key, label }) => {
      const items = NAV_ITEMS.filter((n) => n.group === key)
      if (!items.length) return null
      return (
        <div key={key} className="sidebar-group">
          {!collapsed && label && <span className="sidebar-group-label">{label}</span>}
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
    })
  }, [collapsed, location.pathname])

  const handleSidebarClick = (e: React.MouseEvent) => {
    if (!collapsed) return
    const target = e.target as HTMLElement
    if (
      target.closest('.sidebar-item') ||
      target.closest('[data-profile-section]')
    ) {
      return
    }
    onToggle()
  }

  return (
    <aside
      className={`sidebar ${collapsed ? 'cursor-pointer' : ''}`}
      onClick={handleSidebarClick}
      style={{
        width: collapsed ? 64 : 256,
        transition: 'width 0.22s cubic-bezier(0.4, 0, 0.2, 1)'
      }}
    >
      {/* Sidebar Top Header */}
      <div className="sidebar-logo flex items-center justify-between px-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            type="button"
            onClick={collapsed ? onToggle : undefined}
            onMouseEnter={() => collapsed && setIsLogoHovered(true)}
            onMouseLeave={() => setIsLogoHovered(false)}
            className={`sidebar-logo-mark shrink-0 transition-all duration-200 border-0 p-0 flex items-center justify-center ${
              collapsed ? 'cursor-pointer' : 'cursor-default'
            }`}
            title={collapsed ? 'Expand sidebar' : undefined}
          >
            {collapsed && isLogoHovered ? (
              <PanelLeft size={16} strokeWidth={2.2} />
            ) : (
              <span>IC</span>
            )}
          </button>

          {!collapsed && (
            <div className="sidebar-logo-text leading-tight">
              <span className="sidebar-logo-title">Indo Cab</span>
              <span className="sidebar-logo-sub">Super Admin</span>
            </div>
          )}
        </div>

        {!collapsed && (
          <button
            type="button"
            onClick={onToggle}
            className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer shrink-0"
            title="Collapse sidebar"
          >
            <PanelLeft size={18} strokeWidth={1.8} />
          </button>
        )}
      </div>

      {/* Navigation Items */}
      <nav className="sidebar-nav">{navGroupsRender}</nav>

      {/* Profile Card at Sidebar Bottom */}
      <div
        data-profile-section
        className="border-t border-neutral-200/80 p-2 flex flex-col gap-2 relative cursor-default"
        ref={menuRef}
      >
        {/* Profile Popover Menu */}
        {isProfileMenuOpen && (
          <div
            className={`absolute bottom-[calc(100%+6px)] left-2 right-2 bg-white border border-neutral-200 rounded-lg shadow-xl z-50 animate-fadeIn flex flex-col gap-1 ${
              collapsed ? 'p-1.5 items-center' : 'p-2'
            }`}
          >
            {!collapsed && (
              <div className="p-2 border-b border-neutral-100 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#0D5C4D] text-white font-extrabold text-xs flex items-center justify-center">
                  SA
                </div>
                <div className="flex flex-col min-w-0 text-left">
                  <span className="font-bold text-xs text-neutral-900 truncate">Super Admin</span>
                  <span className="text-[10px] text-neutral-400 truncate">admin@indo.cab</span>
                </div>
              </div>
            )}

            {PROFILE_MENU_ITEMS.map(({ label, icon: Icon, path }) => (
              <button
                key={path}
                type="button"
                onClick={() => handleAction(path)}
                title={collapsed ? label : undefined}
                className={`w-full rounded-lg transition-colors cursor-pointer text-left flex items-center gap-2.5 ${
                  collapsed
                    ? 'p-2 justify-center text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                    : 'px-3 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-100'
                }`}
              >
                <Icon size={collapsed ? 16 : 14} className={collapsed ? '' : 'text-neutral-500'} />
                {!collapsed && <span>{label}</span>}
              </button>
            ))}

            <div className={`bg-neutral-100 ${collapsed ? 'w-full h-px my-0.5' : 'h-px my-0.5'}`} />

            <button
              type="button"
              onClick={handleLogout}
              title={collapsed ? 'Log Out' : undefined}
              className={`btn btn-delete w-full ${
                collapsed ? 'p-1.5 justify-center' : 'justify-start'
              }`} 
            >
              <LogOut size={collapsed ? 16 : 14} />
              {!collapsed && <span>Log Out</span>}
            </button>
          </div>
        )}

        {/* Profile Card Button */}
        <button
          onClick={() => setIsProfileMenuOpen((prev) => !prev)}
          className={`w-full p-2 rounded-lg border transition-all cursor-pointer flex items-center text-left group ${
            collapsed ? 'justify-center ' : 'justify-between '
          } ${
            isProfileMenuOpen
              ? 'bg-neutral-100 border-neutral-300'
              : 'bg-neutral-50/80 hover:bg-neutral-100 border-neutral-200/80'
          }`}
          title={collapsed ? 'Admin Profile' : undefined}
        >
          <div className="flex items-center min-w-0">
            <div className="w-8 h-8 rounded-lg bg-[#0D5C4D] text-white font-extrabold text-xs flex items-center justify-center shrink-0 shadow-2xs">
              SA
            </div>
            <div className={`flex flex-col leading-tight overflow-hidden transition-all duration-300 ${collapsed ? 'max-w-0 opacity-0 ml-0' : 'max-w-[150px] opacity-100 ml-2.5'}`}>
              <span className="font-bold text-xs text-neutral-900 group-hover:text-[#1B6B5C] transition-colors truncate whitespace-nowrap">
                Admin Profile
              </span>
              <span className="text-[10px] font-semibold text-neutral-400 truncate whitespace-nowrap">
                Manage organization
              </span>
            </div>
          </div>

          <ChevronUp
            size={12}
            className={`text-neutral-400 group-hover:text-neutral-600 shrink-0 transition-all duration-300 ${
              isProfileMenuOpen ? 'rotate-180' : '' 
            } ${collapsed ? 'w-0 opacity-0 overflow-hidden' : 'w-3 opacity-100'}`}
          />
        </button>
      </div>
    </aside>
  )
}

export default React.memo(SidebarComponent)
