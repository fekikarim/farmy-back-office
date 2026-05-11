import axiosInstance from '../axiosInstance';

export interface DeliveryFilters {
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export const getAdminDeliveries = async (filters: DeliveryFilters) => {
  const response = await axiosInstance.get('/deliveries/admin/all', { params: filters });
  return response.data;
};

export const updateDeliveryStatus = async (deliveryId: string, status: string, note?: string) => {
  const response = await axiosInstance.patch(`/deliveries/${deliveryId}/status`, { status, note });
  return response.data;
};
