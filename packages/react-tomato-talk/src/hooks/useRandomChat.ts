import { useState, useEffect, useCallback } from 'react';
import { Socket } from 'socket.io-client';
import { ChatMessage, RandomChatStatus, TomatoUser } from '../types';
import { decryptMessage } from '../core/crypto';

export interface UseRandomChatOptions {
  socket: Socket | null;
  currentUser: TomatoUser;
  secretKey?: string;
  sendMessage: (roomId: string, content: string, type?: 'text' | 'image') => ChatMessage | null;
}

export interface UseRandomChatReturn {
  status: RandomChatStatus;
  currentRoomId: string | null;
  partner: TomatoUser | null;
  messages: ChatMessage[];
  startMatching: (topic?: string) => void;
  cancelMatching: () => void;
  nextPartner: () => void;
  leaveChat: () => void;
  sendTextMessage: (content: string) => void;
  sendImageMessage: (base64Image: string) => void;
}

export const useRandomChat = ({
  socket,
  currentUser,
  secretKey,
  sendMessage
}: UseRandomChatOptions): UseRandomChatReturn => {
  const [status, setStatus] = useState<RandomChatStatus>('idle');
  const [currentRoomId, setCurrentRoomId] = useState<string | null>(null);
  const [partner, setPartner] = useState<TomatoUser | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    if (!socket || !socket.connected) return;

    const handleWaiting = () => {
      setStatus('matching');
      setCurrentRoomId(null);
      setPartner(null);
      setMessages([]);
    };

    const handleMatched = (data: { roomId: string; partner: TomatoUser }) => {
      setStatus('connected');
      setCurrentRoomId(data.roomId);
      setPartner(data.partner);
      setMessages([
        {
          id: `sys_${Date.now()}`,
          roomId: data.roomId,
          senderId: '#system',
          senderName: '시스템',
          content: `${data.partner.nickname} 님과 연결되었습니다. 대화를 시작해보세요!`,
          type: 'system',
          timestamp: Date.now()
        }
      ]);
    };

    const handlePartnerLeft = () => {
      setStatus('partner_disconnected');
      setMessages((prev) => [
        ...prev,
        {
          id: `sys_${Date.now()}`,
          roomId: currentRoomId || '',
          senderId: '#system',
          senderName: '시스템',
          content: '상대방이 대화를 종료하거나 방을 나갔습니다.',
          type: 'system',
          timestamp: Date.now()
        }
      ]);
    };

    const handleMessage = (msg: ChatMessage) => {
      if (currentRoomId && msg.roomId === currentRoomId) {
        const decryptedContent = msg.isEncrypted && secretKey
          ? decryptMessage(msg.content, secretKey)
          : msg.content;
        setMessages((prev) => {
          if (prev.some((m) => m.id === msg.id)) return prev;
          return [...prev, { ...msg, content: decryptedContent }];
        });
      }
    };

    socket.on('random:waiting', handleWaiting);
    socket.on('random:matched', handleMatched);
    socket.on('random:partner_left', handlePartnerLeft);
    socket.on('message:receive', handleMessage);

    return () => {
      socket.off('random:waiting', handleWaiting);
      socket.off('random:matched', handleMatched);
      socket.off('random:partner_left', handlePartnerLeft);
      socket.off('message:receive', handleMessage);
    };
  }, [socket, currentRoomId]);

  const startMatching = useCallback(
    (topic?: string) => {
      if (!socket || !socket.connected) return;
      setStatus('matching');
      setMessages([]);
      setPartner(null);
      setCurrentRoomId(null);
      socket.emit('random:join_queue', { user: currentUser, topic });
    },
    [socket, currentUser]
  );

  const cancelMatching = useCallback(() => {
    if (!socket || !socket.connected) return;
    socket.emit('random:cancel_queue');
    setStatus('idle');
  }, [socket]);

  const nextPartner = useCallback(() => {
    if (!socket || !socket.connected) return;
    if (currentRoomId) {
      socket.emit('random:leave', { roomId: currentRoomId });
    }
    startMatching();
  }, [socket, currentRoomId, startMatching]);

  const leaveChat = useCallback(() => {
    if (socket && socket.connected && currentRoomId) {
      socket.emit('random:leave', { roomId: currentRoomId });
    }
    setStatus('idle');
    setCurrentRoomId(null);
    setPartner(null);
    setMessages([]);
  }, [socket, currentRoomId]);

  const sendTextMessage = useCallback(
    (content: string) => {
      if (!currentRoomId || status !== 'connected' || !content.trim()) return;
      const localMsg = sendMessage(currentRoomId, content, 'text');
      if (localMsg) {
        setMessages((prev) => {
          if (prev.some((m) => m.id === localMsg.id)) return prev;
          return [...prev, localMsg];
        });
      }
    },
    [currentRoomId, status, sendMessage]
  );

  const sendImageMessage = useCallback(
    (base64Image: string) => {
      if (!currentRoomId || status !== 'connected' || !base64Image) return;
      const localMsg = sendMessage(currentRoomId, base64Image, 'image');
      if (localMsg) {
        setMessages((prev) => {
          if (prev.some((m) => m.id === localMsg.id)) return prev;
          return [...prev, localMsg];
        });
      }
    },
    [currentRoomId, status, sendMessage]
  );

  return {
    status,
    currentRoomId,
    partner,
    messages,
    startMatching,
    cancelMatching,
    nextPartner,
    leaveChat,
    sendTextMessage,
    sendImageMessage
  };
};
