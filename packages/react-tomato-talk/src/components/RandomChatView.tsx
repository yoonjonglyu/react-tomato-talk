import React, { useState } from 'react';
import { Socket } from 'socket.io-client';
import { ChatMessage, TomatoUser } from '../types';
import { useRandomChat } from '../hooks/useRandomChat';
import { ChatHeader } from './common/ChatHeader';
import { MessageList } from './common/MessageList';
import { MessageInput } from './common/MessageInput';

export interface RandomChatViewProps {
  socket: Socket | null;
  currentUser: TomatoUser;
  secretKey?: string;
  sendMessage: (roomId: string, content: string, type?: 'text' | 'image') => ChatMessage | null;
}

const TOPICS = ['전체 랜덤', '취미 / 게임', '연애 / 고민상담', '음악 / 영화', '개발 / 코딩'];

export const RandomChatView: React.FC<RandomChatViewProps> = ({
  socket,
  currentUser,
  secretKey,
  sendMessage
}) => {
  const {
    status,
    partner,
    messages,
    startMatching,
    cancelMatching,
    nextPartner,
    leaveChat,
    sendTextMessage,
    sendImageMessage
  } = useRandomChat({
    socket,
    currentUser,
    secretKey,
    sendMessage
  });

  const [selectedTopic, setSelectedTopic] = useState('전체 랜덤');

  // If connected with a partner
  if (status === 'connected' && partner) {
    return (
      <div className="tt-body">
        <ChatHeader
          title={`대화 상대: ${partner.nickname}`}
          subtitle="실시간 랜덤 1:1 대화 중"
          rightAction={
            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                className="tt-outline-btn"
                style={{ fontSize: '11px', padding: '4px 8px' }}
                onClick={nextPartner}
                title="다음 상대와 대화"
              >
                ⏭️ 다음 상대
              </button>
              <button
                className="tt-outline-btn"
                style={{ fontSize: '11px', padding: '4px 8px', color: '#ff4757', borderColor: '#ff4757' }}
                onClick={leaveChat}
                title="대화 종료"
              >
                종료
              </button>
            </div>
          }
        />

        <MessageList messages={messages} currentUserId={currentUser.id} />

        <MessageInput
          onSendText={sendTextMessage}
          onSendImage={sendImageMessage}
          placeholder="상대방에게 첫 인사를 건네보세요..."
        />
      </div>
    );
  }

  // If matching in progress:
  if (status === 'matching') {
    return (
      <div className="tt-body">
        <ChatHeader title="랜덤 매칭 중" subtitle="대화 상대를 검색하고 있습니다" />
        <div className="tt-matching-screen">
          <div className="tt-pulse-tomato">🍅</div>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', color: '#2f3542' }}>
            매칭 대기열에 등록되었습니다
          </h3>
          <p style={{ margin: '0 0 24px 0', fontSize: '13px', color: '#747d8c' }}>
            주제: <strong style={{ color: '#ff4757' }}>{selectedTopic}</strong>
            <br />
            잠시만 기다려주세요...
          </p>
          <button className="tt-outline-btn" onClick={cancelMatching}>
            매칭 취소
          </button>
        </div>
      </div>
    );
  }

  // If partner disconnected:
  if (status === 'partner_disconnected') {
    return (
      <div className="tt-body">
        <ChatHeader title="랜덤 대화 종료" subtitle="상대방이 나갔습니다" />
        <div className="tt-matching-screen">
          <span style={{ fontSize: '48px', marginBottom: '16px' }}>🍂</span>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', color: '#2f3542' }}>
            상대방과의 대화가 종료되었습니다.
          </h3>
          <p style={{ margin: '0 0 20px 0', fontSize: '13px', color: '#747d8c' }}>
            새로운 상대와 다시 매칭을 시작해보세요!
          </p>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="tt-outline-btn" onClick={leaveChat}>
              홈으로
            </button>
            <button className="tt-primary-btn" onClick={() => startMatching(selectedTopic)}>
              새 상대 찾기 🎲
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Default: Idle screen
  return (
    <div className="tt-body">
      <ChatHeader
        title="랜덤 채팅"
        subtitle="새로운 토마토와 1:1 비밀 대화"
        user={currentUser}
      />

      <div className="tt-matching-screen">
        <span style={{ fontSize: '54px', marginBottom: '12px' }}>🍅✨</span>
        <h2 style={{ margin: '0 0 8px 0', fontSize: '20px', color: '#2f3542', fontWeight: 800 }}>
          랜덤 대화 시작하기
        </h2>
        <p style={{ margin: '0 0 24px 0', fontSize: '13px', color: '#747d8c', maxWidth: '280px', lineHeight: 1.5 }}>
          익명으로 누군가와 즉석에서 대화를 나누고 취향을 공유해보세요.
        </p>

        <div style={{ width: '100%', maxWidth: '260px', marginBottom: '24px', textAlign: 'left' }}>
          <label style={{ fontSize: '12px', fontWeight: 600, color: '#747d8c', display: 'block', marginBottom: '6px' }}>
            대화 주제 선택
          </label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {TOPICS.map((topic) => (
              <label
                key={topic}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 12px',
                  background: selectedTopic === topic ? '#ffeef0' : '#ffffff',
                  border: `1px solid ${selectedTopic === topic ? '#ff4757' : '#e4e7eb'}`,
                  borderRadius: '10px',
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
              >
                <input
                  type="radio"
                  name="topic"
                  checked={selectedTopic === topic}
                  onChange={() => setSelectedTopic(topic)}
                  style={{ accentColor: '#ff4757' }}
                />
                {topic}
              </label>
            ))}
          </div>
        </div>

        <button
          className="tt-primary-btn"
          style={{ width: '100%', maxWidth: '260px', padding: '12px', fontSize: '15px' }}
          onClick={() => startMatching(selectedTopic)}
        >
          매칭 시작하기 ⚡
        </button>
      </div>
    </div>
  );
};
