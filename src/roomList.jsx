import React, { useContext, useState, useEffect } from 'react';

import ChatEvents from './lib/chatEvents';
import { StoreContext } from './store/configureStore';


const RoomList = ({ rooms, socket }) => {
    const [headCount, setHeadCount] = useState({});
    const { handleRoom, handleStep } = useContext(StoreContext);
    const Events = new ChatEvents(socket);

    useEffect(() => {
        Events.receiveRoomHeadCount(setHeadCount);
        const healthCheck = setInterval(() => Events.getHeadCount(), 1000);

        return () => {
            clearInterval(healthCheck);
            setHeadCount({});
        }
    }, []);

    const joinRoom = (room) => {
        Events.joinRoom(room);
        handleRoom(room);
        handleStep(5);
    }

    return (
        <article
            data-testid="room-list"
            style={{
                position: "absolute",
                display: "flex",
                flex: "1",
                flexFlow: "column nowrap",
                width: "100%",
                height: "100%",
                background: "rgb(255 92 3 / 50%)",
                overflow: "auto",
                textAlign: "center",
            }}
        >
            <h2
                style={{
                    padding: "8px",
                    fontSize: "1.5rem",
                    color: "#325332"
                }}
            >
                참여 가능한 채팅방 목록
            </h2>
            <ul
                data-testid="rooms"
                style={{
                    width: "100%",
                    maxWidth: "500px",
                    margin: "33px auto",
                    padding: 0,
                    listStyle: "none",
                }}
            >
                {
                    rooms.map((room, idx) =>
                        <li
                            key={idx}
                            onClick={() => joinRoom(room)}
                            style={{
                                margin: "16px",
                                padding: "16px",
                                fontSize: "1.1rem",
                                color: "whitesmoke",
                                border: "1px solid #fff"
                            }}
                            onMouseOver={(e) => e.target.style.color = '#dc1f1f'}
                            onMouseLeave={(e) => e.target.style.color = 'whitesmoke'}
                        >
                            {room} ({headCount[room]?.length || 0})
                        </li>)
                }
            </ul>
        </article>
    );
}

export default RoomList;