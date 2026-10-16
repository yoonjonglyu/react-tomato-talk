export interface TomatoUser {
  id: string;
  nickname: string;
  avatar?: string;
  status?: 'online' | 'busy' | 'offline';
  joinedAt?: number;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  roomId: string;
  content: string;
  type: 'text' | 'image' | 'system';
  timestamp: number;
  isEncrypted?: boolean;
}

export interface GroupRoomInfo {
  id: string;
  title: string;
  description?: string;
  topic?: string;
  creatorId: string;
  memberCount: number;
  maxMembers: number;
  isPrivate?: boolean;
  createdAt: number;
}
