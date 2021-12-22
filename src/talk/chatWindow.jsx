import React from 'react';

import ChatRoom from './chatRoom/chatRoom';
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