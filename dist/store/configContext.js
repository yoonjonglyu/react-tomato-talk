import React, { createContext, useState } from 'react';
export const ConfigContext = /*#__PURE__*/createContext({
  step: 0,
  handleStep: step => {},
  room: "",
  handleRoom: room => {},
  imageSize: 1 * 1024 * 1024,
  handleImageSize: imgsize => {}
});

const ConfigContextProvider = ({
  children
}) => {
  const [step, setStep] = useState(0);

  const handleStep = step => setStep(step);

  const [room, setRoom] = useState('');

  const handleRoom = room => setRoom(room);

  const [imageSize, setImageSize] = useState(1 * 1024 * 1024);

  const handleImageSize = imgsize => {
    if (imageSize > 0) setImageSize(Math.floor(imgsize * 1024 * 1024));
  };

  return /*#__PURE__*/React.createElement(ConfigContext.Provider, {
    value: {
      step,
      handleStep,
      room,
      handleRoom,
      imageSize,
      handleImageSize
    }
  }, children);
};

export default ConfigContextProvider;