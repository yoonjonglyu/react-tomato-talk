import React, { useEffect, useState, useContext } from 'react';
import UserIcon from '../../assets/user.png';
import ChatEvents from '../../lib/chatEvents';
import { ConfigContext } from '../../store/configContext';
import { ModalContext } from '../../store/modalContext';

const ChatHead = props => {
  const {
    socket
  } = props;
  const [headCount, setHeadCount] = useState([]);
  const {
    room
  } = useContext(ConfigContext);
  const {
    handleIsModal,
    handleModal
  } = useContext(ModalContext);

  const headCountModal = () => {
    handleModal( /*#__PURE__*/React.createElement("ul", {
      style: {
        display: "flex",
        flexFlow: "column nowrap",
        flex: "1",
        margin: "0",
        padding: "0",
        listStyle: "none",
        overflow: "auto"
      }
    }, headCount.map((id, idx) => /*#__PURE__*/React.createElement("li", {
      key: idx,
      style: {
        margin: "8px",
        textAlign: "center",
        color: "#e4e2b0"
      }
    }, idx + 1, " : ", id))));
  };

  const openUserList = () => {
    headCountModal();
    handleIsModal(true);
  };

  useEffect(() => {
    if (room !== '') {
      const Events = new ChatEvents(socket);
      Events.getHeadCount(room, setHeadCount);
    }
  }, [room]);
  useEffect(() => {
    if (headCount.length > 0) {
      headCountModal();
    }
  }, [headCount]);
  return /*#__PURE__*/React.createElement("div", {
    "data-testid": "chat-head",
    style: {
      display: "flex",
      height: "48px",
      background: "rgb(230, 221, 196)"
    }
  }, /*#__PURE__*/React.createElement("nav", {
    style: {
      display: "flex",
      flex: "1"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: UserIcon,
    style: {
      width: "30px",
      height: "30px",
      margin: "9px"
    },
    onClick: openUserList
  }), /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: "12px 0",
      fontSize: "1rem",
      color: "rgb(103, 137, 131)"
    }
  }, room || "#1", /*#__PURE__*/React.createElement("span", {
    style: {
      color: "rgb(57, 80, 76)"
    }
  }, "(", headCount.length, ")"))), /*#__PURE__*/React.createElement("button", {
    type: "button",
    title: "\uBC29\uC5D0\uC11C \uB098\uAC00\uAE30",
    style: {
      background: "none",
      border: "none",
      fontSize: "1rem",
      fontWeight: 600,
      color: "#464545"
    }
  }, "X"));
};

export default ChatHead;