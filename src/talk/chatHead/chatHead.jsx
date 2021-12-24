import React, { useEffect, useState, useContext } from 'react';

import ChatEvents from '../../lib/chatEvents';
import { RoomContext } from '../../store/roomContext';

const ChatHead = (props) => {
    const {
        socket
    } = props;
    const [headCount, setHeadCount] = useState([]);
    const { room } = useContext(RoomContext);

    useEffect(() => {
        const Events = new ChatEvents(socket);
        Events.getHeadCount(room, setHeadCount);
        return () => Events.clearHeadCount();
    });

    return (
        <div
            data-testid="chat-head"
            style={{
                display: "flex",
                height: "48px",
                background: "rgb(230, 221, 196)"
            }}
        >
            <nav
                style={{
                    display: "flex",
                    flex: "1"
                }}
            >
                <h2
                    style={{
                        margin: "12px",
                        fontSize: "1rem",
                        color: "rgb(103, 137, 131)"
                    }}
                >
                    {room || "#1"}
                    <span
                        style={{
                            color: "rgb(57, 80, 76)"
                        }}
                    >
                        ({headCount.length})
                    </span>
                </h2>
            </nav>
            <button
                type="button"
                title="방에서 나가기"
                style={{
                    background: "none",
                    border: "none",
                    fontSize: "1rem",
                    fontWeight: 600,
                    color: "#464545",
                }}
            >
                X
            </button>
        </div >
    )
}

export default ChatHead;