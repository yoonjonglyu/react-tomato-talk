import { io, Socket } from 'socket.io-client';
import { ChatMessage, TomatoConfig, TomatoUser } from '../types';
import { decryptMessage, encryptMessage } from './crypto';
import { MockSocket } from './mockSocket';

export class TomatoSocketClient {
  private socket: Socket | MockSocket | null = null;
  private config: TomatoConfig;
  private currentUser: TomatoUser;
  private messageListeners: Set<(msg: ChatMessage) => void> = new Set();
  private isConnecting: boolean = false;

  constructor(config: TomatoConfig) {
    this.config = config;
    this.currentUser = {
      id: config.user?.id || '',
      nickname: config.user?.nickname || '익명의 토마토',
      avatar: config.user?.avatar || '🍅',
      status: 'online',
      joinedAt: Date.now()
    };
  }

  public connect(): Socket {
    if (this.socket && this.socket.connected) {
      return this.socket as any;
    }

    if (this.socket && this.isConnecting) {
      return this.socket as any;
    }

    if (this.config.url === 'mock' || this.config.url.startsWith('mock://')) {
      const mock = new MockSocket(this.currentUser);
      this.socket = mock;
      mock.on('connect', () => {
        this.isConnecting = false;
        this.currentUser.id = mock.id;
      });
      return mock as any;
    }

    this.isConnecting = true;
    this.socket = io(this.config.url, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      query: {
        userId: this.currentUser.id,
        nickname: this.currentUser.nickname,
        avatar: this.currentUser.avatar || ''
      }
    });

    this.socket.on('connect', () => {
      this.isConnecting = false;
      if (!this.currentUser.id && this.socket?.id) {
        this.currentUser.id = this.socket.id;
      }
      // Announce user profile to server
      this.socket?.emit('user:register', this.currentUser);
    });

    this.socket.on('disconnect', () => {
      this.isConnecting = false;
    });

    this.socket.on('message:receive', (rawMsg: ChatMessage) => {
      const processed: ChatMessage = {
        ...rawMsg,
        content: rawMsg.isEncrypted
          ? decryptMessage(rawMsg.content, this.config.secretKey)
          : rawMsg.content
      };
      this.messageListeners.forEach((listener) => listener(processed));
    });

    return this.socket as any;
  }

  public getSocket(): Socket | MockSocket | null {
    return this.socket;
  }

  public getUser(): TomatoUser {
    return this.currentUser;
  }

  public setUser(user: Partial<TomatoUser>) {
    this.currentUser = { ...this.currentUser, ...user };
    if (this.socket?.connected) {
      this.socket.emit('user:update', this.currentUser);
    }
  }

  public onMessage(callback: (msg: ChatMessage) => void): () => void {
    this.messageListeners.add(callback);
    return () => {
      this.messageListeners.delete(callback);
    };
  }

  public sendMessage(roomId: string, content: string, type: 'text' | 'image' = 'text'): ChatMessage | null {
    if (!this.socket || !this.socket.connected) {
      console.warn('[TomatoTalk] Cannot send message: socket not connected');
      return null;
    }

    const isEncrypted = !!this.config.secretKey;
    const finalContent = isEncrypted ? encryptMessage(content, this.config.secretKey) : content;

    const msg: ChatMessage = {
      id: `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      roomId,
      senderId: this.currentUser.id || this.socket.id || 'anonymous',
      senderName: this.currentUser.nickname,
      senderAvatar: this.currentUser.avatar,
      content: finalContent,
      type,
      timestamp: Date.now(),
      isEncrypted
    };

    this.socket.emit('message:send', msg);

    // Return the decrypted local representation
    return {
      ...msg,
      content
    };
  }

  public disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnecting = false;
    }
  }
}
