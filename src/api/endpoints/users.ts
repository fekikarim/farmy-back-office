import axiosInstance from '../axiosInstance';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'suspended' | 'banned';
  joinDate: string;
  region: string;
  isVerified: boolean;
  kycStatus: string;
}

export interface UserFilters {
  search?: string;
  role?: string;
  status?: string;
  region?: string;
  joinDate?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  page?: number;
  limit?: number;
}

export const getUsers = async (filters: UserFilters) => {
  const response = await axiosInstance.get('/users', { params: filters });
  return response.data;
};

export const updateUser = async (id: string, data: Partial<User>) => {
  const response = await axiosInstance.put(`/users/${id}`, data);
  return response.data;
};

export const createAdmin = async (data: any) => {
  const response = await axiosInstance.post('/users/admins', data);
  return response.data;
};

export const exportUsers = async () => {
  const response = await axiosInstance.get('/users/export', { responseType: 'blob' });
  return response.data;
};
