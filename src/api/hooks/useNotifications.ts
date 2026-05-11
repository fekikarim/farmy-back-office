import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMyNotifications, markAsRead, markAllAsRead } from '../endpoints/notifications';

export const useNotifications = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['notifications'],
    queryFn: getMyNotifications,
  });

  const readMutation = useMutation({
    mutationFn: markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const readAllMutation = useMutation({
    mutationFn: markAllAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  return {
    ...query,
    markAsRead: readMutation.mutate,
    markAllAsRead: readAllMutation.mutate,
  };
};
