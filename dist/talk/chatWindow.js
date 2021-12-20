import React from 'react';
import ChatRoom from './chatRoom';
import SendForm from './sendForm';

const ChatWindow = props => {
  const {
    socket
  } = props;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(ChatRoom, {
    socket: socket
  }), /*#__PURE__*/React.createElement(SendForm, {
    socket: socket
  }));
};

export default ChatWindow;