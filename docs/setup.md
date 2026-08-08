# Setup

Firebase project: **`atom-dscs`** (already referenced in `.firebaserc`).

## 1. Local development

```bash
npm ci
cp .env.example .env   # fill in the values from step 2
npm run dev            # http://localhost:8000
```

The site runs without Firebase configured — content falls back to
`src/constants/*`. Admin login, uploads and registration require step 2.

## 2. Firebase console (one-time, needs account access)

**Get the config values** — Project settings → Your apps → SDK setup and
configuration. Copy each field into the matching `VITE_FIREBASE_*` var in
`.env`.

**Enable authentication** — Authentication → Sign-in method → enable
Email/Password. Then Users → Add user, and create the admin account.

**Grant the admin claim.** Being signed in is not enough; every write checks
for a custom claim. With a service account key:

```bash
npm i -D firebase-admin
GOOGLE_APPLICATION_CREDENTIALS=./serviceAccount.json node -e "
  const { initializeApp, cert } = require('firebase-admin/app');
  const { getAuth } = require('firebase-admin/auth');
  initializeApp({ credential: cert(require('./serviceAccount.json')) });
  getAuth().getUserByEmail('ADMIN@EMAIL').then(u =>
    getAuth().setCustomUserClaims(u.uid, { admin: true })
  ).then(() => console.log('done'));
"
```

The admin must sign out and back in before the refreshed token carries the
claim.

> Keep `serviceAccount.json` out of git — it is a real secret, unlike the
> `VITE_*` values. It is already covered by the `.env`/`*.local` ignore rules;
> add it explicitly if you store it elsewhere.

**Create the Firestore database** — Firestore Database → Create database →
production mode.

## 3. Deploy security rules

Rules are the entire authorisation layer. Deploy them before going live:

```bash
npx firebase deploy --only firestore:rules,storage:rules
```

- `firestore.rules` — public read on content; writes require the `admin` claim.
  `registrations` is create-only for the public and readable only by admins.
- `storage.rules` — public read on `gallery/`; uploads require the `admin`
  claim, max 5 MB, images only.

## 4. Seed content (optional)

Copies the bundled events into Firestore. Safe to re-run — documents are keyed
by id, so it upserts.

```bash
npm i -D firebase-admin
GOOGLE_APPLICATION_CREDENTIALS=./serviceAccount.json node scripts/seed-firestore.mjs
```

Coordinators and clubs import image binaries, so seed those through the admin
UI instead.

## 5. Deploy

```bash
npm run build
npx firebase deploy --only hosting
```

## Verification checklist

- [ ] `npm run typecheck` — clean
- [ ] `npm test` — 25 passing
- [ ] `npm run build` — main entry ~114 kB, no `/src/assets` strings in `dist`
- [ ] `/admin` redirects to `/login` when signed out
- [ ] Signing in as the admin reaches the dashboard
- [ ] Editing an event in the CMS persists after a hard refresh
- [ ] Submitting a registration creates a `registrations` document
- [ ] Uploading an image in the CMS lands in Storage under `gallery/`
