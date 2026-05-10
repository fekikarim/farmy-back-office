import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  User as UserIcon, 
  Mail, 
  Calendar, 
  UserPlus, 
  Download, 
  Search, 
  MoreVertical, 
  Edit, 
  ShieldAlert, 
  ShieldCheck, 
  MapPin,
  RefreshCcw,
  Plus,
  Filter,
  X,
  RotateCcw
} from 'lucide-react';
import DataTable from '../../components/ui/DataTable';
import StatusBadge from '../../components/ui/StatusBadge';
import Modal from '../../components/ui/Modal';
import { cn } from '../../utils/cn';
import { useUsers } from '../../hooks/useUsers';
import { format } from 'date-fns';
import { toast } from 'react-toastify';

const UsersPage = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'farmers' | 'workers' | 'investors' | 'customers' | 'admins'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  
  // Filter states
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'active' | 'banned'>('all');
  const [selectedDate, setSelectedDate] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  // Modal states
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  
  // Sorting states
  const [sortBy, setSortBy] = useState<string>('joinDate');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('DESC');
  
  // Form states
  const [adminForm, setAdminForm] = useState({ name: '', email: '', password: '' });
  const [editForm, setEditForm] = useState({ name: '', role: '', status: '' });

  // Reset page on filter/sort change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, activeTab, selectedRegion, selectedStatus, selectedDate, sortBy, sortOrder]);

  // Debounce search
  React.useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const filters = useMemo(() => ({
    search: debouncedSearch,
    role: activeTab === 'all' ? undefined : activeTab.slice(0, -1),
    status: selectedStatus === 'all' ? undefined : selectedStatus,
    region: selectedRegion || undefined,
    joinDate: selectedDate || undefined,
    sortBy,
    sortOrder,
    page: currentPage,
    limit: pageSize
  }), [debouncedSearch, activeTab, selectedStatus, selectedRegion, selectedDate, sortBy, sortOrder, currentPage]);

  const { data: usersData, isLoading, refetch, updateUser, isUpdating, createAdmin, isCreating, handleExport } = useUsers(filters);

  const columns = [
    {
      header: 'User',
      accessor: (user: any) => (
        <div className="flex items-center gap-3">
          <div className={cn(
            "h-10 w-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-sm",
            user.role === 'admin' ? "bg-indigo-600" : "bg-accent-gradient"
          )}>
            {user.name.charAt(0)}
          </div>
          <div>
            <p className="font-bold text-sm">{user.name}</p>
            <div className="flex items-center gap-1 text-[11px] text-text-muted mt-0.5">
              <Mail className="h-3 w-3" /> {user.email}
            </div>
          </div>
        </div>
      ),
      sortable: true,
      sortKey: 'name'
    },
    {
      header: 'Role',
      accessor: (user: any) => <StatusBadge status={user.role} />,
      sortable: true,
      sortKey: 'role'
    },
    {
      header: 'Region',
      accessor: (user: any) => (
        <div className="flex items-center gap-1.5 text-text-muted text-sm">
          <MapPin className="h-3.5 w-3.5" />
          {user.region}
        </div>
      ),
      sortable: true,
      sortKey: 'region'
    },
    {
      header: 'Join Date',
      accessor: (user: any) => (
        <div className="flex items-center gap-1.5 text-text-muted text-sm">
          <Calendar className="h-3.5 w-3.5" />
          {format(new Date(user.joinDate), 'MMM dd, yyyy')}
        </div>
      ),
      sortable: true,
      sortKey: 'joinDate'
    },
    {
      header: 'Status',
      accessor: (user: any) => <StatusBadge status={user.status} />,
      sortable: true,
      sortKey: 'status'
    },
    {
      header: 'Actions',
      accessor: (user: any) => (
        <div className="flex items-center gap-2">
          <button 
            onClick={() => handleEditClick(user)}
            className="p-2 rounded-lg hover:bg-accent-primary/10 text-accent-primary transition-all"
            title="Edit User"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button 
            onClick={() => handleToggleBan(user)}
            className={cn(
              "p-2 rounded-lg transition-all",
              user.status === 'banned' 
                ? "hover:bg-emerald-500/10 text-emerald-500" 
                : "hover:bg-red-500/10 text-red-500"
            )}
            title={user.status === 'banned' ? 'Unban User' : 'Ban User'}
          >
            {user.status === 'banned' ? <ShieldCheck className="h-4 w-4" /> : <ShieldAlert className="h-4 w-4" />}
          </button>
        </div>
      )
    }
  ];

  const handleEditClick = (user: any) => {
    setSelectedUser(user);
    setEditForm({ name: user.name, role: user.role, status: user.status });
    setIsEditModalOpen(true);
  };

  const handleToggleBan = (user: any) => {
    const newStatus = user.status === 'banned' ? 'active' : 'banned';
    updateUser({ 
      id: user.id, 
      data: { status: newStatus } 
    }, {
      onSuccess: () => toast.success(`User ${newStatus === 'banned' ? 'banned' : 'unbanned'} successfully`)
    });
  };

  const handleCreateAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    createAdmin(adminForm, {
      onSuccess: () => {
        setIsAdminModalOpen(false);
        setAdminForm({ name: '', email: '', password: '' });
        toast.success('Admin created successfully');
      },
      onError: (err: any) => {
        toast.error(err.response?.data?.message || 'Failed to create admin');
      }
    });
  };

  const handleUpdateUser = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({ id: selectedUser.id, data: editForm }, {
      onSuccess: () => {
        setIsEditModalOpen(false);
        toast.success('User updated successfully');
      }
    });
  };
  const handleResetFilters = () => {
    setSearchTerm('');
    setActiveTab('all');
    setSelectedRegion('');
    setSelectedStatus('all');
    setSelectedDate('');
    setSortBy('joinDate');
    setSortOrder('DESC');
    setCurrentPage(1);
    setShowFilters(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <Helmet>
        <title>User Management | Farmy Back Office</title>
      </Helmet>

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl tracking-tight">User Management</h1>
          <p className="text-text-muted mt-1">Manage, moderate, and audit all platform participants.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={handleExport}
            className="btn-secondary flex items-center gap-2"
          >
            <Download className="h-4 w-4" /> Export CSV
          </button>
          <button 
            onClick={() => setIsAdminModalOpen(true)}
            className="btn-primary flex items-center gap-2 px-6"
          >
            <UserPlus className="h-4 w-4" /> Add Admin
          </button>
        </div>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-surface/50 p-4 rounded-2xl border border-border">
        {/* Tabs */}
        <div className="flex items-center gap-1 bg-bg-primary/50 p-1.5 rounded-xl border border-border overflow-x-auto no-scrollbar">
          {['all', 'farmers', 'workers', 'investors', 'customers', 'admins'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={cn(
                "px-5 py-2 rounded-lg text-xs font-bold capitalize transition-all whitespace-nowrap",
                activeTab === tab 
                  ? "bg-accent-primary text-white shadow-lg shadow-accent-primary/20" 
                  : "text-text-muted hover:text-text-primary hover:bg-bg-primary"
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search & Filter Trigger */}
        <div className="flex flex-col md:flex-row items-center gap-4 flex-1">
          <div className="relative group flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted group-focus-within:text-accent-primary transition-colors" />
            <input 
              type="text"
              placeholder="Quick search by name or email..."
              className="w-full bg-bg-primary border border-border rounded-xl pl-11 pr-4 py-2.5 text-sm outline-none focus:border-accent-primary focus:ring-4 focus:ring-accent-primary/10 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "btn-secondary flex items-center gap-2 px-5 py-2.5 whitespace-nowrap",
              showFilters && "bg-accent-primary/10 border-accent-primary text-accent-primary"
            )}
          >
            <Filter className="h-4 w-4" /> 
            {showFilters ? 'Hide Filters' : 'Advanced Filters'}
          </button>

          {(searchTerm || activeTab !== 'all' || selectedRegion || selectedStatus !== 'all' || selectedDate || sortBy !== 'joinDate' || sortOrder !== 'DESC') && (
            <button 
              onClick={handleResetFilters}
              className="btn-secondary flex items-center gap-2 px-5 py-2.5 text-rose-500 hover:bg-rose-500/10 border-rose-500/20 whitespace-nowrap"
              title="Reset all filters and sorting"
            >
              <RotateCcw className="h-4 w-4" />
              <span className="hidden sm:inline">Reset All</span>
            </button>
          )}
        </div>
      </div>

      {/* Advanced Filters Drawer/Panel */}
      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-surface/30 p-6 rounded-2xl border border-border animate-in slide-in-from-top duration-300">
          <div className="space-y-2">
            <label className="text-xs font-bold text-text-muted px-1 flex items-center gap-2">
              <MapPin className="h-3 w-3" /> Region / City
            </label>
            <input 
              type="text"
              placeholder="Filter by city..."
              className="w-full bg-bg-primary border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-accent-primary transition-all"
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-text-muted px-1 flex items-center gap-2">
              <ShieldAlert className="h-3 w-3" /> Account Status
            </label>
            <select 
              className="w-full bg-bg-primary border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-accent-primary transition-all"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as any)}
            >
              <option value="all">All Statuses</option>
              <option value="active">Active Only</option>
              <option value="banned">Banned Only</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-text-muted px-1 flex items-center gap-2">
              <Calendar className="h-3 w-3" /> Join Date
            </label>
            <input 
              type="date"
              className="w-full bg-bg-primary border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-accent-primary transition-all"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>

          {(selectedRegion || selectedStatus !== 'all' || selectedDate) && (
            <div className="md:col-span-3 flex justify-end">
              <button 
                onClick={() => {
                  setSelectedRegion('');
                  setSelectedStatus('all');
                  setSelectedDate('');
                }}
                className="text-xs text-red-500 hover:text-red-600 font-bold flex items-center gap-1 transition-colors"
              >
                <X className="h-3 w-3" /> Clear All Filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* Main Table Content */}
      <div className="relative">
        <DataTable 
          columns={columns as any} 
          data={usersData?.data || []} 
          isLoading={isLoading}
          pageSize={pageSize}
          totalItems={usersData?.pagination?.total}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={(key, order) => {
            setSortBy(key);
            setSortOrder(order);
          }}
          remotePagination={true}
        />
      </div>

      {/* Add Admin Modal */}
      <Modal 
        isOpen={isAdminModalOpen} 
        onClose={() => setIsAdminModalOpen(false)}
        title="Add New Administrator"
      >
        <form onSubmit={handleCreateAdmin} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-bold text-text-muted px-1">Full Name</label>
            <input 
              required
              type="text" 
              className="w-full bg-bg-primary border border-border rounded-xl px-4 py-3 outline-none focus:border-accent-primary transition-all"
              placeholder="e.g. John Doe"
              value={adminForm.name}
              onChange={e => setAdminForm({...adminForm, name: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-text-muted px-1">Email Address</label>
            <input 
              required
              type="email" 
              className="w-full bg-bg-primary border border-border rounded-xl px-4 py-3 outline-none focus:border-accent-primary transition-all"
              placeholder="admin@farmy.tn"
              value={adminForm.email}
              onChange={e => setAdminForm({...adminForm, email: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-text-muted px-1">Secure Password</label>
            <input 
              required
              type="password" 
              className="w-full bg-bg-primary border border-border rounded-xl px-4 py-3 outline-none focus:border-accent-primary transition-all"
              placeholder="••••••••"
              value={adminForm.password}
              onChange={e => setAdminForm({...adminForm, password: e.target.value})}
            />
          </div>
          <button 
            type="submit" 
            disabled={isCreating}
            className="w-full btn-primary py-4 mt-4 flex items-center justify-center gap-2"
          >
            {isCreating ? <RefreshCcw className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            Create Admin Account
          </button>
        </form>
      </Modal>

      {/* Edit User Modal */}
      <Modal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)}
        title="Modify User Profile"
      >
        <form onSubmit={handleUpdateUser} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-bold text-text-muted px-1">Display Name</label>
            <input 
              type="text" 
              className="w-full bg-bg-primary border border-border rounded-xl px-4 py-3 outline-none focus:border-accent-primary transition-all"
              value={editForm.name}
              onChange={e => setEditForm({...editForm, name: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-text-muted px-1">System Role</label>
              <select 
                className="w-full bg-bg-primary border border-border rounded-xl px-4 py-3 outline-none focus:border-accent-primary transition-all"
                value={editForm.role}
                onChange={e => setEditForm({...editForm, role: e.target.value})}
              >
                <option value="farmer">Farmer</option>
                <option value="worker">Worker</option>
                <option value="investor">Investor</option>
                <option value="customer">Customer</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-text-muted px-1">Account Status</label>
              <select 
                className="w-full bg-bg-primary border border-border rounded-xl px-4 py-3 outline-none focus:border-accent-primary transition-all"
                value={editForm.status}
                onChange={e => setEditForm({...editForm, status: e.target.value})}
              >
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
                <option value="banned">Banned</option>
              </select>
            </div>
          </div>
          <button 
            type="submit" 
            disabled={isUpdating}
            className="w-full btn-primary py-4 mt-4"
          >
            {isUpdating ? 'Saving Changes...' : 'Save User Profile'}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default UsersPage;
