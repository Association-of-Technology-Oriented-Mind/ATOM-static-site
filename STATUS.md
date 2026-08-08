# Status

Live activity log. Newest on top.

## [2026-08-08 11:50] — Tests and documentation added
**What:** Vitest + Testing Library configured; 25 tests across schemas, the
registration path, the data-service fallback, and the auth guard. Wrote
`docs/architecture.md`, `docs/API.md`, `FIXES.md`, and this file.
**Why:** Repo had zero tests and no docs; the one existing narrative doc
described auth and the CMS as working when neither was.
**State:** DONE
**Next:** Decide on the UI/UX redesign direction.

## [2026-08-08 11:40] — Firebase migration complete (Phase 3)
**What:** Replaced the localStorage CMS with Firestore, hardcoded credentials
with Firebase Auth, and base64 uploads with Firebase Storage. Rebuilt
registration on Firestore. Added `firestore.rules` and `storage.rules`. Added
route-level code splitting.
**Why:** Admin edits never reached visitors; the admin password shipped in the
bundle; the registration backend was gone.
**State:** DONE
**Next:** Seed Firestore and create the admin user — needs console access.

## [2026-08-08 11:20] — TypeScript strict mode (Phase 2)
**What:** Enabled `strict`, `noUnusedLocals`, `noUnusedParameters`,
`noFallthroughCasesInSwitch`; fixed all 121 resulting errors. Re-enabled the
ESLint unused-vars rule. Deleted four components with no importers.
**Why:** `strict: false` and a disabled lint rule let the other defects through.
**State:** DONE

## [2026-08-08 11:00] — Production-breaking fixes (Phase 1)
**What:** Converted 300+ images to WebP (dist 182 MB → 32 MB), fixed gallery
paths that 404'd in production, untracked `.env`, patched 20 of 24
vulnerabilities, removed dead code, restored production error visibility.
**Why:** The deployed site had broken images and an unusable payload on mobile.
**State:** DONE

## [2026-08-08 10:30] — Repo audit
**What:** Full audit of stack, features, and defects. Found the auth bypass,
dead registration backend, broken gallery paths, and 182 MB build.
**Why:** Requested before starting work.
**State:** DONE

---

## Open items

- **Firebase console setup** — BLOCKED on account access. Needs: enable
  Email/Password auth, create the admin user, set the `admin` custom claim,
  deploy rules, populate `.env`. See `docs/setup.md`.
- **UI/UX redesign** — DECIDED: technical/brutalist direction. Not started;
  planning it together is the next step.
- **`EventDetailPage.tsx`** — still 1364 LOC, needs decomposition.
- **Vite 5 → 8** — would clear the last 4 dev-only advisories; deferred as a
  breaking upgrade.
- **`MASTER_DOCUMENTATION.md`** — still describes the old localStorage CMS and
  hardcoded login; superseded by `docs/`.
