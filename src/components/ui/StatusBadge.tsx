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
  // Amber / Warning
  pending: { color: 'text-amber-700 dark:text-amber-300', bg: 'bg-amber-50 dark:bg-amber-900/40', border: 'border-amber-200 dark:border-amber-800' },
  waiting: { color: 'text-amber-700 dark:text-amber-300', bg: 'bg-amber-50 dark:bg-amber-900/40', border: 'border-amber-200 dark:border-amber-800' },
  order_created: { color: 'text-indigo-700 dark:text-indigo-300', bg: 'bg-indigo-50 dark:bg-indigo-900/40', border: 'border-indigo-200 dark:border-indigo-800' },
  
  // Farmy Green / Success
  active: { color: 'text-white', bg: 'bg-emerald-500 shadow-sm shadow-emerald-100 dark:shadow-none', border: 'border-emerald-600' },
  approved: { color: 'text-white', bg: 'bg-emerald-500 shadow-sm shadow-emerald-100 dark:shadow-none', border: 'border-emerald-600' },
  confirmed: { color: 'text-emerald-700 dark:text-emerald-300', bg: 'bg-emerald-50 dark:bg-emerald-900/40', border: 'border-emerald-200 dark:border-emerald-800' },
  verified: { color: 'text-white', bg: 'bg-emerald-500 shadow-sm shadow-emerald-100 dark:shadow-none', border: 'border-emerald-600' },
  open: { color: 'text-emerald-700 dark:text-emerald-300', bg: 'bg-emerald-50 dark:bg-emerald-900/40', border: 'border-emerald-200 dark:border-emerald-800' },
  
  // Emerald / Completed
  delivered: { color: 'text-emerald-800 dark:text-emerald-200', bg: 'bg-emerald-100 dark:bg-emerald-900/60', border: 'border-emerald-300 dark:border-emerald-700' },
  completed: { color: 'text-emerald-800 dark:text-emerald-200', bg: 'bg-emerald-100 dark:bg-emerald-900/60', border: 'border-emerald-300 dark:border-emerald-700' },
  resolved: { color: 'text-teal-800 dark:text-teal-200', bg: 'bg-teal-100 dark:bg-teal-900/60', border: 'border-teal-300 dark:border-teal-700' },
  
  // Red / Danger
  rejected: { color: 'text-white', bg: 'bg-rose-500 shadow-sm shadow-rose-100 dark:shadow-none', border: 'border-rose-600' },
  cancelled: { color: 'text-red-700 dark:text-red-300', bg: 'bg-red-50 dark:bg-red-900/40', border: 'border-red-200 dark:border-red-800' },
  failed: { color: 'text-red-700 dark:text-red-300', bg: 'bg-red-50 dark:bg-red-900/40', border: 'border-red-200 dark:border-red-800' },
  
  // Blue / Info
  in_transit: { color: 'text-blue-700 dark:text-blue-300', bg: 'bg-blue-50 dark:bg-blue-900/40', border: 'border-blue-200 dark:border-blue-800' },
  in_progress: { color: 'text-blue-700 dark:text-blue-300', bg: 'bg-blue-50 dark:bg-blue-900/40', border: 'border-blue-200 dark:border-blue-800' },
  preparing: { color: 'text-blue-700 dark:text-blue-300', bg: 'bg-blue-50 dark:bg-blue-900/40', border: 'border-blue-200 dark:border-blue-800' },
  shipped: { color: 'text-blue-700 dark:text-blue-300', bg: 'bg-blue-50 dark:bg-blue-900/40', border: 'border-blue-200 dark:border-blue-800' },
  out_for_delivery: { color: 'text-sky-700 dark:text-sky-300', bg: 'bg-sky-50 dark:bg-sky-900/40', border: 'border-sky-200 dark:border-sky-800' },
  nearby: { color: 'text-white', bg: 'bg-indigo-500 shadow-sm shadow-indigo-100', border: 'border-indigo-600' },
  
  // Orange / Warning
  suspended: { color: 'text-white', bg: 'bg-orange-500 shadow-sm shadow-orange-100 dark:shadow-none', border: 'border-orange-600' },
  banned: { color: 'text-white', bg: 'bg-rose-500 shadow-sm shadow-rose-100 dark:shadow-none', border: 'border-rose-600' },
  
  // Platform Roles (Solid / Premium Look)
  admin: { color: 'text-white', bg: 'bg-indigo-600 shadow-sm shadow-indigo-200 dark:shadow-none', border: 'border-indigo-700' },
  farmer: { color: 'text-white', bg: 'bg-emerald-600 shadow-sm shadow-emerald-200 dark:shadow-none', border: 'border-emerald-700' },
  worker: { color: 'text-white', bg: 'bg-amber-600 shadow-sm shadow-amber-200 dark:shadow-none', border: 'border-amber-700' },
  investor: { color: 'text-white', bg: 'bg-teal-600 shadow-sm shadow-teal-200 dark:shadow-none', border: 'border-teal-700' },
  customer: { color: 'text-white', bg: 'bg-slate-600 shadow-sm shadow-slate-200 dark:shadow-none', border: 'border-slate-700' },
  
  // Neutral
  expired: { color: 'text-slate-700 dark:text-slate-300', bg: 'bg-slate-50 dark:bg-slate-900/40', border: 'border-slate-200 dark:border-slate-800' },
  closed: { color: 'text-slate-700 dark:text-slate-300', bg: 'bg-slate-50 dark:bg-slate-900/40', border: 'border-slate-200 dark:border-slate-800' },
};

const StatusBadge = ({ status, label, className }: StatusBadgeProps) => {
  const normalizedStatus = status.toLowerCase();
  const config = statusConfig[normalizedStatus] || statusConfig.pending;

  return (
    <span className={cn(
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border uppercase tracking-wider",
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
