import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAdminDeliveries, updateDeliveryStatus } from '../endpoints/deliveries';
import type { DeliveryFilters } from '../endpoints/deliveries';
import { toast } from 'react-toastify';

export const useDeliveries = (filters: DeliveryFilters) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['deliveries', filters],
    queryFn: () => getAdminDeliveries(filters),
  });

  const statusMutation = useMutation({
    mutationFn: ({ deliveryId, status, note }: { deliveryId: string; status: string; note?: string }) => 
      updateDeliveryStatus(deliveryId, status, note),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['deliveries'] });
      toast.success(data.message || 'Delivery status updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update delivery status');
    }
  });

  return {
    ...query,
    updateStatus: statusMutation.mutate,
    isUpdating: statusMutation.isPending
  };
};
