import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import WebChat from './webChat';
import RoomContextProvider from './store/roomContext';

const TomatoTalk = props => {
  const {
    url
  } = props;
  const [socket, setSocket] = useState(null);
  useEffect(() => {
    setSocket(io(url, {
      transports: ['websocket']
    }));
  }, []);
  return /*#__PURE__*/React.createElement(React.Fragment, null, socket !== null && /*#__PURE__*/React.createElement(RoomContextProvider, null, /*#__PURE__*/React.createElement(WebChat, {
    socket: socket
  })));
};

export default TomatoTalk;