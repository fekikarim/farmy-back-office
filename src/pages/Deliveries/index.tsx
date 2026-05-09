import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Truck, Package, MapPin, Clock, CheckCircle2, XCircle, ChevronRight, User } from 'lucide-react';
import DataTable from '../../components/ui/DataTable';
import StatusBadge from '../../components/ui/StatusBadge';
import { cn } from '../../utils/cn';

interface DeliveryData {
  id: string;
  orderRef: string;
  buyer: string;
  seller: string;
  status: 'order_created' | 'preparing' | 'in_transit' | 'delivered' | 'cancelled';
  estimatedDelivery: string;
  startedAt?: string;
  deliveredAt?: string;
}

const mockDeliveries: DeliveryData[] = [
  { id: 'DEL-1024', orderRef: '#ORD-7721', buyer: 'Leila Jazi', seller: 'Ali Ben Salem', status: 'in_transit', estimatedDelivery: '2026-05-09T16:00:00Z', startedAt: '2026-05-09T14:30:00Z' },
  { id: 'DEL-1025', orderRef: '#ORD-7725', buyer: 'Mouna Sellami', seller: 'Ahmed Rezgui', status: 'order_created', estimatedDelivery: '2026-05-10T11:00:00Z' },
  { id: 'DEL-1023', orderRef: '#ORD-7718', buyer: 'Karim Feki', seller: 'Ali Ben Salem', status: 'delivered', estimatedDelivery: '2026-05-09T12:00:00Z', startedAt: '2026-05-09T10:00:00Z', deliveredAt: '2026-05-09T11:45:00Z' },
  { id: 'DEL-1020', orderRef: '#ORD-7702', buyer: 'Sami Amri', seller: 'Mourad Trabelsi', status: 'cancelled', estimatedDelivery: '2026-05-08T15:00:00Z' },
];

const DeliveriesPage = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'order_created' | 'in_transit' | 'delivered'>('all');

  const filteredDeliveries = mockDeliveries.filter(d => {
    if (activeTab === 'all') return true;
    return d.status === activeTab;
  });

  const columns = [
    {
      header: 'Delivery ID',
      accessor: (d: DeliveryData) => (
        <div className="flex items-center gap-2">
          <Truck className="h-4 w-4 text-text-muted" />
          <span className="font-mono font-bold text-xs">{d.id}</span>
        </div>
      ),
      sortable: true
    },
    {
      header: 'Order Ref',
      accessor: 'orderRef',
      className: 'text-text-muted'
    },
    {
      header: 'Parties',
      accessor: (d: DeliveryData) => (
        <div className="text-xs space-y-1">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold text-blue-500 uppercase w-10">Buyer:</span>
            <span className="font-medium">{d.buyer}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold text-accent-primary uppercase w-10">Seller:</span>
            <span className="font-medium">{d.seller}</span>
          </div>
        </div>
      )
    },
    {
      header: 'Status',
      accessor: (d: DeliveryData) => (
        <div className="flex flex-col gap-1.5">
          <StatusBadge status={d.status} />
          {d.status === 'in_transit' && (
            <div className="flex items-center gap-1 text-[10px] text-accent-primary font-bold animate-pulse">
              <MapPin className="h-3 w-3" /> LIVE TRACKING
            </div>
          )}
        </div>
      ),
      sortable: true
    },
    {
      header: 'Timing',
      accessor: (d: DeliveryData) => (
        <div className="text-xs space-y-1 text-text-muted">
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            <span>ETA: {new Date(d.estimatedDelivery).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
          {d.deliveredAt && (
            <div className="flex items-center gap-1.5 text-emerald-500 font-bold">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Delivered</span>
            </div>
          )}
        </div>
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
          <button className="btn-primary flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4" /> Global Map View
          </button>
        </div>
      </div>

      {/* Stats Pipeline */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Created', value: 5, color: 'border-indigo-500', bg: 'bg-indigo-500/5', icon: Package },
          { label: 'In Transit', value: 12, color: 'border-blue-500', bg: 'bg-blue-500/5', icon: Truck },
          { label: 'Delivered', value: 84, color: 'border-emerald-500', bg: 'bg-emerald-500/5', icon: CheckCircle2 },
          { label: 'Cancelled', value: 3, color: 'border-red-500', bg: 'bg-red-500/5', icon: XCircle },
        ].map((stat, idx) => (
          <div key={idx} className={cn("glass-card p-4 border-l-4", stat.color, stat.bg)}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase font-bold text-text-muted mb-1">{stat.label}</p>
                <p className="text-2xl font-sora font-bold">{stat.value}</p>
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
          { id: 'order_created', label: 'New Orders' },
          { id: 'in_transit', label: 'In Transit' },
          { id: 'delivered', label: 'Completed' },
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
      <DataTable 
        columns={columns as any} 
        data={filteredDeliveries}
      />
    </div>
  );
};

export default DeliveriesPage;
