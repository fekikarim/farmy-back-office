import React from 'react';
import { cn } from '../../utils/cn';

export type StatusType = 
  | 'pending' | 'waiting' | 'order_created'
  | 'active' | 'approved' | 'confirmed'
  | 'delivered' | 'completed' | 'resolved'
  | 'rejected' | 'cancelled' | 'failed'
  | 'in_transit' | 'in_progress' | 'preparing' | 'shipped' | 'out_for_delivery' | 'nearby'
  | 'suspended' | 'banned' | 'expired'
  | 'open' | 'closed';

interface StatusBadgeProps {
  status: string | StatusType;
  label?: string;
  className?: string;
}

const statusConfig: Record<string, { color: string, bg: string, border: string }> = {
  // Warning / Pending (Solid)
  pending: { color: 'text-white', bg: 'bg-amber-500 dark:bg-amber-600 shadow-sm shadow-amber-500/20', border: 'border-amber-600 dark:border-amber-400' },
  waiting: { color: 'text-white', bg: 'bg-amber-500 dark:bg-amber-600 shadow-sm shadow-amber-500/20', border: 'border-amber-600 dark:border-amber-400' },
  
  // New / Created (Solid)
  order_created: { color: 'text-white', bg: 'bg-indigo-600 dark:bg-indigo-500 shadow-sm shadow-indigo-500/20', border: 'border-indigo-700 dark:border-indigo-400' },
  
  // Success / Active (Solid)
  active: { color: 'text-white', bg: 'bg-emerald-600 dark:bg-emerald-500 shadow-sm shadow-emerald-500/20', border: 'border-emerald-700 dark:border-emerald-400' },
  approved: { color: 'text-white', bg: 'bg-emerald-600 dark:bg-emerald-500 shadow-sm shadow-emerald-500/20', border: 'border-emerald-700 dark:border-emerald-400' },
  verified: { color: 'text-white', bg: 'bg-emerald-600 dark:bg-emerald-500 shadow-sm shadow-emerald-500/20', border: 'border-emerald-700 dark:border-emerald-400' },
  
  // Success / Confirmed (Solid-ish or Solid)
  confirmed: { color: 'text-white', bg: 'bg-emerald-500 dark:bg-emerald-600 shadow-sm shadow-emerald-500/20', border: 'border-emerald-600 dark:border-emerald-400' },
  open: { color: 'text-white', bg: 'bg-emerald-500 dark:bg-emerald-600 shadow-sm shadow-emerald-500/20', border: 'border-emerald-600 dark:border-emerald-400' },
  
  // Completed (Solid)
  delivered: { color: 'text-white', bg: 'bg-emerald-600 dark:bg-emerald-500 shadow-sm shadow-emerald-500/20', border: 'border-emerald-700 dark:border-emerald-400' },
  completed: { color: 'text-white', bg: 'bg-emerald-600 dark:bg-emerald-500 shadow-sm shadow-emerald-500/20', border: 'border-emerald-700 dark:border-emerald-400' },
  resolved: { color: 'text-white', bg: 'bg-teal-600 dark:bg-teal-500 shadow-sm shadow-teal-500/20', border: 'border-teal-700 dark:border-teal-400' },
  
  // Danger (Solid)
  rejected: { color: 'text-white', bg: 'bg-rose-600 dark:bg-rose-500 shadow-sm shadow-rose-500/20', border: 'border-rose-700 dark:border-rose-400' },
  cancelled: { color: 'text-white', bg: 'bg-red-600 dark:bg-red-500 shadow-sm shadow-red-500/20', border: 'border-red-700 dark:border-red-400' },
  failed: { color: 'text-white', bg: 'bg-red-600 dark:bg-red-500 shadow-sm shadow-red-500/20', border: 'border-red-700 dark:border-red-400' },
  
  // Info / Progress (Solid)
  in_transit: { color: 'text-white', bg: 'bg-blue-600 dark:bg-blue-500 shadow-sm shadow-blue-500/20', border: 'border-blue-700 dark:border-blue-400' },
  in_progress: { color: 'text-white', bg: 'bg-blue-600 dark:bg-blue-500 shadow-sm shadow-blue-500/20', border: 'border-blue-700 dark:border-blue-400' },
  preparing: { color: 'text-white', bg: 'bg-blue-600 dark:bg-blue-500 shadow-sm shadow-blue-500/20', border: 'border-blue-700 dark:border-blue-400' },
  shipped: { color: 'text-white', bg: 'bg-blue-600 dark:bg-blue-500 shadow-sm shadow-blue-500/20', border: 'border-blue-700 dark:border-blue-400' },
  
  // Sky / Transit (Solid)
  out_for_delivery: { color: 'text-white', bg: 'bg-sky-600 dark:bg-sky-500 shadow-sm shadow-sky-500/20', border: 'border-sky-700 dark:border-sky-400' },
  
  // Violet / Proximity (Solid)
  nearby: { color: 'text-white', bg: 'bg-violet-600 dark:bg-violet-500 shadow-sm shadow-violet-500/20', border: 'border-violet-700 dark:border-violet-400' },
  
  // Orange / Warning (Solid)
  suspended: { color: 'text-white', bg: 'bg-orange-500 dark:bg-orange-600 shadow-sm shadow-orange-500/20', border: 'border-orange-600 dark:border-orange-400' },
  banned: { color: 'text-white', bg: 'bg-rose-600 dark:bg-rose-500 shadow-sm shadow-rose-500/20', border: 'border-rose-700 dark:border-rose-400' },
  
  // Platform Roles (Solid / Premium Look)
  admin: { color: 'text-white', bg: 'bg-indigo-600 dark:bg-indigo-500 shadow-lg shadow-indigo-500/20', border: 'border-indigo-700 dark:border-indigo-400' },
  farmer: { color: 'text-white', bg: 'bg-emerald-600 dark:bg-emerald-500 shadow-lg shadow-emerald-500/20', border: 'border-emerald-700 dark:border-emerald-400' },
  worker: { color: 'text-white', bg: 'bg-amber-600 dark:bg-amber-500 shadow-lg shadow-amber-500/20', border: 'border-amber-700 dark:border-amber-400' },
  investor: { color: 'text-white', bg: 'bg-teal-600 dark:bg-teal-500 shadow-lg shadow-teal-500/20', border: 'border-teal-700 dark:border-teal-400' },
  customer: { color: 'text-white', bg: 'bg-slate-600 dark:bg-slate-500 shadow-lg shadow-slate-500/20', border: 'border-slate-700 dark:border-slate-400' },
  
  // Neutral (Solid)
  expired: { color: 'text-white', bg: 'bg-slate-500 dark:bg-slate-600 shadow-sm shadow-slate-500/20', border: 'border-slate-600 dark:border-slate-400' },
  closed: { color: 'text-white', bg: 'bg-slate-500 dark:bg-slate-600 shadow-sm shadow-slate-500/20', border: 'border-slate-600 dark:border-slate-400' },
};

const StatusBadge = ({ status, label, className }: StatusBadgeProps) => {
  const normalizedStatus = status.toLowerCase();
  const config = statusConfig[normalizedStatus] || statusConfig.pending;

  return (
    <span className={cn(
      "inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider w-fit whitespace-nowrap shadow-md transition-all",
      config.bg,
      config.color,
      config.border,
      className
    )}>
      {label || status.replace(/_/g, ' ')}
    </span>
  );
};

export default StatusBadge;
