import React, { useEffect, useState, useContext } from 'react';

import ChatWindow from './talk/chatWindow';
import Loading from './loading';

import ChatEvents from './lib/chatEvents';
import { RoomContext } from './store/roomContext';

const WebChat = (props) => {
    const {
        socket
    } = props;
    const [step, setStep] = useState(0);
    const [rooms, setRooms] = useState([]);
    const { handleRoom } = useContext(RoomContext);
    const Events = new ChatEvents(socket);
    const handleStep = (step) => {
        setStep(step);
    }
    useEffect(() => {
        Events.handleConnect(() => {
            Events.getRooms(setRooms);
        });
        Events.handleDisConnect(() => {
            handleStep(1);
        });
        Events.handleError(() => {
            handleStep(1);
        });
        return () => {
            socket.close();
        }
    }, [socket]);
    useEffect(() => {
        if (rooms.length > 0) {
            Events.joinRoom(rooms[0]);
            handleRoom(rooms[0]);
            handleStep(2);
        }
    }, [rooms]);

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