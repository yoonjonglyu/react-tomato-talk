import { ChatMessage, GroupRoomInfo, TomatoUser } from '../types';

interface BusMessage {
  senderSocketId: string;
  senderTabId: string;
  event: string;
  payload: any;
}

const CURRENT_TAB_ID = typeof window !== 'undefined'
  ? ((window as any).__TOMATO_TAB_ID__ || ((window as any).__TOMATO_TAB_ID__ = Math.random().toString(36).substring(2, 9)))
  : 'srv';

// Shared in-memory state for mock server within the current window/page session
class MockServerState {
  public sockets = new Set<MockSocket>();
  public activeUsers = new Map<string, TomatoUser>();
  public anonymousRooms = new Map<string, Set<string>>();
  public groupRooms = new Map<string, { info: GroupRoomInfo; members: Map<string, TomatoUser> }>();
  public directRooms = new Map<string, { user1: string; user2: string }>();
  public randomQueue: { socketId: string; user: TomatoUser; topic?: string }[] = [];
  public activeRandomPairs = new Map<string, { partnerSocketId: string; roomId: string }>();

  constructor() {
    this.seedDefaultRooms();
  }

  private seedDefaultRooms() {
    const defaults: GroupRoomInfo[] = [
      {
        id: 'group_general',
        title: '🍅 토마토 수다방',
        description: '누구나 자유롭게 대화를 나눌 수 있는 오픈 수다방입니다.',
        topic: '자유',
        creatorId: 'system',
        memberCount: 0,
        maxMembers: 100,
        createdAt: Date.now()
      },
      {
        id: 'group_dev',
        title: '💻 개발자 & 테크 토크',
        description: 'React, TypeScript, 웹 개발 관련 정보를 공유해요.',
        topic: '코딩',
        creatorId: 'system',
        memberCount: 0,
        maxMembers: 50,
        createdAt: Date.now()
      }
    ];
    defaults.forEach((r) => {
      this.groupRooms.set(r.id, { info: r, members: new Map() });
    });
  }
}

const mockState = new MockServerState();

export class MockSocket {
  public id: string;
  public connected: boolean = true;
  private listeners: Map<string, Set<Function>> = new Map();
  private channel: BroadcastChannel | null = null;
  private currentUser: TomatoUser;
  private joinedRooms: Set<string> = new Set();

  constructor(initialUser?: TomatoUser) {
    this.id = `mock_${Math.random().toString(36).substring(2, 9)}`;
    this.currentUser = {
      id: this.id,
      nickname: initialUser?.nickname || '익명의 토마토',
      avatar: initialUser?.avatar || '🍅',
      status: 'online',
      joinedAt: Date.now()
    };
    mockState.activeUsers.set(this.id, this.currentUser);
    mockState.sockets.add(this);

    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      this.channel = new BroadcastChannel('tomato_mock_bus');
      this.channel.onmessage = (e) => this.handleBusMessage(e.data);
    }

