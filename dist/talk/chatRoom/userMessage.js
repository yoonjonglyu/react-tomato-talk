import React from 'react';

const UserMessage = ({
  message,
  openImageModal,
  time
}) => {
  const messageStyle = {
    maxWidth: "58%",
    padding: "8px",
    margin: "8px",
    fontSize: "1rem",
    color: "#1b1b1b",
    wordBreak: "break-word",
    background: "tomato",
    borderRadius: "6px"
  };
  const boxStyle = {
    display: "flex",
    flex: "1",
    flexFlow: "row-reverse",
    width: "100%",
    margin: 0,
    marginLeft: "auto"
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("p", {
    style: boxStyle
  }, message.slice(0, 5) !== '@$IMG' ? /*#__PURE__*/React.createElement("span", {
    "data-testid": "user",
    style: messageStyle
  }, message) : /*#__PURE__*/React.createElement("img", {
    "data-testid": "user-image",
    src: message.slice(5),
    style: messageStyle,
    onClick: () => openImageModal(message.slice(5)),
    alt: "\uC804\uC1A1\uB41C \uC774\uBBF8\uC9C0"
  }), /*#__PURE__*/React.createElement("time", {
    style: {
      display: "flex",
      alignItems: "flex-end",
      marginBottom: "8px",
      fontSize: "0.7rem"
    }
  }, time)));
};

export default UserMessage;