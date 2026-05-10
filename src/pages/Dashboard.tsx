import React from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  Users, 
  TrendingUp, 
  Map, 
  AlertCircle, 
  Plus, 
  ArrowRight,
  UserCheck,
  MessageSquare,
  Briefcase,
  Truck,
  ShoppingCart,
  RefreshCcw,
  AlertTriangle
} from 'lucide-react';
import { cn } from '../utils/cn';
import StatCard from '../components/ui/StatCard';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { useDashboard } from '../hooks/useDashboard';
import { format } from 'date-fns';

const Dashboard = () => {
  const [isMounted, setIsMounted] = React.useState(false);
  const { data, isLoading, isError, refetch, liveActivities } = useDashboard();

  React.useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="p-4 rounded-full bg-red-500/10 text-red-500">
          <AlertTriangle className="h-12 w-12" />
        </div>
        <h2 className="text-2xl font-sora">Failed to load dashboard</h2>
        <p className="text-text-muted">There was an error connecting to the backend services.</p>
        <button 
          onClick={() => refetch()}
          className="btn-primary flex items-center gap-2"
        >
          <RefreshCcw className="h-4 w-4" /> Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Helmet>
        <title>Dashboard | Farmy Back Office</title>
      </Helmet>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl tracking-tight">System Overview</h1>
          <p className="text-text-muted mt-1">Real-time metrics across the Farmy platform.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="btn-secondary flex items-center gap-2">
            Download Report
          </button>
          <button className="btn-primary flex items-center gap-2">
            <Plus className="h-4 w-4" /> Manage Platform
          </button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Users" 
          value={data?.kpis.totalUsers || 0} 
          icon={Users} 
          loading={isLoading}
        />
        <StatCard 
          title="Total Revenue" 
          value={data?.kpis.totalRevenue || 0} 
          icon={TrendingUp} 
          prefix="TND " 
          color="blue"
          loading={isLoading}
        />
        <StatCard 
          title="Active Lands" 
          value={data?.kpis.activeLands || 0} 
          icon={Map} 
          color="amber"
          loading={isLoading}
        />
        <StatCard 
          title="Pending Actions" 
          value={data?.kpis.pendingActions || 0} 
          icon={AlertCircle} 
          color="red"
          loading={isLoading}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Area Chart */}
        <div className="lg:col-span-2 glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg">Revenue Performance</h3>
            <select className="bg-bg-primary border border-border rounded-lg px-3 py-1.5 text-xs outline-none">
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-[300px] w-full min-w-0">
            {isLoading ? (
              <div className="h-full w-full bg-border/20 animate-pulse rounded-xl" />
            ) : isMounted && data?.revenueHistory && (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.revenueHistory}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#90A53E" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#90A53E" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: 'var(--text-muted)', fontSize: 10 }}
                    dy={10}
                    tickFormatter={(val) => format(new Date(val), 'MMM dd')}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'var(--surface)', 
                      border: '1px solid var(--border)',
                      borderRadius: '12px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#90A53E" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorValue)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* User Distribution Pie Chart */}
        <div className="glass-card p-6">
          <h3 className="text-lg mb-6">User Distribution</h3>
          <div className="h-[260px] w-full relative min-w-0">
            {isLoading ? (
              <div className="h-full w-full flex items-center justify-center">
                <div className="h-32 w-32 rounded-full border-8 border-border border-t-accent-primary animate-spin" />
              </div>
            ) : isMounted && data?.userDistribution && (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.userDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {data.userDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
            {!isLoading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-bold font-sora">{data?.kpis.totalUsers || 0}</span>
                <span className="text-[10px] text-text-muted uppercase">Total Users</span>
              </div>
            )}
          </div>
          <div className="space-y-2 mt-4">
            {data?.userDistribution.map((role, idx) => (
              <div key={idx} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full" style={{ backgroundColor: role.color }} />
                  <span className="text-text-muted">{role.name}</span>
                </div>
                <span className="font-bold">{role.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row: Pending Actions & Real-time Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Actions */}
        <div className="space-y-4">
          <h3 className="text-xl px-2">Attention Required</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {isLoading ? (
              [1, 2, 3, 4].map(i => (
                <div key={i} className="h-20 bg-border/20 animate-pulse rounded-2xl" />
              ))
            ) : data?.attentionRequired.map((action) => {
              const Icon = action.id === 'kyc' ? UserCheck : 
                           action.id === 'feedback' ? MessageSquare :
                           action.id === 'jobs' ? Briefcase : Truck;
              
              const borderColors = {
                amber: 'border-l-amber-500',
                blue: 'border-l-blue-500',
                indigo: 'border-l-indigo-500',
                emerald: 'border-l-emerald-500',
                red: 'border-l-red-500'
              };

              const bgColors = {
                amber: 'bg-amber-500/10 text-amber-500',
                blue: 'bg-blue-500/10 text-blue-500',
                indigo: 'bg-indigo-500/10 text-indigo-500',
                emerald: 'bg-emerald-500/10 text-emerald-500',
                red: 'bg-red-500/10 text-red-500'
              };

              return (
                <div key={action.id} className={cn("glass-card p-4 flex items-center gap-4 hover:bg-accent-primary/5 cursor-pointer transition-all border-l-4", borderColors[action.color])}>
                  <div className={cn("p-2 rounded-lg", bgColors[action.color])}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">{action.count} {action.title}</p>
                    <p className="text-xs text-text-muted">Awaiting action</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Activity Feed */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg">Live Platform Activity</h3>
            <span className="flex items-center gap-1.5 text-[10px] font-bold text-accent-primary uppercase tracking-wider">
              <div className="h-1.5 w-1.5 rounded-full bg-accent-primary animate-pulse" />
              Live
            </span>
          </div>
          
          <div className="space-y-6">
            {isLoading ? (
              [1, 2, 3].map(i => (
                <div key={i} className="flex gap-4 items-center">
                  <div className="h-10 w-10 rounded-xl bg-border/20 animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-3/4 bg-border/20 animate-pulse rounded" />
                    <div className="h-3 w-1/4 bg-border/20 animate-pulse rounded" />
                  </div>
                </div>
              ))
            ) : liveActivities.length > 0 ? liveActivities.map((activity, idx) => {
              const Icon = activity.type === 'order' ? ShoppingCart : 
                           activity.type === 'kyc' ? UserCheck :
                           activity.type === 'user' ? Users : Map;

              return (
                <div key={activity.id || idx} className="flex gap-4 animate-in fade-in slide-in-from-top-2 duration-500">
                  <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0", activity.color)}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">
                      <span className="font-bold">{activity.user}</span> {activity.action}
                    </p>
                    <p className="text-xs text-text-muted mt-1">
                      {typeof activity.time === 'string' ? format(new Date(activity.time), 'HH:mm') : 'Just now'}
                    </p>
                  </div>
                  <button className="text-text-muted hover:text-accent-primary transition-colors">
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              );
            }) : (
              <div className="text-center py-8 text-text-muted italic">
                No recent activity recorded.
              </div>
            )}
          </div>
          
          <button className="w-full mt-8 py-2 text-sm text-accent-primary font-bold hover:bg-accent-primary/5 rounded-xl transition-all">
            View All Activity
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
