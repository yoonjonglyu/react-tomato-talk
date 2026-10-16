import { useEffect, useRef, useState, useCallback } from 'react';
import { Socket } from 'socket.io-client';
import { TomatoSocketClient } from '../core/socket';
import { ChatMessage, TomatoConfig, TomatoUser } from '../types';

export interface UseTomatoSocketReturn {
  socket: Socket | null;
  isConnected: boolean;
  currentUser: TomatoUser;
  updateUser: (user: Partial<TomatoUser>) => void;
  sendMessage: (roomId: string, content: string, type?: 'text' | 'image') => ChatMessage | null;
  client: TomatoSocketClient | null;
}

export const useTomatoSocket = (config: TomatoConfig): UseTomatoSocketReturn => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<TomatoUser>(() => ({
    id: config.user?.id || '',
    nickname: config.user?.nickname || '익명의 토마토',
    avatar: config.user?.avatar || '🍅',
    status: 'online',
    joinedAt: Date.now()
  }));

  const clientRef = useRef<TomatoSocketClient | null>(null);
  const [socketInstance, setSocketInstance] = useState<Socket | null>(null);

  useEffect(() => {
    const client = new TomatoSocketClient(config);
    clientRef.current = client;
    const socket = client.connect();
    setSocketInstance(socket);

    const onConnect = () => {
      setIsConnected(true);
      setCurrentUser(client.getUser());
    };

    const onDisconnect = () => {
      setIsConnected(false);
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    if (socket.connected) {
      setIsConnected(true);
      setCurrentUser(client.getUser());
    }

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      client.disconnect();
    };
  }, [config.url, config.secretKey]);

  const updateUser = useCallback((userData: Partial<TomatoUser>) => {
    if (clientRef.current) {
      clientRef.current.setUser(userData);
      setCurrentUser(clientRef.current.getUser());
    }
  }, []);

  const sendMessage = useCallback((roomId: string, content: string, type: 'text' | 'image' = 'text') => {
    if (!clientRef.current) return null;
    return clientRef.current.sendMessage(roomId, content, type);
  }, []);

  return {
    socket: socketInstance,
    isConnected,
    currentUser,
    updateUser,
    sendMessage,
    client: clientRef.current
  };
};
