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

## 아시안게임 대한민국 야구 (2026)

경기 현황 상단에서 **아시안게임 · 대한민국**을 선택하면 한국 경기의 전체 일정과 날짜별 일정·결과를 볼 수 있습니다. 직접 주소: `/?competition=asian-games`.

- 초기 데이터는 대회 조직위원회의 [2026-09-11 정정 공지](https://www.aichi-nagoya2026.org/ja/news-2050/) 기준 조별리그 3경기이며, 2026-09-21 확인했습니다. 일본과 한국 모두 UTC+9입니다.
- 경기 시작 15분 전부터 대회 조직위원회의 [공식 결과 서비스](https://results.asiangames2026.org/#/discipline/BBL/schedule)를 10초마다 확인합니다. 경기 종료·취소·연기가 확인되면 자동 갱신을 멈춥니다.
- 경기 중에는 점수, 이닝과 초·말, 볼·스트라이크·아웃카운트, 1~3루 주자, 현재 투수·타자를 표시합니다. 공식 데이터가 일시적으로 누락되면 마지막 정상 데이터를 유지하면서 오류 안내를 표시합니다.
- 브라우저는 `/api/asian-games-live`만 호출하며, 서버가 등록된 경기 ID를 검증한 뒤 공식 응답을 공통 UI 형식으로 변환합니다. 응답은 캐시하지 않습니다.
- 시작 전 점수는 `null`로 유지합니다. 경기 상태는 시각으로 추정하지 않고 공식 응답을 따릅니다.
- 이후 라운드는 한국의 진출과 대진이 공식 확정된 경우에만 추가합니다. 기존 KBO 상세·실시간 API에 국제대회 경기 ID를 전달하지 않습니다.

검증: Node.js 22.6+에서 `node --experimental-strip-types --test tests/asian-games.test.mjs`로 한국시간 경계, 홈·원정 승패, 공식 실시간 필드 변환과 종료 상태를 검사할 수 있습니다.
