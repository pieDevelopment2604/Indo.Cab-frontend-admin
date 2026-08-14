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
    <div className="bg-white rounded-[16px] border border-neutral-200/70 shadow-sm overflow-hidden flex flex-col font-sans">
      {/* Integrated Search, Filter Options & Actions Toolbar */}
      {hasToolbar && (
        <div className="px-5 py-3.5 border-b border-neutral-100 bg-white flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
            {onSearchChange !== undefined && (
               <div className="relative w-full sm:w-[320px]">
                 <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                 <input
                   type="text"
                   placeholder={searchPlaceholder || 'Search records...'}
                   value={searchQuery || ''}
                   onChange={(e) => onSearchChange(e.target.value)}
                   className="w-full pl-9 pr-4 py-2 text-[13px] border border-neutral-200 rounded-lg bg-white text-neutral-900 outline-none focus:border-neutral-300 focus:ring-4 focus:ring-neutral-100 transition-all placeholder:text-neutral-400 shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
                 />
               </div>
            )}

            {filterOptions && onFilterChange && (
              <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                {filterOptions.map((opt) => {
                  const isActive = selectedFilter === opt.key
                  return (
                    <button
                      key={opt.key}
                      type="button"
                      onClick={() => onFilterChange(opt.key)}
                      className={`px-3.5 py-1.5 rounded-lg text-[13px] font-medium whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
                        isActive
                          ? 'bg-neutral-100 text-neutral-900 font-semibold'
                          : 'bg-transparent text-neutral-500 hover:bg-neutral-50 hover:text-neutral-700'
                      }`}
                    >
                      <span>{opt.label}</span>
                      {opt.count !== undefined && (
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                            isActive ? 'bg-white border border-neutral-200 text-neutral-800 shadow-sm' : 'bg-neutral-100 text-neutral-500'
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
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="border-b border-neutral-100 text-[12px] font-medium text-neutral-400 bg-white">
                {columns.map((col, idx) => (
                  <th
                    key={idx}
                    className={`py-3 px-5 tracking-wide ${col.headerClassName || ''} ${
                      col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'
                    }`}
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 bg-white">
              {Array.from({ length: 5 }).map((_, rowIdx) => (
                <tr key={rowIdx}>
                  {columns.map((col, colIdx) => (
                    <td
                      key={colIdx}
                      className={`py-4 px-5 ${col.className || ''} ${
                        col.align === 'right' ? 'flex justify-end' : col.align === 'center' ? 'flex justify-center' : ''
                      }`}
                    >
                      <div 
                        className="h-4 bg-neutral-200/70 rounded animate-pulse" 
                        style={{ width: colIdx === 0 ? '60%' : colIdx === columns.length - 1 ? '30%' : '80%' }}
                      ></div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : data.length === 0 ? (
        /* Empty State */
        <div className="p-16 text-center flex flex-col items-center justify-center gap-3 bg-white">
          {emptyIcon && <div className="text-neutral-300 mb-1">{emptyIcon}</div>}
          <h3 className="text-[13px] font-medium text-neutral-500">{emptyMessage}</h3>
        </div>
      ) : (
        /* Table Content */
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="border-b border-neutral-100 text-[12px] font-medium text-neutral-400 bg-white">
                {columns.map((col, idx) => (
                  <th
                    key={idx}
                    className={`py-3 px-5 tracking-wide ${col.headerClassName || ''} ${
                      col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'
                    }`}
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-neutral-100 text-[13px] font-medium text-neutral-700 bg-white">
              {data.map((row) => (
                <tr
                  key={keyExtractor(row)}
                  onClick={() => onRowClick && onRowClick(row)}
                  className={`transition-colors group ${
                    onRowClick ? 'hover:bg-neutral-50/70 cursor-pointer' : ''
                  }`}
                >
                  {columns.map((col, idx) => (
                    <td
                      key={idx}
                      className={`py-3.5 px-5 ${col.className || ''} ${
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
        <div className="px-5 py-3.5 border-t border-neutral-100 bg-white flex flex-col sm:flex-row justify-between items-center gap-3 text-[12px] text-neutral-500 font-medium">
          <span>
            Showing <strong className="text-neutral-800">{Math.min((pagination.currentPage - 1) * pagination.pageSize + 1, pagination.totalItems)}</strong> to{' '}
            <strong className="text-neutral-800">{Math.min(pagination.currentPage * pagination.pageSize, pagination.totalItems)}</strong> of{' '}
            <strong className="text-neutral-800">{pagination.totalItems}</strong>
          </span>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={pagination.currentPage === 1}
              onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
              className="p-1.5 rounded-lg text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer transition-colors"
            >
              <ChevronLeft size={16} />
            </button>

            <span className="px-2 py-1 font-medium text-neutral-700">
              {pagination.currentPage} / {pagination.totalPages}
            </span>

            <button
              type="button"
              disabled={pagination.currentPage === pagination.totalPages}
              onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
              className="p-1.5 rounded-lg text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
