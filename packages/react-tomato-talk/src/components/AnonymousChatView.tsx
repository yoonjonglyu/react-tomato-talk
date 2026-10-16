import React, { useState } from 'react';
import { Socket } from 'socket.io-client';
import { ChatMessage, TomatoUser } from '../types';
import { useAnonymousChat } from '../hooks/useAnonymousChat';
import { ChatHeader } from './common/ChatHeader';
import { MessageList } from './common/MessageList';
import { MessageInput } from './common/MessageInput';

export interface AnonymousChatViewProps {
  socket: Socket | null;
  currentUser: TomatoUser;
  secretKey?: string;
  sendMessage: (roomId: string, content: string, type?: 'text' | 'image') => ChatMessage | null;
  onUserUpdate?: (user: Partial<TomatoUser>) => void;
  defaultRoomId?: string;
}

const POPULAR_TAGS = ['#자유토크', '#취미공유', '#고민상담', '#익명광장'];

export const AnonymousChatView: React.FC<AnonymousChatViewProps> = ({
  socket,
  currentUser,
  secretKey,
  sendMessage,
  onUserUpdate,
  defaultRoomId = 'anon_lounge'
}) => {
  const {
    currentRoomId,
    changeRoom,
    messages,
    roomUserCount,
    sendTextMessage,
    sendImageMessage,
    regenerateIdentity
  } = useAnonymousChat({
    socket,
    currentUser,
    defaultRoomId,
    secretKey,
    onUserUpdate,
    sendMessage
  });

  const [customRoomInput, setCustomRoomInput] = useState('');

  return (
    <div className="tt-body">
      <ChatHeader
        title={`익명 채팅: ${currentRoomId}`}
        subtitle={`참여자 ${roomUserCount}명`}
        user={currentUser}
        onUserClick={regenerateIdentity}
        rightAction={
          <button
            className="tt-outline-btn"
            onClick={regenerateIdentity}
            title="새 닉네임 생성"
            style={{ fontSize: '11px', padding: '4px 8px' }}
          >
            🎲 닉네임 재설정
          </button>
        }
      />

      <div style={{ display: 'flex', gap: '6px', padding: '8px 16px', background: '#ffffff', borderBottom: '1px solid #e4e7eb', overflowX: 'auto' }}>
        {POPULAR_TAGS.map((tag) => (
          <button
            key={tag}
            className="tt-outline-btn"
            style={{
              padding: '4px 10px',
              fontSize: '11px',
              background: currentRoomId === tag ? '#ffeef0' : 'transparent',
              borderColor: currentRoomId === tag ? '#ff4757' : '#e4e7eb',
              color: currentRoomId === tag ? '#ff4757' : '#2f3542'
            }}
            onClick={() => changeRoom(tag)}
          >
            {tag}
          </button>
        ))}
      </div>

      <MessageList messages={messages} currentUserId={currentUser.id} />

      <MessageInput
        onSendText={sendTextMessage}
        onSendImage={sendImageMessage}
        placeholder="익명으로 메시지를 남겨보세요..."
      />
    </div>
  );
};
