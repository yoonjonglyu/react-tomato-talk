import React from 'react';

const ChatMessage = props => {
  const {
    messages,
    userIdx
  } = props;
  return /*#__PURE__*/React.createElement(React.Fragment, null, messages.map((current, idx) => {
    const Style = {
      maxWidth: "58%",
      padding: "8px",
      margin: "8px",
      fontSize: "1rem",
      color: "#1b1b1b",
      wordBreak: "break-word",
      background: "rgb(0 0 0 / 19%)",
      borderRadius: "6px"
    };

    if (current.idx === '#system') {
      Style.maxWidth = "100%";
      Style.textAlign = "center";
      Style.color = "rgb(98 14 14)";
      Style.fontSize = "0.9rem";
      Style.margin = "6px";
    }

    if (current.idx === userIdx) {
      Style.background = "tomato";
      Style.marginLeft = "auto";
    } else if (current.idx !== '#system') {
      Style.background = "#eeeeee";
      Style.marginRight = "auto";
    }

    return /*#__PURE__*/React.createElement("article", {
      key: idx,
      style: {
        display: "flex",
        flexFlow: "column"
      }
    }, current.idx !== '#system' && current.idx !== userIdx && /*#__PURE__*/React.createElement("span", {
      style: {
        paddingLeft: "8px",
        fontSize: "0.8rem"
      }
    }, current.idx), /*#__PURE__*/React.createElement("p", {
      style: Style
    }, current.message));
  }));
};

export default ChatMessage;