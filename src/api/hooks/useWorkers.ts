import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAdminWorkers, verifyWorkerProfile } from '../endpoints/workers';
import type { WorkerFilters } from '../endpoints/workers';
import { toast } from 'react-toastify';

export const useWorkers = (filters: WorkerFilters) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['workers', filters],
    queryFn: () => getAdminWorkers(filters),
  });

  const verifyMutation = useMutation({
    mutationFn: ({ profileId, status }: { profileId: string; status: 'verified' | 'rejected' }) => 
      verifyWorkerProfile(profileId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workers'] });
      toast.success('Worker status updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update worker status');
    }
  });

  return {
    ...query,
    verifyWorker: verifyMutation.mutate,
    isVerifying: verifyMutation.isPending
  };
};
