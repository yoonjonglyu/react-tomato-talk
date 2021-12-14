import React, { useEffect, useState } from 'react';
import ChatWindow from './talk/chatWindow';

const WebChat = props => {
  const {
    socket
  } = props;
  const [step, setStep] = useState(0);

  const handleStep = step => {
    setStep(step);
  };

  useEffect(() => {
    socket.on('connect', async () => {
      if (socket.connected) {
        socket.emit('join', {
          socketIdx: socket.id,
          room: '#1'
        });
      }
    });
    return () => {
      socket.close();
    };
  }, []);
  return /*#__PURE__*/React.createElement("article", {
    style: {
      display: "flex",
      flexFlow: "column wrap",
      flex: "1",
      justifyContent: "center",
      border: "1px solid #678983"
    }
  }, step === 0 && /*#__PURE__*/React.createElement(ChatWindow, {
    socket: socket
  }));
};

export default WebChat;