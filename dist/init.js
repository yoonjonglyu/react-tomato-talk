import React from 'react';
import { io } from 'socket.io-client';
import WebChat from './webChat';

const Init = props => {
  const {
    url
  } = props;
  const Socket = io(url, {
    transports: ['websocket']
  });
  return () => /*#__PURE__*/React.createElement(WebChat, {
    socket: Socket
  });
};

export default Init;