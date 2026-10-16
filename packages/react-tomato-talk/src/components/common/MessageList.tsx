import React, { useEffect, useRef } from 'react';
import { ChatMessage } from '../../types';

export interface MessageListProps {
  messages: ChatMessage[];
  currentUserId?: string;
  isTyping?: boolean;
  typingText?: string;
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  currentUserId,
  isTyping = false,
  typingText = '상대방이 입력 중입니다...'
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const formatTime = (ts: number) => {
    const d = new Date(ts);
    return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  };

  return (
    <div className="tt-messages" ref={scrollRef}>
      {messages.map((msg) => {
        if (msg.type === 'system') {
          return (
            <div key={msg.id} className="tt-message-row system">
              <div className="tt-bubble system">{msg.content}</div>
            </div>
          );
        }

        const isMine = currentUserId ? msg.senderId === currentUserId : false;

        return (
          <div key={msg.id} className={`tt-message-row ${isMine ? 'mine' : 'other'}`}>
            {!isMine && (
              <div className="tt-avatar">{msg.senderAvatar || '🍅'}</div>
            )}
            <div className="tt-bubble-container">
              {!isMine && (
                <span className="tt-sender-name">{msg.senderName}</span>
              )}
              <div style={{ display: 'flex', gap: '4px', flexDirection: isMine ? 'row-reverse' : 'row' }}>
                <div className={`tt-bubble ${isMine ? 'mine' : 'other'}`}>
                  {msg.type === 'image' ? (
                    <img src={msg.content} alt="전송된 이미지" className="tt-image-msg" />
                  ) : (
                    msg.content
                  )}
                </div>
                <span className="tt-msg-time">{formatTime(msg.timestamp)}</span>
              </div>
            </div>
          </div>
        );
      })}

      {isTyping && (
        <div className="tt-typing-indicator">
          <span>✍️</span> {typingText}
        </div>
      )}
    </div>
  );
};
