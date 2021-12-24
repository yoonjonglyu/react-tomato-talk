import React, { createContext, useState } from 'react';

export const RoomContext = createContext({
    room: "",
    handleRoom: (data) => { }
});

const RoomContextProvider = ({ children }) => {
    const [room, setRoom] = useState('');
    const handleRoom = (data) => setRoom(data);

    return (
        <RoomContext.Provider value={{ room, handleRoom }}>
            {children}
        </RoomContext.Provider>
    );
};

export default RoomContextProvider;
