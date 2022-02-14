import Crypto from "crypto-js";

class ChatEvents {
  constructor(socket, cryptoKey) {
    this.socket = socket;
    this.cryptoKey = cryptoKey || '';
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
    this.socket.once('rooms', data => {
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

  leaveRoom(room) {
    this.socket.emit('leave', {
      socketIdx: this.socket.id,
      room: room
    });
  }

  sendMessage(message, room) {
    this.emit('send', {
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
    this.socket.on('receiveImage', data => {
      const reader = new FileReader();

      reader.onload = e => {
        handleMessage({
          idx: data.idx,
          message: `@$IMG ${e.target?.result}`
        });
      };

      reader.readAsDataURL(new Blob([data.message], {
        type: 'images/png'
      }));
    });
    this.on('receive', data => {
      if (this.socket.connected) {
        handleMessage(data);
      }
    });
    this.socket.on('joinRoom', id => {
      if (this.socket.connected) {
        handleMessage({
          idx: '#system',
          message: `${id} 님이 대화에 참여 하였습니다.`
        });
        this.getHeadCount();
      }
    });
    this.socket.on('leaveRoom', id => {
      if (this.socket.connected) {
        handleMessage({
          idx: '#system',
          message: `${id} 님이 대화에서 나갔습니다.`
        });
        this.getHeadCount();
      }
    });
  }

  getHeadCount() {
    this.socket.emit('headCount');
  }

  receiveHeadCount(room, handleCount) {
    this.socket.on('headCount', data => {
      if (this.socket.connected) {
        handleCount(data[room]);
      }
    });
  }

  receiveRoomHeadCount(handleCount) {
    this.socket.on('headCount', data => {
      if (this.socket.connected) {
        handleCount(data);
      }
    });
  }

  emit(eventName, message) {
    this.socket.emit(eventName, this.cryptoKey.length > 0 ? Crypto.AES.encrypt(JSON.stringify(message), this.cryptoKey).toString() : message);
  }

  on(eventName, cb) {
    this.socket.on(eventName, this.cryptoKey.length > 0 ? data => cb(JSON.parse(Crypto.AES.decrypt(data, this.cryptoKey).toString(Crypto.enc.Utf8))) : cb);
  }

}

export default ChatEvents;