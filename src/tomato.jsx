import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

import WebChat from './webChat';

import RootContextProvider from './store';

const TomatoTalk = (props) => {
    const {
        url,
        imageSize
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
                <RootContextProvider>
                    <WebChat
                        socket={socket}
                        config={{
                            imageSize
                        }}
                    />
                </RootContextProvider>
            }
        </>
    );
}

export default TomatoTalk;