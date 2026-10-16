import React from 'react';
import { Socket } from 'socket.io-client';
import { ChatMessage, TomatoUser } from '../types';
import { useDirectChat } from '../hooks/useDirectChat';
import { ChatHeader } from './common/ChatHeader';
import { MessageList } from './common/MessageList';
import { MessageInput } from './common/MessageInput';

export interface DirectChatViewProps {
  socket: Socket | null;
  currentUser: TomatoUser;
  secretKey?: string;
  sendMessage: (roomId: string, content: string, type?: 'text' | 'image') => ChatMessage | null;
}

export const DirectChatView: React.FC<DirectChatViewProps> = ({
  socket,
  currentUser,
  secretKey,
  sendMessage
}) => {
  const {
    onlineUsers,
    activePartner,
    messages,
    isPartnerTyping,
    refreshUsers,
    openDirectChat,
    closeDirectChat,
    sendTextMessage,
    sendImageMessage,
    emitTyping
  } = useDirectChat({
    socket,
    currentUser,
    secretKey,
    sendMessage
  });

  // If in an active 1:1 direct chat session:
  if (activePartner) {
    return (
      <div className="tt-body">
        <ChatHeader
          title={`${activePartner.nickname}`}
          subtitle="1:1 개인 대화"
          onBack={closeDirectChat}
          rightAction={
            <div style={{ fontSize: '18px' }}>{activePartner.avatar || '🍅'}</div>
          }
        />

        <MessageList
          messages={messages}
          currentUserId={currentUser.id}
          isTyping={isPartnerTyping}
          typingText={`${activePartner.nickname} 님이 입력 중입니다...`}
        />

        <MessageInput
          onSendText={sendTextMessage}
          onSendImage={sendImageMessage}
          onTyping={emitTyping}
          placeholder={`${activePartner.nickname} 님에게 메시지 보내기...`}
        />
      </div>
    );
  }

  // If viewing online users list to start 1:1 chat:
  return (
    <div className="tt-body">
      <ChatHeader
        title="1:1 개인 채팅"
        subtitle={`접속 중인 사용자 ${onlineUsers.length}명`}
        user={currentUser}
        rightAction={
          <button className="tt-icon-btn" onClick={refreshUsers} title="새로고침">
            🔄
          </button>
        }
      />

      <div style={{ padding: '12px 16px', fontSize: '13px', fontWeight: 600, color: '#2f3542' }}>
        대화 가능한 상대 선택
      </div>

      {onlineUsers.length === 0 ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#747d8c', gap: '8px' }}>
          <span style={{ fontSize: '32px' }}>🌱</span>
          <p style={{ margin: 0, fontSize: '14px' }}>현재 접속 중인 다른 사용자가 없습니다.</p>
          <span style={{ fontSize: '12px' }}>다른 탭이나 창에서 접속하면 여기에 표시됩니다!</span>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '0 16px 16px 16px', overflowY: 'auto' }}>
          {onlineUsers.map((user) => (
            <div
              key={user.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px',
                background: '#ffffff',
                border: '1px solid #e4e7eb',
                borderRadius: '12px',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div className="tt-avatar">{user.avatar || '🍅'}</div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#2f3542' }}>{user.nickname}</div>
                  <div style={{ fontSize: '11px', color: '#2ed573' }}>● 접속 중</div>
                </div>
              </div>
              <button
                className="tt-primary-btn"
                style={{ fontSize: '12px', padding: '6px 14px' }}
                onClick={() => openDirectChat(user)}
              >
                1:1 대화
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
