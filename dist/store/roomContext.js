import React, { createContext, useState } from 'react';
export const RoomContext = /*#__PURE__*/createContext({
  room: "",
  handleRoom: data => {}
});

const RoomContextProvider = ({
  children
}) => {
  const [room, setRoom] = useState('');

  const handleRoom = data => setRoom(data);

  return /*#__PURE__*/React.createElement(RoomContext.Provider, {
    value: {
      room,
      handleRoom
    }
  }, children);
};

export default RoomContextProvider;