---
name: react-tomato-talk
description: Comprehensive guide, API reference, and design patterns for integrating and customizing react-tomato-talk (v2.0) in React and Next.js applications. Use when the user asks to implement, customize, style, or debug real-time chat with anonymous rooms, group chats, 1:1 direct messages, or random matchmaking.
---

# React Tomato Talk (v2.0) Agent Skill

`react-tomato-talk` is an all-in-one real-time chat SDK and UI toolkit for React 18/19 and Next.js, powered by Socket.IO.
It provides dual integration options:
1. **All-in-One Component (`<TomatoTalk />`)**: Plug-and-play complete UI widget with 4 chat modes.
2. **Headless React Hooks**: `useTomatoSocket`, `useAnonymousChat`, `useGroupChat`, `useDirectChat`, `useRandomChat` for 100% custom styling (e.g. TailwindCSS, Chakra, MUI).

---

## 1. Installation & Styles

```bash
npm install react-tomato-talk socket.io-client
# or
pnpm add react-tomato-talk socket.io-client
# or
yarn add react-tomato-talk socket.io-client
```

Import default CSS bundle in your application entry point (`App.tsx`, `layout.tsx`, or `_app.tsx`):
```tsx
import 'react-tomato-talk/styles/tomato.css';
// Or alias:
// import 'react-tomato-talk/style.css';
```

---

## 2. All-in-One UI Component: `<TomatoTalk />`

### Standard Integration (Binding Authenticated User)
```tsx
import React from 'react';
import { TomatoTalk } from 'react-tomato-talk';
import 'react-tomato-talk/styles/tomato.css';

export const ChatWidget = ({ currentUser }) => {
  return (
    <div style={{ width: '400px', height: '640px' }}>
      <TomatoTalk
        // Socket.IO server URL or "mock" for zero-backend browser testing
        url="https://socket.myservice.com"

        // Authenticated user information
        user={{
          id: currentUser.id,         // e.g. "usr_1024"
          nickname: currentUser.name, // e.g. "홍길동"
          avatar: currentUser.avatar  // Profile image URL or emoji
        }}

        // Mode: 'all' | 'anonymous' | 'group' | 'direct' | 'random'
        mode="all"
        defaultTab="group"

        // Optional end-to-end AES encryption key
        secretKey="service-channel-secret-key"

        // Limits and theming
        maxImageSizeMB={5}
      />
    </div>
  );
};
```

### `<TomatoTalk />` Props Reference

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `url` | `string` | **Required** | Socket.IO server endpoint (or `"mock"` for browser-only simulation) |
| `user` | `Partial<TomatoUser>` | Guest generator | User identity `{ id, nickname, avatar }` |
| `mode` | `'all' \| 'anonymous' \| 'group' \| 'direct' \| 'random'` | `'all'` | Selected mode or multi-tab view |
| `defaultTab` | `'anonymous' \| 'group' \| 'direct' \| 'random'` | `'anonymous'` | Active tab on initial mount |
| `secretKey` | `string` | `undefined` | AES-256 E2E encryption secret key |
| `maxImageSizeMB` | `number` | `5` | Maximum image upload size in megabytes |
| `className` | `string` | `''` | Container CSS class name |
| `style` | `React.CSSProperties` | `undefined` | Inline styling |

---

## 3. Dedicated View Components

If you need only one mode without navigation tabs:
```tsx
import {
  AnonymousChatView,
  GroupChatView,
  DirectChatView,
  RandomChatView,
  useTomatoSocket
} from 'react-tomato-talk';

export const MyGroupOnlyChat = ({ user }) => {
  const { socket, currentUser, sendMessage } = useTomatoSocket({
    url: 'https://socket.myservice.com',
    user
  });

  return (
    <GroupChatView
      socket={socket}
      currentUser={currentUser}
      sendMessage={sendMessage}
    />
  );
};
```

---

