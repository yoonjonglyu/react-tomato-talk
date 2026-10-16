import React, { useState } from 'react';
import { Socket } from 'socket.io-client';
import { ChatMessage, TomatoUser } from '../types';
import { useGroupChat } from '../hooks/useGroupChat';
import { ChatHeader } from './common/ChatHeader';
import { MessageList } from './common/MessageList';
import { MessageInput } from './common/MessageInput';

export interface GroupChatViewProps {
  socket: Socket | null;
  currentUser: TomatoUser;
  secretKey?: string;
  sendMessage: (roomId: string, content: string, type?: 'text' | 'image') => ChatMessage | null;
}

export const GroupChatView: React.FC<GroupChatViewProps> = ({
  socket,
  currentUser,
  secretKey,
  sendMessage
}) => {
  const {
    rooms,
    currentRoom,
    roomMembers,
    messages,
    createRoom,
    joinRoom,
    leaveRoom,
    refreshRooms,
    sendTextMessage,
    sendImageMessage
  } = useGroupChat({
    socket,
    currentUser,
    secretKey,
    sendMessage
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTopic, setNewTopic] = useState('');
  const [maxMembers, setMaxMembers] = useState(30);

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    createRoom({
      title: newTitle.trim(),
      topic: newTopic.trim() || '일반 대화',
      maxMembers
    });
    setNewTitle('');
    setNewTopic('');
    setIsModalOpen(false);
  };

  // If inside a group room:
  if (currentRoom) {
    return (
      <div className="tt-body">
        <ChatHeader
          title={currentRoom.title}
          subtitle={`참여자 ${roomMembers.length}명 / 최대 ${currentRoom.maxMembers}명`}
          onBack={leaveRoom}
          rightAction={
            <button
              className="tt-outline-btn"
              onClick={leaveRoom}
              style={{ fontSize: '11px', padding: '4px 8px', color: '#ff4757', borderColor: '#ff4757' }}
            >
              나가기
            </button>
          }
        />

        <div style={{ padding: '6px 16px', background: '#ffffff', fontSize: '12px', color: '#747d8c', borderBottom: '1px solid #e4e7eb' }}>
          🏷️ {currentRoom.topic || '일반 대화'}
        </div>

        <MessageList messages={messages} currentUserId={currentUser.id} />

        <MessageInput
          onSendText={sendTextMessage}
          onSendImage={sendImageMessage}
          placeholder="그룹에 메시지 보내기..."
        />
      </div>
    );
  }

  // If viewing the room list:
  return (
    <div className="tt-body">
      <ChatHeader
        title="그룹 채팅방 목록"
        subtitle={`개설된 대화방 ${rooms.length}개`}
        user={currentUser}
        rightAction={
          <button
            className="tt-primary-btn"
            onClick={() => setIsModalOpen(true)}
            style={{ fontSize: '12px', padding: '6px 12px' }}
          >
            + 방 만들기
          </button>
        }
      />

      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 16px', alignItems: 'center' }}>
        <span style={{ fontSize: '13px', fontWeight: 600, color: '#2f3542' }}>참여 가능한 방</span>
        <button className="tt-icon-btn" onClick={refreshRooms} title="목록 새로고침">
          🔄
        </button>
      </div>

      {rooms.length === 0 ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#747d8c', gap: '8px' }}>
          <span style={{ fontSize: '32px' }}>💬</span>
          <p style={{ margin: 0, fontSize: '14px' }}>개설된 그룹 채팅방이 없습니다.</p>
          <button className="tt-primary-btn" onClick={() => setIsModalOpen(true)} style={{ marginTop: '8px', fontSize: '13px' }}>
            첫 번째 방 개설하기
          </button>
        </div>
      ) : (
        <div className="tt-card-grid">
          {rooms.map((room) => (
            <div key={room.id} className="tt-room-card" onClick={() => joinRoom(room.id)}>
              <div>
                <div className="tt-room-card-title">{room.title}</div>
                <div className="tt-room-card-topic">🏷️ {room.topic || '일반 대화'}</div>
              </div>
              <div className="tt-room-card-footer">
                <span>👥 {room.memberCount || 0} / {room.maxMembers}명</span>
                <span style={{ color: '#ff4757', fontWeight: 600 }}>참여하기 →</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="tt-modal-overlay">
          <div className="tt-modal">
            <h3 className="tt-modal-title">새 그룹 채팅방 만들기</h3>
            <form onSubmit={handleCreateRoom}>
              <div className="tt-form-group">
                <label>채팅방 이름</label>
                <input
                  type="text"
                  placeholder="예: 토마토 개발자 모임"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                  autoFocus
                />
              </div>
              <div className="tt-form-group">
                <label>대화 주제 (태그)</label>
                <input
                  type="text"
                  placeholder="예: 리액트, 코딩, 일상"
                  value={newTopic}
                  onChange={(e) => setNewTopic(e.target.value)}
                />
              </div>
              <div className="tt-form-group">
                <label>최대 인원</label>
                <select value={maxMembers} onChange={(e) => setMaxMembers(Number(e.target.value))}>
                  <option value={10}>10명</option>
                  <option value={30}>30명</option>
                  <option value={50}>50명</option>
                  <option value={100}>100명</option>
                </select>
              </div>
              <div className="tt-modal-actions">
                <button type="button" className="tt-outline-btn" onClick={() => setIsModalOpen(false)}>
                  취소
                </button>
                <button type="submit" className="tt-primary-btn" disabled={!newTitle.trim()}>
                  방 만들기
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
