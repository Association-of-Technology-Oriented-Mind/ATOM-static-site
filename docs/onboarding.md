# Onboarding

For a developer picking this project up for the first time. Read this end to
end once — it is shorter than the time you would lose rediscovering it.

## 1. What this actually is

A React single-page app. No backend server exists. Firebase supplies the
database (Firestore), admin login (Firebase Auth), and optionally file storage.
Everything else is static files on a CDN.

Three kinds of user:

- **Visitors** — browse events, clubs, coordinators, photo gallery
- **Students** — submit event registration forms
- **Club admins** — sign in at `/admin` and edit site content

## 2. Get it running (5 minutes)

```bash
npm ci
npm run dev
```

Open http://localhost:8000. It works immediately, with no configuration.

That is deliberate. When Firebase is unconfigured, the app reads content from
`src/constants/*.ts` instead of Firestore. You get the real site with real
content, just read-only. Add `.env` (see [setup.md](setup.md)) when you need
admin login or live data.

## 3. The five things that will confuse you

These are the non-obvious parts. Each one has caused a real bug — see
[FIXES.md](../FIXES.md).

### Content has two sources, and that's on purpose

`src/constants/*.ts` holds bundled content. Firestore holds live content. Every
read tries Firestore and **falls back to the constants** on any failure: not
configured, empty collection, network error, malformed document.

This keeps the public site alive during a Firestore outage and lets anyone run
the project without credentials. Don't "simplify" it away.

```ts
// src/utils/dataService.ts — the pattern every read follows
if (!isFirebaseConfigured || !db) return defaultEvents;
try {
  const snapshot = await getDocs(...);
  if (snapshot.empty) return defaultEvents;
  ...
} catch {
  return defaultEvents;   // degrade to stale, never to blank
}
```

### Images must be imported, never referenced as `/src/assets/...`

Vite rewrites assets that are `import`ed or live in `public/`. A raw string
like `"/src/assets/PHOTOS/x.webp"` survives into the bundle unchanged and
**404s in production**, because `dist/` has no `src/` directory. This exact bug
broke the entire gallery once.

- Gallery photos: resolved via `import.meta.glob` in `src/constants/gallery.ts`
- Event posters: live in `public/EVENTS/`, referenced as `/EVENTS/name.webp`
- Everything else: `import img from '@/assets/thing.webp'`

### Security rules are the authorization layer

`VITE_*` environment variables are compiled into the public JavaScript bundle.
Anyone can read them from the deployed site. That is fine and expected — they
are identifiers, not secrets.

What actually protects data is `firestore.rules`. If a check matters, it goes
there. A client-side check is a UX nicety and nothing more.

The one real secret is `.secrets/serviceAccount.json`, which bypasses all rules.
Never commit it.

### Admin writes need a custom claim, not just a login

Being signed in is not enough. `firestore.rules` requires `request.auth.token.admin == true`.
A new admin account can log in and see the CMS, but every save fails until you
run:

```bash
GOOGLE_APPLICATION_CREDENTIALS=.secrets/serviceAccount.json \
  node scripts/set-admin-claim.mjs their@email.com
```

They must sign out and back in afterwards — claims only land on a fresh token.

### Never persist app data to localStorage

The original CMS stored everything there. Consequences: admin edits were
invisible to every other visitor, one page wiped them on load, and base64 image
uploads blew the ~5 MB quota. All of that is fixed; don't reintroduce it.

## 4. How a request flows

```text
Visitor hits /events
  → React Router renders src/pages/Event.tsx
  → useEvents() from src/hooks/useContent.ts   (TanStack Query, 5 min cache)
  → getEvents() from src/utils/dataService.ts
  → Firestore query, each doc parsed by eventSchema (Zod)
  → invalid docs skipped and logged, not fatal
  → falls back to src/constants/events.ts if anything goes wrong
  → PastEventTimeline renders the list
```

Admin writes go the other direction: manager component → `replaceCollection()`
→ Firestore (gated by rules) → `queryClient.invalidateQueries()` so readers
refresh.

## 5. Making common changes

**Add an event** — CMS at `/admin` → Events, or edit `src/constants/events.ts`
and re-seed. See [content-guide.md](content-guide.md).

**Add gallery photos** — convert to WebP, drop in `src/assets/PHOTOS/`, commit,
redeploy. They are picked up automatically by the glob.

```bash
magick photo.jpg -resize '1200x1200>' -quality 78 src/assets/PHOTOS/photo.webp
```

**Change a data shape** — update the Zod schema in `src/lib/schemas.ts` first,
then the TypeScript type, then the UI. The schema is what actually runs.

**Add a route** — add a `lazy()` import and `<Route>` in `src/App.tsx`. Keep it
lazy so it stays out of the landing page's critical path.

## 6. Before you push

```bash
npm run typecheck   # strict mode, must be clean
npm test            # 26 tests
npm run build       # catches asset and import errors typecheck misses
```

Then append to `FIXES.md` (if you fixed a bug) and `STATUS.md` (if you finished
something meaningful).

## 7. Known rough edges

- `EventDetailPage.tsx` is ~1360 lines and needs decomposition.
- `MASTER_DOCUMENTATION.md` predates the Firebase migration and describes the
  removed localStorage CMS. `docs/` is authoritative.
- Coordinators and clubs are not seeded into Firestore (they import image
  binaries); they render from the constants until edited via the CMS.
- Firebase Storage is off — it needs the paid plan, and is only used for CMS
  image uploads. The upload tab disables itself and explains the alternative.
- Ten `npm audit` advisories remain, all dev-only: the Vite dev server, a
  React Router advisory needing a v7 major, and `firebase-admin`'s transitive
  deps (a devDependency used only by `scripts/`). None ship to users.
- A UI redesign toward a technical/brutalist direction is agreed but not
  started. Check before making visual changes.
