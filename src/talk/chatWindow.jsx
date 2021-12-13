import React from 'react';

import ChatRoom from './chatRoom';
import SendForm from './sendForm';

const ChatWindow = (props) => {
    const {
        socket
    } = props;

    return (
        <>
            <ChatRoom socket={socket} />
            <SendForm socket={socket} />
        </>
    );
}

export default ChatWindow;