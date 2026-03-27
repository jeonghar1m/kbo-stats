# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**KBO 경기 결과** — A single-page web app for browsing Korean baseball (KBO) game results with AI-powered analysis. Three tabs:

- **Tab 1**: Game results dashboard (no AI, free)
- **Tab 2**: AI chat about game results (requires API key)
- **Tab 3**: Real-time AI analysis with streaming (requires API key)

Tech: Next.js 16 (Turbopack), React 19, TypeScript, Tailwind CSS v4, Anthropic Claude API.

## Git Commit Author

커밋 시 항상 아래 author 정보를 사용할 것:

- **Name**: Jeong Harim
- **Email**: me@jeongharim.dev

커밋 시 항상 아래 명령어 형식을 사용할 것 (author와 committer 모두 지정):

```bash
GIT_COMMITTER_NAME="Jeong Harim" GIT_COMMITTER_EMAIL="me@jeongharim.dev" \
  git commit --author="Jeong Harim <me@jeongharim.dev>" ...
```

## Quick Commands

```bash
npm run dev        # Start development server (localhost:3000)
npm run build      # Build for production
npm start          # Start production server
npm run lint       # Run ESLint
```

## Critical: Next.js 16 & AI SDK v6 Breaking Changes

**This is NOT the Next.js you know.** Always read `node_modules/next/dist/docs/` before writing code.

### Next.js 16 Breaking Changes

- `params` and `searchParams` in route handlers/pages are **Promises** — always `await` them
- Turbopack (default bundler) cannot handle dynamic imports with computed paths. Solution: install `kbo-game` as local dependency, use direct `import("kbo-game")`

### AI SDK v6 Breaking Changes

- **Tool definitions**: Use `inputSchema` (not `parameters`)
- **Step limiting**: Use `stopWhen: stepCountIs(3)` (not `maxSteps`)
- **Chat streaming**: `toUIMessageStreamResponse()` (not `toDataStreamResponse()`)
- **useChat hook**: No `api`/`input`/`handleInputChange` props — use `useChat()` with default transport `/api/chat`, call `sendMessage({ text: "..." })`
- **Tool parts**: `part.type.startsWith("tool-")` with `part.state === "output-available"` and `part.output` (not `toolInvocation.state: 'result'`)
- **useObject**: `experimental_useObject` from `@ai-sdk/react`, configure via second arg object with `api` + `schema`

See [ai-chat.tsx](components/tabs/ai-chat.tsx) and [realtime.tsx](components/tabs/realtime.tsx) for working examples.

## Architecture

### Data Flow

1. **kbo-game package** → `/lib/kbo.ts` → (used by all tabs)
   - `fetchGames(date: Date): Game[]` — queries the `kbo-game` package
   - `createKSTDate(dateString?): Date` — helper to parse dates in Asia/Seoul timezone

2. **Tab 1 (Game Results)**
   - Server-side: `page.tsx` fetches today's games on initial load
   - Client-side: `today-results.tsx` handles date changes via GET `/api/games?date=...`
   - No AI, no API key needed

3. **Tab 2 (AI Chat)**
   - Client-side: `ai-chat.tsx` uses `useChat()` hook
   - Transport: POST `/api/chat`
   - API handler: `api/chat/route.ts` uses `streamText` + `getGames` tool (calls `fetchGames`)
   - Requires `ANTHROPIC_API_KEY`

4. **Tab 3 (Real-time Analysis)**
   - Client-side: `realtime.tsx` uses `experimental_useObject` hook
   - Trigger: Manual button click (cost control)
   - Transport: POST `/api/games`
   - API handler: `api/games/route.ts` POST method uses `streamObject` with `gameAnalysisSchema`
   - Also serves GET `/api/games?date=...` for Tab 1 date changes (plain JSON, no AI)
   - Requires `ANTHROPIC_API_KEY`

### Key Files

**Core Data / Types**

- `lib/kbo.ts` — KBO package wrapper, async data fetching
- `lib/types.ts` — `Game` interface (matches kbo-game schema)
- `lib/team-colors.ts` — 10 KBO teams → color palettes

**UI Components**

- `components/game-card.tsx` — Reused across all 3 tabs, displays single game with team colors
- `components/game-card-skeleton.tsx` — Loading state
- `components/date-picker.tsx` — Date input wrapper
- `components/tab-container.tsx` — 3-tab switcher (useState, no URL routing)

**Tab Pages**

- `components/tabs/today-results.tsx` — Grid of game cards, date picker, fetches on date change
- `components/tabs/ai-chat.tsx` — useChat, message bubbles, tool output rendering
- `components/tabs/realtime.tsx` — useObject, manual trigger button, progressive card rendering

**API Routes**

- `api/chat/route.ts` — POST only, streamText with `getGames` tool
- `api/games/route.ts` — GET (plain JSON for Tab 1), POST (streamObject for Tab 3)

**Config**

- `next.config.ts` — `serverExternalPackages: ["kbo-game"]` (required)
- `tsconfig.json` — Strict mode, path alias `@/*` = project root

## Configuration

### Environment Variables

Create `.env.local`:

```
ANTHROPIC_API_KEY=sk-ant-...
```

Without this, Tab 2 and Tab 3 will show fallback messages. Get key from [Anthropic Console](https://console.anthropic.com).

### Tailwind CSS v4

Post CSS config is auto-generated. Update styles in `app/globals.css` (uses CSS variables like `var(--font-sans)`).

## Important Implementation Notes

1. **Date Handling**: Always use `createKSTDate()` for consistent Asia/Seoul timezone parsing. KBO data returned from `getGame()` has dates as strings.

2. **AI Prompts**: Anthropic models excel at Korean. System prompts include today's date for context. Prompts are in `api/chat/route.ts` and `api/games/route.ts`.

3. **Streaming**: Both `streamText` (chat) and `streamObject` (analysis) use Vercel AI SDK's streaming response objects. Client hooks consume these progressively.

4. **Error Handling**:
   - Missing games data → `[]`
   - Missing API key → fallback messages in response
   - Try/catch blocks in data fetch, don't fail hard

5. **UI State**: All tab state managed in `tab-container.tsx` with `useState`. No URL routing. Tab 3 manual trigger prevents surprise API charges.

## Common Tasks

**Add a new feature to Tab 1**

- Edit `components/tabs/today-results.tsx` (client component)
- If it needs data, call GET `/api/games?date=...` via fetch/axios

**Modify AI behavior (Tab 2)**

- Edit `api/chat/route.ts` — system prompt, tool definition, step limit
- Test with suggestion buttons in `ai-chat.tsx`

**Change game card layout**

- Edit `components/game-card.tsx` (used by all tabs)
- Colors come from `lib/team-colors.ts`

**Debug data issues**

- Check `lib/kbo.ts` — ensure `getGame()` receives Date object, not string
- Inspect `JSON.parse(JSON.stringify(games))` in fetchGames — serializes Date fields to strings

## Costs & Quotas

- Tab 1: $0 (local data)
- Tab 2: ~$0.006/query (short conversation)
- Tab 3: ~$0.016/query (full game analysis)
- Claude Sonnet 4.6: $3 input, $15 output per million tokens

## Related Files

- `README.md` — User guide (feature status, setup, usage examples)
- `AGENTS.md` — Next.js 16 deprecation notice (read before coding)
- `package.json` — Dependencies, note AI SDK versions are pinned to avoid breaking changes
