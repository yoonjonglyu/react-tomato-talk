import { useState, useEffect, useCallback } from 'react';
import { Socket } from 'socket.io-client';
import { ChatMessage, TomatoUser } from '../types';
import { generateAnonymousNickname, getRandomAvatar } from '../core/avatar';
import { decryptMessage } from '../core/crypto';

export interface UseAnonymousChatOptions {
  socket: Socket | null;
  currentUser: TomatoUser;
  defaultRoomId?: string;
  secretKey?: string;
  onUserUpdate?: (user: Partial<TomatoUser>) => void;
  sendMessage: (roomId: string, content: string, type?: 'text' | 'image') => ChatMessage | null;
}

export interface UseAnonymousChatReturn {
  currentRoomId: string;
  changeRoom: (roomId: string) => void;
  messages: ChatMessage[];
  roomUserCount: number;
  sendTextMessage: (content: string) => void;
  sendImageMessage: (base64Image: string) => void;
  regenerateIdentity: () => void;
  clearMessages: () => void;
}

export const useAnonymousChat = ({
  socket,
  currentUser,
  defaultRoomId = 'anon_lounge',
  secretKey,
  onUserUpdate,
  sendMessage
}: UseAnonymousChatOptions): UseAnonymousChatReturn => {
  const [currentRoomId, setCurrentRoomId] = useState<string>(defaultRoomId);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [roomUserCount, setRoomUserCount] = useState<number>(1);

  // Join anonymous room on room change or connect
  useEffect(() => {
    if (!socket || !socket.connected) return;

    socket.emit('anonymous:join', { roomId: currentRoomId, user: currentUser });

    const handleRoomInfo = (data: { roomId: string; userCount: number }) => {
      if (data.roomId === currentRoomId) {
        setRoomUserCount(data.userCount);
      }
    };

    const handleMessage = (msg: ChatMessage) => {
      if (msg.roomId === currentRoomId) {
        const decryptedContent = msg.isEncrypted && secretKey
          ? decryptMessage(msg.content, secretKey)
          : msg.content;
        setMessages((prev) => {
          if (prev.some((m) => m.id === msg.id)) return prev;
          return [...prev, { ...msg, content: decryptedContent }];
        });
      }
    };

    const handleUserCount = (data: { roomId: string; count: number }) => {
      if (data.roomId === currentRoomId) {
        setRoomUserCount(data.count);
      }
    };

    socket.on('anonymous:room_info', handleRoomInfo);
    socket.on('message:receive', handleMessage);
    socket.on('room:user_count', handleUserCount);

    return () => {
      socket.emit('anonymous:leave', { roomId: currentRoomId });
      socket.off('anonymous:room_info', handleRoomInfo);
      socket.off('message:receive', handleMessage);
      socket.off('room:user_count', handleUserCount);
    };
  }, [socket, currentRoomId, currentUser]);

  const changeRoom = useCallback((newRoomId: string) => {
    if (newRoomId === currentRoomId) return;
    setMessages([]);
    setCurrentRoomId(newRoomId);
  }, [currentRoomId]);

  const sendTextMessage = useCallback((content: string) => {
    if (!content.trim()) return;
    const localMsg = sendMessage(currentRoomId, content, 'text');
    if (localMsg) {
      setMessages((prev) => {
        if (prev.some((m) => m.id === localMsg.id)) return prev;
        return [...prev, localMsg];
      });
    }
  }, [currentRoomId, sendMessage]);

  const sendImageMessage = useCallback((base64Image: string) => {
    if (!base64Image) return;
    const localMsg = sendMessage(currentRoomId, base64Image, 'image');
    if (localMsg) {
      setMessages((prev) => {
        if (prev.some((m) => m.id === localMsg.id)) return prev;
        return [...prev, localMsg];
      });
    }
  }, [currentRoomId, sendMessage]);

  const regenerateIdentity = useCallback(() => {
    const newNick = generateAnonymousNickname();
    const newAvatar = getRandomAvatar();
    if (onUserUpdate) {
      onUserUpdate({ nickname: newNick, avatar: newAvatar });
    }
  }, [onUserUpdate]);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    currentRoomId,
    changeRoom,
    messages,
    roomUserCount,
    sendTextMessage,
    sendImageMessage,
    regenerateIdentity,
    clearMessages
  };
};
