import React from 'react';
import { cn } from '../../utils/cn';

export type StatusType = 
  | 'pending' | 'waiting' | 'order_created'
  | 'active' | 'approved' | 'confirmed'
  | 'delivered' | 'completed' | 'resolved'
  | 'rejected' | 'cancelled' | 'failed'
  | 'in_transit' | 'in_progress' | 'preparing' | 'shipped'
  | 'suspended' | 'banned' | 'expired'
  | 'open' | 'closed';

interface StatusBadgeProps {
  status: string | StatusType;
  label?: string;
  className?: string;
}

const statusConfig: Record<string, { color: string, bg: string, border: string }> = {
  // Amber / Warning
  pending: { color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-100 dark:bg-amber-900/30', border: 'border-amber-200 dark:border-amber-800/50' },
  waiting: { color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-100 dark:bg-amber-900/30', border: 'border-amber-200 dark:border-amber-800/50' },
  order_created: { color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-100 dark:bg-indigo-900/30', border: 'border-indigo-200 dark:border-indigo-800/50' },
  
  // Farmy Green / Success
  active: { color: 'text-accent-primary', bg: 'bg-accent-primary/10', border: 'border-accent-primary/20' },
  approved: { color: 'text-accent-primary', bg: 'bg-accent-primary/10', border: 'border-accent-primary/20' },
  confirmed: { color: 'text-accent-primary', bg: 'bg-accent-primary/10', border: 'border-accent-primary/20' },
  open: { color: 'text-accent-primary', bg: 'bg-accent-primary/10', border: 'border-accent-primary/20' },
  
  // Emerald / Completed
  delivered: { color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-900/30', border: 'border-emerald-200 dark:border-emerald-800/50' },
  completed: { color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-900/30', border: 'border-emerald-200 dark:border-emerald-800/50' },
  resolved: { color: 'text-teal-600 dark:text-teal-400', bg: 'bg-teal-100 dark:bg-teal-900/30', border: 'border-teal-200 dark:border-teal-800/50' },
  
  // Red / Danger
  rejected: { color: 'text-red-600 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-900/30', border: 'border-red-200 dark:border-red-800/50' },
  cancelled: { color: 'text-red-600 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-900/30', border: 'border-red-200 dark:border-red-800/50' },
  failed: { color: 'text-red-600 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-900/30', border: 'border-red-200 dark:border-red-800/50' },
  
  // Blue / Info
  in_transit: { color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900/30', border: 'border-blue-200 dark:border-blue-800/50' },
  in_progress: { color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900/30', border: 'border-blue-200 dark:border-blue-800/50' },
  preparing: { color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900/30', border: 'border-blue-200 dark:border-blue-800/50' },
  shipped: { color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900/30', border: 'border-blue-200 dark:border-blue-800/50' },
  
  // Orange / Warning
  suspended: { color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-100 dark:bg-orange-900/30', border: 'border-orange-200 dark:border-orange-800/50' },
  banned: { color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-100 dark:bg-orange-900/30', border: 'border-orange-200 dark:border-orange-800/50' },
  
  // Neutral
  expired: { color: 'text-slate-600 dark:text-slate-400', bg: 'bg-slate-100 dark:bg-slate-900/30', border: 'border-slate-200 dark:border-slate-800/50' },
  closed: { color: 'text-slate-600 dark:text-slate-400', bg: 'bg-slate-100 dark:bg-slate-900/30', border: 'border-slate-200 dark:border-slate-800/50' },
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
