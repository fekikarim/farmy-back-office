import axiosInstance from '../axiosInstance';

export const getMyNotifications = async () => {
  const response = await axiosInstance.get('/notifications');
  return response.data;
};

export const markAsRead = async (id: string) => {
  const response = await axiosInstance.patch(`/notifications/${id}/read`);
  return response.data;
};

export const markAllAsRead = async () => {
  const response = await axiosInstance.patch('/notifications/read-all');
  return response.data;
};
