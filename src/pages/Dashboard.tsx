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
  ShoppingCart
} from 'lucide-react';
import StatCard from '../components/ui/StatCard';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie
} from 'recharts';

// Mock data for initial UI build
const revenueData = [
  { name: 'May 01', value: 4000 },
  { name: 'May 02', value: 3000 },
  { name: 'May 03', value: 2000 },
  { name: 'May 04', value: 2780 },
  { name: 'May 05', value: 1890 },
  { name: 'May 06', value: 2390 },
  { name: 'May 07', value: 3490 },
  { name: 'May 08', value: 4000 },
  { name: 'May 09', value: 4500 },
];

const roleData = [
  { name: 'Farmers', value: 400, color: '#90A53E' },
  { name: 'Investors', value: 300, color: '#4E7034' },
  { name: 'Workers', value: 300, color: '#F59E0B' },
  { name: 'Customers', value: 200, color: '#3B82F6' },
];

const Dashboard = () => {
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
          value={1284} 
          icon={Users} 
          trend={12.5} 
        />
        <StatCard 
          title="Total Revenue" 
          value={48290} 
          icon={TrendingUp} 
          prefix="TND " 
          trend={8.2} 
          color="blue"
        />
        <StatCard 
          title="Active Lands" 
          value={156} 
          icon={Map} 
          trend={-2.4} 
          color="amber"
        />
        <StatCard 
          title="Pending Actions" 
          value={24} 
          icon={AlertCircle} 
          color="red"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Area Chart */}
        <div className="lg:col-span-2 glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg">Revenue Performance</h3>
            <select className="bg-bg-primary border border-border rounded-lg px-3 py-1.5 text-xs outline-none">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>Last Year</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
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
                  tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
                  dy={10}
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
          </div>
        </div>

        {/* User Distribution Pie Chart */}
        <div className="glass-card p-6">
          <h3 className="text-lg mb-6">User Distribution</h3>
          <div className="h-[300px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={roleData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {roleData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-bold font-sora">1,284</span>
              <span className="text-[10px] text-text-muted uppercase">Total Users</span>
            </div>
          </div>
          <div className="space-y-2 mt-4">
            {roleData.map((role, idx) => (
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
            <div className="glass-card p-4 flex items-center gap-4 hover:bg-accent-primary/5 cursor-pointer transition-all border-l-4 border-l-amber-500">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
                <UserCheck className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-bold">12 Worker KYCs</p>
                <p className="text-xs text-text-muted">Awaiting review</p>
              </div>
            </div>
            
            <div className="glass-card p-4 flex items-center gap-4 hover:bg-accent-primary/5 cursor-pointer transition-all border-l-4 border-l-blue-500">
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                <MessageSquare className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-bold">8 Feedbacks</p>
                <p className="text-xs text-text-muted">Unresolved</p>
              </div>
            </div>

            <div className="glass-card p-4 flex items-center gap-4 hover:bg-accent-primary/5 cursor-pointer transition-all border-l-4 border-l-indigo-500">
              <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-500">
                <Briefcase className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-bold">5 Job Apps</p>
                <p className="text-xs text-text-muted">Awaiting action</p>
              </div>
            </div>

            <div className="glass-card p-4 flex items-center gap-4 hover:bg-accent-primary/5 cursor-pointer transition-all border-l-4 border-l-emerald-500">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
                <Truck className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-bold">3 Deliveries</p>
                <p className="text-xs text-text-muted">Stuck at created</p>
              </div>
            </div>
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
            {[
              { type: 'order', user: 'Ali Ben Salem', action: 'placed a new order', time: '2 min ago', icon: ShoppingCart, color: 'text-blue-500 bg-blue-500/10' },
              { type: 'kyc', user: 'Samir Dridi', action: 'submitted KYC profile', time: '15 min ago', icon: UserCheck, color: 'text-amber-500 bg-amber-500/10' },
              { type: 'user', user: 'Ines Barka', action: 'joined as Investor', time: '1 hour ago', icon: Users, color: 'text-accent-primary bg-accent-primary/10' },
              { type: 'land', user: 'Mourad Trabelsi', action: 'listed new land', time: '3 hours ago', icon: Map, color: 'text-emerald-500 bg-emerald-500/10' },
            ].map((activity, idx) => (
              <div key={idx} className="flex gap-4">
                <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0", activity.color)}>
                  <activity.icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm">
                    <span className="font-bold">{activity.user}</span> {activity.action}
                  </p>
                  <p className="text-xs text-text-muted mt-1">{activity.time}</p>
                </div>
                <button className="text-text-muted hover:text-accent-primary transition-colors">
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            ))}
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
