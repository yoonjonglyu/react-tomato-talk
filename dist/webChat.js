import React, { useEffect, useState } from 'react';
import ChatWindow from './talk/chatWindow';
import Loading from './loading';
import ChatEvents from './lib/chatEvents';

const WebChat = props => {
  const {
    socket
  } = props;
  const [step, setStep] = useState(0);

  const handleStep = step => {
    setStep(step);
  };

  useEffect(() => {
    const Events = new ChatEvents(socket);
    Events.handleConnect(() => {
      socket.emit('join', {
        socketIdx: socket.id,
        room: '#1'
      });
      handleStep(2);
    });
    Events.handleDisConnect(() => {
      handleStep(1);
    });
    Events.handleError(() => {
      handleStep(1);
    });
    return () => {
      socket.close();
    };
  }, [socket]);
  return /*#__PURE__*/React.createElement("article", {
    style: {
      display: "flex",
      flexFlow: "column wrap",
      flex: "1",
      justifyContent: "center",
      position: "relative",
      border: "1px solid #678983"
    }
  }, step < 2 && /*#__PURE__*/React.createElement(Loading, {
    state: step
  }), /*#__PURE__*/React.createElement(ChatWindow, {
    socket: socket
  }));
};

export default WebChat;