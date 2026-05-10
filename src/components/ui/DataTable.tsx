import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  ArrowUpDown,
  Download,
  Filter,
  MoreHorizontal
} from 'lucide-react';
import { cn } from '../../utils/cn';

interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
  sortable?: boolean;
  sortKey?: string;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  onSearch?: (query: string) => void;
  onExport?: () => void;
  pageSize?: number;
  totalItems?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  showToolbar?: boolean;
  remotePagination?: boolean;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  onSort?: (key: string, order: 'ASC' | 'DESC') => void;
}

const DataTable = <T extends { id: string | number }>({ 
  columns, 
  data, 
  isLoading = false,
  onSearch,
  onExport,
  pageSize = 10,
  totalItems,
  currentPage: externalPage,
  onPageChange,
  showToolbar = false,
  remotePagination = false,
  sortBy: externalSortBy,
  sortOrder: externalSortOrder,
  onSort
}: DataTableProps<T>) => {
  const [internalPage, setInternalPage] = useState(1);
  const [internalSortBy, setInternalSortBy] = useState<string | undefined>();
  const [internalSortOrder, setInternalSortOrder] = useState<'ASC' | 'DESC'>('DESC');
  const [searchQuery, setSearchQuery] = useState('');

  const currentPage = remotePagination ? (externalPage || 1) : internalPage;
  const sortBy = remotePagination ? externalSortBy : internalSortBy;
  const sortOrder = remotePagination ? externalSortOrder : internalSortOrder;
  
  const totalCount = remotePagination ? (totalItems || data.length) : data.length;
  const totalPages = Math.ceil(totalCount / pageSize);
  
  const sortedData = remotePagination ? data : [...data].sort((a, b) => {
    if (!sortBy) return 0;
    const aVal = (a as any)[sortBy];
    const bVal = (b as any)[sortBy];
    if (aVal < bVal) return sortOrder === 'ASC' ? -1 : 1;
    if (aVal > bVal) return sortOrder === 'ASC' ? 1 : -1;
    return 0;
  });

  const paginatedData = remotePagination ? data : sortedData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleSort = (key: string) => {
    const newOrder = sortBy === key && sortOrder === 'ASC' ? 'DESC' : 'ASC';
    if (remotePagination) {
      onSort?.(key, newOrder);
    } else {
      setInternalSortBy(key);
      setInternalSortOrder(newOrder);
    }
  };

  const handlePageChange = (page: number) => {
    if (remotePagination) {
      onPageChange?.(page);
    } else {
      setInternalPage(page);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    onSearch?.(e.target.value);
    if (remotePagination) {
      onPageChange?.(1);
    } else {
      setInternalPage(1);
    }
  };

  return (
    <div className="glass-card overflow-hidden flex flex-col border border-border shadow-xl shadow-black/5">
      {/* Table Toolbar */}
      {showToolbar && (
        <div className="p-4 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface/50">
          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
            <input
              type="text"
              placeholder="Quick search..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full bg-bg-primary border border-border rounded-lg pl-9 pr-4 py-2 text-sm focus:border-accent-primary outline-none transition-all"
            />
          </div>

          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium border border-border rounded-lg hover:bg-bg-primary transition-all">
              <Filter className="h-4 w-4" /> Filters
            </button>
            {onExport && (
              <button 
                onClick={onExport}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium border border-border rounded-lg hover:bg-bg-primary transition-all"
              >
                <Download className="h-4 w-4" /> Export
              </button>
            )}
          </div>
        </div>
      )}

      {/* Table Body */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-bg-primary/50 text-[10px] font-bold uppercase tracking-widest text-text-muted">
              {columns.map((col, idx) => (
                <th 
                  key={idx} 
                  className={cn(
                    "px-6 py-4 border-b border-border", 
                    col.sortable && "cursor-pointer hover:bg-bg-primary/80 transition-colors",
                    col.className
                  )}
                  onClick={() => col.sortable && handleSort(col.sortKey || (typeof col.accessor === 'string' ? col.accessor as string : ''))}
                >
                  <div className="flex items-center gap-2">
                    {col.header}
                    {col.sortable && (
                      <ArrowUpDown className={cn(
                        "h-3 w-3 transition-colors",
                        sortBy === (col.sortKey || col.accessor) ? "text-accent-primary" : "text-text-muted/40"
                      )} />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, idx) => (
                <tr key={idx}>
                  {columns.map((_, cIdx) => (
                    <td key={cIdx} className="px-6 py-5">
                      <div className="h-3 bg-border/40 rounded-full w-full animate-pulse"></div>
                    </td>
                  ))}
                </tr>
              ))
            ) : paginatedData.length > 0 ? (
              paginatedData.map((item) => (
                <tr key={item.id} className="hover:bg-accent-primary/[0.03] transition-colors group">
                  {columns.map((col, idx) => (
                    <td key={idx} className={cn("px-6 py-4 text-sm font-medium", col.className)}>
                      {typeof col.accessor === 'function' 
                        ? col.accessor(item) 
                        : (item[col.accessor] as React.ReactNode)}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-6 py-20 text-center">
                  <div className="flex flex-col items-center justify-center space-y-3 opacity-40">
                    <Search className="h-10 w-10" />
                    <p className="text-sm font-medium">No platform participants found matching your criteria.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="p-4 border-t border-border flex items-center justify-between bg-surface/50">
        <p className="text-xs text-text-muted">
          Showing <span className="font-bold text-text-primary">{(currentPage - 1) * pageSize + 1}</span> to <span className="font-bold text-text-primary">{Math.min(currentPage * pageSize, data.length)}</span> of <span className="font-bold text-text-primary">{data.length}</span> results
        </p>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-lg border border-border hover:bg-bg-primary disabled:opacity-50 disabled:pointer-events-none transition-all"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }).map((_, idx) => {
              const pageNum = idx + 1;
              return (
                <button
                  key={idx}
                  onClick={() => handlePageChange(pageNum)}
                  className={cn(
                    "h-8 w-8 rounded-lg text-xs font-bold transition-all",
                    currentPage === pageNum 
                      ? "bg-accent-primary text-white shadow-accent-glow" 
                      : "hover:bg-bg-primary text-text-muted"
                  )}
                >
                  {pageNum}
                </button>
              );
            })}
            {totalPages > 5 && <span className="text-text-muted px-1">...</span>}
          </div>
 
          <button
            onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg border border-border hover:bg-bg-primary disabled:opacity-50 disabled:pointer-events-none transition-all"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
