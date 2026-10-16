import React, { useState } from 'react';
import { ChatMode, TomatoUser } from '../types';
import { useTomatoSocket } from '../hooks/useTomatoSocket';
import { AnonymousChatView } from './AnonymousChatView';
import { GroupChatView } from './GroupChatView';
import { DirectChatView } from './DirectChatView';
import { RandomChatView } from './RandomChatView';
import '../styles/tomato.css';

export interface TomatoTalkProps {
  url: string;
  secretKey?: string;
  user?: Partial<TomatoUser>;
  mode?: 'all' | ChatMode;
  defaultTab?: ChatMode;
  maxImageSizeMB?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const TomatoTalk: React.FC<TomatoTalkProps> = ({
  url,
  secretKey,
  user,
  mode = 'all',
  defaultTab = 'anonymous',
  className = '',
  style
}) => {
  const [activeTab, setActiveTab] = useState<ChatMode>(
    mode !== 'all' ? mode : defaultTab
  );

  const {
    socket,
    isConnected,
    currentUser,
    updateUser,
    sendMessage
  } = useTomatoSocket({
    url,
    secretKey,
    user
  });

  const showTabs = mode === 'all';

  return (
    <section className={`tomato-talk-container ${className}`} style={style}>
      {!isConnected && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          background: '#ffa502',
          color: '#ffffff',
          fontSize: '11px',
          fontWeight: 600,
          padding: '3px 8px',
          textAlign: 'center',
          zIndex: 10
        }}>
          서버에 연결하는 중입니다... 🔄
        </div>
      )}

      {showTabs && (
        <nav className="tt-tabs">
          <button
            className={`tt-tab-btn ${activeTab === 'anonymous' ? 'active' : ''}`}
            onClick={() => setActiveTab('anonymous')}
          >
            <span>🎭</span> 익명광장
          </button>
          <button
            className={`tt-tab-btn ${activeTab === 'group' ? 'active' : ''}`}
            onClick={() => setActiveTab('group')}
          >
            <span>👥</span> 그룹채팅
          </button>
          <button
            className={`tt-tab-btn ${activeTab === 'direct' ? 'active' : ''}`}
            onClick={() => setActiveTab('direct')}
          >
            <span>💬</span> 1:1 대화
          </button>
          <button
            className={`tt-tab-btn ${activeTab === 'random' ? 'active' : ''}`}
            onClick={() => setActiveTab('random')}
          >
            <span>⚡</span> 랜덤채팅
          </button>
        </nav>
      )}

      {activeTab === 'anonymous' && (
        <AnonymousChatView
          socket={socket}
          currentUser={currentUser}
          secretKey={secretKey}
          sendMessage={sendMessage}
          onUserUpdate={updateUser}
        />
      )}

      {activeTab === 'group' && (
        <GroupChatView
          socket={socket}
          currentUser={currentUser}
          secretKey={secretKey}
          sendMessage={sendMessage}
        />
      )}

      {activeTab === 'direct' && (
        <DirectChatView
          socket={socket}
          currentUser={currentUser}
          secretKey={secretKey}
          sendMessage={sendMessage}
        />
      )}

      {activeTab === 'random' && (
        <RandomChatView
          socket={socket}
          currentUser={currentUser}
          secretKey={secretKey}
          sendMessage={sendMessage}
        />
      )}
    </section>
  );
};

export default TomatoTalk;
