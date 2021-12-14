import React, { useState } from 'react';

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
      background: "#DFD8CA"
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "text",
    "data-testid": "chat-input",
    value: message,
    onChange: handleMsg,
    style: {
      flex: "3 0px",
      margin: "3px 3px 0 0"
    }
  }), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    "data-testid": "chat-request",
    style: {
      margin: "3px 0 0 0",
      padding: "6px 12px",
      color: "#FBF3E4",
      background: "#105652",
      border: "0",
      borderRadius: "3px"
    }
  }, "\uC804\uC1A1"));
};

export default SendForm;