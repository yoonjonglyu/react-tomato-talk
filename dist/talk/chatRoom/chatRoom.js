import React, { useState, useEffect, useRef } from 'react';
import ChatMessage from './chatMessage';
import ChatEvents from '../../lib/chatEvents';

const ChatRoom = props => {
  const {
    socket
  } = props;
  const [userId, setUserId] = useState('');
  const [chatLog, setChatLog] = useState([]);
  useEffect(() => {
    setUserId(socket.id);
  }, [chatLog]);
  useEffect(() => {
    const Events = new ChatEvents(socket);
    Events.receiveMessages(msg => {
      setChatLog([...chatLog, { ...msg,
        time: `${new Date().toLocaleTimeString('ko-KR', {
          hour: '2-digit',
          minute: '2-digit'
        })}`
      }]);
    });
    return () => {
      Events.clearReceive();
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
    userId: userId
  }));
};

export default ChatRoom;