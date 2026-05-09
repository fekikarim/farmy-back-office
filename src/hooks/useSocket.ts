import { useEffect } from 'react';
import { useSocketContext } from '../providers/SocketProvider';

export const useSocket = (event: string, callback: (data: any) => void) => {
  const { socket } = useSocketContext();

  useEffect(() => {
    if (!socket) return;

    socket.on(event, callback);

    return () => {
      socket.off(event, callback);
    };
  }, [socket, event, callback]);
};
