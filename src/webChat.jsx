import React, { useEffect, useState } from 'react';

import ChatWindow from './talk/chatWindow';
import Loading from './loading';

const WebChat = (props) => {
    const {
        socket
    } = props;
    const [step, setStep] = useState(0);
    const handleStep = (step) => {
        setStep(step);
    }

    useEffect(() => {
        socket.on('connect', async () => {
            if (socket.connected) {
                socket.emit('join', {
                    socketIdx: socket.id,
                    room: '#1'
                });
                handleStep(2);
            }
        });
        socket.on('disconnect', () => {
            handleStep(1);
        });
        socket.on('connect_error', () => {
            handleStep(1);
        });
        return () => {
            socket.close();
        }
    }, []);


    return (
        <article style={{
            display: "flex",
            flexFlow: "column wrap",
            flex: "1",
            justifyContent: "center",
            position: "relative",
            border: "1px solid #678983",
        }}
        >
            {
                step < 2 &&
                <Loading state={step} />
            }
            <ChatWindow socket={socket} />
        </article >
    );
}

export default WebChat;