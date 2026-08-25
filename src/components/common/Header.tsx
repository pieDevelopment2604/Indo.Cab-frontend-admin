import { useLocation } from 'react-router-dom'
import {
  Bell,
  Search,
  HelpCircle
} from '@/utils/icons'
import { ROUTE_TITLES } from '@/constants/routes'

interface HeaderProps {
  sidebarCollapsed: boolean
  onToggleSidebar: () => void
}

export default function Header({ sidebarCollapsed }: HeaderProps) {
  const location = useLocation()

  const pageTitle =
    Object.entries(ROUTE_TITLES).find(([path]) =>
      path === '/' ? location.pathname === '/' : location.pathname.startsWith(path)
    )?.[1] ?? 'Admin'

  return (
    <header
      className="fixed top-0 right-0 h-[58px] bg-white border-b border-gray-200 grid grid-cols-[1fr_auto_1fr] items-center px-5 gap-4 z-30"
      style={{
        left: sidebarCollapsed ? 64 : 256,
        transition: 'left 0.26s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      {/* Left Section: Page Title */}
      <div className="flex items-center gap-3 min-w-0 overflow-hidden">
        <h1 className="text-[15px] font-semibold text-gray-900 tracking-tight m-0 leading-none truncate">
          {pageTitle}
        </h1>
      </div>

      {/* Center Search Bar */}
      <div className="w-[400px] flex items-center gap-2 bg-slate-50 border border-gray-200 rounded-lg px-3 py-1.5 focus-within:border-[#1B6B5C] focus-within:ring-2 focus-within:ring-[#1B6B5C]/10 transition-all">
        <Search size={14} className="text-slate-400 shrink-0" />
        <input
          type="text"
          placeholder="Search bookings, vendors, or fleets..."
          className="flex-1 bg-transparent border-none outline-none text-xs text-gray-900 placeholder:text-slate-400"
        />
        <kbd className="text-[10px] px-1.5 py-0.5 rounded bg-white border border-gray-200 text-slate-400 font-mono whitespace-nowrap">
          ⌘K
        </kbd>
      </div>

      {/* Right Section: Notifications & Help Controls */}
      <div className="flex items-center justify-end gap-3">
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

        {/* Help Center Action */}
        <button
          type="button"
          className="btn btn-neutral"
        >
          <HelpCircle size={15} className="text-slate-500" />
          <span>Help</span>
        </button>
      </div>
    </header>
  )
}
