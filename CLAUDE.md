# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run lint         # ESLint
npm run test         # Run all tests (Vitest)
npx vitest run path/to/file.test.ts  # Run a single test file
npx prisma studio    # Open DB GUI
npx prisma migrate dev --name <name>  # Create + apply a migration
npx prisma generate  # Regenerate Prisma client after schema changes
```

## Architecture

Next.js 14 app-directory monolith with PostgreSQL (Neon) via Prisma, Clerk auth, and dual AI providers (Claude + OpenAI via Vercel AI SDK).

**Request flow**: React (TipTap editor + Radix/MUI UI) → Next.js API routes → Prisma → Neon PostgreSQL

### Key directories

- `app/api/` — All REST API routes
- `components/` — React components; notable: `AIAssistant/`, `TipTap/`, `SideBar/`, `FileTree/`
- `hooks/` — React Query hooks for all data fetching (one hook per operation pattern)
- `lib/ai/` — AI provider abstraction: `index.ts` (factory), `claude.ts`, `openai.ts`, `types.ts`
- `backend/db.tsx` — Prisma client singleton
- `prisma/schema.prisma` — Database schema

### Data model

There are **two parallel content models** — a legacy one and a newer hierarchical one:

- **Legacy**: `Page` + `Folder` (integer IDs, separate tables)
- **Current**: `Item` (UUID, `itemType: FOLDER | PAGE`, self-referential `parentId`, `isWorldContext` flag for the world-context document)

Most new features use the `Item` model. The legacy `Page`/`Folder` models still exist and some older API routes use them.

### AI Assistant

- `components/AIAssistant/AIAssistant.tsx` — Chat UI with slash-command context picker, provider/model switcher, pinned pages, and streaming output
- `app/api/ai/chat/` — Streams responses using Vercel AI SDK; assembles system prompt from world context + pinned pages + current page content
- `app/api/world-context/` — POST generates a structured markdown world-context doc from all user story pages; GET retrieves it. The doc is stored in the DB (`isWorldContext` Item) and in `world-context.md`
- `lib/tiptap-to-text.ts` — Converts TipTap JSON editor content to plain text for AI consumption

### Auth

Clerk is the primary auth provider. `middleware.ts` checks a `userId` cookie and redirects unauthenticated requests to `/sign-in` (API routes are exempt). A Clerk webhook at `/api/webhook/clerk-user` syncs new users into the database.

## Environment variables

Required in `.env` / `.env.local`:
- `DATABASE_URL` + `DIRECT_URL` — Neon PostgreSQL (pooled + direct)
- `ANTHROPIC_API_KEY`
- `OPENAI_API_KEY`
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` + `CLERK_SECRET_KEY`
- `CLERK_WEBHOOK_SECRET`

## Testing

Vitest + React Testing Library. `postinstall` runs `prisma generate && prisma migrate deploy` automatically.
