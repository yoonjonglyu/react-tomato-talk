import React, { useContext } from 'react';
import { ModalContext } from '../../store/modalContext';

const ChatMessage = props => {
  const {
    messages,
    userId
  } = props;
  const {
    handleIsModal,
    handleModal
  } = useContext(ModalContext);

  const openImageModal = src => {
    handleModal( /*#__PURE__*/React.createElement("img", {
      src: src,
      style: {
        maxWidth: "100%",
        maxHeight: "100%"
      }
    }));
    handleIsModal(true);
  };

  return /*#__PURE__*/React.createElement(React.Fragment, null, messages.map((current, idx) => {
    const messageStyle = {
      maxWidth: "58%",
      padding: "8px",
      margin: "8px",
      fontSize: "1rem",
      color: "#1b1b1b",
      wordBreak: "break-word",
      background: "rgb(0 0 0 / 19%)",
      borderRadius: "6px"
    };
    const boxStyle = {
      display: "flex",
      flex: "1",
      flexFlow: "column",
      width: "100%",
      margin: 0
    };

    if (current.idx === '#system') {
      messageStyle.maxWidth = "100%";
      messageStyle.textAlign = "center";
      messageStyle.color = "rgb(98 14 14)";
      messageStyle.fontSize = "0.9rem";
      messageStyle.margin = "6px";
    }

    if (current.idx === userId) {
      messageStyle.background = "tomato";
      boxStyle.marginLeft = "auto";
      boxStyle.flexFlow = "row-reverse";
    } else if (current.idx !== '#system') {
      messageStyle.background = "#eeeeee";
      boxStyle.marginRight = "auto";
      boxStyle.flexFlow = "row";
    }

    return /*#__PURE__*/React.createElement("article", {
      key: idx,
      style: {
        display: "flex",
        flexFlow: "column"
      }
    }, current.idx !== '#system' && current.idx !== userId && /*#__PURE__*/React.createElement("span", {
      style: {
        paddingLeft: "8px",
        fontSize: "0.8rem"
      }
    }, current.idx), /*#__PURE__*/React.createElement("p", {
      style: boxStyle
    }, current.message.slice(0, 5) !== '@$IMG' ? /*#__PURE__*/React.createElement("span", {
      style: messageStyle
    }, current.message) : /*#__PURE__*/React.createElement("img", {
      src: current.message.slice(5),
      style: messageStyle,
      onClick: () => openImageModal(current.message.slice(5))
    }), current.idx !== '#system' && /*#__PURE__*/React.createElement("time", {
      style: {
        display: "flex",
        alignItems: "flex-end",
        marginBottom: "8px",
        fontSize: "0.7rem"
      }
    }, current.time)));
  }));
};

export default ChatMessage;