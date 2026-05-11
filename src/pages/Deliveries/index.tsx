import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  Truck, 
  Package, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  ChevronRight, 
  User, 
  Eye, 
  RefreshCw, 
  AlertCircle,
  ClipboardList,
  Navigation,
  ArrowRight
} from 'lucide-react';
import DataTable from '../../components/ui/DataTable';
import StatusBadge from '../../components/ui/StatusBadge';
import Modal from '../../components/ui/Modal';
import { cn } from '../../utils/cn';
import { useDeliveries } from '../../api/hooks/useDeliveries';
import { format } from 'date-fns';

const DELIVERY_STATUSES = [
  'ORDER_CREATED',
  'CONFIRMED',
  'PREPARING',
  'OUT_FOR_DELIVERY',
  'NEARBY',
  'DELIVERED',
  'CANCELLED'
];

const DELIVERY_TRANSITIONS: Record<string, string[]> = {
  'ORDER_CREATED': ['CONFIRMED', 'CANCELLED'],
  'CONFIRMED': ['PREPARING', 'CANCELLED'],
  'PREPARING': ['OUT_FOR_DELIVERY', 'CANCELLED'],
  'OUT_FOR_DELIVERY': ['NEARBY', 'DELIVERED', 'CANCELLED'],
  'NEARBY': ['DELIVERED', 'CANCELLED'],
  'DELIVERED': [],
  'CANCELLED': []
};


