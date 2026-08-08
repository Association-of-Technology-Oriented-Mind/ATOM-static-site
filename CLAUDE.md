# CLAUDE.md

Guidance for working in this repository.

## What this is

Public website + CMS for the ATOM Club at Karunya Institute of Technology and
Sciences. React SPA on Firebase Hosting, backed by Firestore and Firebase Auth.
There is no custom backend server.

Live at https://atom-2026.web.app (Firebase project `atom-2026`).

New here? Read `docs/onboarding.md`, then `STATUS.md` for current state.

## Commands

```bash
npm run dev        # dev server on :8000
npm run build      # production build to dist/
npm run typecheck  # tsc -p tsconfig.app.json --noEmit
npm test           # vitest run (26 tests)
npm run lint       # eslint
```

Before pushing: `npm run typecheck && npm test && npm run build`. The build
catches asset and import errors that typecheck misses.

## Architecture invariants

Each of these has caused a real production bug. `FIXES.md` has the postmortems.

- **Firestore is the source of truth; `src/constants/*` is the fallback.**
  Every read path must survive Firebase being unconfigured, empty, or failing —
  the public site has to render regardless. Don't remove the fallbacks or
  "simplify" them into a single source.
- **`src/lib/schemas.ts` is the only validation boundary.** Validate user input
  and Firestore reads there, not inline in components. Malformed documents are
  skipped and logged, never fatal.
- **Security rules are the authorization layer.** `VITE_*` env vars ship in the
  bundle and are not secret. Never gate access on client state; if a check
  matters it belongs in `firestore.rules`. The only real secret is
  `.secrets/serviceAccount.json`.
- **Admin writes need the `admin` custom claim**, not just a session. A signed-in
  user without it can read the CMS but every write is rejected.
- **Never persist app data to localStorage.** It was the previous CMS backend:
  edits were invisible to visitors, silently overwritten on page load, and
  capped at ~5 MB. Use Firestore.
- **Never reference `/src/assets/...` as a string.** Vite only rewrites imported
  assets and `public/`. Raw paths survive into the bundle and 404 in
  production — this broke the whole gallery once. Import them, or use
  `public/`.

## Code conventions

- TypeScript `strict: true`. No `any` — type the value or use `unknown`.
- Named exports, `const` over `let`, async/await.
- Data fetching goes through `src/hooks/useContent.ts` (TanStack Query), not
  raw calls in components. Invalidate the relevant query key after a write.
- Admin writes use optimistic state with rollback on failure — see
  `EventsManager.handleSaveEvents`.
- Errors surface as toasts (`sonner` in admin, `useToast` elsewhere). Never
  `alert()`. **Never swallow an error into a success path** — the registration
  form showed "Success!" for months while every submission was lost.
- Keep routes lazy in `App.tsx`. Firebase and the ~1 MB admin bundle load on
  demand rather than on the landing page; don't make them eager imports.
- Images are WebP, resized. Gallery: `-resize '1200x1200>' -quality 78`.
  Posters: `-resize '1600x1600>' -quality 82`. Always `-strip`.
- Don't add build-time compression plugins — Firebase Hosting compresses on the
  fly, and `.gz`/`.br` output just inflates every deploy.

## Testing

Vitest + Testing Library, AAA structure. Mock the Firebase SDK at the module
boundary (see `src/utils/api.test.ts`).

Auth and registration paths require full coverage — both have shipped silently
broken before. When fixing a bug, add the regression test that would have
caught it; several existing tests are named for exactly that.

## Docs to maintain

- `STATUS.md` — prepend an entry after each meaningful change.
- `FIXES.md` — prepend an entry for every bug fixed: symptom, root cause, fix
  with `file:line`, verification.
- `docs/architecture.md` — update when services or data flows change.
- `docs/content-guide.md` — update when the CMS workflow changes.

`MASTER_DOCUMENTATION.md` predates the Firebase migration and describes the
removed localStorage CMS and hardcoded login. `docs/` is authoritative.

## Operational notes

- Deploys upload only changed files. The first full deploy is slow on a
  constrained uplink; `FIREBASE_HOSTING_UPLOAD_CONCURRENCY=1` helps if
  connections drop.
- Firebase Storage is **off** (needs the paid plan). Only CMS image uploads
  depend on it; the upload tab disables itself and explains the alternative.
- Rules deploy separately: `firebase deploy --only firestore:rules`. Ship rule
  changes before the code that relies on them.

## Design direction

A technical/brutalist redesign is **in progress**. Read `GOAL.md` before
touching any public-site component — it lists what is done, what is left, and
the decisions already made.

- `docs/design-system.md` holds the tokens and rules. Lattice tokens in
  `index.css` are additive; the admin CMS still depends on the old ones.
- Scroll-pinned sections use `src/components/scroll/ScrollScene.tsx`. Phase
  children must write styles directly to the DOM via refs — never React state,
  which would re-render the tree every frame.
- Scroll scenes cannot be verified from the DOM alone. Screenshot them.
