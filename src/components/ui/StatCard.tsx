import React from 'react';
import CountUpModule from 'react-countup';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cn } from '../../utils/cn';

// Handle potential ESM/CJS interop issues with react-countup
const CountUp = (CountUpModule as any).default || CountUpModule;

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ElementType;
  trend?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  loading?: boolean;
  color?: 'green' | 'blue' | 'amber' | 'red';
}

const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  prefix = '', 
  suffix = '', 
  decimals = 0,
  loading = false,
  color = 'green'
}: StatCardProps) => {
  const colorMap = {
    green: 'text-accent-primary bg-accent-primary/10 border-accent-primary/20',
    blue: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
    amber: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    red: 'text-red-500 bg-red-500/10 border-red-500/20',
  };

  return (
    <div className="glass-card p-6 border-t-4 border-t-accent-primary transition-all duration-300 hover:translate-y-[-4px] hover:shadow-lg">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-text-muted mb-1">{title}</p>
          <h3 className="text-3xl font-sora font-bold tracking-tight">
            {loading ? (
              <div className="h-9 w-24 bg-border animate-pulse rounded-md mt-1"></div>
            ) : (
              <>
                {prefix}
                <CountUp end={value} duration={1.5} decimals={decimals} separator="," />
                {suffix}
              </>
            )}
          </h3>
          
          {trend !== undefined && (
            <div className={cn(
              "flex items-center gap-1 text-xs font-bold mt-2",
              trend >= 0 ? "text-emerald-500" : "text-red-500"
            )}>
              {trend >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
              <span>{Math.abs(trend)}%</span>
              <span className="text-text-muted font-normal">vs last month</span>
            </div>
          )}
        </div>

        <div className={cn(
          "p-3 rounded-xl border",
          colorMap[color]
        )}>
          <Icon className="h-6 w-6" strokeWidth={1.5} />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
