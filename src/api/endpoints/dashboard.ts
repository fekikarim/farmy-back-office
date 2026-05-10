import axiosInstance from '../axiosInstance';

export interface DashboardStats {
  kpis: {
    totalUsers: number;
    totalRevenue: number;
    activeLands: number;
    pendingActions: number;
  };
  userDistribution: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  revenueHistory: Array<{
    name: string;
    value: number;
  }>;
  attentionRequired: Array<{
    id: string;
    title: string;
    count: number;
    color: 'amber' | 'blue' | 'indigo' | 'emerald' | 'red';
  }>;
  activities: Array<{
    id: string;
    type: string;
    user: string;
    action: string;
    time: string;
    color: string;
  }>;
}

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const response = await axiosInstance.get('/admin/stats');
  return response.data.data;
};
