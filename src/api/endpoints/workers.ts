import axiosInstance from '../axiosInstance';

export interface WorkerFilters {
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export const getAdminWorkers = async (filters: WorkerFilters) => {
  const response = await axiosInstance.get('/worker-profiles/admin/profiles', { params: filters });
  return response.data;
};

export const verifyWorkerProfile = async (profileId: string, status: 'verified' | 'rejected' | 'pending') => {
  const response = await axiosInstance.patch(`/worker-profiles/${profileId}/verify`, { status });
  return response.data;
};
