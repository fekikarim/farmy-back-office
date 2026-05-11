import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthProvider';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  connectionStatus: 'connected' | 'reconnecting' | 'disconnected';
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const useSocketContext = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocketContext must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'reconnecting' | 'disconnected'>('disconnected');
  const { token } = useAuth();

  useEffect(() => {
    if (!token) {
      if (socket) {
        socket.close();
        setSocket(null);
        setConnectionStatus('disconnected');
      }
      return;
    }

    const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:3000';
    
    const newSocket = io(WS_URL, {
      auth: { token },
      transports: ['polling', 'websocket'],
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
      timeout: 20000,
    });

    newSocket.on('connect', () => {
      setConnectionStatus('connected');
    });

    newSocket.on('disconnect', () => {
      setConnectionStatus('disconnected');
    });

    newSocket.on('reconnect_attempt', () => {
      setConnectionStatus('reconnecting');
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [token]);

  return (
    <SocketContext.Provider value={{ socket, isConnected: connectionStatus === 'connected', connectionStatus }}>
      {children}
    </SocketContext.Provider>
  );
};
