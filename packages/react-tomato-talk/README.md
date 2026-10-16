# 🍅 React Tomato Talk (v2.0)

> **리액트 올인원 실시간 채팅 SDK & UI 키트**  
> **익명채팅방**, **그룹채팅**, **1:1 개인채팅(DM)**, **랜덤채팅** 4가지 모드를 지원하며, 완성형 UI 컴포넌트와 유연한 Headless Hook을 모두 제공합니다.

---

## 🌟 주요 특징

- 🎭 **익명 채팅 (Anonymous Chat)**: 무작위 토마토 닉네임 자동 생성, 익명 라운지 및 태그별 토크방 참여.
- 👥 **그룹 채팅 (Group Chat)**: 대화방 개설 (제목, 주제 태그, 정원 설정), 실시간 참여자 목록 및 인원 수 카운트.
- 💬 **1:1 개인 채팅 (Direct Chat)**: 온라인 사용자 디렉토리, 1:1 비밀 대화 세션 및 실시간 입력 감지(Typing indicator).
- ⚡ **랜덤 채팅 (Random Chat)**: 관심 주제별/전체 랜덤 매칭 큐, 1:1 페어링, "다음 상대 찾기(Next)" 및 퇴장 처리.
- 🧩 **2-in-1 아키텍처**:
  - **All-in-One UI**: `<TomatoTalk />` 컴포넌트 하나로 4개 모드 탭 인터페이스 즉시 사용.
  - **Headless Hooks**: `useTomatoSocket`, `useAnonymousChat`, `useGroupChat`, `useDirectChat`, `useRandomChat`으로 나만의 디자인에 채팅 로직만 결합.
- 🔒 **AES 양방향 암호화**: `secretKey` prop 하나로 클라이언트 간 종단간(E2EE) 메시지 암호화 지원.
- 🤖 **AI 코딩 어시스턴트 스킬 내장**: 패키지 내 `skills/react-tomato-talk/SKILL.md`가 동봉되어 Antigravity, Cursor, Claude, Copilot 등 AI 에이전트가 완벽한 구현 가이드를 즉시 인식합니다.
- 📦 **모던 빌드 & 풀 타입스크립트**: ESM / CommonJS 듀얼 빌드 및 정확한 TypeScript 타입 정의(`index.d.ts`) 내장.

---

## 🚀 빠른 시작

### 1. 패키지 설치

```bash
npm install react-tomato-talk socket.io-client
# 또는
pnpm add react-tomato-talk socket.io-client
# 또는
yarn add react-tomato-talk socket.io-client
```

### 2. 완성형 UI 컴포넌트 사용

```tsx
import React from 'react';
import { TomatoTalk } from 'react-tomato-talk';
import 'react-tomato-talk/styles/tomato.css'; // 또는 'react-tomato-talk/style.css'

export const App = ({ currentUser }) => {
  return (
    <main style={{ maxWidth: '420px', height: '680px', margin: '40px auto' }}>
      {/* 4가지 채팅 모드 통합 위젯 */}
      <TomatoTalk
        url="https://socket.myservice.com" // 소켓 서버 주소 (테스트용은 "mock")
        mode="all"                         // 'all' | 'anonymous' | 'group' | 'direct' | 'random'
        defaultTab="group"                 // 시작 탭
        secretKey="my-service-aes-key"     // (선택) E2EE 메시지 암호화 키
        user={{
          id: currentUser.id,
          nickname: currentUser.name,
          avatar: currentUser.avatar
        }}
      />
    </main>
  );
};
```

---

## 🎨 Headless Hooks (커스텀 UI / TailwindCSS)

원하는 스타일과 컴포넌트 라이브러리(Tailwind, Styled-components, Chakra 등)에 실시간 통신 로직만 바인딩할 수 있습니다.

