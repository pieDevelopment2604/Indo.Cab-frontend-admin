import React from 'react'
import { ChevronLeft, ChevronRight, Search } from '@/utils/icons'

export interface Column<T> {
  header: string
  accessorKey?: keyof T
  cell?: (row: T) => React.ReactNode
  className?: string
  headerClassName?: string
  align?: 'left' | 'center' | 'right'
}

export interface FilterOption {
  key: string
  label: string
  count?: number
}

export interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  keyExtractor: (row: T) => string | number
  onRowClick?: (row: T) => void
  emptyMessage?: string
  emptyIcon?: React.ReactNode
  isLoading?: boolean

  // Optional Integrated Toolbar Props
  searchQuery?: string
  onSearchChange?: (query: string) => void
  searchPlaceholder?: string
  filterOptions?: FilterOption[]
  selectedFilter?: string
  onFilterChange?: (filterKey: string) => void
  actionButtons?: React.ReactNode

  // Optional Pagination
  pagination?: {
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
    totalItems: number
    pageSize: number
  }
}

export default function DataTable<T>({
  data,
  columns,
  keyExtractor,
  onRowClick,
  emptyMessage = 'No records found',
  emptyIcon,
  isLoading = false,
  searchQuery,
  onSearchChange,
  searchPlaceholder,
  filterOptions,
  selectedFilter,
  onFilterChange,
  actionButtons,
  pagination
}: DataTableProps<T>) {
  const hasToolbar = onSearchChange !== undefined || (filterOptions && filterOptions.length > 0) || actionButtons !== undefined

  return (
    <div className="bg-white rounded-2xl border border-neutral-200/80 shadow-xs overflow-hidden flex flex-col">
      {/* Integrated Search, Filter Options & Actions Toolbar */}
      {hasToolbar && (
        <div className="p-4 border-b border-neutral-100 bg-white flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
            {onSearchChange !== undefined && (
              <div className="relative w-full sm:w-[320px]">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  placeholder={searchPlaceholder || 'Search records...'}
                  value={searchQuery || ''}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-xs border border-neutral-200/80 rounded-xl bg-neutral-50/80 focus:bg-white text-neutral-900 outline-none focus:border-[#135c4e] focus:ring-2 focus:ring-[#135c4e]/10 transition-all"
                />
              </div>
            )}

            {filterOptions && onFilterChange && (
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                {filterOptions.map((opt) => {
                  const isActive = selectedFilter === opt.key
                  return (
                    <button
                      key={opt.key}
                      type="button"
                      onClick={() => onFilterChange(opt.key)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                        isActive
                          ? 'bg-[#135c4e] text-white shadow-xs'
                          : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                      }`}
                    >
                      <span>{opt.label}</span>
                      {opt.count !== undefined && (
                        <span
                          className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                            isActive ? 'bg-white/20 text-white' : 'bg-neutral-200 text-neutral-700'
                          }`}
                        >
                          {opt.count}
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {actionButtons && <div className="flex items-center gap-2 shrink-0">{actionButtons}</div>}
        </div>
      )}

      {/* Loading State */}
      {isLoading ? (
        <div className="p-12 text-center flex flex-col items-center justify-center gap-3">
          <div className="w-5 h-5 rounded-full border-2 border-[#135c4e] border-t-transparent animate-spin" />
          <span className="text-xs font-bold text-neutral-400">Loading data...</span>
        </div>
      ) : data.length === 0 ? (
        /* Empty State */
        <div className="p-12 text-center flex flex-col items-center justify-center gap-3">
          {emptyIcon && <div className="text-neutral-400 mb-1">{emptyIcon}</div>}
          <h3 className="text-sm font-bold text-neutral-800">{emptyMessage}</h3>
        </div>
      ) : (
        /* Table Content */
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-50/80 border-b border-neutral-200/80 text-[10px] font-bold text-neutral-400 uppercase tracking-wider select-none">
                {columns.map((col, idx) => (
                  <th
                    key={idx}
                    className={`py-3.5 px-6 ${col.headerClassName || ''} ${
                      col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'
                    }`}
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-neutral-100 text-xs font-medium text-neutral-800">
              {data.map((row) => (
                <tr
                  key={keyExtractor(row)}
                  onClick={() => onRowClick && onRowClick(row)}
                  className={`transition-colors ${
                    onRowClick ? 'hover:bg-teal-50/20 cursor-pointer' : ''
                  }`}
                >
                  {columns.map((col, idx) => (
                    <td
                      key={idx}
                      className={`py-4 px-6 ${col.className || ''} ${
                        col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'
                      }`}
                    >
                      {col.cell ? col.cell(row) : col.accessorKey ? String(row[col.accessorKey] ?? '') : null}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Footer */}
      {pagination && !isLoading && data.length > 0 && (
        <div className="p-4 border-t border-neutral-100 bg-neutral-50/50 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-neutral-500 font-medium">
          <span>
            Showing <strong>{Math.min((pagination.currentPage - 1) * pagination.pageSize + 1, pagination.totalItems)}</strong> to{' '}
            <strong>{Math.min(pagination.currentPage * pagination.pageSize, pagination.totalItems)}</strong> of{' '}
            <strong>{pagination.totalItems}</strong> entries
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={pagination.currentPage === 1}
              onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
              className="p-1.5 rounded-lg border border-neutral-200 hover:bg-white text-neutral-700 disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer transition-colors"
            >
              <ChevronLeft size={16} />
            </button>

            <span className="px-3 py-1 font-bold text-neutral-900 text-xs">
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>

            <button
              type="button"
              disabled={pagination.currentPage === pagination.totalPages}
              onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
              className="p-1.5 rounded-lg border border-neutral-200 hover:bg-white text-neutral-700 disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
