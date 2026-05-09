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
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  onSearch?: (query: string) => void;
  onExport?: () => void;
  pageSize?: number;
}

const DataTable = <T extends { id: string | number }>({ 
  columns, 
  data, 
  isLoading = false,
  onSearch,
  onExport,
  pageSize = 10
}: DataTableProps<T>) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  const totalPages = Math.ceil(data.length / pageSize);
  const paginatedData = data.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    onSearch?.(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="glass-card overflow-hidden flex flex-col">
      {/* Table Toolbar */}
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

      {/* Table Body */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-bg-primary/50 text-xs font-bold uppercase tracking-wider text-text-muted">
              {columns.map((col, idx) => (
                <th key={idx} className={cn("px-6 py-4 border-b border-border", col.className)}>
                  <div className="flex items-center gap-2">
                    {col.header}
                    {col.sortable && <ArrowUpDown className="h-3 w-3 cursor-pointer hover:text-accent-primary" />}
                  </div>
                </th>
              ))}
              <th className="px-6 py-4 border-b border-border text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, idx) => (
                <tr key={idx} className="animate-pulse">
                  {columns.map((_, cIdx) => (
                    <td key={cIdx} className="px-6 py-4">
                      <div className="h-4 bg-border rounded w-full"></div>
                    </td>
                  ))}
                  <td className="px-6 py-4 text-right">
                    <div className="h-8 w-8 bg-border rounded ml-auto"></div>
                  </td>
                </tr>
              ))
            ) : paginatedData.length > 0 ? (
              paginatedData.map((item) => (
                <tr key={item.id} className="hover:bg-accent-primary/[0.02] transition-colors group">
                  {columns.map((col, idx) => (
                    <td key={idx} className={cn("px-6 py-4 text-sm", col.className)}>
                      {typeof col.accessor === 'function' 
                        ? col.accessor(item) 
                        : (item[col.accessor] as React.ReactNode)}
                    </td>
                  ))}
                  <td className="px-6 py-4 text-right">
                    <button className="p-1.5 rounded-lg hover:bg-border text-text-muted transition-all">
                      <MoreHorizontal className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length + 1} className="px-6 py-12 text-center text-text-muted">
                  No records found matching your criteria.
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
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
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
                  onClick={() => setCurrentPage(pageNum)}
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
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
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
