import React, { createContext, useState } from 'react';
export const ConfigContext = /*#__PURE__*/createContext({
  room: "",
  handleRoom: room => {},
  imageSize: 1 * 1024 * 1024,
  handleImageSize: imgsize => {}
});

const ConfigContextProvider = ({
  children
}) => {
  const [room, setRoom] = useState('');

  const handleRoom = room => setRoom(room);

  const [imageSize, setImageSize] = useState(1 * 1024 * 1024);

  const handleImageSize = imgsize => {
    if (imageSize > 0) setImageSize(Math.floor(imgsize * 1024 * 1024));
  };

  return /*#__PURE__*/React.createElement(ConfigContext.Provider, {
    value: {
      room,
      handleRoom,
      imageSize,
      handleImageSize
    }
  }, children);
};

export default ConfigContextProvider;