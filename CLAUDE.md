# CLAUDE.md

Guidance for working in this repository.

## What this is

Public website + CMS for the ATOM Club at Karunya Institute of Technology and
Sciences. React SPA on Firebase Hosting, backed by Firestore, Firebase Auth and
Firebase Storage. There is no custom backend server.

Read `docs/architecture.md` first, then `STATUS.md` for current state.

## Commands

```bash
npm run dev        # dev server on :8000
npm run build      # production build to dist/
npm run typecheck  # tsc --noEmit
npm test           # vitest run
npm run lint       # eslint
```

## Architecture rules

- **Firestore is the source of truth; `src/constants/*` is the fallback.**
  Every read path must survive Firebase being unconfigured or failing — the
  public site has to render regardless. Don't remove the fallbacks.
- **`src/lib/schemas.ts` is the only validation boundary.** Validate user input
  and Firestore reads there, not inline in components.
- **Security rules are the authorisation layer.** `VITE_*` env vars ship in the
  bundle and are not secret. Never gate access on client state; if a check
  matters, it belongs in `firestore.rules` or `storage.rules`.
- **Never persist app data to localStorage.** It was the previous CMS backend
  and caused edits to be invisible to visitors, silently overwritten, and
  capped at ~5 MB. Use Firestore.

## Code conventions

- TypeScript `strict: true`. No `any` — type the value or use `unknown`.
- Named exports, `const` over `let`, async/await.
- Data fetching goes through `src/hooks/useContent.ts` (TanStack Query), not
  raw calls in components.
- Errors surface to users as toasts (`sonner` in admin, `useToast` elsewhere).
  Never `alert()`. Never swallow an error into a success path.
- Assets: import them or place them in `public/`. A literal `/src/assets/...`
  string will 404 in production.
- Images are WebP. Run new additions through
  `magick in.jpg -resize '1600x1600>' -quality 82 -strip out.webp`.

## Testing

Vitest + Testing Library, AAA structure. Auth and registration paths require
full coverage — both have shipped silently broken before. Mock the Firebase
SDK at the module boundary (see `src/utils/api.test.ts`).

## Docs to maintain

- `STATUS.md` — prepend an entry after each meaningful change.
- `FIXES.md` — prepend an entry for every bug fixed: symptom, root cause, fix
  with `file:line`, verification.
- `docs/architecture.md` — update when services or data flows change.

`MASTER_DOCUMENTATION.md` predates the Firebase migration and describes the old
localStorage CMS and hardcoded login. Treat `docs/` as authoritative.

## Design direction

Current UI is dark glassmorphism with blue/cyan gradients. A redesign toward a
technical/brutalist direction is agreed but not started — check with the owner
before making visual changes.
