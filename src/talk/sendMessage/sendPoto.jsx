import React from 'react';

import PotoIcon from '../../assets/poto.png';

const SendPoto = ({ socket }) => {
    const handleFile = (e) => {
        const file = e.target.files;
        if (file[0]) {
            if (file[0].type.split('/')[0] === 'image') {
                const reader = new FileReader();
                reader.onload = (e) => {
                    socket.emit('send', {
                        socketIdx: socket.id,
                        message: `@$IMG ${e.target?.result}`,
                        room: '#1'
                    });
                }
                reader.readAsDataURL(file[0]);
            }
        }
        e.target.value = '';
    }

    return (
        <label
            style={{
                display: "flex",
                marginRight: "3px"
            }}
        >
            <img
                src={PotoIcon}
                width="30px"
            />
            <input
                type="file"
                style={{
                    display: "none"
                }}
                onChange={handleFile}
                accept="image/*"
            />
        </label>
    );
}

export default SendPoto;