import { useLocation, Link } from 'react-router-dom'
import {
  Bell,
  Search,
} from '@/utils/icons'
import { ROUTE_TITLES, ROUTES } from '@/constants/routes'

interface HeaderProps {
  sidebarCollapsed?: boolean
  onToggleSidebar?: () => void
  onToggleRightDrawer?: () => void
  isRightDrawerOpen?: boolean
}

export default function Header({
  onToggleRightDrawer,
  isRightDrawerOpen = false
}: HeaderProps) {
  const location = useLocation()

  const pageTitle =
    Object.entries(ROUTE_TITLES).find(([path]) =>
      path === '/' ? location.pathname === '/' : location.pathname.startsWith(path)
    )?.[1] ?? 'Admin'

  return (
    <>
      <header
        className="fixed top-0 right-0 h-[58px] bg-white border-b border-gray-200 flex items-center justify-between px-3 sm:px-5 gap-2 sm:gap-4 z-30 transition-[left] duration-250 ease-out"
        style={{
          left: 'var(--header-left-offset, 0px)',
        }}
      >
        {/* Left Section: Mobile Brand Mark + Page Title */}
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 overflow-hidden">
          {/* Logo badge for mobile & tablet */}
          <Link
            to={ROUTES.DASHBOARD}
            className="flex lg:hidden w-7.5 h-7.5 rounded-lg bg-[#0D5C4D] text-white items-center justify-center font-extrabold text-xs shrink-0 shadow-2xs text-decoration-none"
            title="Indo Cab Dashboard"
          >
            IC
          </Link>

          <h1 className="text-[14px] sm:text-[15px] font-semibold text-gray-900 tracking-tight m-0 leading-none truncate">
            {pageTitle}
          </h1>
        </div>

        {/* Center Search Bar (Tablet & Desktop) */}
        <div className="hidden md:flex flex-1 max-w-[320px] lg:max-w-[400px] items-center gap-2 bg-slate-50 border border-gray-200 rounded-lg px-3 py-1.5 focus-within:border-[#1B6B5C] focus-within:ring-2 focus-within:ring-[#1B6B5C]/10 transition-all mx-2">
          <Search size={14} className="text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search bookings, vendors, fleets..."
            className="flex-1 bg-transparent border-none outline-none text-xs text-gray-900 placeholder:text-slate-400 min-w-0"
          />
          <kbd className="hidden lg:inline-block text-[10px] px-1.5 py-0.5 rounded bg-white border border-gray-200 text-slate-400 font-mono whitespace-nowrap">
            ⌘K
          </kbd>
        </div>

        {/* Right Section: Notifications & User Avatar Drawer Trigger */}
        <div className="flex items-center justify-end gap-2 sm:gap-3 shrink-0">
          {/* Notification Bell */}
          <button
            type="button"
            className="icon-btn icon-btn-secondary relative"
            title="Notifications"
          >
            <Bell size={16} strokeWidth={1.8} />
            <span className="absolute -top-1 -right-1 min-w-[16px] h-4 rounded-full bg-red-500 text-white text-[9px] font-extrabold flex items-center justify-center px-1 border-[1.5px] border-white shadow-xs">
              3
            </span>
          </button>

          {/* Top Right Profile Avatar Button (Triggers Right Sidebar Drawer on Mobile/Tablet) */}
          <button
            type="button"
            onClick={onToggleRightDrawer}
            aria-expanded={isRightDrawerOpen}
            aria-label="Toggle navigation drawer"
            title={isRightDrawerOpen ? "Close menu" : "Open navigation menu"}
            className={`flex lg:hidden items-center gap-2 p-1 pl-1.5 sm:pr-2.5 rounded-xl border transition-all duration-150 cursor-pointer ${
              isRightDrawerOpen
                ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-500/20'
                : 'bg-white hover:bg-neutral-50 border-neutral-200'
            }`}
          >
            <div className="w-7 h-7 rounded-lg bg-[#0D5C4D] text-white font-extrabold text-[11px] flex items-center justify-center shrink-0 shadow-2xs">
              SA
            </div>
            <div className="hidden sm:flex flex-col text-left leading-tight">
              <span className="text-xs font-bold text-neutral-800 leading-none">
                Super Admin
              </span>
              <span className="text-[10px] text-neutral-400 leading-none mt-0.5">
                Admin Menu
              </span>
            </div>
          </button>
        </div>
      </header>

      {/* Mobile Search Overlay Modal */}
      {/* {isMobileSearchOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex flex-col animate-fadeIn">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => setIsMobileSearchOpen(false)}
          />
          <div className="relative bg-white border-b border-neutral-200 p-3 shadow-lg z-10 flex items-center gap-2.5">
            <div className="flex-1 flex items-center gap-2 bg-slate-50 border border-neutral-200 rounded-xl px-3 py-2">
              <Search size={16} className="text-slate-400 shrink-0" />
              <input
                autoFocus
                type="text"
                placeholder="Search bookings, drivers, vendors..."
                className="flex-1 bg-transparent border-none outline-none text-xs text-gray-900 placeholder:text-slate-400"
              />
            </div>
            <button
              type="button"
              onClick={() => setIsMobileSearchOpen(false)}
              className="p-2 rounded-lg text-neutral-500 hover:text-neutral-900 cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )} */}
    </>
  )
}

