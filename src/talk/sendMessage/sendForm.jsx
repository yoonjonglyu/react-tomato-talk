import React, { useState } from 'react';

import SendPoto from './sendPoto';

import ChatEvents from '../../lib/chatEvents';

const SendForm = (props) => {
    const {
        socket
    } = props;
    const [message, setMessage] = useState('');

    const sendMessage = (e) => {
        e.preventDefault();
        if (message.length > 0) {
            const Events = new ChatEvents(socket);
            Events.sendMessage(message, '#1');
            setMessage('');
        }
    }
    const handleMsg = (e) => {
        setMessage(e.target.value);
    }

    return (
        <form
            data-testid="chat-form"
            onSubmit={sendMessage}
            style={{
                display: "flex",
                flexFlow: "row",
                justifyContent: "center",
                padding: "6px",
                background: "#DFD8CA",
                boxShadow: "rgb(206, 202, 194) -0px -1px"
            }}
        >
            <input
                type="text"
                data-testid="chat-input"
                value={message}
                onChange={handleMsg}
                style={{
                    flex: "3 0px",
                    margin: "3px 3px 0 0",
                    background: "#DFD8CA",
                    fontSize: "1rem",
                    border: "none",
                    outline: "none",
                }}
                placeholder="채팅 메시지를 입력하세요."
            />
            <SendPoto socket={socket} />
        </form>
    );
}

export default SendForm;