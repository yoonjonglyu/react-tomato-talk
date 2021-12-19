import React, { useState } from 'react';

import SendPoto from './sendPoto';

const SendForm = (props) => {
    const {
        socket
    } = props;
    const [message, setMessage] = useState('');

    const sendMessage = (e) => {
        e.preventDefault();
        if (message.length > 0) {
            socket.emit('send', {
                socketIdx: socket.id,
                message: message,
                room: '#1'
            });
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
            }}
        >
            <input
                type="text"
                data-testid="chat-input"
                value={message}
                onChange={handleMsg}
                style={{
                    flex: "3 0px",
                    margin: "3px 3px 0 0"
                }}
            />
            <SendPoto socket={socket} />
            <button
                type="submit"
                data-testid="chat-request"
                style={{
                    margin: "3px 0 0 0",
                    padding: "6px 12px",
                    color: "#FBF3E4",
                    background: "#105652",
                    border: "0",
                    borderRadius: "3px",
                }}
            >
                전송
            </button>
        </form>
    );
}

export default SendForm;