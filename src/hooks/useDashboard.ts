import { useQuery } from '@tanstack/react-query';
import { getDashboardStats } from '../api/endpoints/dashboard';
import type { DashboardStats } from '../api/endpoints/dashboard';
import { useEffect, useState } from 'react';
import { useSocketContext } from '../providers/SocketProvider';

export const useDashboard = () => {
  const { socket } = useSocketContext();
  const [liveActivities, setLiveActivities] = useState<DashboardStats['activities']>([]);

  const query = useQuery({
    queryKey: ['adminDashboardStats'],
    queryFn: getDashboardStats,
    refetchInterval: 300000, // Refetch every 5 minutes as a fallback
  });

  // Sync initial activities from query
  useEffect(() => {
    if (query.data?.activities) {
      setLiveActivities(query.data.activities);
    }
  }, [query.data]);

  // Handle real-time updates via Socket.io
  useEffect(() => {
    if (!socket) return;

    const handleNewActivity = (activity: any) => {
      setLiveActivities(prev => [activity, ...prev].slice(0, 10));
      // Optionally invalidate query to refresh KPIs
      // queryClient.invalidateQueries({ queryKey: ['adminDashboardStats'] });
    };

    socket.on('new_platform_activity', handleNewActivity);
    socket.on('stats_update', () => query.refetch());

    return () => {
      socket.off('new_platform_activity', handleNewActivity);
      socket.off('stats_update');
    };
  }, [socket, query]);

  return {
    ...query,
    liveActivities,
  };
};
