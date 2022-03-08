import React, { useEffect, useState, useContext } from 'react';
import RoomList from './roomList';
import ChatWindow from './talk/chatWindow';
import Loading from './loading';
import Modal from './modal';
import ChatEvents from './lib/chatEvents';
import { StoreContext } from './store/configureStore';

const WebChat = props => {
  const {
    socket,
    config
  } = props;
  const {
    handleRoom,
    handleImageSize,
    handleSecretKey,
    step,
    handleStep,
    isModal
  } = useContext(StoreContext);
  useEffect(() => {
    if (config?.imageSize) handleImageSize(config.imageSize);
    if (config?.secretKey) handleSecretKey(config.secretKey);
  }, []);
  const Events = new ChatEvents(socket);
  const [rooms, setRooms] = useState([]);
  useEffect(() => {
    Events.handleConnect(() => {
      Events.getRooms(setRooms);
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
  useEffect(() => {
    if (rooms.length > 0) {
      if (rooms.length === 1) {
        Events.joinRoom(rooms[0]);
        handleRoom(rooms[0]);
        handleStep(5);
      } else {
        handleStep(3);
      }
    }
  }, [rooms]);
  return /*#__PURE__*/React.createElement("article", {
    style: {
      display: "flex",
      flexFlow: "column wrap",
      flex: "1",
      justifyContent: "center",
      position: "relative",
      border: "1px solid #678983"
    }
  }, isModal && /*#__PURE__*/React.createElement(Modal, null), step < 2 && /*#__PURE__*/React.createElement(Loading, {
    state: step
  }), step === 3 && /*#__PURE__*/React.createElement(RoomList, {
    rooms: rooms,
    socket: socket
  }), step > 4 && /*#__PURE__*/React.createElement(ChatWindow, {
    socket: socket
  }));
};

export default WebChat;