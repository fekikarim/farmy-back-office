import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  UserCheck, 
  UserX, 
  Eye, 
  Search, 
  Filter, 
  Download, 
  CheckCircle2, 
  XCircle, 
  Info,
  Star,
  Calendar,
  RefreshCw,
  AlertCircle,
  RotateCcw
} from 'lucide-react';
import DataTable from '../../components/ui/DataTable';
import StatusBadge from '../../components/ui/StatusBadge';
import Modal from '../../components/ui/Modal';
import { cn } from '../../utils/cn';
import { useWorkers } from '../../api/hooks/useWorkers';
import { format } from 'date-fns';

interface WorkerProfile {
  id: string;
  name: string;
  email: string;
  skills: string[];
  dailyRate: number;
  rating: number;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

const mockWorkers: WorkerProfile[] = [
  { id: '1', name: 'Samir Dridi', email: 'samir.worker@gmail.com', skills: ['Pruning', 'Irrigation'], dailyRate: 45, rating: 4.8, submittedAt: '2026-05-08T10:30:00Z', status: 'pending' },
  { id: '2', name: 'Hedi Mansour', email: 'hedi.m@gmail.com', skills: ['Harvesting', 'Pesticides'], dailyRate: 40, rating: 4.5, submittedAt: '2026-05-07T14:20:00Z', status: 'approved' },
  { id: '3', name: 'Zied Ayari', email: 'zied.ayari@gmail.com', skills: ['Tractor Driving', 'Maintenance'], dailyRate: 60, rating: 4.9, submittedAt: '2026-05-06T09:15:00Z', status: 'approved' },
  { id: '4', name: 'Faten Riahi', email: 'faten.r@gmail.com', skills: ['Packaging', 'Sorting'], dailyRate: 35, rating: 4.2, submittedAt: '2026-05-05T16:45:00Z', status: 'rejected' },
  { id: '5', name: 'Omar Gabsi', email: 'omar.g@gmail.com', skills: ['Livestock Care'], dailyRate: 50, rating: 4.7, submittedAt: '2026-05-09T08:00:00Z', status: 'pending' },
];

const WorkersPage = () => {
  const [activeTab, setActiveTab] = useState<'pending' | 'verified' | 'rejected' | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

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


  // Debounce search
  React.useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const filters = React.useMemo(() => ({
    status: activeTab === 'all' ? undefined : activeTab,
    search: debouncedSearch || undefined,
    page: currentPage,
    limit: pageSize
  }), [activeTab, debouncedSearch, currentPage]);

  const { data: workersData, isLoading, error, refetch, isFetching, verifyWorker, isVerifying } = useWorkers(filters);

  const handleRefresh = () => {
    refetch();
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

  const handleVerify = (worker: any) => {
    openConfirmModal(worker, 'verified');
  };

  const handleReject = (worker: any) => {
    openConfirmModal(worker, 'rejected');
  };

  const handleReset = (worker: any) => {
    openConfirmModal(worker, 'pending');
  };

  const handleViewDetails = (worker: any) => {
    setDetailsModal({
      isOpen: true,
      worker
    });
  };



  const columns = [
    {
      header: 'Worker',
      accessor: (worker: any) => (
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-accent-gradient flex items-center justify-center text-white font-bold text-xs shadow-sm">
            {worker.user?.profile?.name?.charAt(0) || '?'}
          </div>
          <div>
            <p className="font-bold">{worker.user?.profile?.name || 'Unknown'}</p>
            <p className="text-[10px] text-text-muted mt-0.5">{worker.user?.email}</p>
          </div>
        </div>
      ),
      sortable: true
    },
    {
      header: 'Skills',
      accessor: (worker: any) => (
        <div className="flex flex-wrap gap-1">
          {worker.skills?.map((skill: string, idx: number) => (
            <span key={idx} className="px-2 py-0.5 bg-bg-primary border border-border rounded text-[10px] font-medium text-text-muted">
              {skill}
            </span>
          ))}
        </div>
      )
    },
    {
      header: 'Daily Rate',
      accessor: (worker: any) => (
        <span className="font-bold text-accent-primary">{worker.hourly_rate * 8} TND</span>
      ),
      sortable: true
    },
    {
      header: 'Rating',
      accessor: (worker: any) => (
        <div className="flex items-center gap-1 text-amber-500">
          <Star className="h-3.5 w-3.5 fill-current" />
          <span className="font-bold text-sm">{worker.rating || 'N/A'}</span>
        </div>
      ),
      sortable: true
    },
    {
      header: 'Submitted At',
      accessor: (worker: any) => (
        <div className="flex items-center gap-1.5 text-text-muted text-xs">
          <Calendar className="h-3.5 w-3.5" />
          {format(new Date(worker.createdAt), 'MMM dd, yyyy')}
        </div>
      ),
      sortable: true
    },
    {
      header: 'Status',
      accessor: (worker: any) => <StatusBadge status={worker.verification_status} />,
      sortable: true
    },
    {
      header: 'Actions',
      accessor: (worker: any) => (
        <div className="flex items-center gap-1">
          {worker.verification_status === 'pending' ? (
            <>
              <button 
                onClick={() => handleVerify(worker)}
                disabled={isVerifying}
                className="p-1.5 rounded-lg hover:bg-emerald-500/10 text-emerald-500 transition-all active:scale-95"
                title="Verify Worker"
              >
                <CheckCircle2 className="h-4 w-4" />
              </button>
              <button 
                onClick={() => handleReject(worker)}
                disabled={isVerifying}
                className="p-1.5 rounded-lg hover:bg-rose-500/10 text-rose-500 transition-all active:scale-95"
                title="Reject Worker"
              >
                <XCircle className="h-4 w-4" />
              </button>
            </>
          ) : (
            <button 
              onClick={() => handleReset(worker)}
              disabled={isVerifying}
              className="p-1.5 rounded-lg hover:bg-amber-500/10 text-amber-500 transition-all active:scale-95"
              title="Reset to Pending"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          )}

          {worker.verification_status === 'rejected' && (
            <button 
              onClick={() => handleVerify(worker)}
              disabled={isVerifying}
              className="p-1.5 rounded-lg hover:bg-emerald-500/10 text-emerald-500 transition-all active:scale-95"
              title="Verify Anyway"
            >
              <CheckCircle2 className="h-4 w-4" />
            </button>
          )}

          {worker.verification_status === 'verified' && (
            <button 
              onClick={() => handleReject(worker)}
              disabled={isVerifying}
              className="p-1.5 rounded-lg hover:bg-rose-500/10 text-rose-500 transition-all active:scale-95"
              title="Reject Worker"
            >
              <XCircle className="h-4 w-4" />
            </button>
          )}


          <button 
            onClick={() => handleViewDetails(worker)}
            className="p-1.5 rounded-lg hover:bg-accent-primary/10 text-accent-primary transition-all active:scale-95"
            title="View Details"
          >
            <Eye className="h-4 w-4" />
          </button>
        </div>
      )
    }


  ];

  return (
    <div className="space-y-6">
      <Helmet>
        <title>Worker KYC Review | Farmy Back Office</title>
      </Helmet>

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl tracking-tight">Worker Profiles & KYC</h1>
          <p className="text-text-muted mt-1">Review and verify agricultural workers for the platform.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={handleRefresh}
            className={cn(
              "p-2 rounded-xl border border-border bg-surface hover:bg-bg-primary transition-all text-text-muted",
              isFetching && "animate-spin text-accent-primary"
            )}
            title="Refresh Data"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
          <button className="btn-secondary flex items-center gap-2 text-sm">
            <Download className="h-4 w-4" /> Export Report
          </button>
        </div>
      </div>

      {/* Analytics Card at Top */}
      <div className="glass-card p-6 bg-accent-primary/5 border-accent-primary/10">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 w-full">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold">Verification Progress</span>
              <span className="text-xs text-text-muted">75% Overall Approval Rate</span>
            </div>
            <div className="h-2 w-full bg-border rounded-full overflow-hidden">
              <div className="h-full bg-accent-primary w-3/4 shadow-accent-glow"></div>
            </div>
          </div>
          
          <div className="flex items-center gap-6 divide-x divide-border">
            <div className="text-center px-6">
              <p className="text-[10px] uppercase font-bold text-text-muted mb-1">Pending</p>
              {isLoading ? (
                <div className="h-8 w-12 bg-border/40 rounded animate-pulse mx-auto"></div>
              ) : (
                <p className="text-2xl font-sora font-bold text-amber-500">{workersData?.stats?.pending || 0}</p>
              )}
            </div>
            <div className="text-center px-6">
              <p className="text-[10px] uppercase font-bold text-text-muted mb-1">Approved</p>
              {isLoading ? (
                <div className="h-8 w-12 bg-border/40 rounded animate-pulse mx-auto"></div>
              ) : (
                <p className="text-2xl font-sora font-bold text-accent-primary">{workersData?.stats?.verified || 0}</p>
              )}
            </div>
            <div className="text-center px-6">
              <p className="text-[10px] uppercase font-bold text-text-muted mb-1">Rejected</p>
              {isLoading ? (
                <div className="h-8 w-12 bg-border/40 rounded animate-pulse mx-auto"></div>
              ) : (
                <p className="text-2xl font-sora font-bold text-red-500">{workersData?.stats?.rejected || 0}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-surface p-1 rounded-xl border border-border w-fit max-w-full overflow-x-auto no-scrollbar">
        {[
          { id: 'all', label: 'All Workers', icon: UserCheck },
          { id: 'pending', label: 'Pending Review', icon: Info },
          { id: 'verified', label: 'Approved', icon: CheckCircle2 },
          { id: 'rejected', label: 'Rejected', icon: XCircle },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all",
              activeTab === tab.id 
                ? "bg-accent-primary text-white shadow-md" 
                : "text-text-muted hover:text-text-primary hover:bg-bg-primary"
            )}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
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
          <button onClick={handleRefresh} className="btn-primary px-6">Retry Connection</button>
        </div>
      )}

      {/* Table with Custom Row Actions */}
      {!error && (
        <DataTable 
          columns={columns as any} 
          data={workersData?.data || []}
          isLoading={isLoading}
          onSearch={setSearchTerm}
          totalItems={workersData?.pagination?.total}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
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
              {isVerifying && <RefreshCw className="h-4 w-4 animate-spin" />}
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
                  <StatusBadge status={detailsModal.worker.verification_status} />
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
                <p className="text-lg font-bold text-accent-primary">{detailsModal.worker.hourly_rate * 8} TND</p>
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
                      <span className="font-bold capitalize">{detailsModal.worker.availability}</span>
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
              {detailsModal.worker.verification_status === 'pending' && (
                <div className="flex gap-2">
                  <button 
                    onClick={() => {
                      setDetailsModal({ isOpen: false, worker: null });
                      handleReject(detailsModal.worker);
                    }}
                    className="bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-xl font-bold shadow-lg shadow-rose-500/20 transition-all active:scale-95"
                  >
                    Reject Profile
                  </button>
                  <button 
                    onClick={() => {
                      setDetailsModal({ isOpen: false, worker: null });
                      handleVerify(detailsModal.worker);
                    }}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl font-bold shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
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
