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
      className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-2xl border border-neutral-200/80 shadow-xs w-full ${className}`}
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
          <span className="text-xs font-bold uppercase tracking-wider text-[#135c4e] bg-teal-50 px-3 py-1 rounded-full border border-teal-100">
            {badgeText}
          </span>
        </div>
      ) : (
        <div />
      )}

      {/* Right section: View Mode Selector Tabs */}
      <div className="flex items-center gap-2 self-end sm:self-auto flex-wrap">
        {tabs.map(({ id, label, icon }) => {
          const isActive = activeTab === id
          return (
            <button
              key={id}
              type="button"
              onClick={() => onTabChange(id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                isActive
                  ? 'bg-[#135c4e] text-white shadow-xs'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
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
