import React from 'react';

import ChatRoom from './chatRoom/chatRoom';
import SendForm from './sendMessage/sendForm';
import ChatHead from './chatHead/chatHead';

const ChatWindow = (props) => {
    const {
        socket
    } = props;

    return (
        <>
            <ChatHead socket={socket} />
            <ChatRoom socket={socket} />
            <SendForm socket={socket} />
        </>
    );
}

export default ChatWindow;