## 4. Headless Hooks for Custom UI (e.g. TailwindCSS)

### `useTomatoSocket`
Manages socket connection lifecycle, user state, and message dispatch.
```tsx
const {
  socket,        // Socket.IO or MockSocket instance
  isConnected,   // boolean connection status
  currentUser,   // TomatoUser with assigned ID and nickname
  updateUser,    // (user: Partial<TomatoUser>) => void
  sendMessage    // (roomId, content, type) => ChatMessage | null
} = useTomatoSocket({
  url: 'https://socket.myservice.com',
  user: { id: 'usr_1', nickname: '토마토개발자' },
  secretKey: 'optional-aes-key'
});
```

### `useGroupChat`
Manages room listing, room creation, joining/leaving, member lists, and message stream:
```tsx
const {
  rooms,            // GroupRoomInfo[]
  currentRoom,      // GroupRoomInfo | null
  roomMembers,      // TomatoUser[]
  messages,         // ChatMessage[] (deduplicated by message ID)
  createRoom,       // ({ title, description, topic, maxMembers }) => void
  joinRoom,         // (roomId) => void
  leaveRoom,        // () => void
  refreshRooms,     // () => void
  sendTextMessage,  // (text: string) => void
  sendImageMessage  // (base64: string) => void
} = useGroupChat({
  socket,
  currentUser,
  secretKey,
  sendMessage
});
```

### `useDirectChat`
1:1 DM with online user directory and typing indicators:
```tsx
const {
  onlineUsers,       // TomatoUser[] (excluding self)
  activePartner,     // TomatoUser | null
  messages,          // ChatMessage[]
  isPartnerTyping,   // boolean
  openDirectChat,    // (targetUser: TomatoUser) => void
  closeDirectChat,   // () => void
  sendTextMessage,   // (text: string) => void
  sendImageMessage,  // (base64: string) => void
  emitTyping         // (isTyping: boolean) => void
} = useDirectChat({ socket, currentUser, secretKey, sendMessage });
```

### `useRandomChat`
Matchmaking queue, pairing, skipping to next partner:
```tsx
const {
  status,            // 'idle' | 'matching' | 'connected' | 'partner_disconnected'
  partner,           // TomatoUser | null
  messages,          // ChatMessage[]
  startMatching,     // (topic?: string) => void
  cancelMatching,    // () => void
  nextPartner,       // () => void
  leaveChat,         // () => void
  sendTextMessage,   // (text: string) => void
  sendImageMessage   // (base64: string) => void
} = useRandomChat({ socket, currentUser, secretKey, sendMessage });
```

---

## 5. Backend Socket.IO Event Schema

If mounting onto your own Express / NestJS server:
- `join_room` / `anonymous:join` / `group:join`: Join a socket channel.
- `message:send`: Client sends a message. The server forwards via `socket.to(roomId).emit('message:receive', msg)`.
- `direct:typing`: Relay typing status via `socket.to(roomId).emit('direct:typing_status', ...)`.
- Reference server implementation is available in `@tomato-talk/server` (`packages/server/src/index.ts`).

---

## 6. Production Best Practices & Pitfalls

1. **Korean/CJK IME KeyDown**:
   When implementing custom message inputs, always verify `if (e.nativeEvent.isComposing) return;` on `Enter` key events to prevent sending duplicate messages.
2. **Zero-Backend Development**:
   Use `url="mock"` in local development, PR staging, or storybooks. It runs an in-browser virtual server using `BroadcastChannel` with cross-window support and zero network cost.
3. **End-to-End Encryption (E2EE)**:
   Pass a unique `secretKey` per channel or room. Messages are encrypted with AES-256 in client memory before transmission, keeping backend databases zero-knowledge.
4. **Horizontal Scaling**:
   When deploying multiple Node.js backend instances behind an ALB/Nginx, install `@socket.io/redis-adapter` for inter-server event broadcasting.
