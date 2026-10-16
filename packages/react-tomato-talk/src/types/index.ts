export type ChatMode = 'anonymous' | 'group' | 'direct' | 'random';

export interface TomatoUser {
  id: string;
  nickname: string;
  avatar?: string;
  status?: 'online' | 'busy' | 'offline';
  joinedAt?: number;
}

export type MessageType = 'text' | 'image' | 'system';

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  roomId: string;
  content: string;
  type: MessageType;
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

export interface DirectChatSession {
  roomId: string;
  targetUser: TomatoUser;
  unreadCount?: number;
  lastMessage?: string;
  lastTimestamp?: number;
}

export type RandomChatStatus = 'idle' | 'matching' | 'connected' | 'partner_disconnected';

export interface TomatoConfig {
  url: string;
  secretKey?: string;
  user?: Partial<TomatoUser>;
  maxImageSizeMB?: number; // default 5MB
  enableSound?: boolean;
  theme?: 'light' | 'dark' | 'auto';
}
