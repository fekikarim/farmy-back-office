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
  Calendar
} from 'lucide-react';
import DataTable from '../../components/ui/DataTable';
import StatusBadge from '../../components/ui/StatusBadge';
import { cn } from '../../utils/cn';

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
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending');

  const filteredWorkers = mockWorkers.filter(worker => {
    if (activeTab === 'all') return true;
    return worker.status === activeTab;
  });

  const columns = [
    {
      header: 'Worker',
      accessor: (worker: WorkerProfile) => (
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-accent-gradient flex items-center justify-center text-white font-bold text-xs shadow-sm">
            {worker.name.charAt(0)}
          </div>
          <div>
            <p className="font-bold">{worker.name}</p>
            <p className="text-[10px] text-text-muted mt-0.5">{worker.email}</p>
          </div>
        </div>
      ),
      sortable: true
    },
    {
      header: 'Skills',
      accessor: (worker: WorkerProfile) => (
        <div className="flex flex-wrap gap-1">
          {worker.skills.map((skill, idx) => (
            <span key={idx} className="px-2 py-0.5 bg-bg-primary border border-border rounded text-[10px] font-medium text-text-muted">
              {skill}
            </span>
          ))}
        </div>
      )
    },
    {
      header: 'Daily Rate',
      accessor: (worker: WorkerProfile) => (
        <span className="font-bold text-accent-primary">{worker.dailyRate} TND</span>
      ),
      sortable: true
    },
    {
      header: 'Rating',
      accessor: (worker: WorkerProfile) => (
        <div className="flex items-center gap-1 text-amber-500">
          <Star className="h-3.5 w-3.5 fill-current" />
          <span className="font-bold text-sm">{worker.rating}</span>
        </div>
      ),
      sortable: true
    },
    {
      header: 'Submitted At',
      accessor: (worker: WorkerProfile) => (
        <div className="flex items-center gap-1.5 text-text-muted text-xs">
          <Calendar className="h-3.5 w-3.5" />
          {new Date(worker.submittedAt).toLocaleDateString()}
        </div>
      ),
      sortable: true
    },
    {
      header: 'Status',
      accessor: (worker: WorkerProfile) => <StatusBadge status={worker.status} />,
      sortable: true
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
              <p className="text-2xl font-sora font-bold text-amber-500">12</p>
            </div>
            <div className="text-center px-6">
              <p className="text-[10px] uppercase font-bold text-text-muted mb-1">Approved</p>
              <p className="text-2xl font-sora font-bold text-accent-primary">148</p>
            </div>
            <div className="text-center px-6">
              <p className="text-[10px] uppercase font-bold text-text-muted mb-1">Rejected</p>
              <p className="text-2xl font-sora font-bold text-red-500">23</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-surface p-1 rounded-xl border border-border w-fit">
        {[
          { id: 'pending', label: 'Pending Review', icon: Info },
          { id: 'approved', label: 'Approved', icon: CheckCircle2 },
          { id: 'rejected', label: 'Rejected', icon: XCircle },
          { id: 'all', label: 'All Workers', icon: UserCheck },
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

      {/* Table with Custom Row Actions */}
      <DataTable 
        columns={columns as any} 
        data={filteredWorkers}
        onSearch={(q) => console.log('Searching workers:', q)}
      />
    </div>
  );
};

export default WorkersPage;
