import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { User, Mail, Phone, Calendar, Shield, Ban, Eye, UserPlus, Download } from 'lucide-react';
import DataTable from '../../components/ui/DataTable';
import StatusBadge from '../../components/ui/StatusBadge';
import { cn } from '../../utils/cn';

interface UserData {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'farmer' | 'worker' | 'investor' | 'customer' | 'admin';
  status: 'active' | 'suspended' | 'banned';
  joinDate: string;
  region: string;
}

const mockUsers: UserData[] = [
  { id: '1', name: 'Karim Feki', email: 'karim@farmy.tn', phone: '+216 22 123 456', role: 'admin', status: 'active', joinDate: '2026-01-15', region: 'Tunis' },
  { id: '2', name: 'Ali Ben Salem', email: 'ali.salem@gmail.com', phone: '+216 55 987 654', role: 'farmer', status: 'active', joinDate: '2026-02-10', region: 'Bizerte' },
  { id: '3', name: 'Ines Barka', email: 'ines.b@invest.tn', phone: '+216 20 555 444', role: 'investor', status: 'active', joinDate: '2026-03-05', region: 'Sousse' },
  { id: '4', name: 'Samir Dridi', email: 'samir.worker@gmail.com', phone: '+216 98 444 333', role: 'worker', status: 'active', joinDate: '2026-03-20', region: 'Beja' },
  { id: '5', name: 'Leila Jazi', email: 'leila.j@customer.tn', phone: '+216 21 000 111', role: 'customer', status: 'suspended', joinDate: '2026-04-12', region: 'Sfax' },
  { id: '6', name: 'Ahmed Rezgui', email: 'ahmed.r@gmail.com', phone: '+216 50 111 222', role: 'farmer', status: 'active', joinDate: '2026-04-25', region: 'Jendouba' },
  { id: '7', name: 'Mouna Sellami', email: 'mouna.s@gmail.com', phone: '+216 24 333 222', role: 'customer', status: 'banned', joinDate: '2026-05-01', region: 'Nabeul' },
];

const UsersPage = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'farmers' | 'workers' | 'investors' | 'customers' | 'admins'>('all');

  const filteredUsers = mockUsers.filter(user => {
    if (activeTab === 'all') return true;
    return user.role === activeTab.slice(0, -1); // Simple mapping for mock
  });

  const columns = [
    {
      header: 'User',
      accessor: (user: UserData) => (
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-accent-gradient flex items-center justify-center text-white font-bold text-xs shadow-sm">
            {user.name.charAt(0)}
          </div>
          <div>
            <p className="font-bold">{user.name}</p>
            <div className="flex items-center gap-1 text-[10px] text-text-muted mt-0.5">
              <Mail className="h-3 w-3" /> {user.email}
            </div>
          </div>
        </div>
      ),
      sortable: true
    },
    {
      header: 'Role',
      accessor: (user: UserData) => <StatusBadge status={user.role} />,
      sortable: true
    },
    {
      header: 'Region',
      accessor: 'region',
      sortable: true,
      className: 'text-text-muted'
    },
    {
      header: 'Join Date',
      accessor: (user: UserData) => (
        <div className="flex items-center gap-1.5 text-text-muted">
          <Calendar className="h-3.5 w-3.5" />
          {new Date(user.joinDate).toLocaleDateString()}
        </div>
      ),
      sortable: true
    },
    {
      header: 'Status',
      accessor: (user: UserData) => <StatusBadge status={user.status} />,
      sortable: true
    }
  ];

  return (
    <div className="space-y-6">
      <Helmet>
        <title>User Management | Farmy Back Office</title>
      </Helmet>

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl tracking-tight">User Management</h1>
          <p className="text-text-muted mt-1">Manage and moderate all platform participants.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="btn-secondary flex items-center gap-2">
            <Download className="h-4 w-4" /> Export CSV
          </button>
          <button className="btn-primary flex items-center gap-2">
            <UserPlus className="h-4 w-4" /> Add Admin
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-surface p-1 rounded-xl border border-border w-fit overflow-x-auto max-w-full">
        {['all', 'farmers', 'workers', 'investors', 'customers', 'admins'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-bold capitalize transition-all whitespace-nowrap",
              activeTab === tab 
                ? "bg-accent-primary text-white shadow-md" 
                : "text-text-muted hover:text-text-primary hover:bg-bg-primary"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Main Table */}
      <DataTable 
        columns={columns as any} 
        data={filteredUsers} 
        onExport={() => console.log('Exporting...')}
      />

      {/* Stats Mini Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {[
          { label: 'Active', value: 482, color: 'text-accent-primary' },
          { label: 'Suspended', value: 12, color: 'text-amber-500' },
          { label: 'Banned', value: 5, color: 'text-red-500' },
          { label: 'Verified', value: 398, color: 'text-blue-500' },
          { label: 'Pending KYC', value: 24, color: 'text-indigo-500' },
        ].map((stat, idx) => (
          <div key={idx} className="glass-card p-4 text-center">
            <p className="text-[10px] uppercase font-bold text-text-muted tracking-widest mb-1">{stat.label}</p>
            <p className={cn("text-2xl font-sora font-bold", stat.color)}>{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UsersPage;
