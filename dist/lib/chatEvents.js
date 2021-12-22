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

  sendImage(image) {
    if (image.type.split('/')[0] === 'image') {
      const reader = new FileReader();

      reader.onload = e => {
        this.socket.emit('send', {
          socketIdx: this.socket.id,
          message: `@$IMG ${e.target?.result}`,
          room: '#1'
        });
      };

      reader.readAsDataURL(image);
      return true;
    } else {
      return false;
    }
  }

  receiveMessages(handleMessage) {
    this.socket.once('receive', data => {
      if (this.socket.connected) {
        handleMessage(data);
      }
    });
    this.socket.once('joinRoom', id => {
      if (this.socket.connected) {
        handleMessage({
          idx: '#system',
          message: `${id} 님이 대화에 참여 하였습니다.`
        });
      }
    });
    this.socket.once('leaveRoom', id => {
      if (this.socket.connected) {
        handleMessage({
          idx: '#system',
          message: `${id} 님이 대화에서 나갔습니다.`
        });
      }
    });
  }

  clearReceive() {
    this.socket.removeAllListeners('receive');
    this.socket.removeAllListeners('joinRoom');
    this.socket.removeAllListeners('leaveRoom');
  }

}

export default ChatEvents;