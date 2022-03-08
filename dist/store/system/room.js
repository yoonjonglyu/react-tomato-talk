import { useState } from 'react';
export const initState = {
  room: "",
  handleRoom: room => {}
};
export function setContext() {
  const [room, setRoom] = useState('');

  const handleRoom = room => setRoom(room);

  return {
    room,
    handleRoom
  };
}