import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

import WebChat from './webChat';

import RoomContextProvider from './store/roomContext';
import ModalContextProvider from './store/modalContext';

const TomatoTalk = (props) => {
    const {
        url
    } = props;
    const [socket, setSocket] = useState(null);
    
    useEffect(() => {
        setSocket(
            io(url,
                {
                    transports: ['websocket']
                }
            )
        );
    }, []);

    return (
        <>
            {
                socket !== null &&
                <ModalContextProvider>
                    <RoomContextProvider>
                        <WebChat socket={socket} />
                    </RoomContextProvider>
                </ModalContextProvider>
            }
        </>
    );
}

export default TomatoTalk;