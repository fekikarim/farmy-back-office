import React, { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  Eye, 
  Search, 
  Filter, 
  Download, 
  CheckCircle2, 
  XCircle, 
  Info,
  Star,
  Calendar,
  RefreshCcw,
  AlertCircle,
  RotateCcw,
  MapPin,
  UserRoundCheck
} from 'lucide-react';
import DataTable from '../../components/ui/DataTable';
import StatusBadge from '../../components/ui/StatusBadge';
import Modal from '../../components/ui/Modal';
import { cn } from '../../utils/cn';
import { useWorkers } from '../../api/hooks/useWorkers';
import { format } from 'date-fns';

const WorkersPage = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'verified' | 'rejected'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Filter states
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Sorting states
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('DESC');

  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    workerId: string;
    workerName: string;
    status: 'pending' | 'verified' | 'rejected' | null;
  }>({
    isOpen: false,
    workerId: '',
    workerName: '',
    status: null
  });

  const [detailsModal, setDetailsModal] = useState<{
    isOpen: boolean;
    worker: any | null;
  }>({
    isOpen: false,
    worker: null
  });

  // Reset page on filter/sort change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, activeTab, selectedRegion, selectedDate, sortBy, sortOrder]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const filters = useMemo(() => ({
    status: activeTab === 'all' ? undefined : activeTab,
    search: debouncedSearch || undefined,
    region: selectedRegion || undefined,
    submittedAt: selectedDate || undefined,
    sortBy,
    sortOrder,
    page: currentPage,
    limit: pageSize
  }), [activeTab, debouncedSearch, selectedRegion, selectedDate, sortBy, sortOrder, currentPage]);

  const { data: workersData, isLoading, error, refetch, isFetching, verifyWorker, isVerifying } = useWorkers(filters);

  const resetFilters = () => {
    setSearchTerm('');
    setActiveTab('all');
    setSelectedRegion('');
    setSelectedDate('');
    setSortBy('createdAt');
    setSortOrder('DESC');
    setShowFilters(false);
  };

  const openConfirmModal = (worker: any, status: 'verified' | 'rejected' | 'pending') => {
    setConfirmModal({
      isOpen: true,
      workerId: worker.id,
      workerName: worker.user?.profile?.name || 'Unknown Worker',
      status
    });
  };

  const handleConfirmAction = () => {
    if (confirmModal.workerId && confirmModal.status) {
      verifyWorker({ profileId: confirmModal.workerId, status: confirmModal.status }, {
        onSuccess: () => {
          setConfirmModal(prev => ({ ...prev, isOpen: false }));
        }
      });
    }
  };

  const columns = [
    {
      header: 'Worker',
      accessor: (worker: any) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-accent-gradient flex items-center justify-center text-white font-bold text-sm shadow-sm">
            {worker.user?.profile?.name?.charAt(0) || 'W'}
          </div>
          <div>
            <p className="font-bold text-sm text-text-primary">{worker.user?.profile?.name || 'Unknown'}</p>
            <p className="text-[11px] text-text-muted">{worker.user?.email}</p>
          </div>
        </div>
      ),
      sortable: true,
      sortKey: 'name'
    },
    {
      header: 'Skills',
      accessor: (worker: any) => (
        <div className="flex flex-wrap gap-1">
          {worker.skills?.slice(0, 2).map((skill: string, i: number) => (
            <span key={i} className="px-2 py-0.5 bg-bg-secondary border border-border rounded-full text-[10px] text-text-secondary">
              {skill}
            </span>
          ))}
          {worker.skills?.length > 2 && (
            <span className="text-[10px] text-text-muted">+{worker.skills.length - 2}</span>
          )}
        </div>
      )
    },
    {
      header: 'Daily Rate',
      accessor: (worker: any) => (
        <span className="font-bold text-accent-primary">
          {worker.dailyRate || 0} TND
        </span>
      ),
      sortable: true,
      sortKey: 'dailyRate'
    },
    {
      header: 'Rating',
      accessor: (worker: any) => (
        <div className="flex items-center gap-1">
          <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
          <span className="font-medium text-sm">{worker.rating || 'N/A'}</span>
        </div>
      ),
      sortable: true,
      sortKey: 'rating'
    },
    {
      header: 'Submitted At',
      accessor: (worker: any) => (
        <div className="flex items-center gap-1.5 text-text-muted">
          <Calendar className="h-3.5 w-3.5 text-accent-primary" />
          <span className="text-xs">{worker.createdAt ? format(new Date(worker.createdAt), 'MMM dd, yyyy') : 'N/A'}</span>
        </div>
      ),
      sortable: true,
      sortKey: 'createdAt'
    },
    {
      header: 'Status',
      accessor: (worker: any) => (
        <StatusBadge status={worker.status} />
      ),
      sortable: true,
      sortKey: 'status'
    },
    {
      header: 'Actions',
      accessor: (worker: any) => (
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setDetailsModal({ isOpen: true, worker })}
            className="p-2 rounded-lg bg-bg-secondary hover:bg-border text-text-secondary transition-colors group"
            title="View Details"
          >
            <Eye className="h-4 w-4 group-hover:scale-110 transition-transform" />
          </button>
          
          {worker.status === 'pending' && (
            <>
              <button 
                onClick={() => openConfirmModal(worker, 'verified')}
                className="p-2 rounded-lg bg-green-500/10 hover:bg-green-500/20 text-green-600 transition-colors group"
                title="Verify Worker"
              >
                <CheckCircle2 className="h-4 w-4 group-hover:scale-110 transition-transform" />
              </button>
              <button 
                onClick={() => openConfirmModal(worker, 'rejected')}
                className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-600 transition-colors group"
                title="Reject Profile"
              >
                <XCircle className="h-4 w-4 group-hover:scale-110 transition-transform" />
              </button>
            </>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <Helmet>
        <title>Worker Profiles | Farmy Admin</title>
      </Helmet>

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">Worker Profiles</h1>
          <p className="text-text-muted text-sm mt-1">Manage, verify and monitor farm worker applications.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => refetch()}
            className="flex items-center gap-2 px-4 py-2.5 bg-surface border border-border rounded-xl text-sm font-medium hover:bg-bg-secondary transition-all active:scale-95 disabled:opacity-50"
            disabled={isFetching}
          >
            <RefreshCcw className={cn("h-4 w-4 text-accent-primary", isFetching && "animate-spin")} />
            Refresh
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-accent-gradient text-white rounded-xl text-sm font-bold shadow-lg shadow-accent-primary/25 hover:opacity-90 transition-all active:scale-95">
            <Download className="h-4 w-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Search and Tabs */}
      <div className="bg-surface border border-border rounded-2xl p-4 mb-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          <div className="flex-1 flex items-center gap-2 bg-bg-secondary border border-border px-4 py-2.5 rounded-xl group focus-within:border-accent-primary/50 transition-all">
            <Search className="h-4 w-4 text-text-muted group-focus-within:text-accent-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Quick search by name, email or skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-none focus:outline-none text-sm w-full text-text-primary"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')}>
                <XCircle className="h-4 w-4 text-text-muted hover:text-red-500" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 bg-bg-secondary p-1 rounded-xl border border-border overflow-x-auto no-scrollbar">
            {[
              { id: 'all', label: 'All Workers', icon: UserRoundCheck },
              { id: 'pending', label: 'Pending Review', icon: Info },
              { id: 'verified', label: 'Approved', icon: CheckCircle2 },
              { id: 'rejected', label: 'Rejected', icon: XCircle },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap",
                  activeTab === tab.id 
                    ? "bg-accent-primary text-surface shadow-md shadow-accent-primary/20" 
                    : "text-text-muted hover:bg-border/50 hover:text-text-primary"
                )}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold border transition-all active:scale-95",
                showFilters 
                  ? "bg-accent-primary/10 border-accent-primary text-accent-primary" 
                  : "bg-surface border-border text-text-secondary hover:bg-bg-secondary"
              )}
            >
              <Filter className="h-4 w-4" />
              Advanced Filters
            </button>
            <button 
              onClick={resetFilters}
              className="p-2.5 rounded-xl border border-border bg-surface text-text-muted hover:text-red-500 hover:border-red-200 transition-all active:scale-95 group"
              title="Reset sorting and filters"
            >
              <RotateCcw className="h-4 w-4 group-hover:rotate-[-45deg] transition-transform" />
            </button>
          </div>
        </div>

        {/* Advanced Filters Dropdown */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-border animate-in slide-in-from-top-2 duration-300">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider ml-1">Region / Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                <select 
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="w-full bg-bg-secondary border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-accent-primary transition-all appearance-none"
                >
                  <option value="">All Regions</option>
                  <option value="Tunis">Tunis</option>
                  <option value="Bizerte">Bizerte</option>
                  <option value="Sousse">Sousse</option>
                  <option value="Nabeul">Nabeul</option>
                  <option value="Beja">Beja</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider ml-1">Submission Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                <input 
                  type="date" 
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full bg-bg-secondary border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-accent-primary transition-all"
                />
              </div>
            </div>

            <div className="flex items-end">
              <button 
                onClick={resetFilters}
                className="w-full py-2.5 bg-bg-secondary text-text-secondary rounded-xl text-sm font-bold hover:bg-border transition-all border border-border active:scale-95"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Error State */}
      {error && (
        <div className="flex flex-col items-center justify-center p-12 bg-rose-500/5 border border-rose-500/20 rounded-2xl text-center space-y-4">
          <div className="h-12 w-12 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500">
            <AlertCircle className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold">Failed to fetch workers</h3>
            <p className="text-text-muted max-w-xs mx-auto">There was an error communicating with the server. Please check your connection and try again.</p>
          </div>
          <button onClick={() => refetch()} className="btn-primary px-6">Retry Connection</button>
        </div>
      )}

      {/* Main Content Table */}
      {!error && (
        <DataTable 
          columns={columns} 
          data={workersData?.data || []} 
          isLoading={isLoading} 
          currentPage={currentPage}
          pageSize={pageSize}
          totalItems={workersData?.pagination?.total || 0}
          onPageChange={setCurrentPage}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={(key, order) => {
            setSortBy(key);
            setSortOrder(order);
          }}
          remotePagination={true}
        />
      )}

      {/* Status Change Confirmation Modal */}
      <Modal
        isOpen={confirmModal.isOpen}
        onClose={() => !isVerifying && setConfirmModal(prev => ({ ...prev, isOpen: false }))}
        title="Change Verification Status"
        className="max-w-md"
      >
        <div className="space-y-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className={cn(
              "h-16 w-16 rounded-full flex items-center justify-center shadow-lg",
              confirmModal.status === 'verified' && "bg-emerald-500/10 text-emerald-500 shadow-emerald-500/20",
              confirmModal.status === 'rejected' && "bg-rose-500/10 text-rose-500 shadow-rose-500/20",
              confirmModal.status === 'pending' && "bg-amber-500/10 text-amber-500 shadow-amber-500/20"
            )}>
              {confirmModal.status === 'verified' && <CheckCircle2 className="h-8 w-8" />}
              {confirmModal.status === 'rejected' && <XCircle className="h-8 w-8" />}
              {confirmModal.status === 'pending' && <RotateCcw className="h-8 w-8" />}
            </div>
            
            <div>
              <h4 className="text-lg font-bold">Update {confirmModal.workerName}?</h4>
              <p className="text-sm text-text-muted mt-1">
                Are you sure you want to change this worker's status to{' '}
                <span className={cn(
                  "font-bold",
                  confirmModal.status === 'verified' && "text-emerald-500",
                  confirmModal.status === 'rejected' && "text-rose-500",
                  confirmModal.status === 'pending' && "text-amber-500"
                )}>
                  {confirmModal.status?.toUpperCase()}
                </span>?
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
              disabled={isVerifying}
              className="flex-1 btn-secondary py-2.5"
            >
              Cancel
            </button>
            <button 
              onClick={handleConfirmAction}
              disabled={isVerifying}
              className={cn(
                "flex-1 py-2.5 rounded-xl font-bold text-white shadow-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2",
                confirmModal.status === 'verified' && "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/30",
                confirmModal.status === 'rejected' && "bg-rose-500 hover:bg-rose-600 shadow-rose-500/30",
                confirmModal.status === 'pending' && "bg-amber-500 hover:bg-amber-600 shadow-amber-500/30"
              )}
            >
              {isVerifying && <RefreshCcw className="h-4 w-4 animate-spin" />}
              Confirm Change
            </button>
          </div>
        </div>
      </Modal>

      {/* Worker Details Modal */}
      <Modal
        isOpen={detailsModal.isOpen}
        onClose={() => setDetailsModal({ isOpen: false, worker: null })}
        title="Worker Detailed Profile"
        className="max-w-2xl"
      >
        {detailsModal.worker && (
          <div className="space-y-8">
            {/* Profile Header */}
            <div className="flex items-start gap-6">
              <div className="h-20 w-20 rounded-2xl bg-accent-gradient flex items-center justify-center text-white text-3xl font-bold shadow-xl">
                {detailsModal.worker.user?.profile?.name?.charAt(0) || '?'}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-2xl font-bold">{detailsModal.worker.user?.profile?.name || 'Unknown'}</h4>
                  <StatusBadge status={detailsModal.worker.status} />
                </div>
                <p className="text-text-muted mt-1">{detailsModal.worker.user?.email}</p>
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-1 text-amber-500 bg-amber-500/10 px-2 py-1 rounded-lg">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="font-bold text-sm">{detailsModal.worker.rating || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-1 text-accent-primary bg-accent-primary/10 px-2 py-1 rounded-lg">
                    <Calendar className="h-4 w-4" />
                    <span className="font-bold text-sm">{detailsModal.worker.years_of_experience || 0} Years Exp.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-bg-primary border border-border text-center">
                <p className="text-[10px] uppercase font-bold text-text-muted mb-1">Daily Rate</p>
                <p className="text-lg font-bold text-accent-primary">{detailsModal.worker.dailyRate || 0} TND</p>
              </div>
              <div className="p-4 rounded-2xl bg-bg-primary border border-border text-center">
                <p className="text-[10px] uppercase font-bold text-text-muted mb-1">Tasks</p>
                <p className="text-lg font-bold">{detailsModal.worker.completed_tasks || 0}</p>
              </div>
              <div className="p-4 rounded-2xl bg-bg-primary border border-border text-center">
                <p className="text-[10px] uppercase font-bold text-text-muted mb-1">On Time</p>
                <p className="text-lg font-bold text-emerald-500">{detailsModal.worker.on_time_rate || 0}%</p>
              </div>
              <div className="p-4 rounded-2xl bg-bg-primary border border-border text-center">
                <p className="text-[10px] uppercase font-bold text-text-muted mb-1">Disputes</p>
                <p className="text-lg font-bold text-rose-500">{detailsModal.worker.dispute_count || 0}</p>
              </div>
            </div>

            {/* Content Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h5 className="text-sm font-bold uppercase tracking-wider text-text-muted mb-3">About Worker</h5>
                  <p className="text-sm leading-relaxed text-text-secondary italic">
                    "{detailsModal.worker.bio || 'No bio provided.'}"
                  </p>
                </div>

                <div>
                  <h5 className="text-sm font-bold uppercase tracking-wider text-text-muted mb-3">Skills & Expertise</h5>
                  <div className="flex flex-wrap gap-2">
                    {detailsModal.worker.skills?.map((skill: string, idx: number) => (
                      <span key={idx} className="px-3 py-1 bg-accent-primary/5 border border-accent-primary/20 rounded-full text-xs font-bold text-accent-primary">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h5 className="text-sm font-bold uppercase tracking-wider text-text-muted mb-3">Professional Info</h5>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-text-muted">Availability</span>
                      <span className="font-bold capitalize">{detailsModal.worker.availability || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-text-muted">Languages</span>
                      <span className="font-bold">{detailsModal.worker.languages_spoken?.join(', ') || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-text-muted">Location</span>
                      <span className="font-bold">{detailsModal.worker.user?.profile?.city || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h5 className="text-sm font-bold uppercase tracking-wider text-text-muted mb-3">Certifications</h5>
                  <div className="space-y-2">
                    {detailsModal.worker.certifications?.length > 0 ? (
                      detailsModal.worker.certifications.map((cert: string, idx: number) => (
                        <div key={idx} className="flex items-center gap-2 text-sm text-emerald-600 bg-emerald-50 p-2 rounded-lg border border-emerald-100">
                          <CheckCircle2 className="h-4 w-4" />
                          <span className="font-medium">{cert}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-text-muted italic">No certifications uploaded.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Footer */}
            <div className="pt-6 border-t border-border flex justify-end gap-3">
              <button 
                onClick={() => setDetailsModal({ isOpen: false, worker: null })}
                className="btn-secondary px-6"
              >
                Close
              </button>
              {detailsModal.worker.status === 'pending' && (
                <div className="flex gap-2">
                  <button 
                    onClick={() => {
                      setDetailsModal({ isOpen: false, worker: null });
                      openConfirmModal(detailsModal.worker, 'rejected');
                    }}
                    className="bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-xl font-bold shadow-lg shadow-rose-500/20 transition-all active:scale-95"
                  >
                    Reject Profile
                  </button>
                  <button 
                    onClick={() => {
                      setDetailsModal({ isOpen: false, worker: null });
                      openConfirmModal(detailsModal.worker, 'verified');
                    }}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl font-bold shadow-lg shadow-emerald-500/30 transition-all active:scale-95"
                  >
                    Approve Profile
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default WorkersPage;
