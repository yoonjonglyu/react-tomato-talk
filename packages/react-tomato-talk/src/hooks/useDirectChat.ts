import { useState, useEffect, useCallback, useRef } from 'react';
import { Socket } from 'socket.io-client';
import { ChatMessage, TomatoUser } from '../types';
import { decryptMessage } from '../core/crypto';

export interface UseDirectChatOptions {
  socket: Socket | null;
  currentUser: TomatoUser;
  secretKey?: string;
  sendMessage: (roomId: string, content: string, type?: 'text' | 'image') => ChatMessage | null;
}

export interface UseDirectChatReturn {
  onlineUsers: TomatoUser[];
  activePartner: TomatoUser | null;
  activeRoomId: string | null;
  messages: ChatMessage[];
  isPartnerTyping: boolean;
  refreshUsers: () => void;
  openDirectChat: (targetUser: TomatoUser) => void;
  closeDirectChat: () => void;
  sendTextMessage: (content: string) => void;
  sendImageMessage: (base64Image: string) => void;
  emitTyping: (isTyping: boolean) => void;
}

export const useDirectChat = ({
  socket,
  currentUser,
  secretKey,
  sendMessage
}: UseDirectChatOptions): UseDirectChatReturn => {
  const [onlineUsers, setOnlineUsers] = useState<TomatoUser[]>([]);
  const [activePartner, setActivePartner] = useState<TomatoUser | null>(null);
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isPartnerTyping, setIsPartnerTyping] = useState<boolean>(false);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const refreshUsers = useCallback(() => {
    if (socket && socket.connected) {
      socket.emit('direct:get_users');
    }
  }, [socket]);

  useEffect(() => {
    if (!socket || !socket.connected) return;

    refreshUsers();

    const handleUsersList = (users: TomatoUser[]) => {
      // Exclude current user from target selection
      setOnlineUsers(users.filter((u) => u.id !== currentUser.id));
    };

    const handleDirectReady = (data: { roomId: string; partner: TomatoUser }) => {
      setActiveRoomId(data.roomId);
      setActivePartner(data.partner);
      setMessages([]);
    };

    const handleMessage = (msg: ChatMessage) => {
      if (activeRoomId && msg.roomId === activeRoomId) {
        const decryptedContent = msg.isEncrypted && secretKey
          ? decryptMessage(msg.content, secretKey)
          : msg.content;
        setMessages((prev) => {
          if (prev.some((m) => m.id === msg.id)) return prev;
          return [...prev, { ...msg, content: decryptedContent }];
        });
      }
    };

    const handleTyping = (data: { roomId: string; isTyping: boolean }) => {
      if (activeRoomId && data.roomId === activeRoomId) {
        setIsPartnerTyping(data.isTyping);
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        if (data.isTyping) {
          typingTimeoutRef.current = setTimeout(() => {
            setIsPartnerTyping(false);
          }, 3000);
        }
      }
    };

    socket.on('direct:users_response', handleUsersList);
    socket.on('direct:ready', handleDirectReady);
    socket.on('message:receive', handleMessage);
    socket.on('direct:typing_status', handleTyping);

    return () => {
      socket.off('direct:users_response', handleUsersList);
      socket.off('direct:ready', handleDirectReady);
      socket.off('message:receive', handleMessage);
      socket.off('direct:typing_status', handleTyping);
    };
  }, [socket, currentUser.id, activeRoomId, refreshUsers]);

  const openDirectChat = useCallback(
    (targetUser: TomatoUser) => {
      if (!socket || !socket.connected) return;
      socket.emit('direct:start', {
        user: currentUser,
        targetUser
      });
    },
    [socket, currentUser]
  );

  const closeDirectChat = useCallback(() => {
    if (socket && socket.connected && activeRoomId) {
      socket.emit('direct:leave', { roomId: activeRoomId });
    }
    setActiveRoomId(null);
    setActivePartner(null);
    setMessages([]);
    setIsPartnerTyping(false);
    refreshUsers();
  }, [socket, activeRoomId, refreshUsers]);

  const sendTextMessage = useCallback(
    (content: string) => {
      if (!activeRoomId || !content.trim()) return;
      const localMsg = sendMessage(activeRoomId, content, 'text');
      if (localMsg) {
        setMessages((prev) => {
          if (prev.some((m) => m.id === localMsg.id)) return prev;
          return [...prev, localMsg];
        });
      }
      emitTyping(false);
    },
    [activeRoomId, sendMessage]
  );

  const sendImageMessage = useCallback(
    (base64Image: string) => {
      if (!activeRoomId || !base64Image) return;
      const localMsg = sendMessage(activeRoomId, base64Image, 'image');
      if (localMsg) {
        setMessages((prev) => {
          if (prev.some((m) => m.id === localMsg.id)) return prev;
          return [...prev, localMsg];
        });
      }
    },
    [activeRoomId, sendMessage]
  );

  const emitTyping = useCallback(
    (isTyping: boolean) => {
      if (socket && socket.connected && activeRoomId) {
        socket.emit('direct:typing', { roomId: activeRoomId, isTyping });
      }
    },
    [socket, activeRoomId]
  );

  return {
    onlineUsers,
    activePartner,
    activeRoomId,
    messages,
    isPartnerTyping,
    refreshUsers,
    openDirectChat,
    closeDirectChat,
    sendTextMessage,
    sendImageMessage,
    emitTyping
  };
};
