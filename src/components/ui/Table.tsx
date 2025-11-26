import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Column<T> {
  key: string;
  label: string;
  render?: (item: T) => React.ReactNode;
}

interface TableProps<T> {
  columns: Column<T>[];
  // data: T[];
  data: Record<string, T>;
  onRowClick?: (item: T) => void;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  loading?: boolean;
}


export function Table<T extends { id: string }>({
  columns,
  data,
  onRowClick,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  loading = false
}: TableProps<T>) {

  // const tableData = data ? Object.values(data) : [];
   const rows = Object.values(data);


  return (
    <div className="w-full bg-white dark:bg-slate-900 rounded-2xl shadow-lg overflow-hidden border border-gray-100 dark:border-slate-800">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          {/* Table Header - MUI Style */}
          <thead>
            <tr className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-850 border-b border-gray-200 dark:border-slate-700">
              {columns.map((column, index) => (
                <th
                  key={column.key}
                  className={`
                    px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider
                    ${index === 0 ? 'pl-8' : ''}
                    ${index === columns.length - 1 ? 'pr-8' : ''}
                  `}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>

          {/* Table Body - Clean rows */}
          <tbody className="bg-white dark:bg-slate-900 divide-y divide-gray-100 dark:divide-slate-800">
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="px-8 py-16 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                      <div className="w-10 h-10 border-4 border-gray-200 dark:border-slate-700 border-t-primary-500 rounded-full animate-spin" />
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">Loading data...</span>
                  </div>
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-8 py-16 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-14 h-14 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center">
                      <svg className="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">No data available</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">There are no records to display</p>
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              rows.map((item, rowIndex) => (
                <tr
                  key={item.id}
                  onClick={() => onRowClick?.(item)}
                  className={`
                    group transition-all duration-150
                    ${rowIndex % 2 === 0 ? 'bg-white dark:bg-slate-900' : 'bg-gray-50/50 dark:bg-slate-900/50'}
                    ${onRowClick ? 'cursor-pointer hover:bg-primary-50/50 dark:hover:bg-slate-800/80' : ''}
                  `}
                >
                  {columns.map((column, colIndex) => (
                    <td
                      key={column.key}
                      className={`
                        px-6 py-4 text-sm text-gray-900 dark:text-gray-100
                        ${colIndex === 0 ? 'pl-8 font-medium' : ''}
                        ${colIndex === columns.length - 1 ? 'pr-8' : ''}
                      `}
                    >
                      {column.render ? column.render(item) : (item as any)[column.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination - Material Design */}
      {totalPages > 1 && (
        <div className="px-6 py-3 bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Rows per page: <span className="font-medium">10</span>
            </span>
          </div>
          <div className="flex items-center gap-6">
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {currentPage} - {totalPages} of {totalPages}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => onPageChange?.(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              <button
                onClick={() => onPageChange?.(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
