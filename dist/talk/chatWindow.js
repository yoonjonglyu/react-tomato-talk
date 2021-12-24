import React from 'react';
import ChatRoom from './chatRoom/chatRoom';
import SendForm from './sendMessage/sendForm';
import ChatHead from './chatHead/chatHead';

const ChatWindow = props => {
  const {
    socket
  } = props;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(ChatHead, {
    socket: socket
  }), /*#__PURE__*/React.createElement(ChatRoom, {
    socket: socket
  }), /*#__PURE__*/React.createElement(SendForm, {
    socket: socket
  }));
};

export default ChatWindow;