const DeliveriesPage = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'ORDER_CREATED' | 'OUT_FOR_DELIVERY' | 'DELIVERED'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    deliveryId: string;
    newStatus: string | null;
  }>({
    isOpen: false,
    deliveryId: '',
    newStatus: null
  });

  const [detailsModal, setDetailsModal] = useState<{
    isOpen: boolean;
    delivery: any | null;
  }>({
    isOpen: false,
    delivery: null
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

  const { data: deliveriesData, isLoading, error, refetch, isFetching, updateStatus, isUpdating } = useDeliveries(filters);

  const handleRefresh = () => {
    refetch();
  };

  const handleStatusChange = (deliveryId: string, status: string) => {
    setConfirmModal({
      isOpen: true,
      deliveryId,
      newStatus: status
    });
  };

  const handleConfirmStatus = () => {
    if (confirmModal.deliveryId && confirmModal.newStatus) {
      updateStatus({ deliveryId: confirmModal.deliveryId, status: confirmModal.newStatus }, {
        onSuccess: () => {
          setConfirmModal(prev => ({ ...prev, isOpen: false }));
          // If details modal is open, update its local delivery status too or refetch
          if (detailsModal.isOpen) {
            setDetailsModal(prev => ({
              ...prev,
              delivery: { ...prev.delivery, delivery_status: confirmModal.newStatus }
            }));
          }
        }
      });
    }
  };

  const handleViewDetails = (delivery: any) => {
    setDetailsModal({
      isOpen: true,
      delivery
    });
  };


  const columns = [
    {
      header: 'Delivery ID',
      accessor: (d: any) => (
        <div className="flex items-center gap-2">
          <Truck className="h-4 w-4 text-text-muted" />
          <span className="font-mono font-bold text-xs">{d.id.substring(0, 8)}...</span>
        </div>
      ),
      sortable: true,
      sortKey: 'id'
    },
    {
      header: 'Order Ref',
      accessor: (d: any) => (
        <span className="text-text-muted font-bold text-xs">#{d.order_id.substring(0, 8)}</span>
      ),
      sortable: true,
      sortKey: 'order_id'
    },
    {
      header: 'Parties',
      accessor: (d: any) => (
        <div className="text-xs space-y-1">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold text-blue-500 uppercase w-10">Buyer:</span>
            <span className="font-medium">{d.buyer?.name || 'Unknown'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold text-accent-primary uppercase w-10">Seller:</span>
            <span className="font-medium">{d.seller?.name || 'Unknown'}</span>
          </div>
        </div>
      )
    },
    {
      header: 'Status',
      accessor: (d: any) => (
        <div className="flex flex-col gap-1.5">
          <StatusBadge status={d.delivery_status} />
          {d.delivery_status === 'OUT_FOR_DELIVERY' && (
            <div className="flex items-center gap-1 text-[10px] text-accent-primary font-bold animate-pulse">
              <MapPin className="h-3 w-3" /> LIVE TRACKING
            </div>
          )}
        </div>
      ),
      sortable: true,
      sortKey: 'delivery_status'
    },
    {
      header: 'Timing',
      accessor: (d: any) => (
        <div className="text-xs space-y-1 text-text-muted">
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            <span>ETA: {d.estimated_delivery_time ? format(new Date(d.estimated_delivery_time), 'HH:mm') : 'N/A'}</span>
          </div>
          {d.delivered_at && (
            <div className="flex items-center gap-1.5 text-emerald-500 font-bold">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Delivered</span>
            </div>
          )}
        </div>
      )
    },
    {
      header: 'Actions',
      accessor: (d: any) => (
        <button 
          onClick={() => handleViewDetails(d)}
          className="p-2 rounded-xl hover:bg-accent-primary/10 text-accent-primary transition-all active:scale-95"
          title="View Details"
        >
          <Eye className="h-5 w-5" />
        </button>
      )
    }
  ];


  return (
    <div className="space-y-6">
      <Helmet>
        <title>Deliveries | Farmy Back Office</title>
      </Helmet>

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl tracking-tight">Delivery Pipeline</h1>
          <p className="text-text-muted mt-1">Real-time tracking of marketplace product shipments.</p>
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
          <button className="btn-primary flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4" /> Global Map View
          </button>
        </div>
      </div>

      {/* Stats Pipeline */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Created', value: deliveriesData?.stats?.created || 0, color: 'border-indigo-500', bg: 'bg-indigo-500/5', icon: Package },
          { label: 'In Transit', value: deliveriesData?.stats?.in_transit || 0, color: 'border-blue-500', bg: 'bg-blue-500/5', icon: Truck },
          { label: 'Delivered', value: deliveriesData?.stats?.delivered || 0, color: 'border-emerald-500', bg: 'bg-emerald-500/5', icon: CheckCircle2 },
          { label: 'Cancelled', value: deliveriesData?.stats?.cancelled || 0, color: 'border-red-500', bg: 'bg-red-500/5', icon: XCircle },
        ].map((stat, idx) => (
          <div key={idx} className={cn("glass-card p-4 border-l-4 transition-all hover:scale-[1.02]", stat.color, stat.bg)}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase font-bold text-text-muted mb-1">{stat.label}</p>
                {isLoading ? (
                  <div className="h-8 w-12 bg-border/40 rounded animate-pulse"></div>
                ) : (
                  <p className="text-2xl font-sora font-bold">{stat.value}</p>
                )}
              </div>
              <stat.icon className={cn("h-8 w-8 opacity-20", stat.color.replace('border', 'text'))} />
            </div>
          </div>
        ))}
      </div>


      {/* Tabs */}
      <div className="flex items-center gap-1 bg-surface p-1 rounded-xl border border-border w-fit">
        {[
          { id: 'all', label: 'All Shipments' },
          { id: 'ORDER_CREATED', label: 'New Orders' },
          { id: 'OUT_FOR_DELIVERY', label: 'In Transit' },
          { id: 'DELIVERED', label: 'Completed' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-bold transition-all",
              activeTab === tab.id 
                ? "bg-accent-primary text-white shadow-md" 
                : "text-text-muted hover:text-text-primary hover:bg-bg-primary"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table */}
      {/* Error State */}
      {error && (
        <div className="flex flex-col items-center justify-center p-12 bg-rose-500/5 border border-rose-500/20 rounded-2xl text-center space-y-4">
          <div className="h-12 w-12 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500">
            <AlertCircle className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold">Failed to fetch deliveries</h3>
            <p className="text-text-muted max-w-xs mx-auto">Error communicating with the logistics server.</p>
          </div>
          <button onClick={handleRefresh} className="btn-primary px-6">Retry Connection</button>
        </div>
      )}

      {/* Table */}
      {!error && (
        <DataTable 
          columns={columns as any} 
          data={deliveriesData?.data || []}
          isLoading={isLoading}
          onSearch={setSearchTerm}
          totalItems={deliveriesData?.pagination?.total}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          remotePagination={true}
        />
      )}

      {/* Details Modal */}
      <Modal
        isOpen={detailsModal.isOpen}
        onClose={() => setDetailsModal({ isOpen: false, delivery: null })}
        title="Delivery Shipment Details"
        className="max-w-3xl"
      >
        {detailsModal.delivery && (
          <div className="space-y-8">
            {/* Modal Header Stats */}
            <div className="flex items-center justify-between p-4 bg-bg-primary border border-border rounded-2xl">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-accent-gradient flex items-center justify-center text-white">
                  <Truck className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs text-text-muted font-bold">SHIPMENT ID</p>
                  <p className="font-mono font-bold text-accent-primary">{detailsModal.delivery.id}</p>
                </div>
              </div>
              <StatusBadge status={detailsModal.delivery.delivery_status} className="scale-110" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column: Tracking & Timeline */}
              <div className="space-y-6">
                <div>
                  <h5 className="text-sm font-bold uppercase tracking-wider text-text-muted mb-4 flex items-center gap-2">
                    <ClipboardList className="h-4 w-4" /> Delivery Timeline
                  </h5>
                  <div className="space-y-4 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
                    {detailsModal.delivery.timeline?.map((step: any, idx: number) => (
                      <div key={idx} className="relative pl-8">
                        <div className={cn(
                          "absolute left-0 top-1 h-6 w-6 rounded-full border-2 border-surface flex items-center justify-center",
                          step.state === 'completed' ? "bg-emerald-500" : "bg-bg-primary"
                        )}>
                          {step.state === 'completed' && <CheckCircle2 className="h-3 w-3 text-white" />}
                        </div>
                        <div>
                          <p className={cn("text-sm font-bold", step.state === 'current' ? "text-accent-primary" : "text-text-primary")}>
                            {step.label}
                          </p>
                          <p className="text-[10px] text-text-muted">
                            {step.timestamp ? format(new Date(step.timestamp), 'MMM dd, yyyy HH:mm') : 'Pending'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {detailsModal.delivery.delivery_address && (
                  <div>
                    <h5 className="text-sm font-bold uppercase tracking-wider text-text-muted mb-3 flex items-center gap-2">
                      <Navigation className="h-4 w-4" /> Destination
                    </h5>
                    <div className="p-3 bg-bg-primary border border-border rounded-xl text-sm italic">
                      {detailsModal.delivery.delivery_address}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Actions & Details */}
              <div className="space-y-6">
                <div>
                  <h5 className="text-sm font-bold uppercase tracking-wider text-text-muted mb-4">Management Actions</h5>
                  <div className="grid grid-cols-1 gap-2">
                    {DELIVERY_STATUSES.map((status) => {
                      const isCurrent = detailsModal.delivery.delivery_status === status;
                      const canTransition = DELIVERY_TRANSITIONS[detailsModal.delivery.delivery_status]?.includes(status);
                      
                      if (isCurrent) return null;

                      return (
                        <button
                          key={status}
                          disabled={!canTransition || isUpdating}
                          onClick={() => handleStatusChange(detailsModal.delivery.id, status)}
                          className={cn(
                            "flex items-center justify-between px-4 py-3 rounded-xl border text-sm font-bold transition-all active:scale-95",
                            canTransition 
                              ? "border-accent-primary/20 bg-accent-primary/5 text-accent-primary hover:bg-accent-primary/10" 
                              : "border-border bg-bg-primary text-text-muted opacity-40 cursor-not-allowed"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <ArrowRight className="h-4 w-4" />
                            <span>Move to {status.replace(/_/g, ' ')}</span>
                          </div>
                          {isUpdating && <RefreshCw className="h-3 w-3 animate-spin" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-accent-primary/5 border border-accent-primary/10 space-y-4">
                  <h5 className="text-sm font-bold text-accent-primary uppercase tracking-widest">Order Info</h5>
                  <div className="space-y-3">
                    <div className="flex justify-between text-xs">
                      <span className="text-text-muted">Buyer</span>
                      <span className="font-bold">{detailsModal.delivery.buyer?.name}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-text-muted">Seller</span>
                      <span className="font-bold">{detailsModal.delivery.seller?.name}</span>
                    </div>
                    {detailsModal.delivery.driver && (
                      <div className="flex justify-between text-xs">
                        <span className="text-text-muted">Driver</span>
                        <span className="font-bold text-blue-500">{detailsModal.delivery.driver?.name}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Confirmation Modal */}
      <Modal
        isOpen={confirmModal.isOpen}
        onClose={() => !isUpdating && setConfirmModal(prev => ({ ...prev, isOpen: false }))}
        title="Update Shipment Status"
        className="max-w-md"
      >
        <div className="space-y-6">
          <div className="text-center space-y-4">
            <div className="h-16 w-16 rounded-full bg-accent-primary/10 text-accent-primary flex items-center justify-center mx-auto">
              <RefreshCw className={cn("h-8 w-8", isUpdating && "animate-spin")} />
            </div>
            <div>
              <h4 className="text-lg font-bold">Confirm Status Transition?</h4>
              <p className="text-sm text-text-muted mt-1">
                You are about to change this shipment's status to{' '}
                <span className="text-accent-primary font-bold uppercase">{confirmModal.newStatus?.replace(/_/g, ' ')}</span>.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button 
              disabled={isUpdating}
              onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
              className="flex-1 btn-secondary"
            >
              Cancel
            </button>
            <button 
              disabled={isUpdating}
              onClick={handleConfirmStatus}
              className="flex-1 btn-primary flex items-center justify-center gap-2"
            >
              {isUpdating && <RefreshCw className="h-4 w-4 animate-spin" />}
              Confirm Update
            </button>
          </div>
        </div>
      </Modal>
    </div>

  );
};

export default DeliveriesPage;
