class ChatEvents {
    constructor(socket) {
        this.socket = socket;
    }
    handleConnect(cb) {
        this.socket.on('connect', () => {
            if (this.socket.connected) {
                cb();
            }
        });
    }
    handleDisConnect(cb) {
        this.socket.on('disconnect', () => {
            cb();
        });
    }
    handleError(cb) {
        this.socket.on('connect_error', () => {
            cb();
        });
    }
    getRooms(handleRooms) {
        this.socket.once('rooms', (data) => {
            handleRooms(data);
        });
        this.socket.emit('rooms');
    }
    joinRoom(room) {
        this.socket.emit('join', {
            socketIdx: this.socket.id,
            room: room
        });
    }
    sendMessage(message, room) {
        this.socket.emit('send', {
            socketIdx: this.socket.id,
            message: message,
            room: room
        });
    }
    sendImage(image, room, imgSize) {
        if (image.type.split('/')[0] === 'image' && image.size <= imgSize) {
            this.socket.emit('sendImage', {
                socketIdx: this.socket.id,
                message: image,
                room: room
            });

            return true;
        } else {
            return false;
        }
    }
    receiveMessages(handleMessage) {
        this.socket.on('receiveImage', (data) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                handleMessage({
                    idx: data.idx,
                    message: `@$IMG ${e.target?.result}`
                });
            }
            reader.readAsDataURL(new Blob([data.message], { type: 'images/png' }));
        });
        this.socket.on('receive', (data) => {
            if (this.socket.connected) {
                handleMessage(data);
            }
        });
        this.socket.on('joinRoom', (id) => {
            if (this.socket.connected) {
                handleMessage({
                    idx: '#system',
                    message: `${id} 님이 대화에 참여 하였습니다.`,
                });
                this.socket.emit('headCount');
            }
        });
        this.socket.on('leaveRoom', (id) => {
            if (this.socket.connected) {
                handleMessage({
                    idx: '#system',
                    message: `${id} 님이 대화에서 나갔습니다.`,
                });
                this.socket.emit('headCount');
            }
        });
    }
    getHeadCount(room, handleCount) {
        this.socket.on('headCount', (data) => {
            if (this.socket.connected) {
                handleCount(data[room]);
            }
        });
    }
}

export default ChatEvents;