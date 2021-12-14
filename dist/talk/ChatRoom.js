import React, { useState, useEffect, useRef } from 'react';
import ChatMessage from './chatMessage';

const ChatRoom = props => {
  const {
    socket
  } = props;
  const [chatLog, setChatLog] = useState < Array < {
    idx: string,
    message: string
  } >> [];
  useEffect(() => {
    const handleChatLog = msg => {
      setChatLog([...chatLog, msg]);
    };

    socket.once('receive', data => {
      if (socket.connected) {
        handleChatLog(data);
      }
    });
    socket.once('joinRoom', id => {
      if (socket.connected) {
        handleChatLog({
          idx: '#system',
          message: `${id} 님이 대화에 참여 하였습니다.`
        });
      }
    });
    socket.once('leaveRoom', id => {
      if (socket.connected) {
        handleChatLog({
          idx: '#system',
          message: `${id} 님이 대화에서 나갔습니다.`
        });
      }
    });
    return () => {
      socket.removeAllListeners('receive');
      socket.removeAllListeners('joinRoom');
      socket.removeAllListeners('leaveRoom');
    };
  }); // 자기가 최신 메시지를 보낼때 자동 스크롤하기

  const Room = useRef(null);
  useEffect(() => {
    if (socket.id === chatLog[chatLog.length - 1]?.idx) {
      if (Room.current.scroll) {
        Room.current.scroll(0, Room.current.scrollHeight);
      }
    }
  }, [chatLog]);
  return /*#__PURE__*/React.createElement("div", {
    "data-testid": "chat-room",
    style: {
      display: "flex",
      flexFlow: "column nowrap",
      flex: "1 0px",
      background: "#E6DDC4",
      overflow: "auto"
    },
    ref: Room
  }, /*#__PURE__*/React.createElement(ChatMessage, {
    messages: chatLog,
    userIdx: socket.id
  }));
};

export default ChatRoom;