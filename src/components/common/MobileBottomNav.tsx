import React, { useState, useEffect, useCallback } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { clearAuth } from '@/store/authSlice'
import {
  LayoutDashboard,
  Navigation2,
  MapPin,
  UserCheck,
  Sparkles,
  X,
  LogOut,
  Shield,
} from '@/utils/icons'
import { NAV_ITEMS, NAV_GROUPS } from '@/constants/navigation'
import { ROUTES } from '@/constants/routes'

interface DockItem {
  id: string
  label: string
  icon: React.ElementType
  to?: string
  isAction?: boolean
}

const PRIMARY_DOCK_ITEMS: DockItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, to: ROUTES.DASHBOARD },
  { id: 'dispatch', label: 'Dispatch', icon: Navigation2, to: ROUTES.DISPATCH },
  { id: 'tracking', label: 'Tracking', icon: MapPin, to: ROUTES.TRACKING },
  { id: 'drivers', label: 'Drivers', icon: UserCheck, to: ROUTES.DRIVERS },
  { id: 'more', label: 'Menu', icon: Sparkles, isAction: true },
]

export default function MobileBottomNav() {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false)
  }, [location.pathname])

  // Prevent background scroll when menu sheet is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMenuOpen])

  const handleLogout = useCallback(() => {
    setIsMenuOpen(false)
    dispatch(clearAuth())
    navigate('/login')
  }, [dispatch, navigate])

  const handleNavigate = useCallback(
    (path: string) => {
      setIsMenuOpen(false)
      navigate(path)
    },
    [navigate]
  )

  // Check if a primary dock item is active
  const isDockItemActive = (item: DockItem) => {
    if (item.isAction) return isMenuOpen
    if (!item.to) return false
    if (item.to === '/') return location.pathname === '/'
    return location.pathname.startsWith(item.to)
  }

  return (
    <>
      {/* ── Floating Pill Bottom Dock (Tablet & Mobile only) ── */}
      <nav
        aria-label="Mobile Navigation Dock"
        className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 lg:hidden pointer-events-auto"
        style={{
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        }}
      >
        <div className="flex items-center gap-1 sm:gap-2 bg-white/95 backdrop-blur-xl border border-neutral-200/90 shadow-[0_12px_36px_rgba(0,0,0,0.16)] rounded-[22px] sm:rounded-3xl p-1.5 transition-all">
          {PRIMARY_DOCK_ITEMS.map((item) => {
            const Icon = item.icon
            const active = isDockItemActive(item)

            if (item.isAction) {
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setIsMenuOpen((prev) => !prev)}
                  aria-label={item.label}
                  aria-expanded={isMenuOpen}
                  className={`relative flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-[16px] sm:rounded-2xl transition-all duration-200 cursor-pointer ${
                    active
                      ? 'bg-neutral-900 text-white shadow-md scale-100'
                      : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100/90 active:scale-95'
                  }`}
                  title={item.label}
                >
                  <Icon size={20} strokeWidth={active ? 2.2 : 1.9} />
                  {active && (
                    <span className="absolute -bottom-0.5 w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  )}
                </button>
              )
            }

            return (
              <NavLink
                key={item.id}
                to={item.to!}
                end={item.to === '/'}
                aria-label={item.label}
                className={`relative flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-[16px] sm:rounded-2xl transition-all duration-200 cursor-pointer ${
                  active
                    ? 'bg-neutral-900 text-white shadow-md scale-100'
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100/90 active:scale-95'
                }`}
                title={item.label}
              >
                <Icon size={20} strokeWidth={active ? 2.2 : 1.9} />
                {active && (
                  <span className="absolute -bottom-0.5 w-1.5 h-1.5 rounded-full bg-emerald-400" />
                )}
              </NavLink>
            )
          })}
        </div>
      </nav>

      {/* ── Slide-up Sheet / Mobile Menu Drawer ── */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end animate-fadeIn">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMenuOpen(false)}
          />

          {/* Drawer Surface */}
          <div
            className="relative bg-white rounded-t-[28px] shadow-2xl border-t border-neutral-200 max-h-[85vh] flex flex-col overflow-hidden z-10 animate-slideUp"
            style={{
              paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 80px)',
            }}
          >
            {/* Sheet Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-neutral-300" />
            </div>

            {/* Sheet Header */}
            <div className="px-5 py-3 border-b border-neutral-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#0D5C4D] text-white flex items-center justify-center font-extrabold text-xs shadow-xs">
                  IC
                </div>
                <div>
                  <h2 className="text-sm font-bold text-neutral-900 leading-tight">
                    Indo.Cab Admin
                  </h2>
                  <p className="text-[11px] text-neutral-400 font-medium">
                    All Modules & System Controls
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsMenuOpen(false)}
                className="w-8 h-8 rounded-full bg-neutral-100 text-neutral-500 hover:text-neutral-900 flex items-center justify-center cursor-pointer transition-colors"
                aria-label="Close menu"
              >
                <X size={16} />
              </button>
            </div>

            {/* Scrollable Navigation Groups */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
              {NAV_GROUPS.map(({ key, label }) => {
                const items = NAV_ITEMS.filter((n) => n.group === key)
                if (!items.length) return null

                return (
                  <div key={key} className="space-y-2">
                    {label && (
                      <h3 className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider px-1">
                        {label}
                      </h3>
                    )}
                    <div className="grid grid-cols-2 gap-2">
                      {items.map((item) => {
                        const Icon = item.icon
                        const isActive =
                          item.to === '/'
                            ? location.pathname === '/'
                            : location.pathname.startsWith(item.to)

                        return (
                          <button
                            key={item.to}
                            type="button"
                            onClick={() => handleNavigate(item.to)}
                            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left text-xs font-semibold transition-all cursor-pointer ${
                              isActive
                                ? 'bg-emerald-50 text-[#0D5C4D] border border-emerald-200/70 shadow-2xs font-bold'
                                : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-700 border border-neutral-200/50'
                            }`}
                          >
                            <div
                              className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                                isActive
                                  ? 'bg-[#0D5C4D] text-white shadow-2xs'
                                  : 'bg-white text-neutral-500 border border-neutral-200/80'
                              }`}
                            >
                              <Icon size={15} strokeWidth={isActive ? 2.2 : 1.8} />
                            </div>
                            <span className="truncate flex-1">{item.label}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )
              })}

              {/* Admin Profile & Actions */}
              <div className="pt-3 border-t border-neutral-100 space-y-2">
                <h3 className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider px-1">
                  Account & Settings
                </h3>

                <div className="bg-neutral-50 rounded-2xl p-3 border border-neutral-200/70 flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-[#0D5C4D] text-white font-extrabold text-xs flex items-center justify-center shrink-0 shadow-2xs">
                      SA
                    </div>
                    <div className="flex flex-col min-w-0 text-left">
                      <span className="font-bold text-xs text-neutral-900 truncate">
                        Super Admin
                      </span>
                      <span className="text-[10px] font-medium text-neutral-400 truncate flex items-center gap-1">
                        <Shield size={10} className="text-emerald-600 shrink-0" />
                        admin@indo.cab
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="btn btn-delete text-xs px-3 py-1.5 rounded-xl shrink-0 flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <LogOut size={13} />
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
