# ⚾ KBO 경기 결과

KBO 프로야구 경기 결과를 한눈에 확인하고 AI와 함께 분석하는 웹사이트입니다.

## 🎯 기능

### Tab 1: 경기 결과 대시보드
- 날짜별 KBO 경기 결과 조회
- 경기 정보: 팀명, 점수, 경기장, 선발투수 등
- 팀별 컬러 반영 디자인

### Tab 2: AI 챗
- AI에게 경기 결과에 대해 자유롭게 질문
- 추천 질문: "오늘 경기 결과 알려줘", "LG 이겼어?", "이번 주 경기 일정"
- AI가 실시간으로 경기 데이터 조회 후 답변 제공
- **필요**: `.env.local`에 `ANTHROPIC_API_KEY` 설정

### Tab 3: 실시간 분석
- 특정 날짜의 모든 경기를 AI가 한 번에 분석
- 각 경기별 요약 + 전체 종합 요약 생성
- 스트리밍 방식으로 점진적 결과 표시
- **필요**: `.env.local`에 `ANTHROPIC_API_KEY` 설정

## 🛠️ 기술 스택

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS v4
- **AI**: Anthropic Claude (Sonnet 4.6), Vercel AI SDK v6
- **데이터**: `kbo-game` npm 패키지

## 🚀 설치 및 실행

### 1. 의존성 설치
```bash
npm install
npm install -g kbo-game
```

### 2. 환경 변수 설정
`.env.local` 파일 생성 후 Anthropic API 키 입력:
```
ANTHROPIC_API_KEY=your-api-key-here
```

[Anthropic Console](https://console.anthropic.com)에서 API 키 발급 가능

### 3. 개발 서버 실행
```bash
npm run dev
```

http://localhost:3000 접속

## 📝 사용 예시

### 경기 결과 조회
1. Tab 1에서 날짜 선택 → 해당 날짜 경기 결과 표시

### AI 챗
1. Tab 2 입력창에 질문 입력
2. AI가 경기 데이터 조회 후 자연어로 답변

### 실시간 분석
1. Tab 3에서 날짜 선택
2. "AI 분석 시작" 버튼 클릭
3. 각 경기별 요약과 전체 분석 결과 스트리밍 표시

## 📖 라이센스

MIT
