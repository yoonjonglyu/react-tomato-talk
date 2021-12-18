import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

import WebChat from './webChat';

const TomatoTalk = (props) => {
    const {
        url
    } = props;
    const [socket, setSocket] = useState(io);
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
        <WebChat socket={socket} />
    );
}

export default TomatoTalk;