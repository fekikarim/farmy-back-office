import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUsers, updateUser, createAdmin, exportUsers } from '../api/endpoints/users';
import type { UserFilters } from '../api/endpoints/users';

export const useUsers = (filters: UserFilters) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['users', filters],
    queryFn: () => getUsers(filters),
    placeholderData: (previousData) => previousData,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const createAdminMutation = useMutation({
    mutationFn: createAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const handleExport = async () => {
    try {
      const blob = await exportUsers();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'users_export.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  return {
    ...query,
    updateUser: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    createAdmin: createAdminMutation.mutate,
    isCreating: createAdminMutation.isPending,
    handleExport
  };
};
