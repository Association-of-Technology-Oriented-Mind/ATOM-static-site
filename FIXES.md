# Fixes

Running bug log. Newest on top.

---

## 2026-08-08 — Multi-day events silently dropped from the site

**Symptom:** Two events ("INNOVATE-X Hackathon", "Full Stack Development
Bootcamp") would have disappeared once content was read from Firestore,
appearing nowhere and raising no visible error.

**Root cause:** Both store their range in one field as
`"2025-08-04,2025-08-08"`. `eventSchema` required a bare `YYYY-MM-DD`, so
`getEvents()` treated them as malformed and skipped them — the deliberate
"skip invalid documents" path in `src/utils/dataService.ts:44` doing exactly
what it was designed to do, against data nobody had checked. The schema had
been written from the TypeScript type rather than the real data.

**Fix:** `src/lib/schemas.ts` now accepts `"start,end"`, keeps the start date
for display, and adds an optional `endDate`.

**Verified:** All 9 seeded events render on https://atom-2026.web.app/events,
including both multi-day ones. Regression test in `src/lib/schemas.test.ts`
("accepts legacy multi-day dates"); 26 tests passing.

---

## 2026-08-08 — Admin auth bypassable by forging a localStorage flag

**Symptom:** Anyone could open devtools, set
`localStorage.cms_authenticated = 'true'`, navigate to `/admin`, and get full
CMS access. Separately, the credentials `admin` / `atomcms` were hardcoded in
`src/config/admin-credentials.ts`, shipped in the JS bundle, and committed to
git — readable by anyone who opened the built asset.

**Root cause:** `ProtectedRoute` gated solely on a boolean in localStorage,
which is fully client-controlled. There was no server-side session.

**Fix:** Deleted `src/config/admin-credentials.ts`. Rewrote
`src/contexts/AuthContext.tsx` to use Firebase Auth with real sessions, and
`src/components/ProtectedRoute.tsx:10` to gate on that session plus an
`isLoading` state. Writes are additionally gated by an `admin` custom claim in
`firestore.rules`.

**Verified:** Built the app, forged `cms_authenticated=true` in the browser,
navigated to `/admin` — redirected to `/login`. Locked in by
`src/components/ProtectedRoute.test.tsx` ("ignores a forged localStorage flag").

---

## 2026-08-08 — Registrations silently discarded

**Symptom:** Users completed the registration form and saw "Registration
Successful!", but no registration was recorded anywhere.

**Root cause:** `src/utils/api.ts` POSTed to `https://api.atom.org.in`, which
has no DNS record. The `catch` returned `{ success: false }`, but the error
path only logged to a console that `drop_console: true` stripped in production,
so the failure was invisible.

**Fix:** Rewrote `src/utils/api.ts` to write to the Firestore `registrations`
collection with Zod validation and explicit failure messages surfaced as
toasts.

**Verified:** `getent hosts api.atom.org.in` returns no record, confirming the
diagnosis. Covered by `src/utils/api.test.ts`, including the regression case
where a rejected write must report failure rather than success.

---

## 2026-08-08 — Gallery images 404 in production

**Symptom:** Default gallery images were broken on the deployed site while
working in dev.

**Root cause:** `dataService.ts` and `GalleryManager.tsx` hardcoded paths like
`/src/assets/PHOTOS/x.jpg`. Vite only rewrites assets that are imported or
placed in `public/`, so these strings survived into the bundle verbatim — and
`dist/` has no `src/` directory.

**Fix:** Added `src/constants/gallery.ts`, which resolves images through
`import.meta.glob` at build time. Both call sites now read from it. Also fixed
a broken placeholder fallback at `src/components/admin/ImageUpload.tsx:346`.

**Verified:** Built and served `dist/`; 130 gallery images resolve to hashed
`/assets/*.webp` URLs returning HTTP 200, with no console errors.

---

## 2026-08-08 — Admin edits wiped on every visit to /events

**Symptom:** Content edited in the CMS reverted to defaults.

**Root cause:** Two separate bugs. `src/pages/Event.tsx:23` called
`localStorage.removeItem('cms_events')` on every mount. Independently,
`dataService.getEvents()` overwrote stored events with defaults whenever image
paths lacked a `/EVENTS/` prefix — which admin-uploaded images never had.

**Fix:** Removed the cache-clearing effect and the overwrite branch. Content
now lives in Firestore, so this class of bug is gone.

**Verified:** `tsc` clean, `/events` renders from the data layer without
mutating stored state.

---

## 2026-08-08 — Image uploads exceeded the localStorage quota

**Symptom:** Uploading a photo in the CMS threw an uncaught
`QuotaExceededError`.

**Root cause:** `ImageUpload.tsx` read files as base64 data URLs and stored
them in localStorage, which caps around 5 MB. Base64 adds ~33% overhead, so a
single photo could exhaust it.

**Fix:** Uploads now go to Firebase Storage via `uploadBytesResumable`, storing
only the download URL. Progress reporting is now real rather than a simulated
loop.

**Verified:** `tsc` clean; build emits the Storage code path. Size and
content-type limits enforced in `storage.rules`.

---

## 2026-08-08 — Contact form failed silently

**Symptom:** Submitting the contact form showed "Message Sent Successfully!"
but no email arrived.

**Root cause:** `src/config/emailjs.ts` still contained the placeholder values
`YOUR_SERVICE_ID` / `YOUR_TEMPLATE_ID` / `YOUR_PUBLIC_KEY`.

**Fix:** Moved config to env vars and added `isEmailJsConfigured()`.
`Contact.tsx` now reports the form as unavailable and points users at
`atom@karunya.edu` instead of faking success.

**Verified:** `tsc` clean; with the vars unset the guard branch is taken.

---

## 2026-08-08 — Production errors invisible

**Symptom:** No diagnostics available for failures on the live site.

**Root cause:** `vite.config.ts` set `drop_console: true`, stripping
`console.error` alongside debug logging.

**Fix:** Replaced with
`pure_funcs: ['console.log', 'console.info', 'console.debug']`, so
`console.error` and `console.warn` survive. Removed 33 debug `console.log`
calls from source (one in `FeaturedEventCard` fired on every countdown tick).

**Verified:** Built and confirmed error logging is retained in the output.
