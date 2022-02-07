import React, { createContext, useState } from 'react';

export const ConfigContext = createContext({
    step: 0,
    handleStep: (step) => { },
    room: "",
    handleRoom: (room) => { },
    imageSize: 1,
    handleImageSize: (imgsize) => { },
});

const ConfigContextProvider = ({ children }) => {
    const [step, setStep] = useState(0);
    const handleStep = (step) => setStep(step);
    const [room, setRoom] = useState('');
    const handleRoom = (room) => setRoom(room);
    const [imageSize, setImageSize] = useState(1);
    const handleImageSize = (imgsize) => {
        if (imageSize > 0) setImageSize(imgsize);
    }

    return (
        <ConfigContext.Provider
            value={{
                step,
                handleStep,
                room,
                handleRoom,
                imageSize,
                handleImageSize
            }}
        >
            {children}
        </ConfigContext.Provider>
    );
};

export default ConfigContextProvider;
