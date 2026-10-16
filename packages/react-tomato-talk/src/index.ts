// React Tomato Talk SDK & UI Kit
import './styles/tomato.css';

// Components
export { TomatoTalk, default } from './components/TomatoTalk';
export type { TomatoTalkProps } from './components/TomatoTalk';

export { AnonymousChatView } from './components/AnonymousChatView';
export type { AnonymousChatViewProps } from './components/AnonymousChatView';

export { GroupChatView } from './components/GroupChatView';
export type { GroupChatViewProps } from './components/GroupChatView';

export { DirectChatView } from './components/DirectChatView';
export type { DirectChatViewProps } from './components/DirectChatView';

export { RandomChatView } from './components/RandomChatView';
export type { RandomChatViewProps } from './components/RandomChatView';

export { ChatHeader } from './components/common/ChatHeader';
export { MessageList } from './components/common/MessageList';
export { MessageInput } from './components/common/MessageInput';

// Headless Hooks
export { useTomatoSocket } from './hooks/useTomatoSocket';
export type { UseTomatoSocketReturn } from './hooks/useTomatoSocket';

export { useAnonymousChat } from './hooks/useAnonymousChat';
export type { UseAnonymousChatOptions, UseAnonymousChatReturn } from './hooks/useAnonymousChat';

export { useGroupChat } from './hooks/useGroupChat';
export type { UseGroupChatOptions, UseGroupChatReturn } from './hooks/useGroupChat';

export { useDirectChat } from './hooks/useDirectChat';
export type { UseDirectChatOptions, UseDirectChatReturn } from './hooks/useDirectChat';

export { useRandomChat } from './hooks/useRandomChat';
export type { UseRandomChatOptions, UseRandomChatReturn } from './hooks/useRandomChat';

// Core & Utilities
export { TomatoSocketClient } from './core/socket';
export { MockSocket } from './core/mockSocket';
export { encryptMessage, decryptMessage } from './core/crypto';
export { generateAnonymousNickname, getRandomAvatar, TOMATO_AVATARS } from './core/avatar';

// Types
export * from './types';
