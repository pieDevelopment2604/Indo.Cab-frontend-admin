import React from 'react'
import { Search } from '@/utils/icons'

export interface TabOption<T extends string = string> {
  id: T
  label: string
  icon?: React.ReactNode
}

export interface ViewModeTabsProps<T extends string = string> {
  tabs: Array<TabOption<T>>
  activeTab: T
  onTabChange: (tabId: T) => void
  searchTerm?: string
  onSearchChange?: (term: string) => void
  searchPlaceholder?: string
  badgeText?: string
  className?: string
}

function ViewModeTabsComponent<T extends string = string>({
  tabs,
  activeTab,
  onTabChange,
  searchTerm,
  onSearchChange,
  searchPlaceholder = 'Search...',
  badgeText,
  className = ''
}: ViewModeTabsProps<T>) {
  return (
    <div
      className={`card p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full ${className}`}
    >
      {/* Left section: Search Input or Badge */}
      {onSearchChange !== undefined ? (
        <div className="relative w-full sm:w-[450px]">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            className="w-full pl-10 pr-4 py-2 text-xs border border-neutral-200/80 rounded-xl bg-neutral-50/80 focus:bg-white text-neutral-900 outline-none focus:border-[#135c4e] focus:ring-2 focus:ring-[#135c4e]/10 transition-all"
            value={searchTerm || ''}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      ) : badgeText ? (
        <div className="flex items-center gap-2">
          <span className="status-success">
            {badgeText}
          </span>
        </div>
      ) : (
        <div />
      )}

      {/* Right section: View Mode Selector Tabs */}
      <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 scrollbar-none shrink-0">
        {tabs.map(({ id, label, icon }) => {
          const isActive = activeTab === id
          return (
            <button
              key={id}
              type="button"
              onClick={() => onTabChange(id)}
              className={`btn whitespace-nowrap text-xs ${isActive ? 'btn-submit' : 'btn-neutral'}`}
            >
              {icon}
              <span>{label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default React.memo(ViewModeTabsComponent) as typeof ViewModeTabsComponent
