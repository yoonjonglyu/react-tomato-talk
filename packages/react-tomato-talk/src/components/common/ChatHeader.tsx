import React from 'react';
import { TomatoUser } from '../../types';

export interface ChatHeaderProps {
  title: string;
  subtitle?: string;
  user?: TomatoUser;
  onUserClick?: () => void;
  onBack?: () => void;
  rightAction?: React.ReactNode;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  title,
  subtitle,
  user,
  onUserClick,
  onBack,
  rightAction
}) => {
  return (
    <header className="tt-header">
      <div className="tt-header-left">
        {onBack && (
          <button className="tt-icon-btn" onClick={onBack} title="뒤로가기">
            ‹
          </button>
        )}
        <div className="tt-logo">🍅</div>
        <div className="tt-title-box">
          <h3>{title}</h3>
          {subtitle && <span>{subtitle}</span>}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {rightAction}
        {user && (
          <button className="tt-user-badge" onClick={onUserClick} title="내 정보 변경">
            <span>{user.avatar || '🍅'}</span>
            <span>{user.nickname}</span>
          </button>
        )}
      </div>
    </header>
  );
};
