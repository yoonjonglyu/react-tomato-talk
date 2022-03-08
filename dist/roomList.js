import React, { useContext, useState, useEffect } from 'react';
import ChatEvents from './lib/chatEvents';
import { StoreContext } from './store/configureStore';

const RoomList = ({
  rooms,
  socket
}) => {
  const [headCount, setHeadCount] = useState({});
  const {
    handleRoom,
    handleStep
  } = useContext(StoreContext);
  const Events = new ChatEvents(socket);
  useEffect(() => {
    Events.receiveRoomHeadCount(setHeadCount);
    const healthCheck = setInterval(() => Events.getHeadCount(), 1000);
    return () => {
      clearInterval(healthCheck);
      setHeadCount({});
    };
  }, []);

  const joinRoom = room => {
    Events.joinRoom(room);
    handleRoom(room);
    handleStep(5);
  };

  return /*#__PURE__*/React.createElement("article", {
    "data-testid": "room-list",
    style: {
      position: "absolute",
      display: "flex",
      flex: "1",
      flexFlow: "column nowrap",
      width: "100%",
      height: "100%",
      background: "rgb(255 92 3 / 50%)",
      overflow: "auto",
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("h2", null, "\uCC38\uC5EC \uAC00\uB2A5\uD55C \uCC44\uD305\uBC29 \uBAA9\uB85D"), /*#__PURE__*/React.createElement("ul", {
    "data-testid": "rooms",
    style: {
      margin: "0",
      padding: 0,
      listStyle: "none"
    }
  }, rooms.map((room, idx) => /*#__PURE__*/React.createElement("li", {
    key: idx,
    onClick: () => joinRoom(room),
    style: {
      margin: "12px",
      fontSize: "1.1rem",
      color: "whitesmoke"
    }
  }, room, " (", headCount[room]?.length || 0, ")"))));
};

export default RoomList;