```tsx
import React, { useState } from 'react';
import { useTomatoSocket, useGroupChat } from 'react-tomato-talk';

export const CustomTailwindChat = ({ roomId, user }) => {
  // 1. 소켓 수명주기 & 사용자 상태
  const { socket, isConnected } = useTomatoSocket({
    url: 'https://socket.myservice.com',
    user
  });

  // 2. 그룹 채팅 상태 & 액션
  const { messages, sendTextMessage } = useGroupChat({
    socket,
    currentUser: user,
    sendMessage: (rId, text) => socket?.emit('message:send', { roomId: rId, content: text })
  });

  const [input, setInput] = useState('');

  const onSend = () => {
    if (!input.trim()) return;
    sendTextMessage(input);
    setInput('');
  };

  return (
    <div className="flex flex-col h-[550px] w-full max-w-md bg-slate-900 text-white rounded-2xl p-4">
      <div className="flex justify-between items-center pb-2 border-b border-slate-700">
        <span className="font-bold">그룹 대화방</span>
        <span className={isConnected ? "text-emerald-400 text-xs" : "text-rose-400 text-xs"}>
          {isConnected ? "● 온라인" : "○ 오프라인"}
        </span>
      </div>
      <div className="flex-1 overflow-y-auto py-3 space-y-2">
        {messages.map((m) => (
          <div key={m.id} className={m.senderId === user.id ? "text-right" : "text-left"}>
            <span className="text-xs text-slate-400">{m.senderName}</span>
            <div className="inline-block bg-rose-500 px-3 py-1.5 rounded-xl text-sm mt-0.5">
              {m.content}
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-2 pt-2 border-t border-slate-700">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.nativeEvent.isComposing) return; // 한글 조합 중복 방지
            if (e.key === 'Enter') onSend();
          }}
          className="flex-1 bg-slate-800 px-3 py-2 rounded-xl text-sm outline-none"
          placeholder="메시지 입력..."
        />
        <button onClick={onSend} className="bg-rose-500 px-4 py-2 rounded-xl text-sm font-bold">
          전송
        </button>
      </div>
    </div>
  );
};
```

---

## 🤖 AI Agent Skill 지원

`react-tomato-talk`는 AI 기반 페어 프로그래밍 환경(Antigravity, Cursor, Claude Code, GitHub Copilot)을 위한 **공식 Agent Skill**을 패키지 내에 기본 동봉합니다.

- **패키지 내 포함 경로**: `node_modules/react-tomato-talk/skills/react-tomato-talk/SKILL.md`
- **효과**: AI 어시스턴트에게 `react-tomato-talk`로 채팅 기능을 구현해달라고 요청하면, AI가 패키지의 API 스펙, Hooks 사용법, Socket 이벤트 스키마, 한글 IME 중복 방지 등의 모범 사례를 자동으로 파악하여 완벽한 코드를 작성합니다.

---

## 📋 API 레퍼런스

### `<TomatoTalk />` Props
| Prop | 타입 | 기본값 | 설명 |
| :--- | :--- | :--- | :--- |
| `url` | `string` | **필수** | Socket.IO 서버 URL (또는 무서버 테스트용 `"mock"`) |
| `mode` | `'all' \| 'anonymous' \| 'group' \| 'direct' \| 'random'` | `'all'` | 제공할 채팅 모드 |
| `defaultTab` | `'anonymous' \| 'group' \| 'direct' \| 'random'` | `'anonymous'` | 초기 활성 탭 |
| `secretKey` | `string` | `undefined` | AES-256 종단간 양방향 암호화 비밀키 |
| `user` | `Partial<TomatoUser>` | 자동 생성 | 사용자 초기 정보 (`id`, `nickname`, `avatar`) |
| `maxImageSizeMB` | `number` | `5` | 이미지 첨부 허용 최대 크기(MB) |
| `className` | `string` | `''` | 컨테이너 커스텀 클래스 |
| `style` | `React.CSSProperties` | `undefined` | 인라인 스타일 |

### 제공 Hooks
- `useTomatoSocket(config)`: 기본 소켓 연결, 자동 재연결 및 사용자 상태 관리.
- `useAnonymousChat({ socket, currentUser, sendMessage, secretKey })`: 익명 채팅방, 닉네임 재생성, 방 전환.
- `useGroupChat({ socket, currentUser, sendMessage, secretKey })`: 그룹방 생성, 목록 조회, 참여/퇴장.
- `useDirectChat({ socket, currentUser, sendMessage, secretKey })`: 1:1 온라인 유저 목록, 개인 대화방, 입력 중 알림.
- `useRandomChat({ socket, currentUser, sendMessage, secretKey })`: 랜덤 매칭 큐 대기, 페어링, 다음 상대 전환.

---

## 📄 라이선스
MIT License © [ISA (yoonjonglyu)](https://github.com/yoonjonglyu)