    // Trigger connect asynchronously
    setTimeout(() => {
      this.dispatch('connect', {});
      this.broadcastActiveUsers();
    }, 50);
  }

  public on(event: string, callback: Function): this {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)?.add(callback);
    return this;
  }

  public off(event: string, callback?: Function): this {
    if (!callback) {
      this.listeners.delete(event);
    } else {
      this.listeners.get(event)?.delete(callback);
    }
    return this;
  }

  public dispatch(event: string, ...args: any[]) {
    this.listeners.get(event)?.forEach((fn) => {
      try {
        fn(...args);
      } catch (err) {
        console.error(`[MockSocket error on ${event}]:`, err);
      }
    });
  }

  private broadcast(event: string, payload: any) {
    // 1. Send to all other MockSocket instances in the same window/tab
    mockState.sockets.forEach((s) => {
      if (s !== this && s.connected) {
        s.dispatch(event, payload);
      }
    });

    // 2. Send to other browser tabs / windows via BroadcastChannel
    if (this.channel) {
      this.channel.postMessage({
        senderSocketId: this.id,
        senderTabId: CURRENT_TAB_ID,
        event,
        payload
      } as BusMessage);
    }
  }

  private handleBusMessage(msg: BusMessage) {
    if (!msg) return;
    // CRITICAL: Ignore messages sent from the SAME browser window/tab!
    // They are already dispatched in-memory to mockState.sockets above.
    if (msg.senderTabId === CURRENT_TAB_ID || msg.senderSocketId === this.id) {
      return;
    }
    this.dispatch(msg.event, msg.payload);
  }

  private broadcastActiveUsers() {
    const list = Array.from(mockState.activeUsers.values());
    this.dispatch('direct:users_response', list);
    this.broadcast('direct:users_response', list);
  }

  public emit(event: string, data?: any): this {
    if (!this.connected) return this;

    switch (event) {
      case 'user:register':
      case 'user:update': {
        if (data) {
          this.currentUser = { ...data, id: this.id };
          mockState.activeUsers.set(this.id, this.currentUser);
          this.broadcastActiveUsers();
        }
        break;
      }

      case 'message:send': {
        const msg: ChatMessage = data;
        // Deliver to other clients
        this.broadcast('message:receive', msg);
        break;
      }

      // 1. Anonymous Chat
      case 'anonymous:join': {
        const { roomId, user } = data || {};
        this.joinedRooms.add(roomId);
        if (!mockState.anonymousRooms.has(roomId)) {
          mockState.anonymousRooms.set(roomId, new Set());
        }
        mockState.anonymousRooms.get(roomId)?.add(this.id);
        const count = mockState.anonymousRooms.get(roomId)?.size || 1;

        this.dispatch('anonymous:room_info', { roomId, userCount: count });
        this.dispatch('room:user_count', { roomId, count });
        this.broadcast('room:user_count', { roomId, count });

        // System notice to others
        this.broadcast('message:receive', {
          id: `sys_${Date.now()}`,
          roomId,
          senderId: '#system',
          senderName: '시스템',
          content: `${user?.nickname || '새 참여자'} 님이 입장했습니다.`,
          type: 'system',
          timestamp: Date.now()
        });
        break;
      }

      case 'anonymous:leave': {
        const { roomId } = data || {};
        this.joinedRooms.delete(roomId);
        mockState.anonymousRooms.get(roomId)?.delete(this.id);
        const count = mockState.anonymousRooms.get(roomId)?.size || 0;
        this.dispatch('room:user_count', { roomId, count });
        this.broadcast('room:user_count', { roomId, count });
        break;
      }

      // 2. Group Chat
      case 'group:list': {
        const list = Array.from(mockState.groupRooms.values()).map((r) => ({
          ...r.info,
          memberCount: r.members.size
        }));
        this.dispatch('group:list_response', list);
        break;
      }

      case 'group:create': {
        const { title, description, topic, maxMembers, creator } = data;
        const roomId = `mock_group_${Date.now()}`;
        const roomInfo: GroupRoomInfo = {
          id: roomId,
          title,
          description,
          topic,
          creatorId: this.id,
          memberCount: 1,
          maxMembers: maxMembers || 50,
          createdAt: Date.now()
        };

        const membersMap = new Map<string, TomatoUser>();
        membersMap.set(this.id, creator);
        mockState.groupRooms.set(roomId, { info: roomInfo, members: membersMap });
        this.joinedRooms.add(roomId);

        this.dispatch('group:joined', { room: roomInfo, members: [creator] });

        const list = Array.from(mockState.groupRooms.values()).map((r) => ({
          ...r.info,
          memberCount: r.members.size
        }));
        this.dispatch('group:list_response', list);
        this.broadcast('group:list_response', list);
        break;
      }

      case 'group:join': {
        const { roomId, user } = data;
        const room = mockState.groupRooms.get(roomId);
        if (room) {
          room.members.set(this.id, user);
          this.joinedRooms.add(roomId);
          const membersList = Array.from(room.members.values());

          this.dispatch('group:joined', { room: room.info, members: membersList });
          this.broadcast('group:members_updated', membersList);

          const list = Array.from(mockState.groupRooms.values()).map((r) => ({
            ...r.info,
            memberCount: r.members.size
          }));
          this.broadcast('group:list_response', list);
        }
        break;
      }

      case 'group:leave': {
        const { roomId, user } = data;
        this.joinedRooms.delete(roomId);
        const room = mockState.groupRooms.get(roomId);
        if (room) {
          room.members.delete(this.id);
          const membersList = Array.from(room.members.values());
          this.broadcast('group:members_updated', membersList);

          const list = Array.from(mockState.groupRooms.values()).map((r) => ({
            ...r.info,
            memberCount: r.members.size
          }));
          this.dispatch('group:list_response', list);
          this.broadcast('group:list_response', list);
        }
        break;
      }

      // 3. Direct 1:1 Chat
      case 'direct:get_users': {
        this.broadcastActiveUsers();
        break;
      }

      case 'direct:start': {
        const { user, targetUser } = data;
        const ids = [this.id, targetUser.id].sort();
        const roomId = `mock_dm_${ids[0]}_${ids[1]}`;

        this.joinedRooms.add(roomId);
        this.dispatch('direct:ready', { roomId, partner: targetUser });
        this.broadcast('direct:ready', { roomId, partner: user });
        break;
      }

      case 'direct:typing': {
        this.broadcast('direct:typing_status', data);
        break;
      }

      case 'direct:leave': {
        this.broadcast('message:receive', {
          id: `sys_${Date.now()}`,
          roomId: data?.roomId,
          senderId: '#system',
          senderName: '시스템',
          content: '상대방이 대화창을 닫았습니다.',
          type: 'system',
          timestamp: Date.now()
        });
        break;
      }

      // 4. Random Chat
      case 'random:join_queue': {
        const { user, topic } = data;
        mockState.randomQueue = mockState.randomQueue.filter((q) => q.socketId !== this.id);

        if (mockState.randomQueue.length > 0) {
          const partner = mockState.randomQueue.shift()!;
          const roomId = `mock_rand_${this.id}_${partner.socketId}`;

          mockState.activeRandomPairs.set(this.id, { partnerSocketId: partner.socketId, roomId });
          mockState.activeRandomPairs.set(partner.socketId, { partnerSocketId: this.id, roomId });

          this.dispatch('random:matched', { roomId, partner: partner.user });
          this.broadcast('random:matched', { roomId, partner: user });
        } else {
          mockState.randomQueue.push({ socketId: this.id, user, topic });
          this.dispatch('random:waiting', {});
        }
        break;
      }

      case 'random:cancel_queue': {
        mockState.randomQueue = mockState.randomQueue.filter((q) => q.socketId !== this.id);
        break;
      }

      case 'random:leave': {
        this.broadcast('random:partner_left', {});
        break;
      }
    }

    return this;
  }

  public disconnect() {
    this.connected = false;
    mockState.sockets.delete(this);
    mockState.activeUsers.delete(this.id);
    mockState.randomQueue = mockState.randomQueue.filter((q) => q.socketId !== this.id);
    this.broadcastActiveUsers();
    this.dispatch('disconnect', {});
    if (this.channel) {
      this.channel.close();
      this.channel = null;
    }
  }
}
