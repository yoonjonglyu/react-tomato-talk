import React, { useState } from 'react';
import SendPoto from './sendPoto';

const SendForm = props => {
  const {
    socket
  } = props;
  const [message, setMessage] = useState('');

  const sendMessage = e => {
    e.preventDefault();

    if (message.length > 0) {
      socket.emit('send', {
        socketIdx: socket.id,
        message: message,
        room: '#1'
      });
      setMessage('');
    }
  };

  const handleMsg = e => {
    setMessage(e.target.value);
  };

  return /*#__PURE__*/React.createElement("form", {
    "data-testid": "chat-form",
    onSubmit: sendMessage,
    style: {
      display: "flex",
      flexFlow: "row",
      justifyContent: "center",
      padding: "6px",
      background: "#DFD8CA",
      boxShadow: "rgb(206, 202, 194) -0px -1px"
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "text",
    "data-testid": "chat-input",
    value: message,
    onChange: handleMsg,
    style: {
      flex: "3 0px",
      margin: "3px 3px 0 0",
      background: "#DFD8CA",
      fontSize: "1rem",
      border: "none",
      outline: "none"
    },
    placeholder: "\uCC44\uD305 \uBA54\uC2DC\uC9C0\uB97C \uC785\uB825\uD558\uC138\uC694."
  }), /*#__PURE__*/React.createElement(SendPoto, {
    socket: socket
  }));
};

export default SendForm;