import express from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import cors from 'cors';
import { ChatMessage, GroupRoomInfo, TomatoUser } from './types.js';

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  },
  maxHttpBufferSize: 10 * 1024 * 1024 // 10MB
});

// State storage
const activeUsers = new Map<string, { socket: Socket; user: TomatoUser }>();

// Anonymous rooms: roomId -> Set of socketIds
const anonymousRooms = new Map<string, Set<string>>();

// Group rooms: roomId -> { info: GroupRoomInfo, members: Map<string, TomatoUser> }
const groupRooms = new Map<string, { info: GroupRoomInfo; members: Map<string, TomatoUser> }>();

// Direct chat rooms: roomId -> { user1: string, user2: string }
const directRooms = new Map<string, { user1: string; user2: string }>();

// Random chat queue: { socketId: string, user: TomatoUser, topic?: string }
interface QueueItem {
  socketId: string;
  user: TomatoUser;
  topic?: string;
}
let randomQueue: QueueItem[] = [];
// Active random pairings: socketId -> { partnerSocketId: string, roomId: string }
const activeRandomPairs = new Map<string, { partnerSocketId: string; roomId: string }>();

// Seed default group rooms
const defaultRooms: GroupRoomInfo[] = [
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

defaultRooms.forEach((r) => {
  groupRooms.set(r.id, { info: r, members: new Map() });
});

io.on('connection', (socket: Socket) => {
  const query = socket.handshake.query;
  const initialUser: TomatoUser = {
    id: (query.userId as string) || socket.id,
    nickname: (query.nickname as string) || '익명의 토마토',
    avatar: (query.avatar as string) || '🍅',
    status: 'online',
    joinedAt: Date.now()
  };

  activeUsers.set(socket.id, { socket, user: initialUser });

  // Broadcast updated user list to direct chat listeners
  const broadcastActiveUsers = () => {
    const userList = Array.from(activeUsers.values()).map((v) => v.user);
    io.emit('direct:users_response', userList);
  };

  broadcastActiveUsers();

  // User profile registration / update
  socket.on('user:register', (user: TomatoUser) => {
    const entry = activeUsers.get(socket.id);
    if (entry) {
      entry.user = { ...entry.user, ...user, id: socket.id };
      broadcastActiveUsers();
    }
  });

  socket.on('user:update', (user: Partial<TomatoUser>) => {
    const entry = activeUsers.get(socket.id);
    if (entry) {
      entry.user = { ...entry.user, ...user };
      broadcastActiveUsers();
    }
  });

  // Common message sending
  socket.on('message:send', (msg: ChatMessage) => {
    // Forward message to all clients in the room except the sender
    socket.to(msg.roomId).emit('message:receive', msg);
  });

  // ==========================================
  // 1. Anonymous Chat Handlers
  // ==========================================
  socket.on('anonymous:join', ({ roomId, user }: { roomId: string; user: TomatoUser }) => {
    socket.join(roomId);
    if (!anonymousRooms.has(roomId)) {
      anonymousRooms.set(roomId, new Set());
    }
    anonymousRooms.get(roomId)?.add(socket.id);

    const count = anonymousRooms.get(roomId)?.size || 1;
    io.to(roomId).emit('room:user_count', { roomId, count });
    socket.emit('anonymous:room_info', { roomId, userCount: count });

    // System join notice
    socket.to(roomId).emit('message:receive', {
      id: `sys_${Date.now()}_${Math.random()}`,
      roomId,
      senderId: '#system',
      senderName: '시스템',
      content: `${user.nickname} 님이 입장했습니다.`,
      type: 'system',
      timestamp: Date.now()
    });
  });

  socket.on('anonymous:leave', ({ roomId }: { roomId: string }) => {
    socket.leave(roomId);
    if (anonymousRooms.has(roomId)) {
      anonymousRooms.get(roomId)?.delete(socket.id);
      const count = anonymousRooms.get(roomId)?.size || 0;
      io.to(roomId).emit('room:user_count', { roomId, count });
    }
  });

  // ==========================================
  // 2. Group Chat Handlers
  // ==========================================
  socket.on('group:list', () => {
    const list = Array.from(groupRooms.values()).map((r) => ({
      ...r.info,
      memberCount: r.members.size
    }));
    socket.emit('group:list_response', list);
  });

  socket.on('group:create', ({ title, description, topic, maxMembers, creator }: {
    title: string;
    description?: string;
    topic?: string;
    maxMembers: number;
    creator: TomatoUser;
  }) => {
    const roomId = `group_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const newRoom: GroupRoomInfo = {
      id: roomId,
      title,
      description,
      topic,
      creatorId: creator.id || socket.id,
      memberCount: 1,
      maxMembers: maxMembers || 50,
      createdAt: Date.now()
    };

    const membersMap = new Map<string, TomatoUser>();
    membersMap.set(socket.id, creator);
    groupRooms.set(roomId, { info: newRoom, members: membersMap });

    socket.join(roomId);
    socket.emit('group:joined', { room: newRoom, members: [creator] });

    // Broadcast updated room list
    const list = Array.from(groupRooms.values()).map((r) => ({
      ...r.info,
      memberCount: r.members.size
    }));
    io.emit('group:list_response', list);
  });

  socket.on('group:join', ({ roomId, user }: { roomId: string; user: TomatoUser }) => {
    const room = groupRooms.get(roomId);
    if (!room) return;

    if (room.members.size >= room.info.maxMembers) {
      socket.emit('group:error', { message: '방 인원이 가득 찼습니다.' });
      return;
    }

    socket.join(roomId);
    room.members.set(socket.id, user);

    const membersList = Array.from(room.members.values());
    socket.emit('group:joined', { room: room.info, members: membersList });
    io.to(roomId).emit('group:members_updated', membersList);

    // System notice
    socket.to(roomId).emit('message:receive', {
      id: `sys_${Date.now()}`,
      roomId,
      senderId: '#system',
      senderName: '시스템',
      content: `${user.nickname} 님이 참여했습니다.`,
      type: 'system',
      timestamp: Date.now()
    });

    // Broadcast updated counts
    const list = Array.from(groupRooms.values()).map((r) => ({
      ...r.info,
      memberCount: r.members.size
    }));
    io.emit('group:list_response', list);
  });

  socket.on('group:leave', ({ roomId, user }: { roomId: string; user: TomatoUser }) => {
    socket.leave(roomId);
    const room = groupRooms.get(roomId);
    if (room) {
      room.members.delete(socket.id);
      const membersList = Array.from(room.members.values());
      io.to(roomId).emit('group:members_updated', membersList);

      socket.to(roomId).emit('message:receive', {
        id: `sys_${Date.now()}`,
        roomId,
        senderId: '#system',
        senderName: '시스템',
        content: `${user.nickname} 님이 퇴장했습니다.`,
        type: 'system',
        timestamp: Date.now()
      });

      const list = Array.from(groupRooms.values()).map((r) => ({
        ...r.info,
        memberCount: r.members.size
      }));
      io.emit('group:list_response', list);
    }
  });

  // ==========================================
  // 3. Direct 1:1 Chat Handlers
  // ==========================================
  socket.on('direct:get_users', () => {
    const userList = Array.from(activeUsers.values()).map((v) => v.user);
    socket.emit('direct:users_response', userList);
  });

  socket.on('direct:start', ({ user, targetUser }: { user: TomatoUser; targetUser: TomatoUser }) => {
    // Target user socket
    const targetEntry = activeUsers.get(targetUser.id);
    if (!targetEntry) {
      socket.emit('direct:error', { message: '상대방이 현재 오프라인 상태입니다.' });
      return;
    }

    // Deterministic roomId for the pair
    const ids = [socket.id, targetUser.id].sort();
    const roomId = `dm_${ids[0]}_${ids[1]}`;

    socket.join(roomId);
    targetEntry.socket.join(roomId);
    directRooms.set(roomId, { user1: socket.id, user2: targetUser.id });

    // Notify both users that direct session is established
    socket.emit('direct:ready', { roomId, partner: targetUser });
    targetEntry.socket.emit('direct:ready', { roomId, partner: user });
  });

  socket.on('direct:typing', ({ roomId, isTyping }: { roomId: string; isTyping: boolean }) => {
    socket.to(roomId).emit('direct:typing_status', { roomId, isTyping });
  });

  socket.on('direct:leave', ({ roomId }: { roomId: string }) => {
    socket.leave(roomId);
    socket.to(roomId).emit('message:receive', {
      id: `sys_${Date.now()}`,
      roomId,
      senderId: '#system',
      senderName: '시스템',
      content: '상대방이 대화창을 닫았습니다.',
      type: 'system',
      timestamp: Date.now()
    });
    directRooms.delete(roomId);
  });

  // ==========================================
  // 4. Random Chat Handlers
  // ==========================================
  socket.on('random:join_queue', ({ user, topic }: { user: TomatoUser; topic?: string }) => {
    // Check if already in queue or paired
    randomQueue = randomQueue.filter((item) => item.socketId !== socket.id);

    // Find match from queue
    let matchIndex = -1;
    if (topic && topic !== '전체 랜덤') {
      matchIndex = randomQueue.findIndex(
        (item) => item.socketId !== socket.id && (item.topic === topic || item.topic === '전체 랜덤')
      );
    }

    if (matchIndex === -1 && randomQueue.length > 0) {
      // Pick first waiting user
      matchIndex = 0;
    }

    if (matchIndex !== -1) {
      const partnerItem = randomQueue.splice(matchIndex, 1)[0];
      const partnerSocket = io.sockets.sockets.get(partnerItem.socketId);

      if (partnerSocket && partnerSocket.connected) {
        const roomId = `rand_${socket.id}_${partnerItem.socketId}`;
        socket.join(roomId);
        partnerSocket.join(roomId);

        activeRandomPairs.set(socket.id, { partnerSocketId: partnerItem.socketId, roomId });
        activeRandomPairs.set(partnerItem.socketId, { partnerSocketId: socket.id, roomId });

        socket.emit('random:matched', { roomId, partner: partnerItem.user });
        partnerSocket.emit('random:matched', { roomId, partner: user });
        return;
      }
    }

    // No match yet, push to waiting queue
    randomQueue.push({ socketId: socket.id, user, topic });
    socket.emit('random:waiting');
  });

  socket.on('random:cancel_queue', () => {
    randomQueue = randomQueue.filter((item) => item.socketId !== socket.id);
  });

  socket.on('random:leave', ({ roomId }: { roomId: string }) => {
    socket.leave(roomId);
    const pair = activeRandomPairs.get(socket.id);
    if (pair) {
      const partnerSocket = io.sockets.sockets.get(pair.partnerSocketId);
      if (partnerSocket) {
        partnerSocket.emit('random:partner_left');
        partnerSocket.leave(roomId);
      }
      activeRandomPairs.delete(socket.id);
      activeRandomPairs.delete(pair.partnerSocketId);
    }
  });

  // ==========================================
  // Disconnect Cleanup
  // ==========================================
  socket.on('disconnect', () => {
    activeUsers.delete(socket.id);
    broadcastActiveUsers();

    // Remove from random queue
    randomQueue = randomQueue.filter((item) => item.socketId !== socket.id);

    // Notify random partner if active
    const randomPair = activeRandomPairs.get(socket.id);
    if (randomPair) {
      const partnerSocket = io.sockets.sockets.get(randomPair.partnerSocketId);
      if (partnerSocket) {
        partnerSocket.emit('random:partner_left');
      }
      activeRandomPairs.delete(socket.id);
      activeRandomPairs.delete(randomPair.partnerSocketId);
    }

    // Clean up anonymous rooms
    anonymousRooms.forEach((set, rId) => {
      if (set.has(socket.id)) {
        set.delete(socket.id);
        io.to(rId).emit('room:user_count', { roomId: rId, count: set.size });
      }
    });

    // Clean up group rooms
    groupRooms.forEach((room, rId) => {
      if (room.members.has(socket.id)) {
        room.members.delete(socket.id);
        const membersList = Array.from(room.members.values());
        io.to(rId).emit('group:members_updated', membersList);
      }
    });
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🍅 [TomatoTalk Server] Running on http://localhost:${PORT}`);
});
