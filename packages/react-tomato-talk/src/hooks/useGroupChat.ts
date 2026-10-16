import { useState, useEffect, useCallback } from 'react';
import { Socket } from 'socket.io-client';
import { ChatMessage, GroupRoomInfo, TomatoUser } from '../types';
import { decryptMessage } from '../core/crypto';

export interface UseGroupChatOptions {
  socket: Socket | null;
  currentUser: TomatoUser;
  secretKey?: string;
  sendMessage: (roomId: string, content: string, type?: 'text' | 'image') => ChatMessage | null;
}

export interface UseGroupChatReturn {
  rooms: GroupRoomInfo[];
  currentRoom: GroupRoomInfo | null;
  roomMembers: TomatoUser[];
  messages: ChatMessage[];
  createRoom: (params: { title: string; description?: string; topic?: string; maxMembers?: number }) => void;
  joinRoom: (roomId: string) => void;
  leaveRoom: () => void;
  refreshRooms: () => void;
  sendTextMessage: (content: string) => void;
  sendImageMessage: (base64Image: string) => void;
}

export const useGroupChat = ({
  socket,
  currentUser,
  secretKey,
  sendMessage
}: UseGroupChatOptions): UseGroupChatReturn => {
  const [rooms, setRooms] = useState<GroupRoomInfo[]>([]);
  const [currentRoom, setCurrentRoom] = useState<GroupRoomInfo | null>(null);
  const [roomMembers, setRoomMembers] = useState<TomatoUser[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const refreshRooms = useCallback(() => {
    if (socket && socket.connected) {
      socket.emit('group:list');
    }
  }, [socket]);

  useEffect(() => {
    if (!socket || !socket.connected) return;

    refreshRooms();

    const handleRoomList = (roomList: GroupRoomInfo[]) => {
      setRooms(roomList);
    };

    const handleRoomJoined = (data: { room: GroupRoomInfo; members: TomatoUser[] }) => {
      setCurrentRoom(data.room);
      setRoomMembers(data.members);
      setMessages([]);
    };

    const handleMembersUpdated = (members: TomatoUser[]) => {
      setRoomMembers(members);
    };

    const handleMessage = (msg: ChatMessage) => {
      if (currentRoom && msg.roomId === currentRoom.id) {
        const decryptedContent = msg.isEncrypted && secretKey
          ? decryptMessage(msg.content, secretKey)
          : msg.content;
        setMessages((prev) => {
          if (prev.some((m) => m.id === msg.id)) return prev;
          return [...prev, { ...msg, content: decryptedContent }];
        });
      }
    };

    socket.on('group:list_response', handleRoomList);
    socket.on('group:joined', handleRoomJoined);
    socket.on('group:members_updated', handleMembersUpdated);
    socket.on('message:receive', handleMessage);

    return () => {
      socket.off('group:list_response', handleRoomList);
      socket.off('group:joined', handleRoomJoined);
      socket.off('group:members_updated', handleMembersUpdated);
      socket.off('message:receive', handleMessage);
    };
  }, [socket, currentRoom, refreshRooms]);

  const createRoom = useCallback(
    ({ title, description, topic, maxMembers = 50 }: { title: string; description?: string; topic?: string; maxMembers?: number }) => {
      if (!socket || !socket.connected) return;
      socket.emit('group:create', {
        title,
        description,
        topic,
        maxMembers,
        creator: currentUser
      });
    },
    [socket, currentUser]
  );

  const joinRoom = useCallback(
    (roomId: string) => {
      if (!socket || !socket.connected) return;
      socket.emit('group:join', { roomId, user: currentUser });
    },
    [socket, currentUser]
  );

  const leaveRoom = useCallback(() => {
    if (!socket || !socket.connected || !currentRoom) return;
    socket.emit('group:leave', { roomId: currentRoom.id, user: currentUser });
    setCurrentRoom(null);
    setRoomMembers([]);
    setMessages([]);
    refreshRooms();
  }, [socket, currentRoom, currentUser, refreshRooms]);

  const sendTextMessage = useCallback(
    (content: string) => {
      if (!currentRoom || !content.trim()) return;
      const localMsg = sendMessage(currentRoom.id, content, 'text');
      if (localMsg) {
        setMessages((prev) => {
          if (prev.some((m) => m.id === localMsg.id)) return prev;
          return [...prev, localMsg];
        });
      }
    },
    [currentRoom, sendMessage]
  );

  const sendImageMessage = useCallback(
    (base64Image: string) => {
      if (!currentRoom || !base64Image) return;
      const localMsg = sendMessage(currentRoom.id, base64Image, 'image');
      if (localMsg) {
        setMessages((prev) => {
          if (prev.some((m) => m.id === localMsg.id)) return prev;
          return [...prev, localMsg];
        });
      }
    },
    [currentRoom, sendMessage]
  );

  return {
    rooms,
    currentRoom,
    roomMembers,
    messages,
    createRoom,
    joinRoom,
    leaveRoom,
    refreshRooms,
    sendTextMessage,
    sendImageMessage
  };
};
