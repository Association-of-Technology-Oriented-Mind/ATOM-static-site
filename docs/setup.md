# Setup

Firebase project: **`atom-2026`** (see `.firebaserc`). Live at
https://atom-2026.web.app.

Most of this is already done for the current deployment. Follow it when
setting up a new machine, or standing the project up from scratch.

## 1. Local development

```bash
npm ci
cp .env.example .env   # fill in from step 2
npm run dev            # http://localhost:8000
```

The site runs without Firebase configured — content falls back to
`src/constants/*`. Admin login, registrations and live content need step 2.

## 2. Firebase configuration

**Get the config values** — Console → Project settings → Your apps → SDK setup
and configuration. Copy each field into the matching `VITE_FIREBASE_*` var in
`.env`. Or via CLI:

```bash
firebase apps:sdkconfig WEB
```

These values are **not secret** — they compile into the public bundle by
design. Access control comes from `firestore.rules`.

**Enable authentication** — Console → Authentication → Sign-in method → enable
Email/Password. This step cannot be scripted; Google requires it once in the
console. Then Users → Add user to create an admin account.

**Create the Firestore database** — Console → Firestore Database → Create
database → production mode, region `asia-south1` (Mumbai; lowest latency for
Karunya, and permanent once set). Or:

```bash
firebase firestore:databases:create "(default)" --location asia-south1
```

**Firebase Storage is optional and requires the Blaze (paid) plan.** Without a
bucket everything works except CMS image uploads — the gallery upload tab
disables itself and explains the alternative. Leave
`VITE_FIREBASE_STORAGE_BUCKET` empty when no bucket exists.

## 3. Grant admin rights

Signing in is not enough. Every write checks for an `admin` custom claim, so a
new account can open the CMS but all saves fail until this runs.

1. Console → Project settings → Service accounts → **Generate new private key**
2. Save it as `.secrets/serviceAccount.json` (gitignored — this one *is* a real
   secret; it bypasses all security rules)
3. Run:

```bash
npm i -D firebase-admin
GOOGLE_APPLICATION_CREDENTIALS=.secrets/serviceAccount.json \
  node scripts/set-admin-claim.mjs atom@karunya.edu
```

The user must sign out and back in — claims only land on a freshly issued
token.

## 4. Deploy security rules

Rules are the entire authorization layer. Deploy them before going live, and
before any code that depends on a rule change.

```bash
npx firebase deploy --only firestore:rules
# Only if a Storage bucket exists:
npx firebase deploy --only storage:rules
```

- `firestore.rules` — public read on content; writes require the `admin` claim.
  `registrations` is create-only for the public and readable only by admins.
- `storage.rules` — public read on `gallery/`; uploads require the `admin`
  claim, max 5 MB, images only.

## 5. Seed content (optional)

Copies the bundled events into Firestore. Safe to re-run — documents are keyed
by id, so it upserts rather than duplicating.

```bash
GOOGLE_APPLICATION_CREDENTIALS=.secrets/serviceAccount.json \
  node scripts/seed-firestore.mjs
```

Coordinators and clubs import image binaries, so they aren't seeded; they
render from the constants until edited through the CMS.

## 6. Deploy

```bash
npm run build
npx firebase deploy --only hosting
```

Only changed files upload. If connections drop on a slow uplink:

```bash
FIREBASE_HOSTING_UPLOAD_CONCURRENCY=1 npx firebase deploy --only hosting
```

## Verification checklist

- [ ] `npm run typecheck` — clean
- [ ] `npm test` — 26 passing
- [ ] `npm run build` — no `/src/assets` strings in `dist`
- [ ] `/admin` redirects to `/login` when signed out
- [ ] Signing in as the admin reaches the dashboard
- [ ] Editing an event in the CMS persists after a hard refresh
- [ ] Submitting a registration creates a `registrations` document
- [ ] `registrations` is **not** readable without the admin claim
- [ ] Uploading an image in the CMS lands in Storage under `gallery/`
      (skip if Storage is not enabled — the upload tab should be disabled)

## Troubleshooting

**`PERMISSION_DENIED` on a Firebase CLI command**
The logged-in account lacks access to the project. `firebase login:list` shows
who you are; `firebase projects:list` shows what you can reach.

**`CONFIGURATION_NOT_FOUND` on sign-in**
Authentication has never been enabled for the project. Console →
Authentication → Get started.

**`BILLING_NOT_ENABLED`**
You hit an Identity Platform or Storage feature that needs the Blaze plan.
Classic Email/Password auth and Firestore both work on the free tier.

**Writes fail with "Missing or insufficient permissions"**
The signed-in user has no `admin` claim, or hasn't re-authenticated since it
was granted. See step 3.
