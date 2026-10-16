import React, { useState } from 'react';
import { TomatoTalk, ChatMode } from 'react-tomato-talk';
import 'react-tomato-talk/styles/tomato.css';

export const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<'duel' | 'single' | 'code'>('duel');
  const [selectedSingleMode, setSelectedSingleMode] = useState<'all' | ChatMode>('all');
  const [serverMode, setServerMode] = useState<'mock' | 'local' | 'custom'>('mock');
  const [customServerUrl, setCustomServerUrl] = useState<string>('https://tomato-talk-server.onrender.com');
  const [secretKey, setSecretKey] = useState<string>('my-tomato-secret-key-123');
  const [isEncrypted, setIsEncrypted] = useState<boolean>(true);
  const [guideTab, setGuideTab] = useState<'quickstart' | 'backend' | 'headless' | 'security'>('quickstart');

  const activeServerUrl = serverMode === 'mock'
    ? 'mock'
    : serverMode === 'local'
    ? 'http://localhost:3001'
    : customServerUrl;

  return (
    <div className="pg-container">
      <header className="pg-header">
        <div className="pg-brand">
          <span style={{ fontSize: '26px' }}>🍅</span>
          <div>
            <h1>React Tomato Talk</h1>
            <span style={{ fontSize: '12px', color: '#94a3b8' }}>익명 · 그룹 · 1:1개인 · 랜덤채팅 올인원 SDK</span>
          </div>
          <span className="pg-badge">v2.0.0 TS</span>
        </div>

        <nav className="pg-nav">
          <button
            className={`pg-nav-btn ${viewMode === 'duel' ? 'active' : ''}`}
            onClick={() => setViewMode('duel')}
          >
            👥 듀얼 시뮬레이터
          </button>
          <button
            className={`pg-nav-btn ${viewMode === 'single' ? 'active' : ''}`}
            onClick={() => setViewMode('single')}
          >
            📱 단일 컴포넌트 뷰
          </button>
          <button
            className={`pg-nav-btn ${viewMode === 'code' ? 'active' : ''}`}
            onClick={() => setViewMode('code')}
          >
            💻 실제 서비스 연동 가이드
          </button>
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          {/* Server Connection Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '11px', color: '#94a3b8' }}>백엔드:</span>
            <select
              value={serverMode}
              onChange={(e) => setServerMode(e.target.value as any)}
              style={{
                background: '#1e293b',
                color: '#f8fafc',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                padding: '4px 8px',
                fontSize: '12px',
                outline: 'none'
              }}
            >
              <option value="mock">🟢 인브라우저 가상 모의 서버 (무료 / 서버리스)</option>
              <option value="local">💻 로컬 서버 (localhost:3001)</option>
              <option value="custom">🌐 커스텀 / Render 클라우드 서버</option>
            </select>
          </div>

          {serverMode === 'custom' && (
            <input
              type="text"
              value={customServerUrl}
              onChange={(e) => setCustomServerUrl(e.target.value)}
              placeholder="https://your-server.com"
              style={{
                background: '#1e293b',
                color: '#f8fafc',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                padding: '4px 8px',
                fontSize: '11px',
                width: '180px'
              }}
            />
          )}

          <label style={{ fontSize: '12px', color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={isEncrypted}
              onChange={(e) => setIsEncrypted(e.target.checked)}
              style={{ accentColor: '#ff4757' }}
            />
            🔒 AES 양방향 암호화
          </label>
        </div>
      </header>

      <main className="pg-content">
        {viewMode === 'duel' && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255, 71, 87, 0.1)', padding: '6px 16px', borderRadius: '20px', marginBottom: '8px' }}>
                <span style={{ fontSize: '14px' }}>⚡</span>
                <span style={{ fontSize: '12px', color: '#ff6b81', fontWeight: 600 }}>
                  {serverMode === 'mock'
                    ? '가상 모의 서버 가동 중: 별도 소켓 서버 없이 브라우저 내/탭 간 즉시 100% 실시간 통신이 지원됩니다.'
                    : `연결 대상 서버: ${activeServerUrl}`}
                </span>
              </div>
              <h2 style={{ margin: '0 0 6px 0', fontSize: '18px', color: '#f8fafc' }}>
                실시간 양방향 대화 시뮬레이터
              </h2>
              <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8' }}>
                한 화면에서 두 명의 가상 사용자가 4개 모드(익명광장, 그룹방, 1:1 대화, 랜덤 매칭)로 통신하는 모습을 테스트할 수 있습니다.
              </p>
            </div>

            <div className="pg-duel-layout">
              {/* Client A */}
              <div className="pg-chat-wrapper">
                <div className="pg-chat-label">
                  <span>🔴 클라이언트 A (달콤한 완숙토마토)</span>
                  <span style={{ fontSize: '11px', color: '#2ed573' }}>
                    ● {serverMode === 'mock' ? 'In-Browser Mock' : 'Socket.IO'} 접속 완료
                  </span>
                </div>
                <TomatoTalk
                  key={`client_a_${activeServerUrl}`}
                  url={activeServerUrl}
                  secretKey={isEncrypted ? secretKey : undefined}
                  user={{
                    id: 'user_alpha',
                    nickname: '달콤한 완숙토마토',
                    avatar: '🍅'
                  }}
                  mode="all"
                  defaultTab="anonymous"
                  style={{ flex: 1 }}
                />
              </div>

              {/* Client B */}
              <div className="pg-chat-wrapper">
                <div className="pg-chat-label">
                  <span>🟢 클라이언트 B (춤추는 방울토마토)</span>
                  <span style={{ fontSize: '11px', color: '#2ed573' }}>
                    ● {serverMode === 'mock' ? 'In-Browser Mock' : 'Socket.IO'} 접속 완료
                  </span>
                </div>
                <TomatoTalk
                  key={`client_b_${activeServerUrl}`}
                  url={activeServerUrl}
                  secretKey={isEncrypted ? secretKey : undefined}
                  user={{
                    id: 'user_beta',
                    nickname: '춤추는 방울토마토',
                    avatar: '🍅✨'
                  }}
                  mode="all"
                  defaultTab="anonymous"
                  style={{ flex: 1 }}
                />
              </div>
            </div>
          </div>
        )}

        {viewMode === 'single' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              {(['all', 'anonymous', 'group', 'direct', 'random'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setSelectedSingleMode(m)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '20px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    background: selectedSingleMode === m ? '#ff4757' : 'rgba(255, 255, 255, 0.05)',
                    color: '#ffffff',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  {m === 'all' && '통합 모드 (all)'}
                  {m === 'anonymous' && '익명 모드 (anonymous)'}
                  {m === 'group' && '그룹 모드 (group)'}
                  {m === 'direct' && '1:1 모드 (direct)'}
                  {m === 'random' && '랜덤 모드 (random)'}
                </button>
              ))}
            </div>

            <div style={{ width: '100%', maxWidth: '420px', height: '680px' }}>
              <TomatoTalk
                key={`${selectedSingleMode}_${activeServerUrl}`}
                url={activeServerUrl}
                secretKey={isEncrypted ? secretKey : undefined}
                mode={selectedSingleMode}
                style={{ height: '100%' }}
              />
            </div>
          </div>
        )}

        {viewMode === 'code' && (
          <div style={{ maxWidth: '920px', margin: '0 auto', width: '100%' }}>
            {/* Guide Header */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span style={{ fontSize: '24px' }}>🛠️</span>
                <h2 style={{ fontSize: '22px', fontWeight: 800, margin: 0, color: '#f8fafc' }}>
                  실제 서비스 연동 & 프로덕션 적용 가이드
                </h2>
              </div>
              <p style={{ fontSize: '14px', color: '#94a3b8', margin: 0, lineHeight: 1.6 }}>
                자사 웹 서비스(React, Next.js 등)와 사내 Node.js 백엔드에 <strong>React Tomato Talk</strong>를 연동하고 운영하는 실무 표준 가이드입니다.
              </p>
            </div>

            {/* Guide Sub-Nav Tabs */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '12px', flexWrap: 'wrap' }}>
              <button
                onClick={() => setGuideTab('quickstart')}
                style={{
                  background: guideTab === 'quickstart' ? '#ff4757' : 'rgba(255,255,255,0.06)',
                  color: guideTab === 'quickstart' ? '#ffffff' : '#cbd5e1',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '8px 16px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                🚀 빠른 연동 (완성형 컴포넌트)
              </button>
              <button
                onClick={() => setGuideTab('backend')}
                style={{
                  background: guideTab === 'backend' ? '#ff4757' : 'rgba(255,255,255,0.06)',
                  color: guideTab === 'backend' ? '#ffffff' : '#cbd5e1',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '8px 16px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                🔌 백엔드 서버 구축 (Node/Express)
              </button>
              <button
                onClick={() => setGuideTab('headless')}
                style={{
                  background: guideTab === 'headless' ? '#ff4757' : 'rgba(255,255,255,0.06)',
                  color: guideTab === 'headless' ? '#ffffff' : '#cbd5e1',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '8px 16px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                🎨 커스텀 UI (Headless Hooks)
              </button>
              <button
                onClick={() => setGuideTab('security')}
                style={{
                  background: guideTab === 'security' ? '#ff4757' : 'rgba(255,255,255,0.06)',
                  color: guideTab === 'security' ? '#ffffff' : '#cbd5e1',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '8px 16px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                🛡️ 실무 보안 & 스케일아웃
              </button>
            </div>

            {/* TAB 1: Quickstart */}
            {guideTab === 'quickstart' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ background: '#1e293b', padding: '20px', borderRadius: '12px', borderLeft: '4px solid #ff4757' }}>
                  <h3 style={{ fontSize: '16px', color: '#ff6b81', margin: '0 0 10px 0' }}>
                    1. 패키지 설치 & 스타일 임포트
                  </h3>
                  <p style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: 1.6, margin: '0 0 12px 0' }}>
                    클라이언트 프로젝트에 <code>react-tomato-talk</code>와 피어 의존성인 <code>socket.io-client</code>를 설치합니다.
                  </p>
                  <pre style={{ background: '#0f172a', padding: '12px', borderRadius: '8px', color: '#38bdf8', fontSize: '13px', overflowX: 'auto' }}>
                    <code>npm install react-tomato-talk socket.io-client</code>
                  </pre>
                  <p style={{ fontSize: '12px', color: '#94a3b8', margin: '8px 0 0 0' }}>
                    Yarn: <code>yarn add react-tomato-talk socket.io-client</code> | pnpm: <code>pnpm add react-tomato-talk socket.io-client</code>
                  </p>
                </div>

                <div style={{ background: '#1e293b', padding: '20px', borderRadius: '12px', borderLeft: '4px solid #2ed573' }}>
                  <h3 style={{ fontSize: '16px', color: '#2ed573', margin: '0 0 10px 0' }}>
                    2. 서비스 회원 정보와 함께 위젯 마운트
                  </h3>
                  <p style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: 1.6, margin: '0 0 12px 0' }}>
                    로그인된 회원 정보(<code>user</code>)와 운영 중인 소켓 서버 URL(<code>url</code>)을 전달하면 즉시 완전한 채팅 UI가 구동됩니다.
                  </p>
                  <pre style={{ background: '#0f172a', padding: '14px', borderRadius: '8px', color: '#f8fafc', fontSize: '12px', lineHeight: 1.5, overflowX: 'auto' }}>
{`import React from 'react';
import { TomatoTalk } from 'react-tomato-talk';
import 'react-tomato-talk/styles/tomato.css'; // 디자인 스타일 시트

export const AppChat = ({ currentUser }) => {
  return (
    <div style={{ width: '380px', height: '620px' }}>
      <TomatoTalk
        // 1. 소켓 서버 주소 (실제 운영 서버 URL 또는 로컬 테스트용 'http://localhost:3001')
        url="https://socket.myservice.com"

        // 2. 로그인된 사용자 정보 연동 (미전달 시 게스트 랜덤 닉네임 자동 발급)
        user={{
          id: currentUser.id,          // 서비스 DB 회원 고유 ID (예: 'usr_83921')
          nickname: currentUser.name,  // 채팅창에 표시될 닉네임
          avatar: currentUser.avatar   // 프로필 이미지 URL (선택)
        }}

        // 3. 제공할 모드 선택: 'all' | 'group' | 'direct' | 'anonymous' | 'random'
        mode="all"

        // 4. 종단간(E2E) AES 암호화 키 (선택 사항: 지정 시 서버에도 평문이 남지 않음)
        secretKey="service-channel-aes-secret-key"

        // 5. 부가 옵션
        theme="dark"              // 'dark' | 'light'
        maxImageSizeMB={5}        // 첨부 이미지 용량 제한 (기본 5MB)
        onModeChange={(m) => console.log('활성 모드 변경:', m)}
      />
    </div>
  );
};`}
                  </pre>
                </div>

                <div style={{ background: '#1e293b', padding: '16px 20px', borderRadius: '12px' }}>
                  <h4 style={{ fontSize: '14px', color: '#f8fafc', margin: '0 0 10px 0' }}>
                    📋 주요 Props 레퍼런스
                  </h4>
                  <table style={{ width: '100%', fontSize: '12px', borderCollapse: 'collapse', color: '#cbd5e1' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'left' }}>
                        <th style={{ padding: '8px' }}>Prop</th>
                        <th style={{ padding: '8px' }}>타입</th>
                        <th style={{ padding: '8px' }}>기본값</th>
                        <th style={{ padding: '8px' }}>설명</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <td style={{ padding: '8px', color: '#38bdf8', fontWeight: 600 }}>url</td>
                        <td style={{ padding: '8px' }}>string</td>
                        <td style={{ padding: '8px' }}>필수</td>
                        <td style={{ padding: '8px' }}>운영 Socket.IO 서버 주소 (테스트용 브라우저 모의 서버는 <code>"mock"</code>)</td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <td style={{ padding: '8px', color: '#38bdf8', fontWeight: 600 }}>user</td>
                        <td style={{ padding: '8px' }}>ChatUser</td>
                        <td style={{ padding: '8px' }}>랜덤 게스트</td>
                        <td style={{ padding: '8px' }}>로그인 회원의 고유 ID, 닉네임, 프로필 아바타 객체</td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <td style={{ padding: '8px', color: '#38bdf8', fontWeight: 600 }}>mode</td>
                        <td style={{ padding: '8px' }}>ChatMode | 'all'</td>
                        <td style={{ padding: '8px' }}>'all'</td>
                        <td style={{ padding: '8px' }}>전체 탭 제공 또는 'group' | 'direct' | 'anonymous' | 'random' 단일 모드 지정</td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <td style={{ padding: '8px', color: '#38bdf8', fontWeight: 600 }}>secretKey</td>
                        <td style={{ padding: '8px' }}>string</td>
                        <td style={{ padding: '8px' }}>선택 (미설정 시 평문)</td>
                        <td style={{ padding: '8px' }}>클라이언트 AES-256 종단간 양방향 암호화 비밀키</td>
                      </tr>
                      <tr>
                        <td style={{ padding: '8px', color: '#38bdf8', fontWeight: 600 }}>maxImageSizeMB</td>
                        <td style={{ padding: '8px' }}>number</td>
                        <td style={{ padding: '8px' }}>5</td>
                        <td style={{ padding: '8px' }}>채팅방 내 사진/이미지 첨부 허용 최대 크기(MB)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 2: Backend */}
            {guideTab === 'backend' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ background: '#1e293b', padding: '20px', borderRadius: '12px', borderLeft: '4px solid #38bdf8' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <h3 style={{ fontSize: '16px', color: '#38bdf8', margin: 0 }}>
                      방식 A. 기존 Node.js / Express 서버에 결합하기 (추천)
                    </h3>
                    <span className="pg-badge">사내 단일 백엔드</span>
                  </div>
                  <p style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: 1.6, margin: '0 0 12px 0' }}>
                    이미 서비스 중인 Express, NestJS, 또는 Fastify 서버의 HTTP 인스턴스에 <code>socket.io</code>를 마운트하여 간단히 채널을 개설합니다.
                  </p>
                  <pre style={{ background: '#0f172a', padding: '14px', borderRadius: '8px', color: '#f8fafc', fontSize: '12px', lineHeight: 1.5, overflowX: 'auto' }}>
{`// server.ts (Express 기반 예시)
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
const httpServer = createServer(app);

// 1. Socket.IO 인스턴스 생성 및 CORS 설정
const io = new Server(httpServer, {
  cors: {
    origin: ['https://myservice.com', 'http://localhost:3000'],
    credentials: true,
  },
  maxHttpBufferSize: 1e7 // 10MB 이미지 전송 허용
});

// 2. 소켓 연결 및 룸 라우팅
io.on('connection', (socket) => {
  // 방 입장 (익명, 그룹, 개인 DM 동일)
  socket.on('join_room', ({ roomId, user }) => {
    socket.join(roomId);
    io.to(roomId).emit('user_joined', user);
  });

  // 메시지 전송 및 중계
  socket.on('send_message', (message) => {
    // 필요 시 사내 DB(MySQL, MongoDB 등)에 대화 기록 저장
    // await saveMessageToDatabase(message);

    io.to(message.roomId).emit('new_message', message);
  });

  // 타이핑 인디케이터
  socket.on('typing', ({ roomId, user, isTyping }) => {
    socket.to(roomId).emit('user_typing', { user, isTyping });
  });

  // 방 퇴장
  socket.on('leave_room', ({ roomId, user }) => {
    socket.leave(roomId);
    io.to(roomId).emit('user_left', user);
  });
});

httpServer.listen(4000, () => {
  console.log('실시간 채팅 소켓 서버 가동 중: port 4000');
});`}
                  </pre>
                </div>

                <div style={{ background: '#1e293b', padding: '20px', borderRadius: '12px', borderLeft: '4px solid #ffa502' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <h3 style={{ fontSize: '16px', color: '#ffa502', margin: 0 }}>
                      방식 B. 전용 마이크로서비스로 배포하기 (@tomato-talk/server)
                    </h3>
                    <span className="pg-badge">독립 컨테이너</span>
                  </div>
                  <p style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: 1.6, margin: '0 0 10px 0' }}>
                    본 리포지토리의 <code>packages/server</code>는 익명·그룹·1:1·랜덤채팅 매칭 큐를 모두 내장한 완성형 소켓 서버입니다.
                    AWS ECS, Cloud Run, Render, Fly.io 등 컨테이너 호스팅에 그대로 독립 배포할 수 있습니다.
                  </p>
                  <pre style={{ background: '#0f172a', padding: '12px', borderRadius: '8px', color: '#38bdf8', fontSize: '12px', overflowX: 'auto' }}>
{`# Dockerfile 예시
FROM node:20-alpine
WORKDIR /app
COPY packages/server ./
RUN npm install && npm run build
EXPOSE 3001
ENV PORT=3001
ENV CORS_ORIGIN=https://myservice.com
CMD ["npm", "start"]`}
                  </pre>
                </div>
              </div>
            )}

            {/* TAB 3: Headless Hooks */}
            {guideTab === 'headless' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ background: '#1e293b', padding: '20px', borderRadius: '12px', borderLeft: '4px solid #a855f7' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <h3 style={{ fontSize: '16px', color: '#c084fc', margin: 0 }}>
                      Headless Hooks로 나만의 독창적인 UI 디자인하기
                    </h3>
                    <span className="pg-badge">TailwindCSS / 커스텀 디자인</span>
                  </div>
                  <p style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: 1.6, margin: '0 0 12px 0' }}>
                    기본 제공되는 위젯 디자인 대신, 자사 서비스의 디자인 시스템(TailwindCSS, Styled-Components 등)을 그대로 유지하면서
                    실시간 소켓 상태와 메시지 동기화 로직만 가져다 사용할 수 있습니다.
                  </p>
                  <pre style={{ background: '#0f172a', padding: '14px', borderRadius: '8px', color: '#f8fafc', fontSize: '12px', lineHeight: 1.5, overflowX: 'auto' }}>
{`import React, { useState } from 'react';
import { useTomatoSocket, useGroupChat } from 'react-tomato-talk';

export const CustomTailwindChat = ({ roomId, currentUser }) => {
  // 1. 소켓 연결 관리 (자동 재연결 & 연결 상태)
  const { socket, isConnected } = useTomatoSocket({
    url: 'https://socket.myservice.com',
    userId: currentUser.id,
    nickname: currentUser.name
  });

  // 2. 그룹 채팅 상태 & 액션 바인딩
  const { messages, sendMessage, typingUsers } = useGroupChat(socket, roomId, currentUser);
  const [inputText, setInputText] = useState('');

  const onSend = () => {
    if (!inputText.trim()) return;
    sendMessage({ type: 'text', content: inputText });
    setInputText('');
  };

  return (
    <div className="flex flex-col h-[550px] w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-2xl">
      {/* 헤더 */}
      <div className="flex justify-between items-center pb-3 border-b border-slate-800">
        <h3 className="font-bold text-white text-base">그룹 대화방</h3>
        <span className={\`text-xs px-2 py-0.5 rounded-full \${isConnected ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}\`}>
          {isConnected ? '● 온라인' : '○ 오프라인'}
        </span>
      </div>

      {/* 메시지 리스트 */}
      <div className="flex-1 overflow-y-auto py-3 space-y-3">
        {messages.map((msg) => (
          <div key={msg.id} className={msg.sender.id === currentUser.id ? 'text-right' : 'text-left'}>
            <div className="text-xs text-slate-400 mb-1">{msg.sender.nickname}</div>
            <div className={\`inline-block px-3 py-2 rounded-xl text-sm max-w-[75%] \${
              msg.sender.id === currentUser.id ? 'bg-rose-500 text-white' : 'bg-slate-800 text-slate-100'
            }\`}>
              {msg.content}
            </div>
          </div>
        ))}
      </div>

      {/* 입력 바 */}
      <div className="flex gap-2 pt-2 border-t border-slate-800">
        <input
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSend()}
          placeholder="메시지 입력..."
          className="flex-1 bg-slate-800 text-white text-sm px-3 py-2 rounded-xl focus:outline-none"
        />
        <button onClick={onSend} className="bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-xl text-sm font-bold">
          전송
        </button>
      </div>
    </div>
  );
};`}
                  </pre>
                </div>
              </div>
            )}

            {/* TAB 4: Security & Scaling */}
            {guideTab === 'security' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ background: '#1e293b', padding: '18px 20px', borderRadius: '12px', borderLeft: '4px solid #ef4444' }}>
                  <h4 style={{ fontSize: '15px', color: '#f87171', margin: '0 0 6px 0' }}>
                    1. 사용자 인증 (JWT / Session 토큰 검증)
                  </h4>
                  <p style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: 1.6, margin: 0 }}>
                    실제 프로덕션에서는 소켓 핸드셰이크 시 <code>auth: &#123; token &#125;</code>을 전달하여 서버의 <code>io.use((socket, next) =&gt; ...)</code> 미들웨어에서 JWT 검증 후 유효하지 않은 사용자의 소켓 연결을 즉시 거부(reject)하도록 설정하세요.
                  </p>
                </div>

                <div style={{ background: '#1e293b', padding: '18px 20px', borderRadius: '12px', borderLeft: '4px solid #22c55e' }}>
                  <h4 style={{ fontSize: '15px', color: '#4ade80', margin: '0 0 6px 0' }}>
                    2. 클라이언트 종단간(E2EE) 암호화 (AES-256)
                  </h4>
                  <p style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: 1.6, margin: 0 }}>
                    <code>secretKey</code> prop을 전달하면 브라우저 메모리상에서 CryptoJS(AES)로 메시지가 암호화된 후 소켓으로 발송됩니다. 서버나 DB에는 암호화된 난수 해시 문자열만 전달되므로, 관리자나 외부 침해 사고로부터 대화 내용을 철저히 보호할 수 있습니다.
                  </p>
                </div>

                <div style={{ background: '#1e293b', padding: '18px 20px', borderRadius: '12px', borderLeft: '4px solid #38bdf8' }}>
                  <h4 style={{ fontSize: '15px', color: '#38bdf8', margin: '0 0 6px 0' }}>
                    3. 서버 다중화 및 수평 확장 (Redis Adapter)
                  </h4>
                  <p style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: 1.6, margin: 0 }}>
                    대규모 동시접속 처리를 위해 소켓 서버를 2대 이상으로 로드밸런싱할 경우, <code>@socket.io/redis-adapter</code>를 연결하여 서버 인스턴스 간 소켓 이벤트를 Redis Pub/Sub으로 실시간 동기화하세요.
                  </p>
                </div>

                <div style={{ background: '#1e293b', padding: '18px 20px', borderRadius: '12px', borderLeft: '4px solid #f59e0b' }}>
                  <h4 style={{ fontSize: '15px', color: '#fbbf24', margin: '0 0 6px 0' }}>
                    4. 대용량 미디어 파일 처리 (S3 / Cloudflare R2 업로드)
                  </h4>
                  <p style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: 1.6, margin: 0 }}>
                    작은 이미지는 Base64 인라인 데이터로 소켓 전송이 가능하지만, 트래픽 비용 및 성능 최적화를 위해 실서비스에서는 이미지를 S3 Presigned URL로 먼저 업로드한 후 반환된 이미지 URL 문자열만 <code>type: 'image'</code>로 전달하는 구조를 권장합니다.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
