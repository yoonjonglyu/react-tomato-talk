# react-tomato-talk

`react`와 `socket.io`, `socket.io-client`을 통해서 만든 익명 채팅 모듈입니다.  
소켓 통신을 통한 실시간 익명 채팅 기능을 웹컴포넌트 방식으로 제공하여서 기존의 사이트나  
다양한 레이아웃에 쉽게 접목 시킬 수 있도록 하기 위한 오픈소스 프로젝트입니다.  
현재는 간단한 *n:n 익명 채팅* 기능을 제공하고 있으며 추가적인 기능 및 설정을 지속적으로 업데이트 할 예정이니 자세한 내용은 아래의 업데이트 기록을 확인 해보시길 바랍니다.  
``기본적으로 해당 컴포넌트는 flex 반응형 레이아웃으로 구성 되어 있습니다.``  
``프론트엔드 패키지외에도 따로 socket.io 또는 sockjs으로 구성된 채팅 서버가 필요합니다.``  

## 데모 버전

![토마토톡](./assets/chat.gif)  
[토마토톡데모](https://yoonjonglyu.github.io/webChat/)

**링크를 통해서 확인 가능한 데모 버전의 채팅창 부분을 모듈화한게 본 패키지입니다.**  
**데모 버전의 경우 개발 중인 기능이 포함 되어 있을 수 있으니 참고하시길 바랍니다.**
**해당 데모는 Heroku 무료 호스팅을 이용중이므로 속도가 느립니다.**

## 설치

```bash
npm npm i react-tomato-talk
//or
yarn add react-tomato-talk
```

## 사용법

### 프론트 엔드

```js
import React from 'react';
import ReactTomatoTalk from 'react-tomato-talk';

const App = function () {
    return (
        <main>
            채팅창
            <section
                className="container"
                style={{
                    display: "flex", // tomatoTalk 컴포넌트는 flex 레이아웃으로 이루어져 있습니다.
                    flex: "1",
                    maxWidth: "350px", // maxWidth를 통해서 채팅창 가로너비를 반응형으로 지정해줄 수 있습니다.
                    maxHeight: "645px" // height를 통해서 채팅창 높이를 지정해줄 수 있습니다.
                }}
            >
                <ReactTomatoTalk
                    url={'http://localhost:3000/'} //소켓서버 url입니다.
                    imageSize={5} // MB 단위 이미지 전송 사이즈 제한 기능. Props 안할 경우 기본값은 1MB다.
                    secretKey='시크릿 키' // 메시지 전송 양방향 암호화 config 미입력시 암호화하지 않는다.
                />
            </section>
        </main>
    );
};
```

### 벡엔드

>  
> 해당 모듈을 위해서 현재 필요한 소켓 이벤트는 connection, rooms, headCount, join, send, sendImage, leave, disconnect가 있다.  
> 기능 추가에 따라서 벡엔드 로직이 추가되거나 일부 수정 될수 있으므로 업데이트시 확인바랍니다.  
> 

```js
const { Server } = require("socket.io"); // cors 설정 주의.
const CryptoJS = require("crypto-js"); // 메시지 양방향 암호화 관련  crypto-js 적용
const io = new Server({
    transports: ["websocket"], // 현재는 웹소켓 방식만 지원해준다.
    maxHttpBufferSize: 5 * 1024 * 1024 // 단일 메시지 바이트수 제한 5(MB) * 1024 * 1024 = MB
});

const usrList = {}; // 사용자가 들어간 채팅방을 기록하는 객체;
const roomList = ['채팅방#1', '#1'] // 채팅방 목록 길이가 2부터 채팅방 선택이 됩니다.
const rooms = { // 각 채팅방 참가자 목록
    "채팅방#1": [],
    "#1": [],
}; // 채팅방 선택 기능의 경우 벡엔드 서버의 roomList의 갯수가 1개 이상일때 자동으로 활성화 됩니다.
io.on("connection", (client) => {
    client.on('rooms', () => { // 사용자가 요청하면 채팅방 목록을 전송
        io.emit('rooms', roomList);
    });
    client.on('headCount', () => { // 사용자가 요청 할시 해당 채팅방 인원 정보를 전송
        io.emit('headCount', rooms);
    });
    client.on('join', data => { // {socketIdx, room} 해당 유저 식별키와 어떤 방에 갈지를 받는다.
        client.join(data.room); // 해당 채팅방에 join
        usrList[data.socketIdx] = data.room; // 해당 유저가 어느 방에 들어갔는지 기록
        rooms[data.room].push(data.socketIdx); // 해당 채팅방 참여인원에 추가
        io.to(data.room).emit('joinRoom', data.socketIdx); // 해당 채팅방에 대화참여 메시지 전송
    });
    client.on('leave', data => { // {socketIdx, room} 해당 유저 식별키와 어떤 방에서 나올지를 받는다.
        client.leave(data.room); // room에서 벗어난다.
        delete usrList[data.socketIdx]; // 해당유저가 채팅방에서 벗어남을 기록
        rooms[data.room] = this.rooms[data.room].filter((el) => el !== data.socketIdx); // 해당 채팅방 참여 인원에서 제거
        io.to(data.room).emit('leaveRoom', data.socketIdx); // 대화 이탈 메시지 전송
    });
    client.on('send', data => { // {message, socketIdx, room} 사용자가 보낸 메시지를 받아서 해당 채팅방에 전송
        //  현재는 채팅 메시지에 대한 암호화만 제공 한다.
        data = JSON.parse(CryptoJS.AES.decrypt(data, '시크릿 키').toString(CryptoJS.enc.Utf8)); // 양방향 암호화 사용시 처리
        // 암호화 사용시
        io.to(data.room).emit('receive', CryptoJS.AES.encrypt(JSON.stringify({
            message: data.message,
            idx: data.socketIdx
        }), '시크릿 키').toString());

        // 암호화 미사용시
        io.to(data.room).emit('receive', {
            message: data.message,
            idx: data.socketIdx
        });
    });
    client.on('sendImage', data => { // {socketIdx, message, room} 사용자가 전송한 이미지를 받아서 해당 채팅방에 전송 
        io.to(data.room).emit('receiveImage', {
            message: data.message,
            idx: data.socketIdx
        });
    });
    client.on('disconnect', () => { // 연결해제시 채팅서버에 기록된 해당 유저의 채팅방에 이탈 메시지 전송
        if (usrList[client.id]) {
            io.to(usrList[client.id]).emit('leaveRoom', client.id); // 대화이탈에 대한 메시지 전송
            rooms[usrList[client.id]] = rooms[usrList[client.id]].filter((el) => el !== client.id); // 해당 채팅방 참여 인원에서 제거
            delete usrList[client.id]; // 메모리에서 해당 유저의 데이터 삭제
        }
    });
});

io.listen(3000);
```

### Props

1. **`url(string)`** : 소켓서버의 url입니다.  
2. **`imageSize(number ?)`** : 이미지 전송 기능의 사이즈 제한입니다. 최소 단위는 MB(메가 바이트)이며 `기본 값은 1MB`입니다.    
* 추가적으로 벡엔드의 소켓 이미지 제한을 조정하셔야 합니다.  
3. **`secretKey(string ?)`** : 채팅 메시지 양방향 암호화 시크릿키입니다. 임의의 문자열을 입력해주시면 양방향 암호화를 적용 할 수 있습니다.


### 벡엔드 소켓 이벤트

1. **`rooms`** : 채팅방 목록을 보내주는 이벤트입니다. `['채팅방#1']` 으로 채팅방 이름 목록을 보내줄 수 있습니다.(현재는 다중 채팅방을 지원하지 않습니다.)  
2. **`headCount`** : 채팅방에 참여한 참여인원 목록을 보내주는 이벤트입니다. `{"채팅방#1": []}` 으로 해당 채팅방 참여 인원을 보내 줄 수 있습니다.  
3. **`join | leave`** : 특정 채팅방에 참여하거나 벗어나는 이벤트입니다.  
4. **`send`** : 서로간의 메시지를 전송하는 이벤트 입니다. (텍스트)  
5. **`sendImage`** : 이미지를 전송하는 이벤트입니다.(arraybuffer)  
  
### 업데이트
- 1.1.0
  - 초기 버전 배포.
- 1.2.0
  - 서버 연결 상태 관련 UI 추가: 연결중, 연결해제 및 실패.
- 1.2.1
  -  패키지 제공 방식이 커스텀훅 => 고차컴포넌트로 변경.
- 1.2.3
  - 채팅 소켓 인스턴스 컨텍스트 관리 개선
  - 채팅 메시지 수신 시간 표시(클라이언트 기준 시간)
- 1.2.4
  - 패키지 타입 수정 커스텀훅 => 고차컴포넌트
- 1.3.2
  - 소켓 인스턴스 초기화 부분 개선
  - 사진전송(base64) 기능 추가
- 1.3.3
  - 채팅메시지 입력폼 스타일 리뉴얼
  - 메시지 자동스크롤
- 1.4.0
  - 채팅방 상단 해더 추가 (채팅방 이름, 현재 인원 표시)
  - 벡엔드 채팅방 목록 및 인원 관련 로직 추가(채팅방선택 & 채팅인원 관련 필요)
  - 채팅방 선택 및 1:1 개인 채팅 기능 개발중
- 1.4.2
  - 이미지 전송 사이즈 제한 추가(500kb) *추후 커스텀 가능
  - 사진 전송 파일형식, 용량 제한 경고 모달 추가
  - 사진 확대 보기 추가
- 1.4.4
  - 이미지 전송 소켓 이벤트 분리 => 벡엔드 로직 추가 sendImages & receiveImage 이벤트
  - 이미지 사이즈 제한 Props 추가 기본 값 1MB, 단위 MB
- 1.5.0
  - 채팅방 참여 인원 리스트 모달 추가
- 1.6.0
  - 채팅메시지 송수신 로직 개선 등 코드 리팩토링
  - 채팅방 선택 기능 추가 (벡엔드 로직 join, leave 이벤트 일부 수정, 디자인 개선중)
- 1.6.2
  - 멀티 채팅방 선택에서 채팅방 인원 표시 기능 추가
  - 멀티 채팅방에서 상단 X버튼으로 해당 채팅방 이탈 기능 추가
- 1.6.4
  - 전송된 이미지 다운로드 기능 추가
  - 이미지 hover시 이미지 상단에 Download 버튼 출현으로 다운로드 가능
- 1.6.9
  - 메시지 전송 관한 양방향 암호화 설정 가능.(현재는 단순 채팅 메시지만 적용)  
- 1.6.12
  - 방목록 & 인원 목록 스타일링 수정.


### LICENSE

react-daumpost-hook is [MIT licensed](./LICENSE).