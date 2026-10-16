# 🍅 @tomato-talk/server (v2.0)

> `react-tomato-talk` 전용 고성능 실시간 Socket.IO 백엔드 서버입니다.  
> **익명채팅**, **그룹채팅**, **1:1 개인채팅(DM)**, **랜덤채팅 매칭 큐**를 완벽하게 지원합니다.

---

## 🌟 주요 기능

- 🎭 **익명 채팅 (Anonymous Chat)**: 무작위 참여자 관리, 방별 실시간 동시 접속자 수 브로드캐스팅.
- 👥 **그룹 채팅 (Group Chat)**: 방 생성(제목, 주제, 정원), 목록 조회, 멤버 입장/퇴장 및 실시간 인원 반영.
- 💬 **1:1 개인 채팅 (Direct Chat)**: 실시간 접속 중인 유저 디렉토리, 1:1 대화방 개설 및 타이핑 인디케이터 중계.
- ⚡ **랜덤 채팅 (Random Chat)**: 주제별/전체 무작위 매칭 대기열(FIFO Queue), 1:1 자동 페어링, "다음 상대(Next)" 처리.
- 🛡️ **안전한 메시지 릴레이**: AES-256 E2E 암호화 메시지를 내용 손상 없이 그대로 전송.

---

## 🚀 빠른 시작

### 1. 로컬 개발 환경 실행
```bash
# 의존성 설치
pnpm install

# TypeScript 실시간 감시 실행 (포트 3001)
pnpm run dev
```

### 2. 프로덕션 빌드 및 실행
```bash
pnpm run build
pnpm start
```

---

## ⚙️ 환경 변수 (Environment Variables)

| 환경 변수 | 기본값 | 설명 |
| :--- | :--- | :--- |
| `PORT` | `3001` | 서버 리스닝 포트 |
| `CORS_ORIGIN` | `*` | 허용할 프론트엔드 도메인 (쉼표로 복수 지정 가능) |

---

## 🔌 기존 Express / Node.js 서버에 결합하기

새로운 서버를 띄우지 않고, 현재 운영 중인 Node.js 백엔드에 결합하고자 하는 경우:

```typescript
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: ['https://myservice.com'],
    credentials: true
  },
  maxHttpBufferSize: 1e7 // 10MB 이미지 업로드 허용
});

// packages/server/src/index.ts의 이벤트 핸들러 로직 연결
io.on('connection', (socket) => {
  // 메시지 중계 (발신자 제외 룸 전체 전송)
  socket.on('message:send', (msg) => {
    socket.to(msg.roomId).emit('message:receive', msg);
  });
});

httpServer.listen(4000, () => {
  console.log('Socket server running on port 4000');
});
```

---

## 🐳 Docker 배포 가이드

```dockerfile
FROM node:20-alpine
WORKDIR /app

COPY package.json pnpm-lock.yaml* ./
RUN npm install -g pnpm && pnpm install --prod

COPY dist ./dist

EXPOSE 3001
ENV PORT=3001
ENV CORS_ORIGIN=https://myservice.com

CMD ["node", "dist/index.js"]
```

---

## 📄 라이선스
MIT License © [ISA (yoonjonglyu)](https://github.com/yoonjonglyu)
