import React, { useState, useRef } from 'react';

export interface MessageInputProps {
  onSendText: (text: string) => void;
  onSendImage?: (base64: string) => void;
  onTyping?: (isTyping: boolean) => void;
  disabled?: boolean;
  placeholder?: string;
  maxImageSizeMB?: number;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  onSendText,
  onSendImage,
  onTyping,
  disabled = false,
  placeholder = '메시지를 입력하세요...',
  maxImageSizeMB = 5
}) => {
  const [text, setText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
    if (onTyping) {
      onTyping(true);
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
      typingTimerRef.current = setTimeout(() => {
        onTyping(false);
      }, 1500);
    }
  };

  const handleSend = () => {
    if (!text.trim() || disabled) return;
    onSendText(text.trim());
    setText('');
    if (onTyping) {
      onTyping(false);
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Prevent duplicate firing during Korean/CJK IME composition
    if (e.nativeEvent.isComposing) {
      return;
    }
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onSendImage) return;

    if (file.size > maxImageSizeMB * 1024 * 1024) {
      alert(`이미지 크기는 최대 ${maxImageSizeMB}MB까지 업로드 가능합니다.`);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (base64) {
        onSendImage(base64);
      }
    };
    reader.readAsDataURL(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="tt-input-bar">
      {onSendImage && (
        <>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            style={{ display: 'none' }}
          />
          <button
            type="button"
            className="tt-icon-btn"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled}
            title="이미지 첨부"
          >
            📷
          </button>
        </>
      )}

      <input
        type="text"
        className="tt-input-field"
        value={text}
        onChange={handleTextChange}
        onKeyDown={handleKeyDown}
        placeholder={disabled ? '채팅에 참여할 수 없습니다' : placeholder}
        disabled={disabled}
      />

      <button
        type="button"
        className="tt-send-btn"
        onClick={handleSend}
        disabled={disabled || !text.trim()}
        title="전송"
      >
        ➤
      </button>
    </div>
  );
};
