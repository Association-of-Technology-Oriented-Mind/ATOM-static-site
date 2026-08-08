# Status

Live activity log. Newest on top.

## [2026-08-08 19:35] — Core members rebuilt on a scroll-pin scrubber
**What:** Replaced the static coordinator grid with six scroll-scrubbed scenes,
one per portfolio. A tall wrapper pins a 100vh stage while progress 0→1 drives
headline → members → detail. Lead sits left, joint holder right. Free-standing
figures on a gradient — no cards or borders. Ported from the Fludigo
/about#founders pattern; the orchestrator is reusable at
src/components/scroll/ScrollScene.tsx.
**Why:** The previous grid didn't scale and didn't communicate structure; Lebi
supplied the Fludigo reference and the scroll-pin-scrubber skill.
**State:** DONE — verified in-browser across all six scenes.
**Next:** Club data, then the remaining homepage sections. See GOAL.md.

## [2026-08-08 19:30] — Design system established
**What:** Lattice tokens added to index.css (additive, so the admin CMS keeps
the old ones): near-monochrome palette plus one accent, phosphor cyan #7DF9E4
sampled from the logo. Archivo Black display, JetBrains Mono labels. Recorded
in docs/design-system.md.
**Why:** The site was dark glassmorphism with blue gradients — the default
AI-website look, and on Lebi's never-do list.
**State:** DONE

## [2026-08-08 19:25] — Coordinator data replaced
**What:** Removed 18 stale coordinators; added the 12 current seats across 6
portfolios, each a lead/joint pair. All fields blank pending real data.
**Why:** Every role on the site was a year out of date.
**State:** DONE — blocked on Lebi for names, photos, bios, LinkedIn URLs.

## [2026-08-08 19:20] — Fixed a site-wide CSS leak
**What:** TextPressure.tsx injected a bare `.flex { justify-content:
space-between }` into a global style block, overriding Tailwind's
.justify-center on every flex container on the page. Scoped it to
.text-pressure-title.
**Why:** Found while debugging why a headline wouldn't centre; it had been
silently affecting layout everywhere.
**State:** DONE

## [2026-08-08 14:10] — Documentation rewritten for contributors
**What:** Rewrote README (removed published admin credentials and stale
`.jpg` paths), added `docs/onboarding.md` (developer guide) and
`docs/content-guide.md` (non-technical club members). Expanded CLAUDE.md with
the invariants that caused real bugs. Corrected `docs/setup.md` to the live
`atom-2026` project.
**Why:** The README still advertised `admin` / `atom2025cms` and described the
removed localStorage CMS; nobody new could onboard from it.
**State:** DONE
**Next:** UI/UX redesign planning.

## [2026-08-08 13:50] — Firebase live and verified end to end
**What:** Provisioned project `atom-2026` (the original `atom-dscs` returns 403
for this account). Enabled APIs, created Firestore in `asia-south1`, deployed
security rules, set the admin custom claim, seeded 9 events, deployed hosting.
**Why:** Complete the Phase 3 migration with real infrastructure.
**State:** DONE — verified: admin sign-in works, an admin edit propagated to a
fresh visitor's browser, registrations are unreadable without the admin claim.
**Next:** —

## [2026-08-08 13:30] — Multi-day event dates fixed
**What:** `eventSchema` rejected `"2025-08-04,2025-08-08"`, so two seeded
events would have been silently skipped. Schema now accepts the range form.
**Why:** Found while verifying the Firestore seed; the schema was written from
the type definition rather than the actual data.
**State:** DONE — regression test added, 26 tests passing.

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

- **Firebase** — DONE. Project `atom-2026`, admin claim set, rules deployed,
  9 events seeded. Storage stays off (Blaze plan only; CMS uploads disabled
  with an in-app explanation).
- **Admin password** — should be rotated; it was shared in a screenshot.
- **UI/UX redesign** — IN PROGRESS. Design system and core members done; the
  rest of the homepage, the clubs page and the footer remain. **See GOAL.md**
  for the full picture of what is done and what is left.
- **`EventDetailPage.tsx`** — still 1363 LOC; decompose as part of the events
  rewrite rather than separately.
- **Redesign not deployed** — it is on master, but the last hosting deploy
  predates it.
- **Dependency advisories** — 10, all dev-only (Vite dev server, React Router
  v7 major, `firebase-admin` transitive deps). None ship to users.
- **`MASTER_DOCUMENTATION.md`** — still describes the old localStorage CMS and
  hardcoded login; superseded by `docs/`.
