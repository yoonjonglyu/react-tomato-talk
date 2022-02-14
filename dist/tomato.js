import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import WebChat from './webChat';
import RootContextProvider from './store';

const TomatoTalk = props => {
  const {
    url,
    imageSize,
    secretKey
  } = props;
  const [socket, setSocket] = useState(null);
  useEffect(() => {
    setSocket(io(url, {
      transports: ['websocket']
    }));
  }, []);
  return /*#__PURE__*/React.createElement(React.Fragment, null, socket !== null && /*#__PURE__*/React.createElement(RootContextProvider, null, /*#__PURE__*/React.createElement(WebChat, {
    socket: socket,
    config: {
      imageSize,
      secretKey
    }
  })));
};

export default TomatoTalk;